import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Nguồn giọng: ưu tiên Google TTS free, lỗi thì fallback sang API riêng của app.
const TTS_API_URL = process.env.NEXT_PUBLIC_TTS_API_URL || 'https://api-v2.behayhoc.com/tts';

// Cache in-process (tồn tại giữa các request trong cùng worker).
const cache = new Map<string, Buffer>();
const MAX_CACHE = 300;

// Loại emoji/icon khỏi text trước khi đọc (option quiz có ✅⭐… sẽ đọc sai/hỏng).
function removeEmojis(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .replace(/[\u{2600}-\u{27BF}]/gu, '')
    .replace(/[\u{2B50}]/gu, '')
    .replace(/[\u{1F000}-\u{1F02F}]/gu, '')
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Cách đọc "âm" tiếng Việt cho chữ cái/phụ âm đơn lẻ (Google TTS đọc sai gh, ch, tr, ng…).
const PHONICS: Record<string, string> = {
  b: 'bờ', c: 'cờ', d: 'dờ', đ: 'đờ', g: 'gờ', h: 'hờ', k: 'ca', l: 'lờ', m: 'mờ',
  n: 'nờ', p: 'pờ', q: 'quy', r: 'rờ', s: 'sờ', t: 'tờ', v: 'vờ', x: 'xờ',
  ch: 'chờ', gh: 'gờ', gi: 'giờ', kh: 'khờ', ng: 'ngờ', ngh: 'ngờ', nh: 'nhờ',
  ph: 'phờ', qu: 'quờ', th: 'thờ', tr: 'trờ',
};

/**
 * Nếu cả đoạn text chỉ là MỘT chữ cái/âm (kể cả dạng "Gh gh" hoa+thường) → đọc theo âm tiếng Việt.
 * Không đụng tới chữ nằm trong từ/câu (vd "trong", "ghế", "chú" giữ nguyên).
 */
function toVietnamesePhonics(text: string): string {
  const tokens = text.trim().toLowerCase().split(/[\s.,;:!?]+/).filter(Boolean);
  if (!tokens.length) return text;
  const uniq = Array.from(new Set(tokens));
  // Cả đoạn chỉ là MỘT âm (kể cả dạng "Ch ch" hoa+thường) → đọc đúng âm đó.
  if (uniq.length === 1 && PHONICS[uniq[0]]) return PHONICS[uniq[0]];
  // Trong câu: thay từng chữ cái/âm đứng RIÊNG (vd "chữ ghép ch", "Ghép b + a")
  // bằng cách đọc âm tiếng Việt. Từ có nhiều chữ (chú, ghép, nghe…) giữ nguyên.
  return text.replace(/\p{L}+/gu, (w) => PHONICS[w.toLowerCase()] ?? w);
}

// ── Tách text thành các đoạn theo NGÔN NGỮ (Việt / Anh) ─────────────────────
// Câu hỏi thường là tiếng Việt có lẫn từ tiếng Anh (vd: 'Hi' có nghĩa là gì?).
// Từ có dấu tiếng Việt → đọc giọng Việt; từ thuần ASCII (không phải từ Việt phổ
// biến) → đọc giọng Anh bản ngữ.
const VI_DIACRITIC = /[àáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/i;
// Từ điển từ tiếng Anh xuất hiện trong khóa Tiếng Anh lớp 1 (+ từ chức năng phổ biến).
// Cách phân biệt: MẶC ĐỊNH là tiếng Việt; chỉ coi là tiếng Anh nếu từ nằm trong từ điển
// này HOẶC có chữ/cụm chỉ tiếng Anh mới có (w, j, z, f, chữ đôi ll/ss/ee/oo, sh, ck…).
const EN_WORDS = new Set([
  // chào hỏi & chức năng
  'hello', 'hi', 'bye', 'goodbye', 'good', 'morning', 'afternoon', 'evening', 'night', 'welcome',
  'what', 'whats', 'your', 'my', 'name', 'is', 'are', 'am', 'i', 'im', 'you', 'youre', 'he', 'hes',
  'she', 'shes', 'it', 'its', 'they', 'we', 'this', 'that', 'thats', 'these', 'those', 'his', 'her',
  'their', 'do', 'does', 'dont', 'doesnt', 'can', 'cant', 'have', 'has', 'like', 'love', 'meet',
  'nice', 'too', 'and', 'but', 'or', 'in', 'on', 'at', 'with', 'to', 'the', 'a', 'an', 'some',
  'please', 'thank', 'thanks', 'yes', 'no', 'not', 'how', 'hows', 'who', 'whose', 'where', 'wheres',
  'when', 'why', 'here', 'there', 'lets', 'get', 'up', 'me',
  // cảm xúc & tính từ
  'fine', 'happy', 'sad', 'tired', 'hungry', 'thirsty', 'big', 'small', 'tall', 'old', 'young',
  'kind', 'soft', 'hard', 'long', 'short', 'hot', 'cold', 'fat', 'fast', 'slow', 'fresh', 'sweet',
  'best', 'favourite', 'favorite', 'pretty', 'heavy', 'mine', 'much', 'very',
  // trường học
  'school', 'teacher', 'student', 'students', 'friend', 'friends', 'class', 'classroom',
  'playground', 'library', 'office', 'book', 'books', 'pen', 'pens', 'pencil', 'pencils', 'notebook',
  'bag', 'ruler', 'eraser', 'crayon', 'crayons', 'glue', 'scissors', 'sharpener', 'desk', 'chair',
  'board', 'door', 'window', 'clock', 'wall', 'sit', 'stand', 'down', 'open', 'close', 'quiet',
  'point', 'turn', 'times', 'raise', 'wash', 'clap', 'touch', 'shake', 'move', 'run', 'jump',
  'walk', 'dance', 'swim', 'fly', 'read', 'write', 'sing', 'borrow', 'use', 'cut', 'colour', 'color',
  // màu & số
  'red', 'blue', 'yellow', 'green', 'orange', 'purple', 'pink', 'brown', 'black', 'white',
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'seventy',
  'count', 'number', 'numbers',
  // gia đình & cơ thể
  'family', 'father', 'mother', 'dad', 'mum', 'mom', 'parents', 'brother', 'brothers', 'sister',
  'sisters', 'baby', 'grandpa', 'grandma', 'grandfather', 'grandmother', 'grandparents', 'people',
  'face', 'eye', 'eyes', 'nose', 'mouth', 'ear', 'ears', 'head', 'hand', 'hands', 'leg', 'legs',
  'arm', 'arms', 'foot', 'feet', 'body', 'finger', 'fingers', 'toe', 'toes', 'teeth', 'tooth',
  // đồ chơi & con vật
  'toy', 'toys', 'ball', 'balls', 'doll', 'dolls', 'car', 'cars', 'kite', 'robot', 'teddy', 'bear',
  'pet', 'pets', 'dog', 'dogs', 'cat', 'cats', 'fish', 'bird', 'birds', 'rabbit', 'rabbits', 'duck',
  'ducks', 'cow', 'cows', 'pig', 'pigs', 'horse', 'horses', 'animal', 'animals', 'bee', 'butterfly',
  'lion', 'tiger', 'whale', 'meow', 'moo', 'quack',
  // đồ ăn & thức uống
  'fruit', 'apple', 'apples', 'banana', 'bananas', 'grapes', 'food', 'rice', 'bread', 'egg', 'eggs',
  'chicken', 'breakfast', 'dinner', 'lunch', 'drink', 'drinks', 'water', 'milk', 'juice', 'tea',
  'glass', 'box', 'eat',
  // nhà, quần áo, thời tiết, hoạt động ngày
  'house', 'houses', 'room', 'rooms', 'kitchen', 'bedroom', 'bathroom', 'living', 'garden', 'next',
  'clothes', 'shirt', 'tshirt', 'hat', 'hats', 'shoes', 'shoe', 'dress', 'socks', 'sock', 'coat',
  'wear', 'put', 'off', 'take', 'weather', 'sunny', 'rainy', 'windy', 'cloudy', 'sun', 'umbrella',
  'summer', 'winter', 'day', 'wake', 'sleep', 'play', 'bed', 'brush', 'time', 'then', 'every',
  'really', 'world',
]);
function classifyWord(w: string): 'vi' | 'en' {
  if (VI_DIACRITIC.test(w)) return 'vi'; // có dấu tiếng Việt → chắc chắn tiếng Việt
  const lw = w.toLowerCase().replace(/[^a-z]/g, '');
  if (!lw) return 'vi';
  if (EN_WORDS.has(lw)) return 'en'; // từ tiếng Anh đã biết
  // Chữ/cụm chỉ có trong tiếng Anh (âm tiết tiếng Việt không dùng): w j z f, chữ đôi, sh/ck/wh…
  if (/[wjzf]/.test(lw)) return 'en';
  if (/(.)\1/.test(lw)) return 'en';
  if (/(sh|ck|wh|ght|oo|ee)/.test(lw)) return 'en';
  return 'vi'; // mặc định: tiếng Việt (an toàn cho từ Việt không dấu như "xin chao")
}
function segmentByLang(text: string): { t: string; lang: 'vi' | 'en' }[] {
  const tokens = text.match(/[A-Za-zÀ-ỹ][A-Za-zÀ-ỹ'’-]*|[^A-Za-zÀ-ỹ]+/g) || [text];
  const segs: { t: string; lang: 'vi' | 'en' }[] = [];
  let curLang: 'vi' | 'en' = 'vi';
  for (const tok of tokens) {
    const isWord = /[A-Za-zÀ-ỹ]/.test(tok);
    const lang: 'vi' | 'en' = isWord ? classifyWord(tok) : curLang;
    if (isWord) curLang = lang;
    const last = segs[segs.length - 1];
    // Ghép các ký tự không phải chữ (dấu câu, khoảng trắng) vào đoạn trước.
    if (last && (!isWord || last.lang === lang)) last.t += tok;
    else segs.push({ t: tok, lang });
  }
  // Gộp đoạn đầu chỉ có dấu câu (vd dấu nháy mở) vào đoạn kế cho gọn.
  if (segs.length > 1 && !/[A-Za-zÀ-ỹ]/.test(segs[0].t)) {
    segs[1].t = segs[0].t + segs[1].t;
    segs.shift();
  }
  return segs.filter((s) => s.t.trim());
}

// Google TTS giới hạn ~200 ký tự/request → tách theo từ thành các đoạn ≤ maxLen.
function splitText(text: string, maxLen = 190): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxLen) {
      if (cur) chunks.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) chunks.push(cur.trim());
  return chunks.length ? chunks : [text];
}

// Lấy audio từ Google Translate TTS cho 1 text (đã gộp các đoạn), trả Buffer hoặc null.
// lang: 'vi' (giọng Việt) hoặc 'en' (giọng bản ngữ tiếng Anh).
async function fetchGoogleTts(text: string, lang: 'vi' | 'en' = 'vi'): Promise<Buffer | null> {
  const parts: Buffer[] = [];
  for (const chunk of splitText(text)) {
    const params = new URLSearchParams({
      ie: 'UTF-8',
      q: chunk,
      tl: lang,
      client: 'tw-ob',
      ttsspeed: lang === 'en' ? '0.9' : '0.8',
    });
    const upstream = await fetch(`https://translate.google.com/translate_tts?${params.toString()}`, {
      headers: {
        // Google translate_tts cần User-Agent giống trình duyệt, nếu không sẽ trả 403.
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Referer: 'https://translate.google.com/',
      },
    });
    if (!upstream.ok) return null;
    parts.push(Buffer.from(await upstream.arrayBuffer()));
  }
  return parts.length ? Buffer.concat(parts) : null;
}

// API riêng của app (natural voice) — dùng khi Google TTS lỗi. Trả Buffer hoặc null.
async function fetchBackendTts(text: string): Promise<Buffer | null> {
  try {
    const res = await fetch(TTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, audio/mpeg, audio/wav, audio/*, */*',
      },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || '';
    // Backend trả JSON kèm audio_url → tải file audio thật.
    if (contentType.includes('application/json')) {
      const data = await res.json();
      const audioUrl = data.audio_url || data.url;
      if (!audioUrl) return null;
      const absUrl = audioUrl.startsWith('http') ? audioUrl : new URL(audioUrl, TTS_API_URL).toString();
      const audioRes = await fetch(absUrl);
      if (!audioRes.ok) return null;
      return Buffer.from(await audioRes.arrayBuffer());
    }
    // Backend trả audio trực tiếp.
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

function audioResponse(buf: Buffer, source: string): NextResponse {
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
      'X-TTS-Source': source,
    },
  });
}

// Xử lý chung cho GET & POST: làm sạch text → cache → Google TTS.
// enMode = true CHỈ cho các bài thuộc khóa tiếng Anh (vd Tiếng Anh lớp 1):
// tách câu theo ngôn ngữ, đọc phần tiếng Anh bằng giọng bản ngữ.
// Mặc định (enMode = false) giữ NGUYÊN hành vi cũ: cả câu đọc giọng Việt + phiên âm.
async function handle(rawText: string | null, enMode = false, forceLang: 'en' | 'vi' | null = null): Promise<NextResponse> {
  if (!rawText || !rawText.trim()) {
    return NextResponse.json({ error: 'q (text) is required' }, { status: 400 });
  }
  if (rawText.length > 500) {
    return NextResponse.json({ error: 'Text must not exceed 500 characters' }, { status: 400 });
  }

  const cleaned = removeEmojis(rawText.trim());
  if (!cleaned) {
    return NextResponse.json({ error: 'Text contains only emoji/icons' }, { status: 400 });
  }

  // ── ÉP NGÔN NGỮ (lang=en|vi): đọc TOÀN BỘ text bằng đúng một giọng, KHÔNG phân loại
  // từng từ. Dùng cho từ vựng: từ tiếng Anh luôn giọng Anh bản ngữ, nghĩa luôn giọng Việt. ──
  if (forceLang) {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.behayhoc.com';
      const look = await fetch(
        `${apiBase}/api/tts/cached?text=${encodeURIComponent(cleaned)}&voice=${forceLang}`,
        { cache: 'no-store' },
      );
      if (look.ok) {
        const { audioUrl } = (await look.json()) as { audioUrl?: string };
        if (audioUrl) return NextResponse.redirect(audioUrl, 302);
      }
    } catch {
      /* tra cache lỗi → tiếp tục gọi Google TTS bên dưới */
    }
    const text = forceLang === 'vi' ? toVietnamesePhonics(cleaned) : cleaned;
    const key = forceLang + ':' + text;
    const hit = cache.get(key);
    if (hit) return audioResponse(hit, 'google-cache');
    const g = await fetchGoogleTts(text, forceLang);
    if (g) {
      if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value!);
      cache.set(key, g);
      return audioResponse(g, 'google-free');
    }
    if (forceLang === 'vi') {
      const b = await fetchBackendTts(text);
      if (b) return audioResponse(b, 'backend');
    }
    return NextResponse.json({ error: 'TTS service unavailable' }, { status: 503 });
  }

  // ── Tra bảng tts_cache trước: nếu đã có audio (S3) cho text này → DÙNG LẠI, khỏi gọi TTS. ──
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.behayhoc.com';
    const voice = enMode ? 'en' : 'vi';
    const look = await fetch(
      `${apiBase}/api/tts/cached?text=${encodeURIComponent(cleaned)}&voice=${voice}`,
      { cache: 'no-store' },
    );
    if (look.ok) {
      const { audioUrl } = (await look.json()) as { audioUrl?: string };
      if (audioUrl) return NextResponse.redirect(audioUrl, 302); // phát thẳng file S3 đã cache
    }
  } catch {
    // Không tra được cache → tiếp tục luồng cũ bên dưới (Google TTS / backend).
  }

  // ── Bài KHÔNG phải tiếng Anh → hành vi cũ: cả câu giọng Việt + phiên âm, fallback backend. ──
  if (!enMode) {
    const text = toVietnamesePhonics(cleaned);
    const key = 'vi:' + text;
    const hit = cache.get(key);
    if (hit) return audioResponse(hit, 'google-cache');
    const g = await fetchGoogleTts(text, 'vi');
    if (g) {
      if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value!);
      cache.set(key, g);
      return audioResponse(g, 'google-free');
    }
    const b = await fetchBackendTts(text);
    if (b) return audioResponse(b, 'backend');
    return NextResponse.json({ error: 'TTS service unavailable' }, { status: 503 });
  }

  // ── Bài tiếng Anh → tách câu theo ngôn ngữ, phần tiếng Anh đọc giọng bản ngữ. ──
  const key = 'en:' + cleaned;
  const cached = cache.get(key);
  if (cached) return audioResponse(cached, 'google-cache');

  const segments = segmentByLang(cleaned);
  const buffers: Buffer[] = [];
  let usedBackend = false;
  let allOk = true;
  for (const seg of segments) {
    // Chỉ áp phiên âm tiếng Việt (gh→"gờ"…) cho đoạn Việt; đoạn Anh giữ nguyên.
    const t = seg.lang === 'vi' ? toVietnamesePhonics(seg.t) : seg.t;
    let buf = await fetchGoogleTts(t, seg.lang);
    if (!buf && seg.lang === 'vi') {
      buf = await fetchBackendTts(t);
      if (buf) usedBackend = true;
    }
    if (buf) buffers.push(buf);
    else allOk = false;
  }

  if (buffers.length) {
    const out = Buffer.concat(buffers);
    if (allOk && !usedBackend) {
      if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value!);
      cache.set(key, out);
    }
    return audioResponse(out, usedBackend ? 'mixed-backend' : 'google-free');
  }

  return NextResponse.json({ error: 'TTS service unavailable' }, { status: 503 });
}

export async function GET(req: NextRequest) {
  const en = req.nextUrl.searchParams.get('en') === '1';
  const lp = req.nextUrl.searchParams.get('lang');
  const forceLang = lp === 'en' || lp === 'vi' ? lp : null;
  return handle(req.nextUrl.searchParams.get('q'), en, forceLang);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const en = body?.en === true || body?.en === '1' || body?.en === 1;
    const lp = body?.lang;
    const forceLang = lp === 'en' || lp === 'vi' ? lp : null;
    return handle(body?.text ?? body?.q ?? null, en, forceLang);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}

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
async function fetchGoogleTts(text: string): Promise<Buffer | null> {
  const parts: Buffer[] = [];
  for (const chunk of splitText(text)) {
    const params = new URLSearchParams({
      ie: 'UTF-8',
      q: chunk,
      tl: 'vi',
      client: 'tw-ob',
      ttsspeed: '0.8',
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
async function handle(rawText: string | null): Promise<NextResponse> {
  if (!rawText || !rawText.trim()) {
    return NextResponse.json({ error: 'q (text) is required' }, { status: 400 });
  }
  if (rawText.length > 500) {
    return NextResponse.json({ error: 'Text must not exceed 500 characters' }, { status: 400 });
  }

  const text = removeEmojis(rawText.trim());
  if (!text) {
    return NextResponse.json({ error: 'Text contains only emoji/icons' }, { status: 400 });
  }

  const cached = cache.get(text);
  if (cached) return audioResponse(cached, 'cache');

  // 1) Ưu tiên Google TTS free.
  let buf = await fetchGoogleTts(text);
  let source = 'google-free';

  // 2) Google lỗi → fallback sang API riêng của app.
  if (!buf) {
    console.warn('Google TTS lỗi → fallback API riêng');
    buf = await fetchBackendTts(text);
    source = 'backend';
  }

  if (!buf) {
    return NextResponse.json({ error: 'TTS service unavailable' }, { status: 503 });
  }

  if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value!);
  cache.set(text, buf);

  return audioResponse(buf, source);
}

export async function GET(req: NextRequest) {
  return handle(req.nextUrl.searchParams.get('q'));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return handle(body?.text ?? body?.q ?? null);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}

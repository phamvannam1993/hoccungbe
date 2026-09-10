// Proxy TTS: đọc văn bản bằng giọng Google (Google Translate TTS) — trả về audio/mpeg.
// Dùng cho nút "Nghe" ở trang Toán tư duy. Gọi qua server để né CORS + đặt header hợp lệ.
// Giới hạn ~200 ký tự / lần (frontend đã tự cắt đoạn), cache mạnh vì nội dung tĩnh.

export const runtime = 'nodejs';

// Kho giọng đọc riêng (VieNeu, đã sinh sẵn và để trên S3). Tiếng Việt tra kho
// này trước; có thì chuyển hướng thẳng sang tệp S3, không có thì rơi về giọng
// Google như cũ. Nhờ vậy trang từ vựng và Vòng tròn từ vựng dùng ngay giọng
// mới mà không phải sửa một dòng nào ở phía client.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Nhớ kết quả tra trong tiến trình để mỗi đoạn chỉ hỏi máy chủ một lần.
// Lưu cả lần trượt (null) — trượt là phần lớn, hỏi lại mỗi lần thì phí.
const KHO = new Map<string, { url: string | null; hetHan: number }>();
const HAN_CO = 10 * 60 * 1000;
// Lần TRƯỢT chỉ nhớ ngắn: vừa sinh xong audio cho một đoạn mà còn nhớ "chưa
// có" cả 10 phút thì trang web vẫn đọc giọng Google, tưởng là ghép hỏng.
const HAN_TRUOT = 60 * 1000;

async function traKho(text: string): Promise<string | null> {
  const co = KHO.get(text);
  if (co && co.hetHan > Date.now()) return co.url;
  let url: string | null = null;
  try {
    const r = await fetch(`${API_URL}/api/tts/cached?text=${encodeURIComponent(text)}`, {
      signal: AbortSignal.timeout(2500),
      cache: 'no-store',
    });
    if (r.ok) {
      const j = await r.json();
      if (typeof j?.audioUrl === 'string' && /^https?:\/\//.test(j.audioUrl)) url = j.audioUrl;
    }
  } catch {
    // Máy chủ giọng đọc trục trặc thì im lặng dùng giọng Google — bé vẫn nghe được.
  }
  KHO.set(text, { url, hetHan: Date.now() + (url ? HAN_CO : HAN_TRUOT) });
  return url;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim().slice(0, 200);
  // Chấp nhận cả `tl` lẫn `lang` (alias) — để bundle client cũ gửi &lang=en vẫn ra giọng Anh.
  // 'en-US' → 'en' (Google chỉ nhận mã ngắn).
  const raw = (searchParams.get('tl') || searchParams.get('lang') || 'vi').toLowerCase();
  const tl = (raw.startsWith('en') ? 'en' : raw.startsWith('vi') ? 'vi' : raw).slice(0, 5);
  if (!q) return new Response('missing q', { status: 400 });

  // speed<1 → đọc chậm (dùng cho phonics "đánh vần"). Kẹp trong [0.1, 1].
  const speedRaw = parseFloat(searchParams.get('speed') || '1');
  const ttsspeed = Number.isFinite(speedRaw) ? Math.min(1, Math.max(0.1, speedRaw)) : 1;

  // Chỉ tra kho khi đọc tiếng Việt ở tốc độ thường: tệp trong kho là bản đọc
  // tốc độ chuẩn, không có bản chậm cho nút con rùa.
  if (tl === 'vi' && ttsspeed === 1) {
    const s3 = await traKho(q);
    if (s3) return Response.redirect(s3, 302);
  }

  const url =
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&ttsspeed=${ttsspeed}` +
    `&tl=${encodeURIComponent(tl)}&textlen=${q.length}&q=${encodeURIComponent(q)}`;

  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        Referer: 'https://translate.google.com/',
        'Accept-Language': 'vi,en;q=0.8',
      },
      // cache ở tầng fetch (nội dung tĩnh theo q)
      next: { revalidate: 604800 },
    });
    if (!r.ok || !r.body) return new Response('tts upstream error', { status: 502 });
    const buf = await r.arrayBuffer();
    return new Response(buf, {
      headers: {
        'Content-Type': 'audio/mpeg',
        // Chỉ giữ 1 giờ, KHÔNG immutable: đây là bản dự phòng của Google, đoạn
        // nào sinh xong giọng riêng thì trình duyệt phải sớm hỏi lại để đổi
        // sang giọng mới, chứ không ôm tệp cũ cả tuần.
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch {
    return new Response('tts fetch failed', { status: 502 });
  }
}

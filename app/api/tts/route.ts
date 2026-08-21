// Proxy TTS: đọc văn bản bằng giọng Google (Google Translate TTS) — trả về audio/mpeg.
// Dùng cho nút "Nghe" ở trang Toán tư duy. Gọi qua server để né CORS + đặt header hợp lệ.
// Giới hạn ~200 ký tự / lần (frontend đã tự cắt đoạn), cache mạnh vì nội dung tĩnh.

export const runtime = 'nodejs';

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
        'Cache-Control': 'public, max-age=604800, s-maxage=604800, immutable',
      },
    });
  } catch {
    return new Response('tts fetch failed', { status: 502 });
  }
}

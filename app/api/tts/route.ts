import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Simple in-process cache (survives across requests in same worker)
const cache = new Map<string, Buffer>();
const MAX_CACHE = 300;

export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get('q');
  if (!text) return NextResponse.json({ error: 'q is required' }, { status: 400 });

  if (cache.has(text)) {
    return new NextResponse(cache.get(text), {
      headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'public, max-age=86400' },
    });
  }

  const params = new URLSearchParams({
    ie: 'UTF-8',
    q: text,
    tl: 'vi',
    client: 'tw-ob',
    ttsspeed: '0.8',
  });

  const upstream = await fetch(
    `https://translate.google.com/translate_tts?${params.toString()}`,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Referer: 'https://translate.google.com/',
      },
    },
  );

  if (!upstream.ok) {
    return NextResponse.json({ error: 'upstream failed' }, { status: 502 });
  }

  const buf = Buffer.from(await upstream.arrayBuffer());

  if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value!);
  cache.set(text, buf);

  return new NextResponse(buf, {
    headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'public, max-age=86400' },
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { getClientIp } from '@/lib/rate-limiting/getClientIp';
import { getRateLimiter, initializeRateLimiter } from '@/lib/rate-limiting/rateLimit';
import { getStorage } from '@/lib/rate-limiting/storage';

export const runtime = 'nodejs';

// Simple in-process cache (survives across requests in same worker)
const cache = new Map<string, Buffer>();
const MAX_CACHE = 300;

// Initialize rate limiter with custom config
// Default: 100 requests per hour (you can change this)
initializeRateLimiter({
  maxRequests: 100,
  windowMs: 3600000, // 1 hour
});

export async function POST(req: NextRequest) {
  try {
    // Extract client IP
    const clientIp = getClientIp(req);
    const storage = getStorage();
    const rateLimiter = getRateLimiter();

    // Check if IP is blacklisted
    if (storage.isBlacklisted(clientIp)) {
      storage.logRequest(clientIp, '/api/tts', true, 0, req.headers.get('user-agent') || undefined);

      return NextResponse.json(
        { error: 'Access denied' },
        {
          status: 403,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + 86400000).getTime().toString(),
          },
        },
      );
    }

    // Check rate limit
    const rateLimitResult = rateLimiter.check(clientIp);

    if (!rateLimitResult.allowed) {
      storage.logRequest(
        clientIp,
        '/api/tts',
        true,
        rateLimitResult.remaining,
        req.headers.get('user-agent') || undefined,
      );

      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': (rateLimitResult.retryAfter || 3600).toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTimeUnix.toString(),
          },
        },
      );
    }

    // Parse request body
    const body = await req.json();
    const { text, voice, rate = '+0%', pitch = '+0Hz' } = body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        {
          status: 400,
          headers: {
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTimeUnix.toString(),
          },
        },
      );
    }

    if (text.length > 500) {
      return NextResponse.json(
        { error: 'Text must not exceed 500 characters' },
        {
          status: 400,
          headers: {
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTimeUnix.toString(),
          },
        },
      );
    }

    // Check for invalid characters
    const invalidCharPattern = /[^\p{L}\p{N}\s.,!?;:\-—()\[\]'"\/\\]/gu;
    if (invalidCharPattern.test(text)) {
      return NextResponse.json(
        { error: 'Text contains invalid characters' },
        {
          status: 400,
          headers: {
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTimeUnix.toString(),
          },
        },
      );
    }

    if (!voice || typeof voice !== 'string') {
      return NextResponse.json(
        { error: 'Voice is required' },
        {
          status: 400,
          headers: {
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTimeUnix.toString(),
          },
        },
      );
    }

    // Create cache key based on text and voice
    const cacheKey = JSON.stringify({ text, voice, rate, pitch });
    const cached = cache.get(cacheKey);

    if (cached) {
      storage.logRequest(
        clientIp,
        '/api/tts',
        false,
        rateLimitResult.remaining,
        req.headers.get('user-agent') || undefined,
      );

      return new NextResponse(new Uint8Array(cached), {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=86400',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTimeUnix.toString(),
          'X-Cache': 'HIT',
        },
      });
    }

    // Call external TTS API (behayhoc)
    const upstream = await fetch(
      'https://api-v2.behayhoc.com/tts',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voice: voice,
          rate: rate || '+0%',
          pitch: pitch || '+0Hz',
        }),
      },
    );

    if (!upstream.ok) {
      return NextResponse.json(
        { error: 'Failed to generate speech' },
        {
          status: 502,
          headers: {
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTimeUnix.toString(),
          },
        },
      );
    }

    const data = await upstream.json();

    // Convert relative audio_url to absolute URL
    if (data.audio_url && data.audio_url.startsWith('/')) {
      data.audio_url = `https://api-v2.behayhoc.com${data.audio_url}`;
    }

    // Log successful request
    storage.logRequest(
      clientIp,
      '/api/tts',
      false,
      rateLimitResult.remaining,
      req.headers.get('user-agent') || undefined,
    );

    // Return JSON response from external API
    return NextResponse.json(data, {
      headers: {
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetTimeUnix.toString(),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('TTS API Error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const storage = getStorage();
    const rateLimiter = getRateLimiter();

    // Check rate limit for GET requests
    const rateLimitResult = rateLimiter.check(clientIp);

    if (!rateLimitResult.allowed) {
      storage.logRequest(
        clientIp,
        '/api/tts',
        true,
        rateLimitResult.remaining,
        req.headers.get('user-agent') || undefined,
      );

      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTimeUnix.toString(),
          },
        },
      );
    }

    const text = req.nextUrl.searchParams.get('q');
    if (!text) {
      return NextResponse.json(
        { error: 'q parameter is required' },
        { status: 400 },
      );
    }

    if (text.length > 500) {
      return NextResponse.json(
        { error: 'Text must not exceed 500 characters' },
        { status: 400 },
      );
    }

    // Check cache
    const cached = cache.get(text);
    if (cached) {
      storage.logRequest(
        clientIp,
        '/api/tts',
        false,
        rateLimitResult.remaining,
        req.headers.get('user-agent') || undefined,
      );

      return new NextResponse(new Uint8Array(cached), {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=86400',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTimeUnix.toString(),
          'X-Cache': 'HIT',
        },
      });
    }

    // Fetch from upstream
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
      return NextResponse.json(
        { error: 'Upstream failed' },
        { status: 502 },
      );
    }

    const buf = Buffer.from(await upstream.arrayBuffer());

    // Cache result
    if (cache.size >= MAX_CACHE) {
      cache.delete(cache.keys().next().value!);
    }
    cache.set(text, buf);

    storage.logRequest(
      clientIp,
      '/api/tts',
      false,
      rateLimitResult.remaining,
      req.headers.get('user-agent') || undefined,
    );

    return new NextResponse(new Uint8Array(buf), {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetTimeUnix.toString(),
      },
    });
  } catch (error) {
    console.error('TTS GET Error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Accept-Language',
      'Access-Control-Max-Age': '86400',
    },
  });
}

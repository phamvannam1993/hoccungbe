import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const audioUrl = request.nextUrl.searchParams.get('url');

  if (!audioUrl) {
    return NextResponse.json(
      { error: 'Missing audio URL' },
      { status: 400 }
    );
  }

  // Validate URL is from expected domain
  if (!audioUrl.startsWith('https://api-v2.behayhoc.com/audio/')) {
    return NextResponse.json(
      { error: 'Invalid audio URL' },
      { status: 400 }
    );
  }

  try {
    // Fetch audio from external API
    const response = await fetch(audioUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!response.ok) {
      console.error(`[TTS Download] External API error: ${response.status}`);
      return NextResponse.json(
        { error: 'Failed to download audio' },
        { status: response.status }
      );
    }

    // Get content type and file size
    const contentType = response.headers.get('content-type') || 'audio/mpeg';
    const contentLength = response.headers.get('content-length');

    // Extract filename from URL
    const urlPath = new URL(audioUrl).pathname;
    const filename = urlPath.split('/').pop() || 'audio.mp3';

    // Stream the audio file
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=604800', // Cache for 7 days
        ...(contentLength && { 'Content-Length': contentLength }),
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('[TTS Download] Error:', error);
    return NextResponse.json(
      { error: 'Download failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

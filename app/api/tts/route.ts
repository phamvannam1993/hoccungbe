import { NextRequest, NextResponse } from 'next/server';

const TTS_API_URL = process.env.NEXT_PUBLIC_TTS_API_URL || 'https://api-v2.behayhoc.com/tts';

// Remove emoji and special icons from text
function removeEmojis(text: string): string {
  return text
    .replace(/[\p{Emoji}\p{Emoji_Component}]/gu, '') // Remove emoji
    .replace(/[​-‍﻿]/g, '') // Remove zero-width chars
    .trim();
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const text = searchParams.get('q');

    if (!text) {
      return NextResponse.json(
        { error: 'Missing query parameter "q" (text to synthesize)' },
        { status: 400 }
      );
    }

    if (text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text cannot be empty' },
        { status: 400 }
      );
    }

    if (text.length > 500) {
      return NextResponse.json(
        { error: 'Text must not exceed 500 characters' },
        { status: 400 }
      );
    }

    // Remove emoji/icons before sending
    const cleanText = removeEmojis(text.trim());

    if (!cleanText) {
      return NextResponse.json(
        { error: 'Text contains only emoji/icons' },
        { status: 400 }
      );
    }

    let response: Response | null = null;
    let backendError: string | null = null;

    // Step 1: Try backend API first
    try {
      response = await fetch(TTS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, audio/mpeg, audio/wav, audio/*, */*',
        },
        body: JSON.stringify({
          text: cleanText,
          voice: 'vi-VN-HoaiMyNeural',
          rate: '+0%',
          pitch: '+0Hz',
        }),
      });
    } catch (error) {
      backendError = error instanceof Error ? error.message : 'Network error';
      console.warn(`Backend API request failed: ${backendError}`);
    }

    // Process backend response if successful
    if (response?.ok) {
      const contentType = response.headers.get('content-type') || 'application/json';

      // Process backend response
      // If response is JSON with audio_url, fetch and return the actual audio file
      if (contentType.includes('application/json')) {
        const data = await response.json();
        const audioUrl = data.audio_url || data.url;

        if (audioUrl) {
          // Make absolute URL if relative
          const absoluteAudioUrl = audioUrl.startsWith('http')
            ? audioUrl
            : new URL(audioUrl, TTS_API_URL).toString();

          // Fetch the actual audio file
          const audioResponse = await fetch(absoluteAudioUrl);
          if (audioResponse.ok) {
            const audioBuffer = await audioResponse.arrayBuffer();
            const audioContentType = audioResponse.headers.get('content-type') || 'audio/mpeg';

            return new NextResponse(audioBuffer, {
              status: 200,
              headers: {
                'Content-Type': audioContentType,
                'Cache-Control': 'public, max-age=86400',
                'Access-Control-Allow-Origin': '*',
              },
            });
          }
        }

        // If audio fetch failed, return JSON response from backend
        return NextResponse.json(data, { status: 200 });
      }

      // If response is already audio, return it directly
      const audioBuffer = await response.arrayBuffer();
      return new NextResponse(audioBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Step 2: Backend failed
    console.error(`Backend TTS failed: ${response?.status || backendError}`);
    return NextResponse.json(
      { error: 'TTS service unavailable' },
      { status: response?.status || 503 }
    );
  } catch (error) {
    console.error('TTS GET error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { text, voice, rate, pitch } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required and cannot be empty' },
        { status: 400 }
      );
    }

    if (text.length > 500) {
      return NextResponse.json(
        { error: 'Text must not exceed 500 characters' },
        { status: 400 }
      );
    }

    // Remove emoji/icons before sending
    const cleanText = removeEmojis(text.trim());

    if (!cleanText) {
      return NextResponse.json(
        { error: 'Text contains only emoji/icons' },
        { status: 400 }
      );
    }

    let response: Response | null = null;
    let backendError: string | null = null;

    // Step 1: Try backend API first
    try {
      response = await fetch(TTS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, audio/mpeg, audio/wav, audio/*, */*',
        },
        body: JSON.stringify({
          text: cleanText,
          voice: voice || 'vi-VN-HoaiMyNeural',
          rate: rate || '+0%',
          pitch: pitch || '+0Hz',
        }),
      });
    } catch (error) {
      backendError = error instanceof Error ? error.message : 'Network error';
      console.warn(`Backend API request failed: ${backendError}`);
    }

    if (response?.ok) {
      const contentType = response.headers.get('content-type') || 'application/json';

      // If response is audio, return as audio stream
      if (contentType.includes('audio')) {
        const audioBuffer = await response.arrayBuffer();
        return new NextResponse(audioBuffer, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=86400',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // If response is JSON, forward it as is
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    }

    // Step 2: Backend failed
    console.error(`Backend TTS failed: ${response?.status || backendError}`);
    return NextResponse.json(
      { error: 'TTS service unavailable' },
      { status: response?.status || 503 }
    );
  } catch (error) {
    console.error('TTS POST error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}

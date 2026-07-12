import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lessonId, questions } = body;

    if (!lessonId || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Missing lessonId or questions array' },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    console.log(`[/api/quizzes/import] Calling: ${apiUrl}/api/quizzes/import`);
    console.log(`[/api/quizzes/import] Questions count: ${questions.length}`);

    const response = await fetch(`${apiUrl}/api/quizzes/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, questions }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error(`[/api/quizzes/import] API Error ${response.status}:`, responseText);
      try {
        const errorData = JSON.parse(responseText);
        return NextResponse.json(
          { error: errorData.message || errorData.error || responseText },
          { status: response.status }
        );
      } catch {
        return NextResponse.json(
          { error: responseText || 'Failed to import questions' },
          { status: response.status }
        );
      }
    }

    const data = JSON.parse(responseText);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('[/api/quizzes/import] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

/**
 * Save SEO description cho 1 bài học
 *
 * PUT /api/lessons/[id]/seo
 * Body: { seoDescription: "..." }
 */

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { seoDescription } = body;

    if (!seoDescription) {
      return NextResponse.json(
        { error: 'seoDescription is required' },
        { status: 400 }
      );
    }

    // Gọi backend PHP API để save
    const apiUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/api/lessons/${params.id}/seo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN || ''}`,
      },
      body: JSON.stringify({ seo_description: seoDescription }),
    });

    if (!response.ok) {
      // Try alternative endpoint pattern
      const altResponse = await fetch(
        `${apiUrl}/api/lessons/${params.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.API_TOKEN || ''}`,
          },
          body: JSON.stringify({ seo_description: seoDescription }),
        }
      );

      if (!altResponse.ok) {
        throw new Error(
          `Failed to save: ${response.status} ${response.statusText}`
        );
      }

      return NextResponse.json({ success: true, id: params.id });
    }

    return NextResponse.json({ success: true, id: params.id });
  } catch (error) {
    console.error('Error saving SEO description:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const apiUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/api/lessons/${params.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN || ''}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({
      id: params.id,
      seoDescription: data.seo_description || data.seoDescription,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

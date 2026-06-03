import { NextRequest, NextResponse } from 'next/server';
import { generateSeoDescription } from '@/lib/seo-description-generator';

/**
 * Admin API để batch generate & save SEO descriptions cho tất cả bài học
 *
 * Sử dụng:
 * POST /api/admin/generate-seo-descriptions
 * Body: { adminPassword: "xxx" } hoặc để trống nếu có auth middleware
 *
 * Response: { success: true, generated: 45, updated: 40, skipped: 5 }
 */

export async function POST(request: NextRequest) {
  try {
    // Check admin auth (thêm middleware nếu có)
    const adminPassword = process.env.ADMIN_API_PASSWORD;
    const body = await request.json();

    if (adminPassword && body.adminPassword !== adminPassword) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch tất cả bài học từ database
    const lessonsResponse = await fetch(
      `${process.env.API_URL || 'http://localhost:3000'}/api/lessons/all`,
      { method: 'GET' }
    );

    if (!lessonsResponse.ok) {
      throw new Error(`Failed to fetch lessons: ${lessonsResponse.status}`);
    }

    const lessonsData = await lessonsResponse.json();
    const lessons = Array.isArray(lessonsData) ? lessonsData : lessonsData.lessons || [];

    if (!lessons || lessons.length === 0) {
      return NextResponse.json(
        { error: 'No lessons found', success: false },
        { status: 400 }
      );
    }

    console.log(`[SEO Gen] Starting to generate descriptions for ${lessons.length} lessons...`);

    let generated = 0;
    let updated = 0;
    let skipped = 0;
    const errors: Array<{ lessonId: number; title: string; error: string }> = [];

    for (const lesson of lessons) {
      try {
        // Generate unique description
        const description = generateSeoDescription({
          id: lesson.id,
          title: lesson.title,
          courseTitle: lesson.course?.title,
          goals: lesson.detail?.goals || [],
        });

        // Save to database
        const saveResponse = await fetch(
          `${process.env.API_URL || 'http://localhost:3000'}/api/lessons/${lesson.id}/seo`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ seoDescription: description }),
          }
        );

        if (saveResponse.ok) {
          updated++;
          generated++;
        } else if (saveResponse.status === 304) {
          // Already exists, not modified
          skipped++;
        } else {
          throw new Error(`Save failed: ${saveResponse.status}`);
        }

        if (generated % 10 === 0) {
          console.log(`[SEO Gen] Progress: ${generated}/${lessons.length}`);
        }
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Unknown error';
        errors.push({
          lessonId: lesson.id,
          title: lesson.title,
          error,
        });
        console.error(`[SEO Gen] Error for lesson ${lesson.id}:`, error);
      }
    }

    console.log(`[SEO Gen] Complete! Generated: ${generated}, Updated: ${updated}, Skipped: ${skipped}`);

    return NextResponse.json({
      success: true,
      generated,
      updated,
      skipped,
      total: lessons.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SEO Gen] Fatal error:', message);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Serve an info page
  return NextResponse.json({
    message: 'SEO Description Generator API',
    usage: 'POST with body { adminPassword: "xxx" } to generate descriptions',
    endpoint: '/api/admin/generate-seo-descriptions',
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { getRateLimiter } from '@/lib/rate-limiting/rateLimit';

/**
 * GET /api/admin/rate-limits/config
 * Get current rate limit configuration
 */
export async function GET(req: NextRequest) {
  try {
    const rateLimiter = getRateLimiter();
    const config = rateLimiter.getConfig();

    return NextResponse.json({
      maxRequests: config.maxRequests,
      windowMs: config.windowMs,
      windowLabel: formatWindow(config.windowMs),
    });
  } catch (error) {
    console.error('Error fetching rate limit config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/rate-limits/config
 * Update rate limit configuration
 */
export async function POST(req: NextRequest) {
  try {
    // Add authentication check here if needed
    // const session = await getSession(req);
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await req.json();
    const { maxRequests, windowMs } = body;

    // Validate input
    if (typeof maxRequests !== 'number' || maxRequests <= 0) {
      return NextResponse.json(
        { error: 'maxRequests must be a positive number' },
        { status: 400 },
      );
    }

    if (typeof windowMs !== 'number' || windowMs <= 0) {
      return NextResponse.json(
        { error: 'windowMs must be a positive number' },
        { status: 400 },
      );
    }

    const rateLimiter = getRateLimiter();
    rateLimiter.updateConfig({
      maxRequests,
      windowMs,
    });

    return NextResponse.json({
      success: true,
      config: {
        maxRequests,
        windowMs,
        windowLabel: formatWindow(windowMs),
      },
      message: 'Rate limit configuration updated successfully',
    });
  } catch (error) {
    console.error('Error updating rate limit config:', error);
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 },
    );
  }
}

function formatWindow(ms: number): string {
  if (ms === 3600000) return '1 hour';
  if (ms === 86400000) return '24 hours';
  if (ms === 60000) return '1 minute';
  return `${Math.round(ms / 1000)}s`;
}

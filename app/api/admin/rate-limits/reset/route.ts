import { NextRequest, NextResponse } from 'next/server';
import { getRateLimiter } from '@/lib/rate-limiting/rateLimit';

/**
 * POST /api/admin/rate-limits/reset
 * Reset rate limit for a specific IP or all IPs
 */
export async function POST(req: NextRequest) {
  try {
    // Add authentication check here if needed
    // const session = await getSession(req);
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await req.json();
    const { ipAddress } = body;

    const rateLimiter = getRateLimiter();

    if (ipAddress) {
      // Reset specific IP
      rateLimiter.reset(ipAddress);
      return NextResponse.json({
        success: true,
        message: `Rate limit for IP ${ipAddress} has been reset`,
        ipAddress,
      });
    } else {
      // Reset all IPs
      rateLimiter.resetAll();
      return NextResponse.json({
        success: true,
        message: 'All rate limits have been reset',
      });
    }
  } catch (error) {
    console.error('Error resetting rate limits:', error);
    return NextResponse.json(
      { error: 'Failed to reset rate limits' },
      { status: 500 },
    );
  }
}

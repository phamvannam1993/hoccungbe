import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/lib/rate-limiting/storage';
import { getRateLimiter } from '@/lib/rate-limiting/rateLimit';

/**
 * GET /api/admin/rate-limits/stats
 * Get rate limit statistics and overview
 */
export async function GET(req: NextRequest) {
  try {
    // Add authentication check here if needed
    // const session = await getSession(req);
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const storage = getStorage();
    const rateLimiter = getRateLimiter();
    const config = rateLimiter.getConfig();

    // Get statistics for last 24 hours
    const twentyFourHoursAgo = Date.now() - 86400000;
    const stats = storage.getStatistics(86400000);

    // Get top IPs by request count
    const topIps = Array.from(stats.requestsByIp.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ip, count]) => ({
        ip,
        requests: count,
        blocked: stats.blockedByIp.get(ip) || 0,
      }));

    // Get whitelist and blacklist
    const whitelist = storage.getWhitelist();
    const blacklist = storage.getBlacklist();

    return NextResponse.json({
      config: {
        maxRequests: config.maxRequests,
        windowMs: config.windowMs,
        windowLabel: formatWindow(config.windowMs),
      },
      statistics: {
        totalRequests: stats.totalRequests,
        blockedRequests: stats.blockedRequests,
        uniqueIps: stats.uniqueIps,
        blockRate: stats.totalRequests > 0
          ? ((stats.blockedRequests / stats.totalRequests) * 100).toFixed(2)
          : '0.00',
      },
      topIps,
      whitelist,
      blacklist,
      logsCount: storage.getLogsCount(),
    });
  } catch (error) {
    console.error('Error fetching rate limit stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
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

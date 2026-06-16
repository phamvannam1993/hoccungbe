import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/lib/rate-limiting/storage';

/**
 * GET /api/admin/rate-limits/logs?ip=192.168.1.1&limit=100&blocked=false
 * Get rate limit logs with optional filtering
 */
export async function GET(req: NextRequest) {
  try {
    const storage = getStorage();

    // Get query parameters
    const ipAddress = req.nextUrl.searchParams.get('ip');
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '100', 10);
    const blockedParam = req.nextUrl.searchParams.get('blocked');
    const blocked = blockedParam === 'true' ? true : blockedParam === 'false' ? false : undefined;

    // Validate limit
    if (limit <= 0 || limit > 10000) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 10000' },
        { status: 400 },
      );
    }

    let logs;

    // Get logs based on filters
    if (ipAddress) {
      logs = storage.getLogsForIp(ipAddress, limit);
    } else if (blocked !== undefined) {
      const allLogs = storage.getLogsForIp('', limit);
      logs = allLogs.filter((log) => log.wasBlocked === blocked).slice(0, limit);
    } else {
      // Return all logs (up to limit)
      // Since we don't have a method to get all logs directly, we'll need to filter by time
      logs = storage.getBlockedRequests(limit);
    }

    return NextResponse.json({
      logs,
      count: logs.length,
      filters: {
        ipAddress: ipAddress || null,
        blocked: blocked !== undefined ? blocked : null,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching rate limit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/rate-limits/logs
 * Clear all rate limit logs
 */
export async function DELETE(req: NextRequest) {
  try {
    // Add authentication check here if needed
    // const session = await getSession(req);
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const storage = getStorage();
    storage.clearLogs();

    return NextResponse.json({
      success: true,
      message: 'All logs have been cleared',
    });
  } catch (error) {
    console.error('Error clearing logs:', error);
    return NextResponse.json(
      { error: 'Failed to clear logs' },
      { status: 500 },
    );
  }
}

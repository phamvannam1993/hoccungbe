import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/lib/rate-limiting/storage';
import { getRateLimiter } from '@/lib/rate-limiting/rateLimit';
import { isValidIp } from '@/lib/rate-limiting/getClientIp';

/**
 * GET /api/admin/rate-limits/whitelist
 * Get all whitelisted IPs
 */
export async function GET(req: NextRequest) {
  try {
    const storage = getStorage();
    const whitelist = storage.getWhitelist();

    return NextResponse.json({
      whitelist,
      count: whitelist.length,
    });
  } catch (error) {
    console.error('Error fetching whitelist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch whitelist' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/rate-limits/whitelist
 * Add IP to whitelist
 */
export async function POST(req: NextRequest) {
  try {
    // Add authentication check here if needed

    const body = await req.json();
    const { ipAddress, reason, addedBy } = body;

    // Validate IP address
    if (!ipAddress || typeof ipAddress !== 'string') {
      return NextResponse.json(
        { error: 'ipAddress is required' },
        { status: 400 },
      );
    }

    if (!isValidIp(ipAddress)) {
      return NextResponse.json(
        { error: 'Invalid IP address format' },
        { status: 400 },
      );
    }

    const storage = getStorage();
    const rateLimiter = getRateLimiter();

    // Add to storage whitelist
    storage.addToWhitelist(ipAddress, reason, addedBy);

    // Add to rate limiter whitelist
    rateLimiter.whitelist(ipAddress);

    return NextResponse.json({
      success: true,
      message: `IP ${ipAddress} added to whitelist`,
      entry: {
        ipAddress,
        reason,
        addedBy,
        addedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error adding to whitelist:', error);
    return NextResponse.json(
      { error: 'Failed to add IP to whitelist' },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/rate-limits/whitelist
 * Remove IP from whitelist
 */
export async function DELETE(req: NextRequest) {
  try {
    // Add authentication check here if needed

    const body = await req.json();
    const { ipAddress } = body;

    if (!ipAddress || typeof ipAddress !== 'string') {
      return NextResponse.json(
        { error: 'ipAddress is required' },
        { status: 400 },
      );
    }

    const storage = getStorage();
    const rateLimiter = getRateLimiter();

    storage.removeFromWhitelist(ipAddress);
    rateLimiter.removeFromWhitelist(ipAddress);

    return NextResponse.json({
      success: true,
      message: `IP ${ipAddress} removed from whitelist`,
    });
  } catch (error) {
    console.error('Error removing from whitelist:', error);
    return NextResponse.json(
      { error: 'Failed to remove IP from whitelist' },
      { status: 500 },
    );
  }
}

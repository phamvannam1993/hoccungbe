import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/lib/rate-limiting/storage';
import { getRateLimiter } from '@/lib/rate-limiting/rateLimit';
import { isValidIp } from '@/lib/rate-limiting/getClientIp';

/**
 * GET /api/admin/rate-limits/blacklist
 * Get all blacklisted IPs
 */
export async function GET(req: NextRequest) {
  try {
    const storage = getStorage();
    const blacklist = storage.getBlacklist();

    return NextResponse.json({
      blacklist,
      count: blacklist.length,
    });
  } catch (error) {
    console.error('Error fetching blacklist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blacklist' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/rate-limits/blacklist
 * Add IP to blacklist
 */
export async function POST(req: NextRequest) {
  try {
    // Add authentication check here if needed

    const body = await req.json();
    const { ipAddress, reason, addedBy, expiresIn } = body;

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

    // Validate expiresIn if provided
    if (expiresIn && (typeof expiresIn !== 'number' || expiresIn < 0)) {
      return NextResponse.json(
        { error: 'expiresIn must be a positive number (milliseconds) or not provided' },
        { status: 400 },
      );
    }

    const storage = getStorage();
    const rateLimiter = getRateLimiter();

    // Add to storage blacklist
    const expiresAt = expiresIn ? Date.now() + expiresIn : undefined;
    storage.addToBlacklist(ipAddress, reason, addedBy, expiresAt);

    // Add to rate limiter blacklist
    rateLimiter.blacklist(ipAddress, expiresIn);

    return NextResponse.json({
      success: true,
      message: `IP ${ipAddress} added to blacklist`,
      entry: {
        ipAddress,
        reason,
        addedBy,
        addedAt: new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
  } catch (error) {
    console.error('Error adding to blacklist:', error);
    return NextResponse.json(
      { error: 'Failed to add IP to blacklist' },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/rate-limits/blacklist
 * Remove IP from blacklist
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

    storage.removeFromBlacklist(ipAddress);
    rateLimiter.removeFromBlacklist(ipAddress);

    return NextResponse.json({
      success: true,
      message: `IP ${ipAddress} removed from blacklist`,
    });
  } catch (error) {
    console.error('Error removing from blacklist:', error);
    return NextResponse.json(
      { error: 'Failed to remove IP from blacklist' },
      { status: 500 },
    );
  }
}

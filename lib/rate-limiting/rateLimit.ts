'use client';

/**
 * Rate Limiting Service
 * Implements token bucket algorithm for per-IP rate limiting
 */

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  message?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  resetTimeUnix: number;
  retryAfter?: number;
}

interface TokenBucket {
  tokens: number;
  lastRefill: number;
  requestCount: number;
  requestTimes: number[];
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 3600000, // 1 hour
};

class RateLimiter {
  private config: RateLimitConfig;
  private buckets: Map<string, TokenBucket>;
  private whitelistSet: Set<string>;
  private blacklistMap: Map<string, { expiresAt?: number }>;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.buckets = new Map();
    this.whitelistSet = new Set();
    this.blacklist = new Map();
  }

  /**
   * Check if an IP is rate limited
   */
  check(ipAddress: string): RateLimitResult {
    const now = Date.now();

    // Check blacklist first
    const blacklistEntry = this.blacklist.get(ipAddress);
    if (blacklistEntry) {
      if (blacklistEntry.expiresAt && blacklistEntry.expiresAt < now) {
        // Entry expired, remove it
        this.blacklist.delete(ipAddress);
      } else {
        // IP is blacklisted
        const resetTime = new Date(now + this.config.windowMs);
        return {
          allowed: false,
          remaining: 0,
          resetTime,
          resetTimeUnix: resetTime.getTime(),
          retryAfter: Math.ceil(this.config.windowMs / 1000),
        };
      }
    }

    // Whitelist has no limits
    if (this.whitelist.has(ipAddress)) {
      const resetTime = new Date(now + this.config.windowMs);
      return {
        allowed: true,
        remaining: this.config.maxRequests,
        resetTime,
        resetTimeUnix: resetTime.getTime(),
      };
    }

    // Get or create token bucket
    let bucket = this.buckets.get(ipAddress);
    if (!bucket) {
      bucket = {
        tokens: this.config.maxRequests,
        lastRefill: now,
        requestCount: 0,
        requestTimes: [],
      };
      this.buckets.set(ipAddress, bucket);
    }

    // Refill tokens based on elapsed time
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd =
      (timePassed / this.config.windowMs) * this.config.maxRequests;
    bucket.tokens = Math.min(
      this.config.maxRequests,
      bucket.tokens + tokensToAdd,
    );
    bucket.lastRefill = now;

    // Clean up old request times (outside window)
    bucket.requestTimes = bucket.requestTimes.filter(
      (time) => now - time < this.config.windowMs,
    );

    // Check if request is allowed
    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      bucket.requestCount += 1;
      bucket.requestTimes.push(now);

      const resetTime = new Date(bucket.lastRefill + this.config.windowMs);
      return {
        allowed: true,
        remaining: Math.floor(bucket.tokens),
        resetTime,
        resetTimeUnix: resetTime.getTime(),
      };
    }

    // Rate limit exceeded
    const oldestRequest = bucket.requestTimes[0] || now;
    const resetTime = new Date(oldestRequest + this.config.windowMs);
    const retryAfter = Math.ceil(
      (resetTime.getTime() - now) / 1000,
    );

    return {
      allowed: false,
      remaining: 0,
      resetTime,
      resetTimeUnix: resetTime.getTime(),
      retryAfter,
    };
  }

  /**
   * Add IP to whitelist (unlimited requests)
   */
  whitelist(ipAddress: string): void {
    this.whitelist.add(ipAddress);
    this.buckets.delete(ipAddress); // Remove from rate limiting
  }

  /**
   * Remove IP from whitelist
   */
  removeFromWhitelist(ipAddress: string): void {
    this.whitelist.delete(ipAddress);
  }

  /**
   * Check if IP is whitelisted
   */
  isWhitelisted(ipAddress: string): boolean {
    return this.whitelist.has(ipAddress);
  }

  /**
   * Add IP to blacklist
   * @param ipAddress The IP address to blacklist
   * @param expiresIn Optional expiration time in milliseconds
   */
  blacklist(ipAddress: string, expiresIn?: number): void {
    const expiresAt = expiresIn ? Date.now() + expiresIn : undefined;
    this.blacklist.set(ipAddress, { expiresAt });
    this.buckets.delete(ipAddress); // Remove from rate limiting
    this.whitelist.delete(ipAddress); // Remove from whitelist if present
  }

  /**
   * Remove IP from blacklist
   */
  removeFromBlacklist(ipAddress: string): void {
    this.blacklist.delete(ipAddress);
  }

  /**
   * Check if IP is blacklisted
   */
  isBlacklisted(ipAddress: string): boolean {
    const entry = this.blacklist.get(ipAddress);
    if (!entry) return false;

    // Check if entry has expired
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.blacklist.delete(ipAddress);
      return false;
    }

    return true;
  }

  /**
   * Reset a specific IP's rate limit
   */
  reset(ipAddress: string): void {
    this.buckets.delete(ipAddress);
  }

  /**
   * Reset all rate limits
   */
  resetAll(): void {
    this.buckets.clear();
  }

  /**
   * Get current stats for an IP
   */
  getStats(ipAddress: string) {
    const bucket = this.buckets.get(ipAddress);
    return {
      ipAddress,
      isWhitelisted: this.whitelist.has(ipAddress),
      isBlacklisted: this.isBlacklisted(ipAddress),
      tokens: bucket?.tokens || this.config.maxRequests,
      requestCount: bucket?.requestCount || 0,
      requestTimes: bucket?.requestTimes || [],
    };
  }

  /**
   * Get all active IPs
   */
  getActiveIps() {
    return Array.from(this.buckets.keys());
  }

  /**
   * Update rate limit config
   */
  updateConfig(config: Partial<RateLimitConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current config
   */
  getConfig(): RateLimitConfig {
    return { ...this.config };
  }
}

// Global singleton instance
let globalRateLimiter: RateLimiter | null = null;

export function initializeRateLimiter(
  config: Partial<RateLimitConfig> = {},
): RateLimiter {
  if (!globalRateLimiter) {
    globalRateLimiter = new RateLimiter(config);
  }
  return globalRateLimiter;
}

export function getRateLimiter(): RateLimiter {
  if (!globalRateLimiter) {
    globalRateLimiter = new RateLimiter();
  }
  return globalRateLimiter;
}

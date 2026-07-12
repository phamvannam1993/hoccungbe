/**
 * Simple in-memory storage for rate limit data
 * Can be extended to use Redis or other backends
 */

export interface RateLimitLog {
  timestamp: number;
  ipAddress: string;
  endpoint: string;
  wasBlocked: boolean;
  remaining: number;
  userAgent?: string;
}

export interface IpListEntry {
  ipAddress: string;
  reason?: string;
  addedAt: number;
  addedBy?: string;
  expiresAt?: number;
}

class RateLimitStorage {
  private logs: RateLimitLog[] = [];
  private whitelist: Map<string, IpListEntry> = new Map();
  private blacklist: Map<string, IpListEntry> = new Map();
  private maxLogs = 10000; // Keep last 10k logs

  /**
   * Log a rate limit check
   */
  logRequest(
    ipAddress: string,
    endpoint: string,
    wasBlocked: boolean,
    remaining: number,
    userAgent?: string,
  ): void {
    const log: RateLimitLog = {
      timestamp: Date.now(),
      ipAddress,
      endpoint,
      wasBlocked,
      remaining,
      userAgent,
    };

    this.logs.push(log);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  /**
   * Get logs for an IP address
   */
  getLogsForIp(ipAddress: string, limit: number = 100): RateLimitLog[] {
    return this.logs
      .filter((log) => log.ipAddress === ipAddress)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get logs for a time range
   */
  getLogsByTimeRange(
    startTime: number,
    endTime: number,
  ): RateLimitLog[] {
    return this.logs.filter(
      (log) => log.timestamp >= startTime && log.timestamp <= endTime,
    );
  }

  /**
   * Get all blocked requests
   */
  getBlockedRequests(limit: number = 100): RateLimitLog[] {
    return this.logs
      .filter((log) => log.wasBlocked)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get usage statistics
   */
  getStatistics(timeWindowMs: number = 3600000) {
    const now = Date.now();
    const recentLogs = this.logs.filter(
      (log) => now - log.timestamp < timeWindowMs,
    );

    const stats = {
      totalRequests: recentLogs.length,
      blockedRequests: recentLogs.filter((l) => l.wasBlocked).length,
      uniqueIps: new Set(recentLogs.map((l) => l.ipAddress)).size,
      requestsByIp: new Map<string, number>(),
      blockedByIp: new Map<string, number>(),
    };

    recentLogs.forEach((log) => {
      // Total requests by IP
      stats.requestsByIp.set(
        log.ipAddress,
        (stats.requestsByIp.get(log.ipAddress) || 0) + 1,
      );

      // Blocked requests by IP
      if (log.wasBlocked) {
        stats.blockedByIp.set(
          log.ipAddress,
          (stats.blockedByIp.get(log.ipAddress) || 0) + 1,
        );
      }
    });

    return stats;
  }

  /**
   * Add IP to whitelist
   */
  addToWhitelist(
    ipAddress: string,
    reason?: string,
    addedBy?: string,
  ): void {
    this.whitelist.set(ipAddress, {
      ipAddress,
      reason,
      addedAt: Date.now(),
      addedBy,
    });
  }

  /**
   * Remove IP from whitelist
   */
  removeFromWhitelist(ipAddress: string): void {
    this.whitelist.delete(ipAddress);
  }

  /**
   * Get whitelist
   */
  getWhitelist(): IpListEntry[] {
    return Array.from(this.whitelist.values());
  }

  /**
   * Check if IP is whitelisted
   */
  isWhitelisted(ipAddress: string): boolean {
    return this.whitelist.has(ipAddress);
  }

  /**
   * Add IP to blacklist
   */
  addToBlacklist(
    ipAddress: string,
    reason?: string,
    addedBy?: string,
    expiresAt?: number,
  ): void {
    this.blacklist.set(ipAddress, {
      ipAddress,
      reason,
      addedAt: Date.now(),
      addedBy,
      expiresAt,
    });
  }

  /**
   * Remove IP from blacklist
   */
  removeFromBlacklist(ipAddress: string): void {
    this.blacklist.delete(ipAddress);
  }

  /**
   * Get blacklist (excluding expired entries)
   */
  getBlacklist(): IpListEntry[] {
    const now = Date.now();
    const activeEntries = Array.from(this.blacklist.values()).filter(
      (entry) => !entry.expiresAt || entry.expiresAt > now,
    );

    // Clean up expired entries
    Array.from(this.blacklist.entries()).forEach(([ip, entry]) => {
      if (entry.expiresAt && entry.expiresAt <= now) {
        this.blacklist.delete(ip);
      }
    });

    return activeEntries;
  }

  /**
   * Check if IP is blacklisted
   */
  isBlacklisted(ipAddress: string): boolean {
    const entry = this.blacklist.get(ipAddress);
    if (!entry) return false;

    // Check expiration
    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.blacklist.delete(ipAddress);
      return false;
    }

    return true;
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export all data
   */
  export() {
    return {
      logs: this.logs,
      whitelist: Array.from(this.whitelist.values()),
      blacklist: this.getBlacklist(),
      statistics: this.getStatistics(),
    };
  }

  /**
   * Get total logs count
   */
  getLogsCount(): number {
    return this.logs.length;
  }
}

// Global singleton
let globalStorage: RateLimitStorage | null = null;

export function getStorage(): RateLimitStorage {
  if (!globalStorage) {
    globalStorage = new RateLimitStorage();
  }
  return globalStorage;
}

export function resetStorage(): void {
  globalStorage = null;
}

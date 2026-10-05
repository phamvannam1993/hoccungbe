/**
 * Extract client IP address from request headers
 * Handles various proxy scenarios
 */

export function getClientIp(request: Request): string {
  const headers = request.headers;

  // Try X-Forwarded-For header (standard proxy header)
  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    // X-Forwarded-For can contain multiple IPs, first is the original client
    const ips = xForwardedFor.split(',').map((ip) => ip.trim());
    if (ips.length > 0) {
      return ips[0];
    }
  }

  // Try Cloudflare header
  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Try X-Real-IP (nginx reverse proxy)
  const xRealIp = headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp;
  }

  // Try X-Client-IP
  const xClientIp = headers.get('x-client-ip');
  if (xClientIp) {
    return xClientIp;
  }

  // Fallback: try to extract from socket (less reliable in serverless)
  // This won't work in edge runtime, but is included for completeness
  try {
    // In Node.js runtime
    const socket = (request as any).socket;
    if (socket?.remoteAddress) {
      return socket.remoteAddress;
    }
  } catch {
    // Continue to final fallback
  }

  // Last resort fallback
  return '127.0.0.1';
}

/**
 * Validate IP address format
 */
export function isValidIp(ip: string): boolean {
  // IPv4
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
    const parts = ip.split('.').map(Number);
    return parts.every((part) => part >= 0 && part <= 255);
  }

  // IPv6 basic check
  if (ip.includes(':')) {
    return true;
  }

  return false;
}

/**
 * Anonymize IP address (keep first octets)
 * Useful for privacy-preserving logging
 */
export function anonymizeIp(ip: string): string {
  if (ip.includes(':')) {
    // IPv6
    const parts = ip.split(':');
    return `${parts.slice(0, 3).join(':')}:****`;
  } else {
    // IPv4
    const parts = ip.split('.');
    return `${parts.slice(0, 3).join('.')}.*`;
  }
}

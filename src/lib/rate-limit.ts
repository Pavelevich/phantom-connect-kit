/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or similar
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (usually IP address)
 * @param limit - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds (default: 60 seconds)
 */
export function rateLimit(
  identifier: string,
  limit: number = 30,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  const record = rateLimitMap.get(key);

  // First request or window expired
  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(key, { count: 1, resetTime });
    return { success: true, remaining: limit - 1, resetTime };
  }

  // Within window, check limit
  if (record.count >= limit) {
    return { success: false, remaining: 0, resetTime: record.resetTime };
  }

  // Increment count
  record.count++;
  return { success: true, remaining: limit - record.count, resetTime: record.resetTime };
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown";
}

/**
 * Create rate limit headers for response
 */
export function rateLimitHeaders(result: RateLimitResult, limit: number): HeadersInit {
  return {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(result.resetTime / 1000).toString(),
  };
}

// For testing - reset the rate limit map
export function _resetRateLimitMap(): void {
  rateLimitMap.clear();
}

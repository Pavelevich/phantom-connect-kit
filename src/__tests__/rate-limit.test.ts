import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, _resetRateLimitMap } from "@/lib/rate-limit";

describe("Rate Limiting", () => {
  beforeEach(() => {
    _resetRateLimitMap();
  });

  it("should allow requests under the limit", () => {
    const result = rateLimit("test-ip", 5, 60000);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("should track multiple requests", () => {
    const ip = "test-ip-2";

    const result1 = rateLimit(ip, 5, 60000);
    expect(result1.remaining).toBe(4);

    const result2 = rateLimit(ip, 5, 60000);
    expect(result2.remaining).toBe(3);

    const result3 = rateLimit(ip, 5, 60000);
    expect(result3.remaining).toBe(2);
  });

  it("should block requests over the limit", () => {
    const ip = "test-ip-3";
    const limit = 3;

    // Make requests up to the limit
    rateLimit(ip, limit, 60000);
    rateLimit(ip, limit, 60000);
    rateLimit(ip, limit, 60000);

    // This one should be blocked
    const result = rateLimit(ip, limit, 60000);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("should track different IPs separately", () => {
    const ip1 = "ip-1";
    const ip2 = "ip-2";

    // Exhaust limit for ip1
    rateLimit(ip1, 2, 60000);
    rateLimit(ip1, 2, 60000);
    const result1 = rateLimit(ip1, 2, 60000);
    expect(result1.success).toBe(false);

    // ip2 should still work
    const result2 = rateLimit(ip2, 2, 60000);
    expect(result2.success).toBe(true);
    expect(result2.remaining).toBe(1);
  });

  it("should include resetTime in result", () => {
    const before = Date.now();
    const result = rateLimit("test-ip-4", 5, 60000);
    const after = Date.now();

    expect(result.resetTime).toBeGreaterThanOrEqual(before + 60000);
    expect(result.resetTime).toBeLessThanOrEqual(after + 60000);
  });

  it("should reset after window expires", async () => {
    const ip = "test-ip-5";
    const windowMs = 100; // 100ms for testing

    // Exhaust limit
    rateLimit(ip, 2, windowMs);
    rateLimit(ip, 2, windowMs);
    const blocked = rateLimit(ip, 2, windowMs);
    expect(blocked.success).toBe(false);

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Should work again
    const result = rateLimit(ip, 2, windowMs);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(1);
  });
});

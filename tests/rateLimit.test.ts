import { describe, it, expect } from "vitest";
import { checkRateLimit } from "../lib/rateLimit";

describe("Rate Limiting Service", () => {
  it("allows normal requests within the limit", () => {
    const testIp = `192.168.1.${Math.floor(Math.random() * 1000)}`;
    const result = checkRateLimit(testIp);
    expect(result.isLimited).toBe(false);
    expect(result.remaining).toBeGreaterThan(0);
  });

  it("blocks rapid spam requests once limit is exceeded", () => {
    const spamIp = `10.0.0.${Date.now() % 255}_${Math.random()}`;
    
    // Max requests is 15
    for (let i = 0; i < 15; i++) {
      checkRateLimit(spamIp);
    }

    // 16th request should be limited
    const blocked = checkRateLimit(spamIp);
    expect(blocked.isLimited).toBe(true);
    expect(blocked.remaining).toBe(0);
  });
});

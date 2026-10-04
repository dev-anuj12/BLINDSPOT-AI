interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 15; // 15 requests per 10 min window to be generous for multi-round reflection

// Periodic cleanup of expired entries
setInterval(() => {
  const now = Date.now();
  rateLimitMap.forEach((record, key) => {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  });
}, 5 * 60 * 1000);

export function checkRateLimit(ip: string): { isLimited: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
    rateLimitMap.set(ip, newRecord);
    return { isLimited: false, remaining: MAX_REQUESTS - 1, resetTime: newRecord.resetTime };
  }

  if (record.count >= MAX_REQUESTS) {
    return { isLimited: true, remaining: 0, resetTime: record.resetTime };
  }

  record.count += 1;
  return { isLimited: false, remaining: MAX_REQUESTS - record.count, resetTime: record.resetTime };
}

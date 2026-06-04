/**
 * Lightweight in-memory sliding-window rate limiter.
 *
 * This is suitable for a single-process Node.js deployment (e.g. a single
 * Vercel function instance or a single VPS server).
 *
 * If you scale to multiple instances, replace this with a Redis-backed
 * solution such as @upstash/ratelimit.
 */

interface WindowEntry {
  timestamps: number[];
}

const store = new Map<string, WindowEntry>();

export interface RateLimitResult {
  allowed: boolean;
  /** How many attempts remain in the current window */
  remaining: number;
  /** Unix timestamp (ms) at which the oldest entry expires */
  resetAt: number;
}

/**
 * Check whether `key` is within the allowed rate.
 *
 * @param key        - Identifier to track (e.g. IP address or email)
 * @param limit      - Maximum number of requests allowed per `windowMs`
 * @param windowMs   - Time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove timestamps outside the current window
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  const remaining = Math.max(0, limit - entry.timestamps.length);
  const resetAt = entry.timestamps.length > 0 ? entry.timestamps[0] + windowMs : now + windowMs;

  if (entry.timestamps.length >= limit) {
    return { allowed: false, remaining: 0, resetAt };
  }

  entry.timestamps.push(now);
  return { allowed: true, remaining: remaining - 1, resetAt };
}

/**
 * Convenience helper for the login endpoint:
 * 5 attempts per 15 minutes per IP address.
 */
export function checkLoginRateLimit(ip: string): RateLimitResult {
  return checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
}

/**
 * Tiny in-memory rate limiter for the admin AI routes.
 *
 * Fixed-window counter keyed by admin identity. NOTE: this caps a single
 * hot serverless instance, not the whole fleet (each Lambda/edge worker
 * keeps its own map). It's enough to stop a runaway client or a leaked
 * session from burning unbounded API credits on one instance. For a hard
 * global ceiling, back this with Upstash / Vercel KV and the same shape.
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterMs: number;
}

export function checkRateLimit(key: string, limit = 30, windowMs = 60_000): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterMs: 0 };
  }
  if (existing.count >= limit) {
    return { ok: false, remaining: 0, retryAfterMs: existing.resetAt - now };
  }
  existing.count += 1;
  return { ok: true, remaining: limit - existing.count, retryAfterMs: 0 };
}

/** Opportunistic cleanup so the map can't grow unbounded over time. */
export function sweepRateLimits(): void {
  const now = Date.now();
  for (const [k, b] of buckets) {
    if (now >= b.resetAt) buckets.delete(k);
  }
}

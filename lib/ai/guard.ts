import { NextResponse } from "next/server";
import { adminIdentity, type AdminIdentity } from "@/lib/auth/session";
import { checkRateLimit, sweepRateLimits } from "@/lib/ai/rate-limit";

export type GuardOutcome =
  | { ok: true; identity: AdminIdentity }
  | { ok: false; response: NextResponse };

/**
 * Single entry guard for the admin AI / credit-burning routes:
 *   1. Require an allowlisted admin session — 404 (like the public web)
 *      on miss, so the endpoints aren't enumerable.
 *   2. Per-identity rate limit — 429 on miss, so a runaway client or a
 *      leaked session can't hammer the paid endpoints unbounded.
 *
 * Usage:
 *   const guard = await guardAiRoute();
 *   if (!guard.ok) return guard.response;
 */
export async function guardAiRoute(opts?: {
  limit?: number;
  windowMs?: number;
  bucket?: string;
}): Promise<GuardOutcome> {
  const identity = await adminIdentity();
  if (!identity) {
    return { ok: false, response: new NextResponse(null, { status: 404 }) };
  }
  sweepRateLimits();
  const key = `${opts?.bucket ?? "ai"}:${identity.sub || identity.email}`;
  const rl = checkRateLimit(key, opts?.limit, opts?.windowMs);
  if (!rl.ok) {
    return {
      ok: false,
      response: NextResponse.json(
        { reason: "Rate limit exceeded. Slow down and try again shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.max(1, Math.ceil(rl.retryAfterMs / 1000))) },
        },
      ),
    };
  }
  return { ok: true, identity };
}

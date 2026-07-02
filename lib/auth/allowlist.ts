import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Admin allowlist — the single rule for "is this email allowed in the admin."
 *
 * An email is allowed if it is EITHER:
 *   - in the ALLOWED_EMAILS env var (bootstrap owners; always works, even
 *     before the DB migration or if the database is unreachable), OR
 *   - in the `staff_emails` table with active = true (self-serve staff added
 *     via /admin/team — no redeploy needed).
 *
 * The env var stays as the always-on fallback so a bad DB state can never lock
 * everyone out. The DB lookup is cached in-process briefly because this runs on
 * every admin request (edge middleware + every admin page/action).
 */

// Only the `from` method is needed, and both the @supabase/ssr edge client and
// the @supabase/supabase-js server client provide it — Pick keeps the helper
// usable by all three gate-checkers without coupling to one client type.
type QueryClient = Pick<SupabaseClient, "from">;

const DB_TTL_MS = 30_000;
const dbCache = new Map<string, { allowed: boolean; exp: number }>();

/**
 * Dev-only admin bypass. When DEV_ADMIN_BYPASS=1 AND we are NOT in production,
 * grant admin without a Google sign-in — so the admin can be opened and tested
 * locally. Double-safe: it is hard-gated on NODE_ENV so it can never unlock a
 * production deploy, and the flag is only ever set in local .env.local (never
 * in the hosting env). Off by default.
 */
export function devAdminBypass(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.DEV_ADMIN_BYPASS === "1";
}

export function envAllowedEmails(): Set<string> {
  const raw = process.env.ALLOWED_EMAILS?.trim() ?? "";
  if (!raw) return new Set();
  return new Set(raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean));
}

export function isEnvAllowed(email: string): boolean {
  return envAllowedEmails().has(email.toLowerCase());
}

/** True when no env allowlist is set — drives the dev-open / prod-closed fallback. */
export function envAllowlistEmpty(): boolean {
  return envAllowedEmails().size === 0;
}

async function isDbAllowed(email: string, supabase: QueryClient): Promise<boolean> {
  const now = Date.now();
  const hit = dbCache.get(email);
  if (hit && hit.exp > now) return hit.allowed;

  let allowed = false;
  try {
    const { data } = await supabase
      .from("staff_emails")
      .select("email")
      .eq("email", email)
      .eq("active", true)
      .maybeSingle();
    allowed = !!data;
  } catch {
    // Table missing (pre-migration) or a transient error → env-only.
    allowed = false;
  }
  dbCache.set(email, { allowed, exp: now + DB_TTL_MS });
  return allowed;
}

/**
 * Is this email allowed admin access? Env allowlist first (no I/O), then the
 * staff_emails table (cached). `supabase` must be a client that can read
 * staff_emails — the per-request authenticated client each gate-checker holds.
 */
export async function isEmailAllowed(
  email: string | undefined | null,
  supabase: QueryClient,
): Promise<boolean> {
  if (!email) return false;
  const e = email.toLowerCase();
  if (isEnvAllowed(e)) return true;
  return isDbAllowed(e, supabase);
}

/** Drop the cached DB allowlist result for an email (call after staff edits). */
export function invalidateAllowlist(email?: string): void {
  if (email) dbCache.delete(email.toLowerCase());
  else dbCache.clear();
}

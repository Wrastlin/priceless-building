import "server-only";
import { adminClient, hasServiceRole } from "@/lib/supabase/admin";
import { isEnvAllowed } from "@/lib/auth/allowlist";

/**
 * The authoritative "is this email allowed in the admin" check. Runs in the
 * Node server runtime only (used by adminIdentity / getClaims), NOT the edge
 * middleware — because it reads the staff_emails table through the SERVICE-ROLE
 * client. That table denies all direct anon/authenticated access (migration
 * 0003), so a signed-in user can't read or write it via the public API; only
 * this server-only path can.
 *
 * Allowed = email in ALLOWED_EMAILS env (bootstrap owners, always works even if
 * the DB is unreachable) OR in staff_emails where active. The DB result is
 * cached briefly since this runs on every admin request.
 */

const DB_TTL_MS = 30_000;
const dbCache = new Map<string, { allowed: boolean; exp: number }>();

async function isDbAllowed(email: string): Promise<boolean> {
  if (!hasServiceRole()) return false; // no service role → env-only
  const now = Date.now();
  const hit = dbCache.get(email);
  if (hit && hit.exp > now) return hit.allowed;

  let allowed = false;
  try {
    const { data } = await adminClient()
      .from("staff_emails")
      .select("email")
      .eq("email", email)
      .eq("active", true)
      .maybeSingle();
    allowed = !!data;
  } catch {
    allowed = false; // table missing / transient → env-only
  }
  dbCache.set(email, { allowed, exp: now + DB_TTL_MS });
  return allowed;
}

export async function isEmailAllowed(email: string | undefined | null): Promise<boolean> {
  if (!email) return false;
  const e = email.toLowerCase();
  if (isEnvAllowed(e)) return true;
  return isDbAllowed(e);
}

/** Drop the cached DB allowlist result for an email (call after staff edits). */
export function invalidateAllowlist(email?: string): void {
  if (email) dbCache.delete(email.toLowerCase());
  else dbCache.clear();
}

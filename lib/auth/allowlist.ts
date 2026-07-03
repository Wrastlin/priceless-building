/**
 * Sync, dependency-free allowlist helpers — safe to import anywhere, including
 * the edge middleware (proxy.ts). The DB-backed staff check lives separately in
 * lib/auth/staff-allowlist.ts (server-only, service-role) so the edge bundle
 * never pulls in the Supabase admin client.
 */

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

/**
 * Dev-only admin bypass. When DEV_ADMIN_BYPASS=1 AND we are NOT in production,
 * grant admin without a Google sign-in — so the admin can be opened and tested
 * locally. Double-safe: hard-gated on NODE_ENV so it can never unlock a
 * production deploy, and the flag is only ever set in local .env.local. Off by
 * default.
 */
export function devAdminBypass(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.DEV_ADMIN_BYPASS === "1";
}

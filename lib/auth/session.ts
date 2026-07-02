import { createClient } from "@/lib/supabase/server";
import { isEmailAllowed, envAllowlistEmpty, devAdminBypass } from "@/lib/auth/allowlist";

/**
 * Single admin-access gate. Used by every protected route handler and
 * Server Action.
 *
 * Access requires ALL of:
 *   0. The admin is globally enabled (see `adminGloballyEnabled` — the
 *      PUBLIC_ADMIN_ENABLED pre-launch killswitch), AND
 *   1. The request carries a valid Supabase session cookie, AND
 *   2. The signed-in user's email is in ALLOWED_EMAILS (case-insensitive,
 *      comma-separated env var).
 *
 * If the user is signed into Supabase BUT their email isn't in the
 * allowlist, treat them the same as logged-out. They'll see the same 404
 * the public web sees.
 *
 * Dev fallback: if NEITHER Supabase env vars NOR ALLOWED_EMAILS are
 * configured, grant access so a designer can iterate locally.
 *
 * Use in API route handlers:
 *   if (!(await hasAdminSession())) return new NextResponse(null, { status: 404 });
 * Or, for the AI routes, prefer `guardAiRoute()` (auth + rate limit).
 *
 * Use in Server Actions:
 *   await requireAdminSession();   // throws Error("Unauthorized") on miss
 */

const isProd = () => process.env.NODE_ENV === "production";

/**
 * Pre-launch killswitch (documented in .env.example). In PRODUCTION the
 * admin is hard-locked unless PUBLIC_ADMIN_ENABLED=1, so a deploy can't
 * accidentally expose the back-office before launch. In dev it's always
 * on. proxy.ts mirrors this so the edge 404s too.
 *
 * NOTE: when you launch, set PUBLIC_ADMIN_ENABLED=1 in the production
 * environment or the live admin will return 404 for everyone.
 */
export function adminGloballyEnabled(): boolean {
  if (!isProd()) return true;
  return process.env.PUBLIC_ADMIN_ENABLED === "1";
}

export type AdminIdentity = { email: string; sub: string };

/**
 * Resolve the current admin identity, or null if access should be denied.
 * Single source of truth behind hasAdminSession / requireAdminSession and
 * the AI-route rate limiter (which keys on `sub`).
 */
export async function adminIdentity(): Promise<AdminIdentity | null> {
  if (!adminGloballyEnabled()) return null;
  if (devAdminBypass()) return { email: "dev@local", sub: "dev" };

  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseConfigured) {
    // Nothing configured: dev fallback open, prod hard-locked.
    if (envAllowlistEmpty() && !isProd()) return { email: "dev@local", sub: "dev" };
    return null;
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const claims = data?.claims;
    if (!claims) return null;
    const email = (claims.email as string | undefined)?.toLowerCase();
    const sub = (claims.sub as string | undefined) ?? email ?? "unknown";
    // Allowed if in the env allowlist OR the staff_emails table.
    if (await isEmailAllowed(email, supabase)) return { email: email ?? "unknown", sub };
    // No allowlist configured at all: fail closed in prod, open in dev.
    if (envAllowlistEmpty() && !isProd()) return { email: email ?? "dev@local", sub };
    return null;
  } catch {
    return null;
  }
}

export async function hasAdminSession(): Promise<boolean> {
  return (await adminIdentity()) !== null;
}

export async function requireAdminSession(): Promise<void> {
  if (!(await hasAdminSession())) {
    throw new Error("Unauthorized");
  }
}

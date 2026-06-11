import { createClient } from "@/lib/supabase/server";

/**
 * Single admin-access gate. Used by every protected route handler and
 * Server Action.
 *
 * Returns true iff:
 *   1. The request carries a valid Supabase session cookie, AND
 *   2. The signed-in user's email is in ALLOWED_EMAILS (case-insensitive,
 *      comma-separated env var).
 *
 * If the user is signed into Supabase BUT their email isn't in the
 * allowlist, treat them the same as logged-out (false). They'll see
 * the same 404 the public web sees.
 *
 * Dev fallback: if NEITHER Supabase env vars NOR ALLOWED_EMAILS are
 * configured, return true so a designer can iterate locally.
 *
 * Use in API route handlers:
 *   if (!(await hasAdminSession())) return new NextResponse(null, { status: 404 });
 *
 * Use in Server Actions:
 *   await requireAdminSession();   // throws Error("Unauthorized") on miss
 */

const isProd = () => process.env.NODE_ENV === "production";

function allowedEmails(): Set<string> {
  const raw = process.env.ALLOWED_EMAILS?.trim() ?? "";
  if (!raw) return new Set();
  return new Set(raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean));
}

export async function hasAdminSession(): Promise<boolean> {
  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const allow = allowedEmails();

  if (!supabaseConfigured && allow.size === 0) {
    // Nothing configured: dev fallback open, prod is hard-locked.
    return !isProd();
  }
  if (!supabaseConfigured) return false;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const claims = data?.claims;
    if (!claims) return false;
    const email = (claims.email as string | undefined)?.toLowerCase();
    if (!email) return false;
    if (allow.size === 0) {
      // Supabase wired but no allowlist configured. In prod, fail
      // closed — never let a stranger with a Google account in. In
      // dev, allow any signed-in user.
      return !isProd();
    }
    return allow.has(email);
  } catch {
    return false;
  }
}

export async function requireAdminSession(): Promise<void> {
  if (!(await hasAdminSession())) {
    throw new Error("Unauthorized");
  }
}

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Returns the current Supabase user's claims, or null if signed out
 * or not on the ALLOWED_EMAILS allowlist.
 *
 * Uses getClaims() which validates the JWT signature locally against the
 * project's JWKS — fast and trustworthy. Wrapped in React `cache` so
 * multiple Server Component reads in the same request hit the cookie
 * store once.
 */
export const getClaims = cache(async (): Promise<AuthClaims> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    // Dev fallback so designers can iterate locally without auth.
    if (process.env.NODE_ENV !== "production") {
      return { sub: "dev", email: "dev@local", role: "admin" };
    }
    return null;
  }
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;
  const email = (claims.email as string | undefined)?.toLowerCase();
  const allow = parseAllowed(process.env.ALLOWED_EMAILS);
  // Empty allowlist in prod = fail closed. In dev = anyone signed in.
  if (allow.size === 0 && process.env.NODE_ENV === "production") return null;
  if (allow.size > 0 && (!email || !allow.has(email))) return null;
  return claims as AuthClaims;
});

function parseAllowed(env: string | undefined): Set<string> {
  if (!env) return new Set();
  return new Set(env.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean));
}

export type AuthClaims = {
  sub: string;
  email?: string;
  role?: string;
  user_metadata?: { full_name?: string; name?: string; avatar_url?: string };
  [key: string]: unknown;
} | null;

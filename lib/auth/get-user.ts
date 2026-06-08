import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Returns the current user's claims from the cookie, or null if signed out.
 *
 * Uses `getClaims()` which validates the JWT signature locally against the
 * project's published JWKS — fast and trustworthy. Wrapped in React `cache`
 * so calling it from multiple Server Components in the same request hits
 * the cookie store once.
 */
export const getClaims = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims ?? null;
});

export type AuthClaims = {
  sub: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
} | null;

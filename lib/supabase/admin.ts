import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client for PRIVILEGED server-side access that must
 * bypass RLS: the staff allowlist (staff_emails) and private item data
 * (item_private). Those tables deny ALL direct anon/authenticated access
 * (migration 0003), so only this client can touch them — and its key is
 * server-only, never shipped to the browser.
 *
 * NEVER import this from a client component. The `server-only` guard makes
 * such an import a build error.
 */
let cached: SupabaseClient | null = null;

export function hasServiceRole(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function adminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Service-role client not configured: set SUPABASE_SERVICE_ROLE_KEY (server env only).",
    );
  }
  if (!cached) {
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Anonymous, session-less Supabase client for PUBLIC reads.
 *
 * Unlike `lib/supabase/server.ts`, this client carries no user cookies and
 * holds no per-request state, so it's safe to memoize at module scope and
 * reuse across requests. RLS limits it to rows the `anon` role may see
 * (published catalog items).
 *
 * Reads use time-based ISR (60s) rather than dynamic fetches so storefront
 * pages stay statically cacheable; catalog writes additionally call
 * `revalidatePath` (see `lib/items/store.ts`) to refresh the affected pages
 * immediately instead of waiting out the window.
 */
let cached: SupabaseClient | null = null;

export function publicClient(): SupabaseClient {
  if (cached) return cached;
  cached = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) =>
          fetch(input, { ...init, next: { revalidate: 60 } }),
      },
    },
  );
  return cached;
}

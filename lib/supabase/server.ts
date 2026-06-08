import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client.
 *
 * Used in Server Components, Server Actions, and Route Handlers. Must be
 * re-created per request — captures the cookies of the current request.
 * Initializing at module scope would leak one user's session into another's
 * request on Fluid compute.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — Next.js disallows cookie
            // writes there. Safe to ignore because proxy.ts refreshes the
            // cookie on the same request and writes Set-Cookie itself.
          }
        },
      },
    },
  );
}

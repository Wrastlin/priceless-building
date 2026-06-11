// Next.js 16: this file used to be `middleware.ts`. The runtime contract is
// identical; only the filename changed.
//
// Auth model:
//   - Every /admin/* request must carry a valid Supabase session whose
//     user's email is on the ALLOWED_EMAILS list. Anything else gets a 404.
//   - 404 (not 401 or a redirect to /login) when the request looks like an
//     unauthenticated visitor probing for admin URLs. We DO redirect to
//     /login when the browser is clearly a real browser following a link
//     (Accept includes text/html). That way Aaron clicking pricelessbuilding.com/admin
//     in Safari lands on the login page rather than a confusing 404.
//
// This file is NOT a security boundary. Every Server Action and Route
// Handler that mutates data or burns API credits must re-check via
// hasAdminSession() / requireAdminSession() in lib/auth/session.ts.

import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const pathname = request.nextUrl.pathname;
  const isAdmin = pathname.startsWith("/admin");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const allow = parseAllowed(process.env.ALLOWED_EMAILS);
  const inProd = process.env.NODE_ENV === "production";

  // In prod with nothing configured: hard 404 the admin (better than
  // half-open). In dev with nothing configured: leave admin open so a
  // designer can iterate locally.
  if (isAdmin && (!supabaseUrl || !supabaseKey)) {
    if (inProd) return new NextResponse(null, { status: 404 });
    return response;
  }

  // Public storefront pages don't need the Supabase round trip.
  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  // Refresh the Supabase session cookie on every request (auth cookies
  // expire — this keeps the user signed in across short tab closures).
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Validate the JWT signature locally against the project's JWKS.
  // Fast (no network), trustworthy.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (isAdmin) {
    const email = (claims?.email as string | undefined)?.toLowerCase();
    const ok = !!email && (allow.size === 0 ? !inProd : allow.has(email));

    if (!ok) {
      // Browser following a link → friendly login redirect.
      const accept = request.headers.get("accept") ?? "";
      if (accept.includes("text/html")) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
      }
      // Anything else (curl, scrapers, API probes) → look like a dead URL.
      return new NextResponse(null, { status: 404 });
    }

    // Authed. CDN/edge must not cache (leaks Set-Cookie or admin content).
    response.headers.set("Cache-Control", "private, no-store");
  }

  return response;
}

function parseAllowed(env: string | undefined): Set<string> {
  if (!env) return new Set();
  return new Set(env.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean));
}

export const config = {
  matcher: [
    // Skip Next.js static + image optimizer + favicon + any direct image hits.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

// Next.js 16: this file used to be `middleware.ts`. The runtime contract is
// identical; only the filename changed. We use it to refresh the Supabase
// auth cookie on every request and gate non-public routes.
//
// Important: this is NOT a security boundary. Every Server Action and Route
// Handler must still re-check auth. The proxy keeps the cookie fresh and
// redirects unauthenticated traffic away from /admin/*.

import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const pathname = request.nextUrl.pathname;
  const isAdmin = pathname.startsWith("/admin");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const adminEnabledInProd = process.env.PUBLIC_ADMIN_ENABLED === "1";
  const inProd = process.env.NODE_ENV === "production";

  // HARD-LOCK /admin in production unless Supabase is wired AND admin is
  // explicitly opted in. Returns 404, not a redirect, so the route doesn't
  // even reveal it exists. Dev mode remains open for local work.
  if (isAdmin && inProd && (!supabaseUrl || !supabaseKey) && !adminEnabledInProd) {
    return new NextResponse(null, { status: 404 });
  }

  // Supabase env vars aren't required for the public storefront to render.
  // In dev without them, skip the auth refresh and let route handlers
  // handle their own gating. This keeps `npm run dev` clean for designers.
  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

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

  // getClaims() validates the JWT signature locally against the project's
  // published JWKS. Fast (no network), trustworthy. Never use getSession()
  // in server code — its content is unsigned cookie data.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  // Admin is the only gated area on this site. Public storefront, shop,
  // builders-corner, four-squared, /auth/*, /api/*, and Next.js internals
  // stay open. API routes self-gate via getClaims() in their handlers
  // when they need to.
  if (isAdmin && !claims) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // CDN/edge must not cache authed responses (would leak Set-Cookie).
  if (claims) {
    response.headers.set("Cache-Control", "private, no-store");
  }
  return response;
}

export const config = {
  matcher: [
    // Skip static, images, favicon. Run on everything else.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

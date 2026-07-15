// OAuth callback: Supabase redirects here with `?code=...` after the user
// completes Google sign-in. We exchange the code for a session, then
// redirect to whatever `?next=` was passed (default /admin).

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Sanitize the post-login `next` target so a crafted login link can't
 * redirect a signed-in staffer off-site (open redirect). Only a
 * same-origin absolute PATH is allowed: it must start with a single "/"
 * and not "//" or "/\" (which browsers resolve as protocol-relative
 * off-origin URLs). Anything else falls back to /admin.
 */
function safeNext(raw: string | null): string {
  if (!raw) return "/admin";
  if (!raw.startsWith("/")) return "/admin";
  if (raw.startsWith("//") || raw.startsWith("/\\")) return "/admin";
  return raw;
}

/**
 * Where to send the browser when the exchange fails. Staff flows land on
 * /login with the error surfaced as a toast. (Customer /account auth is
 * archived under `_archive/commerce-deferred-*` until digital checkout returns.)
 */
function errorDestination(_next: string, origin: string, message: string): URL {
  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set("error", message);
  return loginUrl;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));
  const errorParam = url.searchParams.get("error_description");

  if (errorParam) {
    return NextResponse.redirect(errorDestination(next, url.origin, errorParam));
  }

  if (!code) {
    return NextResponse.redirect(errorDestination(next, url.origin, "Sign-in link was incomplete."));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(errorDestination(next, url.origin, error.message));
  }

  return NextResponse.redirect(new URL(next, url.origin));
}

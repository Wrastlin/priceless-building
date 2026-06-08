// OAuth callback: Supabase redirects here with `?code=...` after the user
// completes Google sign-in. We exchange the code for a session, then
// redirect to whatever `?next=` was passed (default /admin).

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/admin";
  const errorParam = url.searchParams.get("error_description");

  if (errorParam) {
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("error", errorParam);
    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("error", error.message);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}

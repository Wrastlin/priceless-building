"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Server Action: sign the current user out and redirect to /login.
 *
 * Server-side sign-out is preferred over client-side because it can clear
 * the cookie atomically with the redirect, and because revocation hits the
 * Supabase Auth server (vs the client-only local clear).
 */
export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login" as never);
}

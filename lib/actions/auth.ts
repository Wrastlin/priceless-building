"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Server Action: sign the current user out of Supabase and bounce to
 * the login page. Clearing on the server (vs client) atomically clears
 * the cookie with the redirect and revokes the session upstream.
 */
export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login" as never);
}

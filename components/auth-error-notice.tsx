"use client";

import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Supabase redirects OAuth failures to the Site URL (our home page) with
 * ?error_code=...&error_description=... in the query string. Without this,
 * the visitor just lands on the homepage with a cryptic URL and no idea
 * what happened. This reads those params, shows a clear toast, and strips
 * them from the URL so a refresh or shared link doesn't re-trigger.
 */
export function AuthErrorNotice() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("error_code");
    const desc = params.get("error_description"); // URLSearchParams decodes "+" to space
    if (!code && !desc && !params.get("error")) return;

    const message =
      code === "bad_oauth_state"
        ? "Your sign-in didn't complete in time. Please try signing in again."
        : desc || "Sign-in didn't complete. Please try again.";
    toast.error("Sign-in didn't finish", { description: message, duration: 9000 });

    params.delete("error");
    params.delete("error_code");
    params.delete("error_description");
    const qs = params.toString();
    window.history.replaceState(
      null,
      "",
      window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash,
    );
  }, []);

  return null;
}

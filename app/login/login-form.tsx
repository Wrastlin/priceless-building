"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

/**
 * Google OAuth sign-in form for staff. After Google redirects back to
 * /auth/callback, the route handler exchanges the code for a session and
 * forwards the user to `?next=` (defaulting to /admin).
 */
export function LoginForm({ initialError, next }: { initialError?: string; next?: string }) {
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (initialError) toast.error("Sign-in failed", { description: initialError });
  }, [initialError]);

  async function handleGoogle() {
    setPending(true);
    const supabase = createClient();
    const redirectTo = new URL("/auth/callback", window.location.origin);
    if (next) redirectTo.searchParams.set("next", next);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTo.toString() },
    });
    if (error) {
      toast.error("Sign-in failed", { description: error.message });
      setPending(false);
    }
  }

  return (
    <div className="mt-10">
      <button
        type="button"
        onClick={handleGoogle}
        disabled={pending}
        className="flex w-full items-center justify-center gap-3 border border-[var(--border)] bg-white px-5 py-4 text-base font-semibold transition hover:bg-[var(--muted)] disabled:opacity-60"
      >
        {pending ? "Redirecting…" : "Continue with Google"}
      </button>
      <p className="mt-6 text-sm text-[var(--muted-foreground)]">
        Access is restricted to invited Price-Less team members.
      </p>
    </div>
  );
}

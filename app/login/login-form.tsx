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
    <div>
      <button
        type="button"
        onClick={handleGoogle}
        disabled={pending}
        className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-5 py-3.5 text-base font-semibold text-[#1c1c1c] shadow-sm transition hover:bg-white/90 disabled:opacity-60"
      >
        <GoogleGlyph />
        <span>{pending ? "Redirecting…" : "Continue with Google"}</span>
      </button>
      <p className="mt-4 text-center text-xs text-white/55">
        We never see your Google password.
      </p>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.71v2.26h2.9c1.7-1.56 2.69-3.87 2.69-6.61z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.46-.8 5.95-2.18l-2.9-2.26c-.8.54-1.83.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.94v2.33A9 9 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.96 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.17.28-1.71V4.96H.94A9 9 0 0 0 0 9c0 1.45.35 2.83.94 4.04l3.02-2.33z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .94 4.96L3.96 7.3C4.67 5.16 6.66 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

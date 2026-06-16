"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

/**
 * Customer account sign-in / sign-up.
 *
 * Security is handled by the provider (Supabase Auth): password hashing,
 * email verification, and rate limiting all live in Supabase, so we never
 * store or see a raw password. Two paths:
 *   - Continue with Google (OAuth)
 *   - Email + password (sign in or create account)
 *
 * This is the CUSTOMER gate (separate from staff /login). Customers can
 * sign in here without being on the admin allowlist; they just can't reach
 * /admin. Payment details are never collected here — those will be handled
 * by a tokenized payment provider so the store never touches card data.
 */
export function CustomerAuth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  async function handleGoogle() {
    setPending(true);
    const supabase = createClient();
    const redirectTo = new URL("/auth/callback", window.location.origin);
    redirectTo.searchParams.set("next", "/account");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTo.toString() },
    });
    if (error) {
      toast.error("Sign-in failed", { description: error.message });
      setPending(false);
    }
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password too short", { description: "Use at least 8 characters." });
      return;
    }
    setPending(true);
    const supabase = createClient();
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/account` },
      });
      if (error) {
        toast.error("Could not create account", { description: error.message });
        setPending(false);
        return;
      }
      toast.success("Check your email", { description: "Confirm your address to finish setting up your account." });
      setPending(false);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error("Sign-in failed", { description: error.message });
        setPending(false);
        return;
      }
      window.location.href = "/account";
    }
  }

  return (
    <div className="rounded-md border border-[var(--border)] bg-white p-6 shadow-sm">
      <button
        type="button"
        onClick={handleGoogle}
        disabled={pending}
        className="flex w-full items-center justify-center gap-3 rounded-md border border-[var(--border)] bg-white px-5 py-3 text-base font-semibold text-[#1c1c1c] transition hover:bg-[var(--muted)] disabled:opacity-60"
      >
        <GoogleGlyph />
        <span>Continue with Google</span>
      </button>

      <div className="my-5 flex items-center gap-3 text-[var(--muted-foreground)]">
        <span className="h-px flex-1 bg-[var(--border)]" />
        <span className="font-mono text-xs uppercase tracking-[0.14em]">or</span>
        <span className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <form onSubmit={handleEmail} className="space-y-3">
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-white px-3 py-2.5 text-base focus:border-[var(--brand-priceless)] focus:outline-none"
            placeholder="you@email.com"
          />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Password</span>
          <input
            type="password"
            required
            minLength={8}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-white px-3 py-2.5 text-base focus:border-[var(--brand-priceless)] focus:outline-none"
            placeholder="At least 8 characters"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-[var(--brand-priceless)] px-5 py-3 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Working…" : mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-[var(--muted-foreground)]">
        {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
        <button
          type="button"
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          className="font-semibold text-[var(--brand-priceless)] underline underline-offset-2"
        >
          {mode === "signup" ? "Sign in" : "Create an account"}
        </button>
      </p>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.71v2.26h2.9c1.7-1.56 2.69-3.87 2.69-6.61z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.46-.8 5.95-2.18l-2.9-2.26c-.8.54-1.83.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.94v2.33A9 9 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.96 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.17.28-1.71V4.96H.94A9 9 0 0 0 0 9c0 1.45.35 2.83.94 4.04l3.02-2.33z" fill="#FBBC05" />
      <path d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .94 4.96L3.96 7.3C4.67 5.16 6.66 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

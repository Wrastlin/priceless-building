"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Turnstile, turnstileEnabled } from "@/components/turnstile";

/**
 * Customer account sign-in / sign-up / password reset.
 *
 * Security is handled by our managed third-party provider, Supabase Auth:
 * password hashing, email verification, session issuance, and rate limiting
 * all live in Supabase, so Price-Less never stores or sees a raw password.
 * Three modes:
 *   - Continue with Google (OAuth)
 *   - Email + password (sign in or create account)
 *   - Forgot password → emailed reset link
 *
 * When a Cloudflare Turnstile site key is configured the email forms also
 * require a bot-protection challenge whose token Supabase verifies
 * server-side. This is the CUSTOMER gate (separate from staff /login).
 * Payment details are never collected here — those are handled by a
 * tokenized payment provider so the store never touches card data.
 */

const MIN_PASSWORD = 10;

type Mode = "signin" | "signup" | "reset";

export function CustomerAuth() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  // Bumping the key remounts the Turnstile widget so a consumed token is
  // re-issued after an attempt (Supabase invalidates a token once used).
  const [captchaKey, setCaptchaKey] = useState(0);

  function resetCaptcha() {
    setCaptchaToken(null);
    setCaptchaKey((k) => k + 1);
  }

  // When bot protection is on, require a solved challenge before any
  // password call. When it's off this is a no-op so dev/local works.
  function captchaReady() {
    return !turnstileEnabled || !!captchaToken;
  }

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

    if (!captchaReady()) {
      toast.error("One more step", { description: "Please complete the verification below." });
      return;
    }
    const captcha = captchaToken ?? undefined;
    const supabase = createClient();

    if (mode === "reset") {
      setPending(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/account/update-password`,
        captchaToken: captcha,
      });
      resetCaptcha();
      setPending(false);
      if (error) {
        toast.error("Could not send reset email", { description: error.message });
        return;
      }
      // Worded so we never reveal whether an address has an account.
      toast.success("Check your email", {
        description: "If an account exists for that address, a password reset link is on its way.",
      });
      setMode("signin");
      return;
    }

    if (password.length < MIN_PASSWORD) {
      toast.error("Password too short", {
        description: `Use at least ${MIN_PASSWORD} characters. A short phrase you'll remember works well.`,
      });
      return;
    }

    setPending(true);

    if (mode === "signup") {
      if (password !== confirm) {
        setPending(false);
        toast.error("Passwords don't match", { description: "Re-enter the same password in both fields." });
        return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
          captchaToken: captcha,
        },
      });
      resetCaptcha();
      setPending(false);
      if (error) {
        toast.error("Could not create account", { description: error.message });
        return;
      }
      toast.success("Check your email", {
        description: "Confirm your address to finish setting up your account.",
      });
      return;
    }

    // signin
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken: captcha },
    });
    if (error) {
      resetCaptcha();
      setPending(false);
      toast.error("Sign-in failed", { description: error.message });
      return;
    }
    window.location.href = "/account";
  }

  const submitLabel =
    mode === "signup" ? "Create account" : mode === "reset" ? "Send reset link" : "Sign in";

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

        {mode !== "reset" && (
          <label className="block">
            <span className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Password</span>
              {mode === "signin" && (
                <button
                  type="button"
                  onClick={() => setMode("reset")}
                  className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--brand-priceless)] underline underline-offset-2"
                >
                  Forgot password?
                </button>
              )}
            </span>
            <input
              type="password"
              required
              minLength={MIN_PASSWORD}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-white px-3 py-2.5 text-base focus:border-[var(--brand-priceless)] focus:outline-none"
              placeholder={mode === "signup" ? `At least ${MIN_PASSWORD} characters` : "Your password"}
            />
          </label>
        )}

        {mode === "signup" && (
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Confirm password</span>
            <input
              type="password"
              required
              minLength={MIN_PASSWORD}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-white px-3 py-2.5 text-base focus:border-[var(--brand-priceless)] focus:outline-none"
              placeholder="Re-enter your password"
            />
          </label>
        )}

        {mode === "reset" && (
          <p className="text-sm text-[var(--muted-foreground)]">
            Enter your email and we&apos;ll send a link to set a new password.
          </p>
        )}

        {/* Bot-protection challenge — only renders when configured. */}
        <Turnstile key={captchaKey} onToken={setCaptchaToken} />

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-[var(--brand-priceless)] px-5 py-3 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Working…" : submitLabel}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-[var(--muted-foreground)]">
        {mode === "reset" ? (
          <>
            Remembered it?{" "}
            <button
              type="button"
              onClick={() => setMode("signin")}
              className="font-semibold text-[var(--brand-priceless)] underline underline-offset-2"
            >
              Back to sign in
            </button>
          </>
        ) : (
          <>
            {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              className="font-semibold text-[var(--brand-priceless)] underline underline-offset-2"
            >
              {mode === "signup" ? "Sign in" : "Create an account"}
            </button>
          </>
        )}
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

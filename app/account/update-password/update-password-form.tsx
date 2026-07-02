"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const MIN_PASSWORD = 10;

/**
 * Sets a new password using the recovery session established by the reset
 * email link. We confirm a session is present before showing the form so a
 * stale/expired link gets a clear message instead of a confusing failure.
 */
export function UpdatePasswordForm() {
  const [status, setStatus] = useState<"checking" | "ok" | "invalid">("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getSession()
      .then(({ data }) => setStatus(data.session ? "ok" : "invalid"))
      .catch(() => setStatus("invalid"));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < MIN_PASSWORD) {
      toast.error("Password too short", { description: `Use at least ${MIN_PASSWORD} characters.` });
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match", { description: "Re-enter the same password in both fields." });
      return;
    }
    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setPending(false);
    if (error) {
      toast.error("Could not update password", { description: error.message });
      return;
    }
    toast.success("Password updated", { description: "You're all set." });
    window.location.href = "/account";
  }

  if (status === "checking") {
    return <p className="text-sm text-[var(--muted-foreground)]">Checking your reset link…</p>;
  }

  if (status === "invalid") {
    return (
      <div className="rounded-md border border-[var(--border)] bg-white p-6 shadow-sm">
        <p className="text-sm text-[var(--muted-foreground)]">
          This password reset link is invalid or has expired. Head back to the{" "}
          <a href="/account" className="font-semibold text-[var(--brand-priceless)] underline underline-offset-2">
            account sign-in page
          </a>{" "}
          and request a new one.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-md border border-[var(--border)] bg-white p-6 shadow-sm">
      <label className="block">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">New password</span>
        <input
          type="password"
          required
          minLength={MIN_PASSWORD}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-[var(--border)] bg-white px-3 py-2.5 text-base focus:border-[var(--brand-priceless)] focus:outline-none"
          placeholder={`At least ${MIN_PASSWORD} characters`}
        />
      </label>
      <label className="block">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Confirm new password</span>
        <input
          type="password"
          required
          minLength={MIN_PASSWORD}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="mt-1 w-full rounded-md border border-[var(--border)] bg-white px-3 py-2.5 text-base focus:border-[var(--brand-priceless)] focus:outline-none"
          placeholder="Re-enter your new password"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-[var(--brand-priceless)] px-5 py-3 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save new password"}
      </button>
    </form>
  );
}

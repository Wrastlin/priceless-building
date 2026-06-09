"use client";

import { useState } from "react";
import { toast } from "sonner";

export function NewsletterBar() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function sub(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    toast.success("Subscribed. We'll email when fresh inventory lands and when the design walkthrough opens up.");
  }

  if (sent) {
    return (
      <div className="rounded-2xl border bg-[var(--brand-priceless)] p-6 text-white shadow-card md:p-8">
        <div className="font-display text-2xl">You&apos;re on the list.</div>
        <div className="mt-1 text-sm text-white/85">We&apos;ll be in touch when there&apos;s something worth saying.</div>
      </div>
    );
  }

  return (
    <form onSubmit={sub} className="grid items-center gap-4 rounded-2xl border bg-[var(--brand-priceless)] p-6 text-white shadow-card md:grid-cols-[1.5fr_1fr] md:p-8">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-white/85">Stay in the loop</div>
        <div className="font-display mt-1 text-2xl">Get the new inventory list as it lands.</div>
        <div className="mt-1 text-sm text-white/85">
          A short email when fresh doors, windows, or cabinets hit the floor, plus first dibs on the design walkthrough when it launches. No spam.
        </div>
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@gmail.com"
          className="min-w-0 flex-1 rounded-md border border-white/30 bg-white/15 px-3 py-2.5 text-sm text-white placeholder-white/60 outline-none focus:bg-white/25"
        />
        <button className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-priceless)]">Subscribe</button>
      </div>
    </form>
  );
}

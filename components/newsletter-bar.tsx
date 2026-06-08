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
    toast.success("Subscribed · we'll send the inventory drop list every Wednesday morning.");
  }

  if (sent) {
    return (
      <div className="rounded-2xl border bg-[var(--brand-priceless)] p-6 text-white shadow-card md:p-8">
        <div className="font-display text-2xl">You're on the list.</div>
        <div className="mt-1 text-sm text-white/85">Watch your inbox Wednesday morning for the weekly drop.</div>
      </div>
    );
  }

  return (
    <form onSubmit={sub} className="grid items-center gap-4 rounded-2xl border bg-[var(--brand-priceless)] p-6 text-white shadow-card md:grid-cols-[1.5fr_1fr] md:p-8">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-white/70">Wednesday inventory drop</div>
        <div className="font-display mt-1 text-2xl">Get the deals before they hit the floor.</div>
        <div className="mt-1 text-sm text-white/85">
          Every Wednesday we email the freshly tagged inventory (doors, windows, cabinets) so you
          can call ahead and hold what you want. No spam, ever.
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

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

const PRESETS = [25, 50, 100, 250, 500];

export function GiftCardForm() {
  const [amount, setAmount] = useState(100);
  const [custom, setCustom] = useState("");
  const [delivery, setDelivery] = useState<"email" | "mail">("email");

  function buy(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success(`${formatCurrency(amount)} gift card queued. Confirmation email on the way`);
  }

  return (
    <form onSubmit={buy} className="mt-5 space-y-5">
      <div className="grid grid-cols-3 gap-2">
        {PRESETS.map((p) => (
          <button
            type="button"
            key={p}
            onClick={() => { setAmount(p); setCustom(""); }}
            className={
              "rounded-lg border-2 px-3 py-3 text-lg font-bold " +
              (amount === p && !custom ? "border-[var(--brand-priceless)] bg-[var(--brand-priceless)]/5 text-[var(--brand-priceless)]" : "bg-white")
            }
          >
            {formatCurrency(p)}
          </button>
        ))}
        <input
          type="number"
          min={5}
          value={custom}
          onChange={(e) => {
            setCustom(e.target.value);
            const v = Number(e.target.value);
            if (v > 0) setAmount(v);
          }}
          placeholder="Custom"
          className="rounded-lg border-2 px-3 py-3 text-center text-lg"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Your name"><input className="w-full rounded-md border px-3 py-2 text-sm" required /></Field>
        <Field label="Your email"><input type="email" className="w-full rounded-md border px-3 py-2 text-sm" required /></Field>
        <Field label="Recipient name"><input className="w-full rounded-md border px-3 py-2 text-sm" required /></Field>
        <Field label="Recipient email or address">
          <input className="w-full rounded-md border px-3 py-2 text-sm" />
        </Field>
        <Field label="Message" wide>
          <textarea rows={3} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="A note to include with the card" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {(["email", "mail"] as const).map((d) => (
          <label key={d} className={"flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm " + (delivery === d ? "border-[var(--brand-priceless)] bg-[var(--brand-priceless)]/5" : "")}>
            <input type="radio" checked={delivery === d} onChange={() => setDelivery(d)} />
            <span className="font-semibold">{d === "email" ? "Email digital card" : "Mail printed card"}</span>
            <span className="ml-auto text-xs text-[var(--muted-foreground)]">{d === "email" ? "Instant" : "Free in WI"}</span>
          </label>
        ))}
      </div>

      <button className="btn btn-priceless w-full">Buy gift card · {formatCurrency(amount)}</button>
    </form>
  );
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={"block " + (wide ? "md:col-span-2" : "")}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">{label}</span>
      {children}
    </label>
  );
}

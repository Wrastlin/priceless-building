"use client";

import { useState } from "react";
import { Loader2, QrCode, Tag } from "lucide-react";

export function PrintLabels({ sku }: { sku: string }) {
  const [busy, setBusy] = useState<"qr" | "price" | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function print(type: "qr" | "price") {
    setBusy(type);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/intake/print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku, type }),
      });
      const json = await res.json().catch(() => ({}));
      setMsg({
        ok: !!json.ok,
        text: json.message ?? (json.ok ? "Sent to printer" : "Print failed"),
      });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Print failed" });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-3 rounded-[14px] border border-[var(--border)] bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[14px] font-semibold">Labels</h3>
        <span className="text-[11px] text-[var(--muted-foreground)]">QL-800 · CUPS</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[12px] bg-[var(--surface)] p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/admin/intake/label/${encodeURIComponent(sku)}?type=qr`}
            alt="QR label preview"
            className="mx-auto max-h-40 w-auto"
          />
          <button
            type="button"
            className="inv-btn inv-btn-secondary mt-3 w-full"
            disabled={busy !== null}
            onClick={() => print("qr")}
          >
            {busy === "qr" ? <Loader2 size={16} className="animate-spin" /> : <QrCode size={16} />}
            Print QR
          </button>
        </div>
        <div className="rounded-[12px] bg-[var(--surface)] p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/admin/intake/label/${encodeURIComponent(sku)}?type=price`}
            alt="Price tag preview"
            className="mx-auto max-h-40 w-auto"
          />
          <button
            type="button"
            className="inv-btn inv-btn-outline mt-3 w-full"
            disabled={busy !== null}
            onClick={() => print("price")}
          >
            {busy === "price" ? <Loader2 size={16} className="animate-spin" /> : <Tag size={16} />}
            Print price
          </button>
        </div>
      </div>
      {msg ? (
        <p className={`text-[13px] ${msg.ok ? "text-[var(--brand-navy)]" : "text-[var(--sale-red)]"}`}>
          {msg.text}
        </p>
      ) : null}
    </div>
  );
}

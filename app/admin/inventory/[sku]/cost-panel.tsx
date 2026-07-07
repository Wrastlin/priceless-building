"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateItemCostAction } from "@/lib/actions/staging";
import { formatCurrency } from "@/lib/utils";

/**
 * Inline editor for an item's PRIVATE cost + source lot (item_private).
 * Never shown on the storefront. Shows the live cost-based margin as you type.
 */
export function CostPanel({
  sku,
  price,
  initialCost,
  initialSourceLot,
}: {
  sku: string;
  price: number;
  initialCost: number | null;
  initialSourceLot: string | null;
}) {
  const [cost, setCost] = useState(initialCost != null ? String(initialCost) : "");
  const [sourceLot, setSourceLot] = useState(initialSourceLot ?? "");
  const [pending, start] = useTransition();

  const trimmed = cost.trim();
  const costNum = trimmed === "" ? null : Number(trimmed);
  const validCost = costNum === null || Number.isFinite(costNum);
  const m =
    costNum != null && Number.isFinite(costNum) && price > 0
      ? { profit: price - costNum, pct: Math.round(((price - costNum) / price) * 100) }
      : null;

  function save() {
    if (!validCost) {
      toast.error("Enter a valid number for cost.");
      return;
    }
    start(async () => {
      try {
        await updateItemCostAction(sku, { cost: costNum, sourceLot: sourceLot.trim() || null });
        toast.success("Cost saved.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not save cost.");
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="admin-label">Our cost</span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <input
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              inputMode="decimal"
              placeholder="0.00"
              className="admin-input pl-6"
            />
          </div>
        </label>
        <label className="block">
          <span className="admin-label">Source / lot</span>
          <input
            value={sourceLot}
            onChange={(e) => setSourceLot(e.target.value)}
            placeholder="e.g. HD closeout · Mar 2026"
            className="admin-input"
          />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Tag" value={formatCurrency(price)} />
        <Stat label="Profit" value={m ? formatCurrency(m.profit) : "–"} tone={m && m.profit < 0 ? "bad" : undefined} />
        <Stat label="Margin" value={m ? `${m.pct}%` : "–"} tone={m && m.pct < 35 ? "bad" : undefined} />
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={save} disabled={pending || !validCost} className="admin-btn admin-btn-primary">
          {pending ? "Saving…" : "Save cost"}
        </button>
        <span className="admin-help">Internal only — never shown to customers.</span>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "bad" }) {
  return (
    <div className="rounded-lg bg-[oklch(0.975_0.008_85)] p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div
        className={
          "mt-1 font-mono text-lg font-semibold tabular-nums " +
          (tone === "bad" ? "text-[var(--sale-red)]" : "text-foreground")
        }
      >
        {value}
      </div>
    </div>
  );
}

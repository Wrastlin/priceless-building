"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateItemCostAction } from "@/lib/actions/staging";
import { formatCurrency } from "@/lib/utils";

/** Floor minimum margin (settings). Below this = red. */
const FLOOR_MARGIN_PCT = 35;
/** Ideal tag margin vs cost when comps suggest a price. */
const IDEAL_MARGIN_PCT = 45;

/**
 * Private cost + margin math for floor pricing.
 * Shows profit, margin %, and dollars kept above the floor target.
 */
export function CostPanel({
  sku,
  price,
  initialCost,
  initialSourceLot,
  compareAt,
}: {
  sku: string;
  price: number;
  initialCost: number | null;
  initialSourceLot: string | null;
  compareAt?: number | null;
}) {
  const [cost, setCost] = useState(initialCost != null ? String(initialCost) : "");
  const [sourceLot, setSourceLot] = useState(initialSourceLot ?? "");
  const [pending, start] = useTransition();

  const trimmed = cost.trim();
  const costNum = trimmed === "" ? null : Number(trimmed);
  const validCost = costNum === null || Number.isFinite(costNum);

  const m =
    costNum != null && Number.isFinite(costNum) && price > 0
      ? {
          profit: price - costNum,
          pct: Math.round(((price - costNum) / price) * 100),
          floorTarget: costNum / (1 - FLOOR_MARGIN_PCT / 100),
          idealTag: costNum / (1 - IDEAL_MARGIN_PCT / 100),
        }
      : null;

  const keptAboveFloor =
    m != null ? price - m.floorTarget : null;

  const suggestedFromComp =
    compareAt != null && compareAt > 0 ? Math.round(compareAt * 0.45) : null;

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
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Tag" value={formatCurrency(price)} />
        <Stat
          label="Profit"
          value={m ? formatCurrency(m.profit) : "–"}
          tone={m && m.profit < 0 ? "bad" : undefined}
        />
        <Stat
          label="Margin"
          value={m ? `${m.pct}%` : "–"}
          tone={m && m.pct < FLOOR_MARGIN_PCT ? "bad" : undefined}
          hint={`Floor ${FLOOR_MARGIN_PCT}%`}
        />
        <Stat
          label={`Kept ≥${FLOOR_MARGIN_PCT}%`}
          value={
            keptAboveFloor != null
              ? formatCurrency(keptAboveFloor)
              : "–"
          }
          tone={keptAboveFloor != null && keptAboveFloor < 0 ? "bad" : "good"}
          hint="Over floor target"
        />
      </div>

      {m || suggestedFromComp != null ? (
        <div className="rounded-[12px] bg-[oklch(0.975_0.008_85)] px-3 py-2.5 text-[13px] text-[var(--muted-foreground)]">
          {m ? (
            <p>
              Ideal tag at {IDEAL_MARGIN_PCT}% margin:{" "}
              <span className="font-mono font-semibold text-[var(--foreground)]">
                {formatCurrency(Math.round(m.idealTag))}
              </span>
              {" · "}
              Floor tag at {FLOOR_MARGIN_PCT}%:{" "}
              <span className="font-mono font-semibold text-[var(--foreground)]">
                {formatCurrency(Math.round(m.floorTarget))}
              </span>
            </p>
          ) : null}
          {suggestedFromComp != null ? (
            <p className={m ? "mt-1" : undefined}>
              From retail compare ({formatCurrency(compareAt!)} × 45%):{" "}
              <span className="font-mono font-semibold text-[var(--foreground)]">
                {formatCurrency(suggestedFromComp)}
              </span>
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={pending || !validCost}
          className="admin-btn admin-btn-primary"
        >
          {pending ? "Saving…" : "Save cost"}
        </button>
        <span className="admin-help">Internal only — never shown to customers.</span>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
  hint,
}: {
  label: string;
  value: string;
  tone?: "bad" | "good";
  hint?: string;
}) {
  return (
    <div className="rounded-lg bg-[oklch(0.975_0.008_85)] p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div
        className={
          "mt-1 font-mono text-lg font-semibold tabular-nums " +
          (tone === "bad"
            ? "text-[var(--sale-red)]"
            : tone === "good"
              ? "text-[var(--brand-navy)]"
              : "text-foreground")
        }
      >
        {value}
      </div>
      {hint ? <div className="mt-0.5 text-[10px] text-muted-foreground">{hint}</div> : null}
    </div>
  );
}

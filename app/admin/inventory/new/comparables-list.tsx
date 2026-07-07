"use client";

import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import type { Comparable } from "./types";

/**
 * Read-only list of live retail comparables surfaced by Analyze, with the
 * retail average as the final row. Empty state nudges the user to run
 * Analyze (or shows a searching state while it runs).
 */
export function ComparablesList({
  comparables,
  retailAvg,
  analyzing,
}: {
  comparables: Comparable[];
  retailAvg: number;
  analyzing: boolean;
}) {
  if (comparables.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-border bg-[oklch(0.975_0.008_85)] p-4 text-center text-sm text-muted-foreground">
        {analyzing ? "Searching retailers…" : "Run Analyze to fetch live retail prices."}
      </div>
    );
  }
  return (
    <ul className="divide-y divide-border border-y border-border">
      {comparables.map((c, i) => (
        <li key={i} className="grid grid-cols-[48px_1fr_auto] items-center gap-3 py-2.5">
          <div className="relative aspect-square overflow-hidden rounded bg-[oklch(0.968_0.008_85)]">
            {c.image ? (
              <Image src={c.image} alt={c.source} fill className="object-cover" sizes="48px" unoptimized />
            ) : null}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-[var(--brand-navy)]">{c.source}</div>
            <div className="truncate text-sm">{c.title}</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-sm font-semibold tabular-nums">{formatCurrency(c.price)}</div>
            <a
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[var(--brand-navy)] underline decoration-[var(--brand-navy)]/30 underline-offset-2 hover:decoration-[var(--brand-navy)]"
            >
              view listing →
            </a>
          </div>
        </li>
      ))}
      <li className="flex items-center justify-between py-2.5">
        <span className="text-sm font-medium text-muted-foreground">Retail average</span>
        <span className="font-mono text-sm font-semibold tabular-nums">{formatCurrency(retailAvg)}</span>
      </li>
    </ul>
  );
}

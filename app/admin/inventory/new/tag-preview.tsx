"use client";

import { formatCurrency } from "@/lib/utils";

/**
 * Read-only live mock of the 4x3" thermal floor tag. Updates as the staffer
 * edits the listing; the barcode lands once a SKU is generated on Save.
 */
export function TagPreview({
  title,
  subtitle,
  price,
  retailAvg,
  dimensions,
  location,
}: {
  title: string;
  subtitle: string;
  price: number;
  retailAvg: number;
  dimensions: string;
  location: string;
}) {
  return (
    <div className="mx-auto max-w-[320px] rounded border-2 border-[var(--brand-priceless)] bg-white p-4 shadow-sm">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        Price-Less · {location || "Aisle TBD"}
      </div>
      <div className="mt-2 text-base font-semibold leading-snug text-foreground">
        {title.trim() || "Item title"}
      </div>
      {subtitle ? <div className="mt-0.5 text-xs text-muted-foreground">{subtitle}</div> : null}
      <div className="my-3 border-t border-dashed border-border" />
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display text-3xl tabular-nums text-[var(--brand-priceless)]">
          {price > 0 ? formatCurrency(price) : "$ —"}
        </span>
        {retailAvg > 0 && price > 0 && retailAvg > price ? (
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Retail</div>
            <div className="font-mono text-sm tabular-nums text-muted-foreground line-through">
              {formatCurrency(retailAvg)}
            </div>
            <div className="text-[10px] font-semibold text-emerald-700">
              save {formatCurrency(retailAvg - price)}
            </div>
          </div>
        ) : null}
      </div>
      {dimensions ? <div className="mt-2 text-xs text-muted-foreground">{dimensions}</div> : null}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-dashed border-border pt-2 text-[10px] text-muted-foreground">
        <span className="font-mono">SKU: generated on save</span>
        <span className="font-mono">▮▮▮ ▮ ▮▮ ▮ ▮▮▮ ▮</span>
      </div>
    </div>
  );
}

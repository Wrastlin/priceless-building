import type { VelocitySummary } from "@/lib/items/velocity";

/**
 * Sold-velocity summary for the dashboard. Real data only — when nothing has
 * been marked sold yet, the tiles read 0/– and the chart explains why.
 */
export function VelocityPanel({ v }: { v: VelocitySummary }) {
  const max = Math.max(1, ...v.weekly);
  return (
    <section className="admin-card p-5">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <h2 className="text-base font-semibold text-foreground">Sold velocity</h2>
        <span className="text-xs text-muted-foreground tabular-nums">
          {v.totalSold} sold all-time · {v.onFloor} on floor
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Sold this week" value={String(v.soldThisWeek)} />
        <Tile label="Sold this month" value={String(v.soldThisMonth)} />
        <Tile label="Avg days to sell" value={v.avgDaysToSell != null ? `${v.avgDaysToSell}d` : "–"} />
        <Tile label="Sell-through" value={v.sellThroughPct != null ? `${v.sellThroughPct}%` : "–"} />
      </div>

      <div className="mt-5">
        <div className="mb-2 text-xs text-muted-foreground">Units sold · last 8 weeks</div>
        {v.totalSold === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing sold yet. Mark items sold from their page and this fills in.
          </p>
        ) : (
          <div className="flex h-24 items-end gap-1.5">
            {v.weekly.map((n, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1" title={`${n} sold`}>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t bg-[var(--brand-navy)]"
                    style={{ height: `${(n / max) * 100}%`, minHeight: n > 0 ? 4 : 0 }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {i === v.weekly.length - 1 ? "now" : n || ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[oklch(0.975_0.008_85)] p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-foreground">{value}</div>
    </div>
  );
}

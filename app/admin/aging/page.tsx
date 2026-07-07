import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { listCatalog } from "@/lib/catalog";
import { ItemThumb } from "@/components/item-thumb";
import { formatCurrency } from "@/lib/utils";
import { daysOnFloor, ageBand, AGE_BAND_LABEL, MARKDOWN_AFTER_DAYS, type AgeBand } from "@/lib/items/aging";

export const dynamic = "force-dynamic";
export const metadata = { title: "Aging" };

const BAND_PILL: Record<AgeBand, string> = {
  fresh: "bg-emerald-100 text-emerald-800",
  aging: "bg-amber-100 text-amber-800",
  stale: "bg-orange-100 text-orange-800",
  old: "bg-red-100 text-red-800",
};

export default async function AgingPage() {
  const items = await listCatalog();
  const now = Date.now();
  const rows = items
    .map((it) => ({ it, days: daysOnFloor(it.createdAt, now) }))
    .sort((a, b) => (b.days ?? -1) - (a.days ?? -1));

  const counts: Record<AgeBand, number> = { fresh: 0, aging: 0, stale: 0, old: 0 };
  for (const r of rows) counts[ageBand(r.days)]++;
  const candidates = rows.filter((r) => r.days != null && r.days > MARKDOWN_AFTER_DAYS).length;

  return (
    <AdminShell active="aging" title="Aging">
      <p className="admin-help mb-5">
        How long each item has been on the floor. Anything past{" "}
        <strong className="text-foreground">{MARKDOWN_AFTER_DAYS} days</strong> is a markdown candidate.
        Oldest first.
      </p>

      {/* Band summary */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {(Object.keys(counts) as AgeBand[]).map((b) => (
          <div key={b} className="admin-card p-3">
            <div className="text-xs text-muted-foreground">{AGE_BAND_LABEL[b]}</div>
            <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-foreground">{counts[b]}</div>
          </div>
        ))}
        <div className="admin-card border-[var(--sale-red)]/30 p-3">
          <div className="text-xs text-[var(--sale-red)]">Markdown candidates</div>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[var(--sale-red)]">{candidates}</div>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing on the floor yet.</p>
      ) : (
        <div className="admin-card overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item</th>
                <th className="hidden sm:table-cell">Category</th>
                <th className="hidden md:table-cell">Location</th>
                <th className="text-right">Tag</th>
                <th className="text-right">Days on floor</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ it, days }) => {
                const band = ageBand(days);
                return (
                  <tr key={it.sku}>
                    <td>
                      <Link href={`/admin/inventory/${it.sku}`} className="flex items-center gap-3">
                        <ItemThumb item={it} className="h-10 w-14 shrink-0 rounded" iconClass="h-5 w-5" />
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-foreground">{it.title}</span>
                          <span className="block font-mono text-xs text-muted-foreground">{it.sku}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="hidden capitalize text-muted-foreground sm:table-cell">{it.category}</td>
                    <td className="hidden text-muted-foreground md:table-cell">{it.location ?? "–"}</td>
                    <td className="text-right font-mono tabular-nums">{formatCurrency(it.price)}</td>
                    <td className="text-right">
                      <span className={`admin-pill ${BAND_PILL[band]}`}>
                        {days == null ? "–" : `${days}d`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}

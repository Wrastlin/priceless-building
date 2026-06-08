import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { CATALOG } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboard() {
  const totalItems = CATALOG.length;
  const inStock = CATALOG.reduce((sum, c) => sum + c.inStock, 0);
  const tagValue = CATALOG.reduce((sum, c) => sum + c.price * Math.max(c.inStock, 1), 0);
  const retailValue = CATALOG.reduce((sum, c) => sum + (c.msrp ?? c.price * 2) * Math.max(c.inStock, 1), 0);
  const margin = Math.round((1 - tagValue / retailValue) * 100);

  return (
    <AdminShell
      active="dashboard"
      title="Dashboard"
      actions={<Link href="/admin/inventory/new" className="admin-btn admin-btn-primary">+ Add item</Link>}
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="SKUs on file" value={totalItems.toString()} delta="+12 this week" />
        <Stat label="Units on floor" value={inStock.toString()} delta="−4 since open" />
        <Stat label="Tagged value" value={formatCurrency(tagValue)} delta={`Avg ${formatCurrency(tagValue / Math.max(inStock, 1))} / unit`} />
        <Stat label="Margin vs. retail" value={`${margin}%`} delta="Healthier than last week" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="admin-card overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="text-base font-semibold text-foreground">Recent activity</h2>
            <Link href="/admin/inventory" className="text-sm text-[var(--brand-priceless)] hover:underline">View all</Link>
          </div>
          <ul className="divide-y divide-border text-sm">
            {[
              { t: "Tag printed", who: "Brian", obj: "PL-000401 · 48\" Vanity", time: "12 min ago" },
              { t: "Item added", who: "Floor staff", obj: "PL-000601 · 3-Light Vanity Bar", time: "1h ago" },
              { t: "Comparable refresh", who: "System", obj: "PL-000101 · drop $8 (HD $179 → $171)", time: "1h ago" },
              { t: "Sale", who: "POS", obj: "PL-000301 · −2 units · $189 ea", time: "2h ago" },
              { t: "Channel push", who: "System", obj: "PL-000104 listed to Facebook Marketplace", time: "3h ago" },
              { t: "Item added", who: "Josh", obj: "BC-000801 · Custom White Oak Run", time: "yesterday" },
            ].map((r, i) => (
              <li key={i} className="flex items-center justify-between gap-3 px-5 py-2.5">
                <div className="min-w-0">
                  <div className="font-medium text-foreground">{r.t}</div>
                  <div className="text-xs text-muted-foreground">{r.obj}</div>
                </div>
                <div className="shrink-0 text-right text-xs text-muted-foreground">
                  <div>{r.who}</div>
                  <div>{r.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="admin-card overflow-hidden">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-base font-semibold text-foreground">Re-tag queue</h2>
              <p className="mt-0.5 admin-help">SKUs where the comparable search ran more than 7 days ago.</p>
            </div>
            <ul className="divide-y divide-border text-sm">
              {CATALOG.slice(0, 4).map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-2 px-5 py-2.5">
                  <span className="truncate">
                    <span className="font-mono text-xs text-muted-foreground">{c.sku}</span> · {c.title}
                  </span>
                  <Link href={`/admin/inventory/${c.sku}`} className="admin-btn admin-btn-outline px-2.5 py-1 text-xs">Re-tag</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="admin-card overflow-hidden">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-base font-semibold text-foreground">Channel health</h2>
            </div>
            <ul className="divide-y divide-border text-sm">
              <li className="flex items-center justify-between px-5 py-2"><span>Facebook Marketplace</span><span className="text-emerald-700">Connected</span></li>
              <li className="flex items-center justify-between px-5 py-2"><span>eBay</span><span className="text-emerald-700">Connected</span></li>
              <li className="flex items-center justify-between px-5 py-2"><span>Shopify</span><span className="text-emerald-700">Connected</span></li>
              <li className="flex items-center justify-between px-5 py-2"><span>Google Local</span><span className="text-amber-700">Reauth needed</span></li>
            </ul>
            <div className="border-t border-border px-5 py-3">
              <Link href="/admin/sales-channels" className="text-sm text-[var(--brand-priceless)] hover:underline">Manage channels</Link>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="admin-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1.5 text-2xl font-semibold tabular-nums text-foreground">{value}</div>
      {delta ? <div className="mt-1 text-xs text-muted-foreground">{delta}</div> : null}
    </div>
  );
}

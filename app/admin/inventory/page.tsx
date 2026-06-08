import Link from "next/link";
import Image from "next/image";
import { AdminShell } from "@/components/admin-shell";
import { CATALOG } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";

export default function InventoryList() {
  return (
    <AdminShell
      active="inventory"
      title={`Inventory (${CATALOG.length})`}
      actions={
        <>
          <Link href="/admin/tags" className="admin-btn admin-btn-outline">Print tags</Link>
          <Link href="/admin/inventory/new" className="admin-btn admin-btn-primary">+ Add item</Link>
        </>
      }
    >
      <div className="admin-card mb-4 flex flex-wrap items-center gap-2 p-3">
        <input
          type="search"
          placeholder="Search SKU, title, location…"
          className="admin-input flex-1 min-w-[220px]"
        />
        <select className="admin-input w-auto">
          <option>All categories</option>
          <option>Doors</option>
          <option>Windows</option>
          <option>Cabinets</option>
          <option>Vanities</option>
        </select>
        <select className="admin-input w-auto">
          <option>All brands</option>
          <option>Price-Less</option>
          <option>Builders Corner</option>
        </select>
        <button className="admin-btn admin-btn-outline">Filter</button>
      </div>

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>SKU</th>
              <th>Location</th>
              <th className="text-right">Cost</th>
              <th className="text-right">Tag</th>
              <th className="text-right">MSRP</th>
              <th className="text-right">Margin</th>
              <th className="text-right">Days</th>
              <th className="text-right">Qty</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {CATALOG.map((c, i) => {
              const cost = Math.round(c.price * (0.42 + (i % 5) * 0.04));
              const margin = c.price > 0 ? Math.round((1 - cost / c.price) * 100) : 0;
              const days = (i * 7 + 3) % 65;
              return (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-[#f4f4f3]">
                        <Image src={c.image} alt={c.title} fill className="object-cover" sizes="56px" quality={50} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-foreground">{c.title}</div>
                        <div className="text-xs text-muted-foreground">{c.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-xs text-muted-foreground">{c.sku}</td>
                  <td className="text-xs text-muted-foreground">{c.location}</td>
                  <td className="text-right font-mono text-xs tabular-nums text-muted-foreground">{formatCurrency(cost)}</td>
                  <td className="text-right font-mono font-semibold tabular-nums">{formatCurrency(c.price)}</td>
                  <td className="text-right font-mono text-xs tabular-nums text-muted-foreground">{c.msrp ? formatCurrency(c.msrp) : "—"}</td>
                  <td className="text-right">
                    <span className={"admin-pill " + (margin >= 50 ? "bg-emerald-50 text-emerald-700" : margin >= 35 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700")}>
                      {margin}%
                    </span>
                  </td>
                  <td className="text-right">
                    <span className={"text-xs tabular-nums " + (days > 45 ? "font-semibold text-rose-700" : days > 21 ? "text-amber-700" : "text-muted-foreground")}>
                      {days}d
                    </span>
                  </td>
                  <td className="text-right tabular-nums">{c.inStock}</td>
                  <td className="text-right">
                    <Link href={`/admin/inventory/${c.sku}`} className="text-sm text-[var(--brand-priceless)] hover:underline">Edit</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

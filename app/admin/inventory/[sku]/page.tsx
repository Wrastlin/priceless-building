import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { findBySku } from "@/lib/items/store";
import { formatCurrency } from "@/lib/utils";
import { ItemGallery } from "./item-gallery";

export default async function EditItem({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const item = await findBySku(sku);
  if (!item) notFound();

  return (
    <AdminShell
      active="inventory"
      title={item.title}
      crumbs={[
        { label: "Inventory", href: "/admin/inventory" },
        { label: item.sku },
      ]}
      actions={
        <>
          <Link href={`/admin/marketing?sku=${item.sku}`} className="admin-btn admin-btn-outline">Generate post</Link>
          <Link href={`/admin/tags?sku=${item.sku}`} className="admin-btn admin-btn-outline">Print tag</Link>
          <Link href={`/shop/item/${item.sku}`} className="admin-btn admin-btn-outline">Storefront</Link>
        </>
      }
    >
      <div className="mb-4 text-sm text-muted-foreground">
        <span className="font-mono">{item.sku}</span> · {item.category} · {item.location} · {item.inStock} on floor
        {item.subtitle ? <span> · {item.subtitle}</span> : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <ItemGallery
          sku={item.sku}
          cover={item.image}
          gallery={item.gallery ?? []}
          alt={item.title}
        />

        <div className="space-y-4">
          <Panel title="Pricing">
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Tag" value={formatCurrency(item.price)} />
              <Stat label="MSRP" value={item.msrp ? formatCurrency(item.msrp) : "–"} />
              <Stat label="Margin" value={item.msrp ? `${Math.round((1 - item.price / item.msrp) * 100)}%` : "–"} />
            </div>
            <button className="admin-btn admin-btn-outline mt-4">Re-run live comparable search</button>
          </Panel>

          <Panel title={item.comparables && item.comparables.length > 0 ? `Live retail comparables (${item.comparables.length})` : "Live retail comparables"}>
            {item.comparables && item.comparables.length > 0 ? (
              <ul className="divide-y divide-border text-sm">
                {item.comparables.map((c, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-[var(--brand-priceless)]">{c.source}</div>
                      <div className="truncate text-sm text-muted-foreground">{c.title}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-semibold tabular-nums">{formatCurrency(c.price)}</div>
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[var(--brand-priceless)] underline decoration-[var(--brand-priceless)]/30 underline-offset-2 hover:decoration-[var(--brand-priceless)]"
                      >
                        view →
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded border border-dashed border-border bg-[#fafaf9] px-3 py-4 text-xs text-muted-foreground">
                No saved comparables. Re-run analyze on this item from the Add Item flow to capture live retail prices.
              </div>
            )}
          </Panel>

          <Panel title="History">
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>
                Status: <span className="text-foreground">{item.status}</span>
              </li>
              {item.createdAt ? (
                <li>
                  Created: <span className="text-foreground">{new Date(item.createdAt).toLocaleString()}</span>
                </li>
              ) : null}
              {item.createdBy ? (
                <li>
                  Created by: <span className="text-foreground">{item.createdBy}</span>
                </li>
              ) : null}
              <li>
                Currently on floor: <span className="text-foreground">{item.inStock}</span>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </AdminShell>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="admin-card p-5">
      <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[#fafaf9] p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-lg font-semibold tabular-nums text-foreground">{value}</div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { findItem } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";

export default async function EditItem({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const item = findItem(sku);
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
        <div>
          <div className="admin-card overflow-hidden">
            <div className="relative aspect-square bg-[#f4f4f3]">
              <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(min-width:1024px) 30vw, 100vw" quality={80} />
            </div>
            <div className="grid grid-cols-4 gap-px border-t border-border bg-border">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="relative aspect-square overflow-hidden bg-[#f4f4f3] opacity-80">
                  <Image src={item.image} alt={`angle ${i + 1}`} fill className="object-cover" sizes="20vw" quality={50} />
                </div>
              ))}
            </div>
          </div>
          <button className="admin-btn admin-btn-outline mt-3 w-full">+ Add photo</button>
        </div>

        <div className="space-y-4">
          <Panel title="Pricing">
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Tag" value={formatCurrency(item.price)} />
              <Stat label="MSRP" value={item.msrp ? formatCurrency(item.msrp) : "—"} />
              <Stat label="Margin" value={item.msrp ? `${Math.round((1 - item.price / item.msrp) * 100)}%` : "—"} />
            </div>
            <button className="admin-btn admin-btn-outline mt-4">Re-run live comparable search</button>
          </Panel>

          <Panel title="Comparables (refreshed 1h ago)">
            <ul className="divide-y divide-border text-sm">
              {[
                { source: "Home Depot", title: `${item.title} (similar SKU)`, price: Math.round((item.msrp ?? item.price * 2) * 0.95) },
                { source: "Menards", title: item.title, price: Math.round((item.msrp ?? item.price * 2) * 0.92) },
                { source: "Lowe's", title: item.title, price: Math.round((item.msrp ?? item.price * 2) * 0.88) },
                { source: "Amazon", title: item.title, price: Math.round((item.msrp ?? item.price * 2) * 1.05) },
              ].map((c, i) => (
                <li key={i} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-[var(--brand-priceless)]">{c.source}</div>
                    <div className="truncate text-sm text-muted-foreground">{c.title}</div>
                  </div>
                  <span className="font-mono font-semibold tabular-nums">{formatCurrency(c.price)}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Channel listings">
            <ul className="divide-y divide-border text-sm">
              <li className="flex items-center justify-between py-2"><span>Storefront (priceless.com)</span><span className="text-emerald-700">Live</span></li>
              <li className="flex items-center justify-between py-2"><span>Facebook Marketplace</span><span className="text-emerald-700">Live · 18 views today</span></li>
              <li className="flex items-center justify-between py-2"><span>eBay</span><span className="text-muted-foreground">Not listed</span></li>
              <li className="flex items-center justify-between py-2"><span>Shopify shipped storefront</span><span className="text-emerald-700">Live</span></li>
            </ul>
          </Panel>

          <Panel title="History">
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>Listed at {formatCurrency(item.price)} on 2026-05-30</li>
              <li>Photographed by Brian on 2026-05-30</li>
              <li>Acquired from cancelled contractor order #4421</li>
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

import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { byBrand } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";

const HERO = "/real-photos/building-exterior.webp";

const RETAILERS = [
  { name: "Home Depot", mult: 1.0 },
  { name: "Menards", mult: 0.92 },
  { name: "Lowe's", mult: 0.88 },
  { name: "Amazon", mult: 1.05 },
];

export default async function ComparePage() {
  const items = (await byBrand("priceless"))
    .filter((i) => i.msrp && i.msrp > i.price)
    .slice(0, 8);

  return (
    <>
      <SiteHeader brand="priceless" />

      {/* HERO */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0">
          <Image src={HERO} alt="Warehouse aisle showing pricing" fill priority className="object-cover" quality={75} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 text-white md:py-36">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs uppercase tracking-wider backdrop-blur">
            Price comparison
          </div>
          <h1 className="font-display mt-5 max-w-3xl text-5xl leading-[1.05] md:text-7xl">
            SAME ITEM. HALF THE PRICE. LOOK FOR YOURSELF.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/85 md:text-lg">
            We check Home Depot, Menards, Lowe&apos;s and Amazon prices every Tuesday. Same SKUs, same
            manufacturers. Here&apos;s what those identical items cost across town, alongside our tag.
          </p>
        </div>
      </section>

      {/* HEADLINE STATS */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
          <Stat label="Avg. savings vs Home Depot" value="54%" />
          <Stat label="SKUs we benchmark weekly" value="3,200+" />
          <Stat label="Big-box stores checked" value="4" />
          <Stat label="Years of receipts to prove it" value="25" />
        </div>
      </section>

      {/* CARDS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {items.map((it) => {
            const msrp = it.msrp ?? it.price;
            const savings = msrp - it.price;
            const pct = Math.round((1 - it.price / msrp) * 100);
            return (
              <div key={it.id} className="overflow-hidden rounded-2xl border bg-white shadow-card">
                <div className="grid md:grid-cols-[260px_1fr]">
                  {/* photo */}
                  <div className="relative aspect-[4/3] md:aspect-auto md:h-full">
                    <Image src={it.image} alt={it.title} fill className="object-cover" sizes="260px" quality={75} />
                  </div>

                  {/* body */}
                  <div className="flex flex-col p-6">
                    <div className="text-xs font-mono uppercase tracking-wider text-[var(--muted-foreground)]">
                      SKU {it.sku}
                    </div>
                    <h3 className="font-display mt-1 text-xl leading-tight">{it.title}</h3>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">{it.subtitle}</p>

                    {/* retailer rows */}
                    <div className="mt-4 text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
                      What you&apos;d pay at
                    </div>
                    <ul className="mt-2 divide-y rounded-lg border">
                      {RETAILERS.map((r) => (
                        <li
                          key={r.name}
                          className="flex items-center justify-between px-3 py-2 text-sm"
                        >
                          <span className="text-[var(--muted-foreground)]">{r.name}</span>
                          <span className="font-mono">{formatCurrency(Math.round(msrp * r.mult))}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Price-Less hero row */}
                    <div className="mt-4 flex items-end justify-between rounded-lg bg-[var(--brand-priceless)] p-4 text-white">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-white/80">
                          Price-Less tag
                        </div>
                        <div className="font-display text-4xl">{formatCurrency(it.price)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold uppercase tracking-wider text-white/80">
                          You save
                        </div>
                        <div className="font-display text-2xl">{formatCurrency(savings)}</div>
                        <div className="text-xs text-white/80">{pct}% off retail</div>
                      </div>
                    </div>

                    <Link
                      href={`/shop/item/${it.sku}`}
                      className="btn btn-outline mt-4 w-full justify-center"
                    >
                      See this one in the warehouse →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="border-y bg-[var(--muted)] py-10">
        <div className="mx-auto max-w-3xl px-6 text-center text-xs text-[var(--muted-foreground)]">
          Prices shown for Home Depot, Menards, Lowe&apos;s and Amazon are based on retail listings checked
          the Tuesday before each Wednesday inventory drop. We&apos;re not affiliated with any of those
          retailers. We just price against them so you don&apos;t have to.
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-6 rounded-2xl bg-[var(--brand-priceless-dark)] p-10 text-white md:grid-cols-[2fr_1fr]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-white/85">
              The smart move
            </div>
            <h2 className="font-display mt-2 text-3xl md:text-4xl">See it in person before you buy.</h2>
            <p className="mt-3 max-w-xl text-white/85">
              Photos are great. A tape measure is better. Roll up to 825 Washington. We&apos;ll walk you
              right to the bin.
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            <Link href="/shop" className="btn bg-white text-[var(--brand-priceless)]">
              Shop the warehouse
            </Link>
            <Link href="/contact" className="btn btn-outline border-white/50 bg-transparent text-white">
              Visit the store
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-3xl text-[var(--brand-priceless)]">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-[var(--muted-foreground)]">{label}</div>
    </div>
  );
}

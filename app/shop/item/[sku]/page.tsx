import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CATALOG, findItem, byCategory } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";
import { ADDRESS } from "@/lib/brands";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductGallery } from "@/components/product-gallery";

export async function generateStaticParams() {
  return CATALOG.map((c) => ({ sku: c.sku }));
}

export default async function ItemPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const item = findItem(sku);
  if (!item) notFound();
  const similar = byCategory(item.brand, item.category).filter((c) => c.sku !== item.sku).slice(0, 4);
  const savings = item.msrp && item.msrp > item.price ? Math.round((1 - item.price / item.msrp) * 100) : 0;
  const hero = item.staged || item.image;
  const ff = item.fulfillment ?? { pickup: true, localDelivery: true, ships: false };

  return (
    <>
      <SiteHeader brand={item.brand} />

      {/* CRUMB */}
      <div className="border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 text-sm text-[var(--muted-foreground)]">
          <Link href={`/shop/${item.category}`} className="capitalize hover:text-[var(--brand-priceless)]">
            ← All {item.category}
          </Link>
          <div>SKU {item.sku}</div>
        </div>
      </div>

      {/* HERO. Image left at the natural reading order, content right */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-10 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-7">
          <ProductGallery
            title={item.title}
            images={Array.from(new Set([hero, ...(item.gallery ?? []), item.image].filter(Boolean) as string[]))}
            stagedNote={item.staged ? "Staged rendering · click to zoom" : undefined}
          />
        </div>

        <div className="md:col-span-5">
          {item.manufacturer ? (
            <div className="text-sm uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
              {item.manufacturer}
            </div>
          ) : null}

          <h1 className="font-display mt-2 text-4xl leading-[1.05] md:text-5xl">
            {item.title}
          </h1>
          <p className="mt-3 text-base text-[var(--muted-foreground)] md:text-lg">{item.subtitle}</p>

          {/* PRICE BLOCK. Direct, no editorial */}
          <div className="mt-8 border-t border-[var(--border)] pt-6">
            <div className="flex items-end gap-6">
              <div>
                <div className="text-sm text-[var(--muted-foreground)]">Our price</div>
                <div className="font-display mt-1 text-6xl leading-none text-[var(--brand-priceless)]">
                  {formatCurrency(item.price)}
                </div>
              </div>
              {item.msrp && item.msrp > item.price ? (
                <div className="pb-1">
                  <div className="text-sm text-[var(--muted-foreground)]">
                    Estimated retail
                  </div>
                  <div className="font-display mt-1 text-2xl text-[var(--muted-foreground)] line-through">
                    {formatCurrency(item.comparable?.price ?? item.msrp)}
                  </div>
                  <Link href="/policies/pricing" className="mt-1 block text-xs text-[var(--muted-foreground)] underline decoration-[var(--muted-foreground)]/40 underline-offset-2 hover:text-[var(--foreground)]">
                    How we estimate this
                  </Link>
                </div>
              ) : null}
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="inline-flex size-2 rounded-full bg-emerald-500" />
              <span className="text-[var(--foreground)]">
                {item.inStock > 0 ? `In stock · ${item.inStock} available today` : "Made to order · call to confirm"}
              </span>
            </div>
          </div>

          {/* BUY ACTIONS. Dominant primary, plain secondary */}
          <div className="mt-6 space-y-3">
            <AddToCartButton sku={item.sku} title={item.title} />
            <div className="flex flex-wrap gap-3 text-sm">
              <a href="tel:+17158483855" className="text-[var(--brand-priceless)] underline decoration-2 underline-offset-4">
                Call {ADDRESS.phone} to hold
              </a>
              <span className="text-[var(--muted-foreground)]">·</span>
              <Link href="/contact" className="text-[var(--muted-foreground)] underline decoration-[var(--muted-foreground)]/40 decoration-2 underline-offset-4">
                Ask a question
              </Link>
            </div>
          </div>

          {/* FULFILLMENT. What they actually get */}
          <ul className="mt-8 space-y-2 border-t border-[var(--border)] pt-6 text-base text-[var(--foreground)]">
            {ff.pickup ? (
              <li className="flex items-baseline gap-3">
                <span className="text-[var(--brand-priceless)]">✓</span>
                <span>Free pickup at <span className="underline">{ADDRESS.street}, {ADDRESS.city}</span></span>
              </li>
            ) : null}
            {ff.localDelivery ? (
              <li className="flex items-baseline gap-3">
                <span className="text-[var(--brand-priceless)]">✓</span>
                <span>Local delivery within Marathon County starts at $79</span>
              </li>
            ) : null}
            {ff.ships ? (
              <li className="flex items-baseline gap-3">
                <span className="text-[var(--brand-priceless)]">✓</span>
                <span>Ships within Wisconsin · UPS or LTL freight</span>
              </li>
            ) : (
              <li className="flex items-baseline gap-3 text-[var(--muted-foreground)]">
                <span>·</span>
                <span>Too large to ship. Pickup or local delivery only</span>
              </li>
            )}
          </ul>

          {/* SPEC TABLE */}
          <dl className="mt-8 divide-y divide-[var(--border)] border-t border-b border-[var(--border)]">
            <Row label="SKU" value={item.sku} mono />
            {item.manufacturer ? <Row label="Manufacturer" value={item.manufacturer} /> : null}
            {item.dimensions ? <Row label="Dimensions" value={item.dimensions} /> : null}
            {item.weight ? <Row label="Weight" value={item.weight} /> : null}
            <Row label="Category" value={item.category} className="capitalize" />
            <Row label="In store" value={item.location ?? "Front floor"} />
          </dl>

          {/* WHY THIS PRICE. Plain language */}
          <div className="mt-8 bg-[var(--muted)] p-6">
            <div className="text-sm font-semibold text-[var(--foreground)]">Why is it cheaper?</div>
            <p className="mt-2 text-base leading-[1.7] text-[var(--muted-foreground)]">
              This came in as a cancelled order from a Wisconsin contractor. New, in the original packaging, same model number you'd find at Home Depot or Menards. Our estimated retail{item.comparable?.url ? <> (based on a similar item <a href={item.comparable.url} target="_blank" rel="noreferrer" className="underline">at a major retailer</a> this week)</> : ""} runs around {item.msrp ? formatCurrency(item.msrp) : "2× our tag"}. <Link href="/policies/pricing" className="underline decoration-[var(--muted-foreground)]/40 underline-offset-2">Methodology</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* SIMILAR */}
      {similar.length > 0 ? (
        <section className="border-t border-[var(--border)] bg-[var(--muted)]/40">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <h2 className="font-display text-3xl leading-tight md:text-4xl">
              Other {item.category} in stock
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((s) => (
                <Link key={s.id} href={`/shop/item/${s.sku}`} className="group block bg-white">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--muted)]">
                    <Image src={s.staged || s.image} alt={s.title} fill className="object-cover transition duration-500 group-hover:scale-[1.04]" sizes="25vw" quality={70} />
                  </div>
                  <div className="p-4">
                    <div className="font-display text-lg leading-tight">{s.title}</div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="font-display text-xl text-[var(--brand-priceless)]">{formatCurrency(s.price)}</span>
                      {s.msrp ? <span className="text-sm text-[var(--muted-foreground)] line-through">{formatCurrency(s.msrp)}</span> : null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <SiteFooter brand={item.brand} />
    </>
  );
}

function Row({ label, value, mono, className }: { label: string; value: string; mono?: boolean; className?: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] items-baseline gap-4 py-3">
      <dt className="text-sm text-[var(--muted-foreground)]">{label}</dt>
      <dd className={(mono ? "font-mono " : "") + "text-base text-[var(--foreground)] " + (className ?? "")}>{value}</dd>
    </div>
  );
}

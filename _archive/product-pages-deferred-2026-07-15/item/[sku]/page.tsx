import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { listCatalog, findItem, byCategory } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";
import { ADDRESS } from "@/lib/brands";
import { ProductGallery } from "@/components/product-gallery";

const SITE_URL = "https://pricelessbuilding.com";

export async function generateStaticParams() {
  const { FLOOR_SAMPLES } = await import("@/lib/items/floor-samples");
  const all = await listCatalog();
  const pool = [...FLOOR_SAMPLES, ...all.filter((c) => c.featured), ...all.slice(0, 60)];
  const seen = new Set<string>();
  return pool
    .filter((c) => (seen.has(c.sku) ? false : (seen.add(c.sku), true)))
    .slice(0, 100)
    .map((c) => ({ sku: c.sku }));
}

export async function generateMetadata({ params }: { params: Promise<{ sku: string }> }): Promise<Metadata> {
  const { sku } = await params;
  const item = await findItem(sku);
  if (!item) return { title: "Item not found" };
  const callForPrice = !(item.price > 0);
  const savings = !callForPrice && item.msrp && item.msrp > item.price
    ? Math.round((1 - item.price / item.msrp) * 100)
    : 0;
  const priceText = callForPrice ? "Call for price" : formatCurrency(item.price);
  const titleSuffix = savings > 0
    ? ` · ${priceText} (${savings}% off retail) · Wausau, WI`
    : ` · ${priceText} · Wausau, WI`;
  const titleBase = item.title.length > 60 ? `${item.title.slice(0, 57)}…` : item.title;
  const fullTitle = `${titleBase}${titleSuffix}`;
  const heroAbs = item.image.startsWith("http") ? item.image : `${SITE_URL}${item.image}`;
  const description =
    `${item.title}. ${item.subtitle ?? ""} ` +
    `${priceText}${!callForPrice && item.msrp ? ` (retail ${formatCurrency(item.msrp)})` : ""}. ` +
    `On the floor at Price-Less Building Center, ${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.state}. ` +
    `Call to hold · SKU ${item.sku}.`;
  const canonical = `${SITE_URL}/shop/item/${item.sku}`;
  return {
    title: fullTitle,
    description: description.trim(),
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: fullTitle,
      description: description.trim(),
      images: [{ url: heroAbs, alt: item.title }],
      siteName: "Price-Less Building Center",
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [heroAbs] },
    robots: { index: true, follow: true },
  };
}

function productJsonLd(item: NonNullable<Awaited<ReturnType<typeof findItem>>>): string {
  const heroAbs = item.image.startsWith("http") ? item.image : `${SITE_URL}${item.image}`;
  const galleryAbs = (item.gallery ?? []).map((g) =>
    g.startsWith("http") ? g : `${SITE_URL}${g}`,
  );
  const offerBase = {
    "@type": "Offer" as const,
    url: `${SITE_URL}/shop/item/${item.sku}`,
    priceCurrency: "USD",
    availability: item.inStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: {
      "@type": "LocalBusiness",
      name: "Price-Less Building Center",
      address: {
        "@type": "PostalAddress",
        streetAddress: ADDRESS.street,
        addressLocality: ADDRESS.city,
        addressRegion: ADDRESS.state,
        postalCode: ADDRESS.zip,
        addressCountry: "US",
      },
    },
  };
  const offers =
    item.price > 0
      ? {
          ...offerBase,
          price: item.price,
          priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
        }
      : offerBase;
  return JSON.stringify({
    "@context": "https://schema.org/",
    "@type": "Product",
    name: item.title,
    description: item.subtitle ?? item.title,
    image: [heroAbs, ...galleryAbs],
    sku: item.sku,
    brand: item.manufacturer
      ? { "@type": "Brand", name: item.manufacturer }
      : { "@type": "Brand", name: item.brand === "builders" ? "Builders Corner" : "Price-Less Building Center" },
    offers,
  });
}

export default async function ItemPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const item = await findItem(sku);
  if (!item) notFound();
  const similar = (await byCategory(item.brand, item.category)).filter((c) => c.sku !== item.sku).slice(0, 4);
  const hero = item.staged || item.image;
  const ff = item.fulfillment ?? { pickup: true, localDelivery: true, ships: false };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: productJsonLd(item) }} />
      <SiteHeader brand={item.brand} />

      <div className="border-b border-[var(--line)]">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-4 px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[var(--soft)] md:px-8">
          <Link href={`/shop/${item.category}`} className="hover:text-[var(--ink)]">
            ← All {item.category}
          </Link>
          <div>SKU {item.sku}</div>
        </div>
      </div>

      <section className="mx-auto grid max-w-[1360px] gap-10 px-6 py-10 md:grid-cols-12 md:gap-14 md:px-8 md:py-14">
        <div className="md:col-span-7">
          <ProductGallery
            title={item.title}
            images={Array.from(new Set([hero, ...(item.gallery ?? []), item.image].filter(Boolean) as string[]))}
            stagedNote={item.staged ? "Staged rendering · click to zoom" : undefined}
          />
        </div>

        <div className="md:col-span-5 md:pt-2">
          {item.manufacturer ? (
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[var(--rust)]">
              {item.manufacturer}
            </p>
          ) : null}

          <h1 className="font-display mt-3 text-[clamp(1.8rem,1rem+2vw,2.8rem)] leading-[1.08]">
            {item.title}
          </h1>
          {item.subtitle ? (
            <p className="mt-3 text-[1rem] font-light leading-[1.65] text-[var(--soft)]">{item.subtitle}</p>
          ) : null}

          <div className="mt-8 border-t border-[var(--line)] pt-6">
            <div className="flex items-end gap-6">
              <div>
                <div className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--soft)]">
                  {item.price > 0 ? "Our price" : "On the floor"}
                </div>
                <div className="mt-1 text-4xl font-medium tracking-tight md:text-5xl">
                  {item.price > 0 ? formatCurrency(item.price) : "Call for price"}
                </div>
              </div>
              {item.price > 0 && item.msrp && item.msrp > item.price ? (
                <div className="pb-1">
                  <div className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--soft)]">
                    Est. retail
                  </div>
                  <div className="mt-1 text-xl text-[var(--rust)] line-through">
                    {formatCurrency(item.comparable?.price ?? item.msrp)}
                  </div>
                </div>
              ) : null}
            </div>
            <p className="mt-4 text-sm font-light text-[var(--ink)]">
              {item.inStock > 0
                ? item.price > 0
                  ? `In stock · ${item.inStock} available`
                  : "In stock on the floor · call to hold"
                : "Call to confirm availability"}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <a
              href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`}
              className="btn btn-priceless flex w-full items-center justify-center"
            >
              Call to hold · {ADDRESS.phone}
            </a>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[0.72rem] font-medium uppercase tracking-[0.14em]">
              <Link href="/contact" className="text-[var(--soft)] underline-offset-4 hover:underline">
                Ask about size or finish
              </Link>
              <Link href={`/shop/${item.category}`} className="text-[var(--soft)] underline-offset-4 hover:underline">
                More in {item.category}
              </Link>
            </div>
          </div>

          <ul className="mt-8 space-y-2.5 border-t border-[var(--line)] pt-6 text-sm font-light leading-relaxed">
            {ff.pickup ? (
              <li>Free pickup at {ADDRESS.street}, {ADDRESS.city}</li>
            ) : null}
            {ff.localDelivery ? (
              <li>Local delivery within Marathon County from $79</li>
            ) : null}
            {ff.ships ? (
              <li>Ships within Wisconsin · UPS or LTL freight</li>
            ) : (
              <li className="text-[var(--soft)]">Too large to ship — pickup or local delivery only</li>
            )}
          </ul>

          <dl className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)]">
            <Row label="SKU" value={item.sku} />
            {item.manufacturer ? <Row label="Manufacturer" value={item.manufacturer} /> : null}
            {item.dimensions ? <Row label="Dimensions" value={item.dimensions} /> : null}
            {item.weight ? <Row label="Weight" value={item.weight} /> : null}
            <Row label="Category" value={item.category} />
            <Row label="In store" value={item.location ?? "Front floor"} />
          </dl>

          {item.price > 0 ? (
            <div className="mt-8 bg-[var(--cream)] p-6">
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[var(--rust)]">
                Why is it cheaper?
              </p>
              <p className="mt-3 text-sm font-light leading-[1.7] text-[var(--soft)]">
                Brand-new in its original packaging. Our estimated retail
                {item.comparable?.url ? (
                  <>
                    {" "}
                    (based on a similar item{" "}
                    <a href={item.comparable.url} target="_blank" rel="noreferrer" className="underline">
                      at a major retailer
                    </a>{" "}
                    this week)
                  </>
                ) : null}{" "}
                runs around {item.msrp ? formatCurrency(item.msrp) : "2× our tag"}.{" "}
                <Link href="/policies/pricing" className="underline">
                  Methodology
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="mt-8 bg-[var(--cream)] p-6">
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[var(--rust)]">
                How to buy
              </p>
              <p className="mt-3 text-sm font-light leading-[1.7] text-[var(--soft)]">
                We&apos;re tagging inventory for the floor as we go — prices stay
                in the warehouse for now. Call {ADDRESS.phone} and we&apos;ll hold
                it for pickup at {ADDRESS.street}.
              </p>
            </div>
          )}
        </div>
      </section>

      {similar.length > 0 ? (
        <section className="border-t border-[var(--line)] bg-[var(--cream)]">
          <div className="mx-auto max-w-[1360px] px-6 py-16 md:px-8 md:py-20">
            <h2 className="font-display text-center text-[clamp(1.8rem,1rem+2vw,2.6rem)] leading-[1.05]">
              Other {item.category} in <span className="font-normal italic">stock.</span>
            </h2>
            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
              {similar.map((s, i) => (
                <ProductCard key={s.id} item={s} priority={i < 2} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <SiteFooter brand={item.brand} />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-baseline gap-4 py-3">
      <dt className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-[var(--soft)]">{label}</dt>
      <dd className="text-sm font-light capitalize text-[var(--ink)]">{value}</dd>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { ProductCard } from "@/components/product-card";
import { ADDRESS, PRICELESS } from "@/lib/brands";
import { CATEGORIES, byCategory, listFeatured } from "@/lib/catalog";
import { fetchReviews, GOOGLE_RATING } from "@/lib/google-reviews";

const P = "/real-photos";
const B = "/real-photos/business";

const SERVICES = [
  {
    name: "Price-Less Building",
    logo: `${P}/logo-priceless-clean.webp`,
    logoW: 120,
    logoH: 120,
    body: "Discount and surplus doors, windows, cabinets, and lighting — tagged and ready to take home.",
    cta: "Shop the warehouse",
    href: "/shop",
    img: `${B}/white-kitchen-marble-island.jpg`,
  },
  {
    name: "Builders Corner",
    logo: `${P}/logo-builders-corner-real.jpg`,
    logoW: 180,
    logoH: 120,
    body: "Custom cabinetry and full kitchen & bath design, built in our own Wausau shop.",
    cta: "Design a kitchen",
    href: "/builders-corner",
    img: `${P}/builders-corner-hero.jpg`,
  },
  {
    name: "4 Squared",
    logo: `${P}/logo-4squared.jpg`,
    logoW: 140,
    logoH: 140,
    body: "Our own crew handles the whole remodel — from demo to the final walkthrough.",
    cta: "Start a remodel",
    href: "/four-squared",
    img: `${P}/foursquared/kitchen-white-island-shiplap.jpg`,
  },
];

const BEFORE_AFTER = [
  {
    label: "Kitchen remodel",
    img: `${B}/kitchen-remodel-before-after.jpg`,
    body: "Dated oak galley to a bright white-cabinet kitchen with stone counters — designed, supplied, and installed under one roof.",
  },
  {
    label: "Kitchen & bath",
    img: `${B}/kitchen-and-bath-remodel-split.jpg`,
    body: "A whole-home refresh: cabinetry from Builders Corner, fixtures off the Price-Less floor, installed by the 4 Squared crew.",
  },
];

const BRANDS = [
  "Andersen", "Marvin", "JELD-WEN", "Masonite", "Pella", "Kohler",
  "Delta", "Schlage", "Kwikset", "Therma-Tru", "Cambria", "Blum",
];

const NEWS = [
  {
    source: "WSAW NewsChannel 7",
    date: "June 2023",
    title: "A “Build Your Future” community mural comes to downtown Wausau.",
    url: "https://www.wsaw.com/2023/06/18/new-mural-coming-downtown-wausau/",
  },
  {
    source: "Wausau Business News",
    date: "2021",
    title: "Josh Nickel takes the reins at Price-Less and Builders Corner.",
    url: "https://www.readthebusinessnews.com/features/growth_strategies/they-re-building-something/article_70b4788e-a8e3-11eb-ba26-e3a990b7c281.html",
  },
  {
    source: "WSAW NewsChannel 7",
    date: "April 2025",
    title: "Easter Bunny visit draws families to the storefront.",
    url: "https://www.wsaw.com/2025/04/13/easter-bunny-visits-local-wausau-business/",
  },
];

const FB_PHOTOS = [
  `${P}/paint-day-rainbow.webp`,
  `${P}/anniversary-6-year.webp`,
  `${P}/santa-at-storefront.webp`,
  `${P}/school-food-drive.webp`,
];

const GALLERY = [
  `${P}/builders-corner-hero.jpg`,
  `${P}/foursquared/kitchen-wood-island-black-pendants.jpg`,
  `${P}/foursquared/kitchen-white-island-shiplap.jpg`,
  `${B}/white-kitchen-wood-island.jpg`,
  `${B}/dark-double-vanity-bathroom-install.jpg`,
  `${P}/foursquared/pergola-patio-daylight.jpg`,
];

const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HomeImprovementBusiness", "HomeAndConstructionBusiness"],
  "@id": "https://pricelessbuilding.com#org",
  name: "Price-Less Building Center",
  alternateName: ["Price-Less Building", "Priceless Building Center"],
  description:
    "Discount and surplus building materials, premium custom cabinetry, and a professional install crew in Wausau, WI. Doors, windows, cabinets, vanities, hardware, plus full kitchen and bath remodels.",
  url: "https://pricelessbuilding.com",
  telephone: "+1-715-848-3855",
  priceRange: "$ – $$$",
  foundingDate: "1978",
  image: "https://pricelessbuilding.com/og-mural.jpg",
  logo: "https://pricelessbuilding.com/real-photos/logo-priceless-clean.webp",
  address: {
    "@type": "PostalAddress",
    streetAddress: ADDRESS.street,
    addressLocality: ADDRESS.city,
    addressRegion: ADDRESS.state,
    postalCode: ADDRESS.zip,
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: ADDRESS.geo.lat,
    longitude: ADDRESS.geo.lng,
  },
  openingHoursSpecification: PRICELESS.hours
    .filter((h) => h.hours !== "Closed")
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.day,
      ...(h.hours.includes("–")
        ? {
            opens: h.hours.split("–")[0]?.trim(),
            closes: h.hours.split("–")[1]?.trim(),
          }
        : {}),
    })),
  areaServed: [
    "Wausau, WI", "Schofield, WI", "Weston, WI", "Rib Mountain, WI",
    "Rothschild, WI", "Mosinee, WI", "Marathon, WI", "Marathon County, WI",
    "Central Wisconsin",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: GOOGLE_RATING.average.toString(),
    reviewCount: GOOGLE_RATING.count.toString(),
  },
  sameAs: [
    PRICELESS.socials.facebook,
    PRICELESS.socials.instagram,
    PRICELESS.socials.yelp,
    PRICELESS.socials.googleMaps,
  ],
  department: [
    {
      "@type": "LocalBusiness",
      "@id": "https://pricelessbuilding.com/builders-corner#org",
      name: "Builders Corner Cabinetry & Design",
      url: "https://pricelessbuilding.com/builders-corner",
      description:
        "Premium custom kitchen and bath cabinetry, designed and built in Wausau, WI since 1983.",
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://pricelessbuilding.com/four-squared#org",
      name: "4 Squared",
      url: "https://pricelessbuilding.com/four-squared",
      description:
        "Professional installation crew for custom kitchen remodels, bath remodels, and full home renovations in central Wisconsin.",
    },
  ],
  makesOffer: [
    { "@type": "Offer", name: "Discount and surplus building materials" },
    { "@type": "Offer", name: "Surplus doors, windows, cabinets, vanities, and hardware" },
    { "@type": "Offer", name: "Custom kitchen cabinetry design and build" },
    { "@type": "Offer", name: "Custom bathroom cabinetry design and build" },
    { "@type": "Offer", name: "Full kitchen remodel design and installation" },
    { "@type": "Offer", name: "Bath remodel design and installation" },
  ],
};

function Eyebrow({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <p className={`eyebrow ${onDark ? "eyebrow-on-dark" : ""}`}>{children}</p>
  );
}

function H2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`font-display text-[clamp(2rem,1rem+2.9vw,3.3rem)] leading-[1.05] ${className}`}>
      {children}
    </h2>
  );
}

export default async function HomePage() {
  const categoryKeys = Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[];
  const featuredPool = await listFeatured();
  let items;
  if (featuredPool.length >= 8) {
    const day = Math.floor(Date.now() / 86_400_000);
    const start = (day * 12) % featuredPool.length;
    items = [...featuredPool.slice(start), ...featuredPool.slice(0, start)].slice(0, 8);
  } else {
    const perCategory = await Promise.all(
      categoryKeys.map((cat) => byCategory("priceless", cat)),
    );
    items = perCategory.flatMap((list) => list.slice(0, 2)).slice(0, 8);
  }

  const reviews = (await fetchReviews()).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD) }}
      />
      <SiteHeader brand="priceless" />
      <HeroSlideshow />

      {/* Mural */}
      <figure className="relative">
        <div className="relative w-full overflow-hidden bg-[var(--cream)]">
          <Image
            src={`${P}/mural-wide.webp`}
            alt="The 'Build Your Future' community mural on the side of the Price-Less Building Center, painted by fifty Wausau volunteers in June 2023."
            width={2400}
            height={750}
            sizes="100vw"
            className="block h-auto w-full"
          />
        </div>
        <figcaption className="mx-auto flex max-w-[1360px] flex-wrap items-baseline justify-between gap-3 px-8 py-4 text-[0.8rem] text-[var(--soft)]">
          <span>
            &ldquo;Build Your Future&rdquo; mural · designed by Stephanie Kohli · painted by fifty
            Wausau volunteers · June 2023
          </span>
          <a
            href="https://www.wsaw.com/2023/06/18/new-mural-coming-downtown-wausau/"
            target="_blank"
            rel="noreferrer"
            className="font-medium uppercase tracking-[0.16em] text-[var(--rust)]"
          >
            WSAW story ›
          </a>
        </figcaption>
      </figure>

      {/* Three businesses */}
      <section className="bg-[var(--taupe)]">
        <div className="mx-auto max-w-[1240px] px-8 py-24 text-center">
          <Eyebrow>One yard · three ways to build</Eyebrow>
          <H2 className="mx-auto mt-4 max-w-[22ch]">
            Shop it, design it, <span className="font-normal italic">build it.</span>
          </H2>
          <div className="mt-16 grid gap-x-10 gap-y-14 text-left md:grid-cols-3">
            {SERVICES.map((s) => (
              <div key={s.name} className="flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--stone-deep)]">
                  <Image src={s.img} alt={s.name} fill sizes="(max-width:768px) 90vw, 30vw" className="object-cover" />
                </div>
                <div className="mt-7 flex items-center gap-3.5">
                  <Image
                    src={s.logo}
                    alt=""
                    width={s.logoW}
                    height={s.logoH}
                    className="h-11 w-auto max-w-[3.25rem] shrink-0 object-contain"
                  />
                  <h3 className="font-display text-[1.35rem] leading-tight text-[var(--ink)] sm:text-[1.45rem]">
                    {s.name}
                  </h3>
                </div>
                <p className="mt-3 max-w-[36ch] text-[0.92rem] font-light leading-[1.65] text-[var(--soft)]">
                  {s.body}
                </p>
                <Link
                  href={s.href}
                  className="mt-5 inline-block text-[0.72rem] font-medium uppercase tracking-[0.2em] underline-offset-[6px] transition hover:underline"
                >
                  {s.cta} ›
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured inventory */}
      {items.length > 0 ? (
        <section className="mx-auto max-w-[1360px] px-8 pt-20 pb-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <Eyebrow>On the floor now</Eyebrow>
              <H2 className="mt-4">
                Fresh finds from the <span className="font-normal italic">warehouse.</span>
              </H2>
            </div>
            <Link
              href="/shop"
              className="hidden border-b border-[var(--ink)] pb-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] sm:inline-block"
            >
              Shop everything ›
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6">
            {items.map((item, i) => (
              <ProductCard key={item.sku} item={item} priority={i < 4} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Before / after */}
      <section className="mx-auto max-w-[1360px] px-8 pt-10 pb-20">
        <div className="max-w-[46ch]">
          <Eyebrow>The remodeling journey</Eyebrow>
          <H2 className="mt-3">
            Before, and <span className="font-normal italic">after.</span>
          </H2>
          <p className="mt-4 text-[1rem] font-light leading-[1.7] text-[var(--soft)]">
            Real rooms the in-house crew has finished — shopped, designed, and installed without
            leaving the lot.
          </p>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {BEFORE_AFTER.map((ba) => (
            <figure key={ba.label}>
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--line)]">
                <Image src={ba.img} alt={ba.label} fill sizes="(max-width:768px) 90vw, 45vw" className="object-cover" />
              </div>
              <figcaption className="mt-5">
                <h3 className="font-display text-[1.4rem] font-semibold">{ba.label}</h3>
                <p className="mt-2 text-[0.95rem] font-light leading-[1.7] text-[var(--soft)]">{ba.body}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Brands */}
      <section className="bg-[var(--ink)] text-white">
        <div className="mx-auto max-w-[1360px] px-8 py-20 text-center">
          <Eyebrow onDark>Read straight off the boxes in our aisles</Eyebrow>
          <H2 className="mt-4 text-white">Brands on the floor.</H2>
          <div className="mx-auto mt-12 flex max-w-[1100px] flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {BRANDS.map((b) => (
              <span key={b} className="text-[1.15rem] font-medium uppercase tracking-[0.18em] text-white/70">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-[1240px] px-8 py-24 text-center">
        <Eyebrow>Since 1978</Eyebrow>
        <H2 className="mx-auto mt-4 max-w-[24ch]">
          Trusted across <span className="font-normal italic">central Wisconsin.</span>
        </H2>
        <div className="mt-5 flex items-center justify-center gap-3">
          <span className="text-sm tracking-[0.2em] text-[var(--rust)]" aria-hidden>
            ★★★★★
          </span>
          <span className="text-[0.76rem] font-medium uppercase tracking-[0.18em] text-[var(--soft)]">
            {GOOGLE_RATING.average} on Google · Family-run since 1978
          </span>
        </div>
        <div className="mt-16 grid gap-8 text-left md:grid-cols-3">
          {reviews.map((r) => (
            <figure key={`${r.author}-${r.relative}`} className="flex flex-col border border-[var(--line)] p-8">
              <div className="text-sm tracking-[0.2em] text-[var(--rust)]" aria-hidden>
                {"★".repeat(r.rating ?? 5)}
              </div>
              <blockquote className="font-display mt-5 flex-1 text-[1.12rem] font-normal italic leading-[1.55]">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-[0.74rem] font-medium uppercase tracking-[0.12em] text-[var(--soft)]">
                {r.author ?? "Customer"} · {r.source}
                {r.relative ? ` · ${r.relative}` : ""}
              </figcaption>
            </figure>
          ))}
        </div>
        <Link
          href="/reviews"
          className="mt-12 inline-block text-[0.72rem] font-medium uppercase tracking-[0.18em] underline-offset-[6px] hover:underline"
        >
          More reviews ›
        </Link>
      </section>

      {/* Gallery */}
      <section className="border-t border-[var(--line)] bg-[var(--cream)]">
        <div className="mx-auto max-w-[1360px] px-8 py-24">
          <div className="flex items-end justify-between gap-6">
            <div>
              <Eyebrow>Around the yard</Eyebrow>
              <H2 className="mt-4">A slice of the floor.</H2>
            </div>
            <Link
              href="/shop"
              className="hidden border-b border-[var(--ink)] pb-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] sm:inline-block"
            >
              See the full gallery ›
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
            {GALLERY.map((src, i) => (
              <div
                key={src}
                className={`relative overflow-hidden bg-[var(--line)] ${
                  i === 0 ? "aspect-[16/10] md:col-span-2 md:row-span-2 md:aspect-auto" : "aspect-square"
                }`}
              >
                <Image src={src} alt="" fill sizes="(max-width:768px) 45vw, 30vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="mx-auto max-w-[1240px] px-8 py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>In the local news</Eyebrow>
            <H2 className="mt-4">
              Wausau keeps <span className="font-normal italic">talking.</span>
            </H2>
          </div>
          <Link
            href="/press"
            className="hidden shrink-0 text-[0.72rem] font-medium uppercase tracking-[0.18em] underline-offset-[6px] hover:underline sm:inline-block"
          >
            All press ›
          </Link>
        </div>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {NEWS.map((n) => (
            <a
              key={n.title}
              href={n.url}
              target="_blank"
              rel="noreferrer"
              className="group block border-t border-[var(--ink)] pt-6"
            >
              <div className="flex items-baseline justify-between text-[0.7rem] font-medium uppercase tracking-[0.14em] text-[var(--soft)]">
                <span>{n.source}</span>
                <span>{n.date}</span>
              </div>
              <h3 className="font-display mt-4 text-[1.25rem] font-semibold leading-[1.3] transition group-hover:opacity-70">
                {n.title}
              </h3>
              <span className="mt-5 inline-block text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[var(--rust)]">
                Read the story ›
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Facebook */}
      <section className="border-t border-[var(--line)] bg-[var(--cream)]">
        <div className="mx-auto grid max-w-[1240px] items-center gap-14 px-8 py-24 md:grid-cols-2">
          <div>
            <Eyebrow>Around the store lately</Eyebrow>
            <H2 className="mt-4">
              Follow along on <span className="font-normal italic">Facebook.</span>
            </H2>
            <p className="mt-5 max-w-[46ch] text-[1rem] font-light leading-[1.75] text-[var(--soft)]">
              New stock, holiday hours, paint days, and community events — we post a few times a
              week. It&rsquo;s the most current look at what&rsquo;s on the floor between visits.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={PRICELESS.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="border border-[var(--ink)] px-8 py-4 text-[0.72rem] font-medium uppercase tracking-[0.2em] transition hover:bg-[var(--ink)] hover:text-white"
              >
                Follow on Facebook ›
              </a>
              <a
                href={PRICELESS.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-[0.72rem] font-medium uppercase tracking-[0.2em] underline-offset-[6px] hover:underline"
              >
                Instagram ›
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {FB_PHOTOS.map((src) => (
              <div key={src} className="relative aspect-square overflow-hidden bg-[var(--stone-deep)]">
                <Image
                  src={src}
                  alt="A recent Price-Less Building Center community moment."
                  fill
                  sizes="(max-width:768px) 45vw, 22vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA + map */}
      <section className="border-t border-[var(--line)] bg-white">
        <div className="mx-auto grid max-w-[1360px] md:grid-cols-2">
          <div className="flex flex-col justify-center px-8 py-20 md:px-14 md:py-24 lg:px-20">
            <Eyebrow>Visit the yard</Eyebrow>
            <H2 className="mt-4 max-w-[16ch]">
              Come see it. You&rsquo;re in{" "}
              <span className="font-normal italic">Wausau.</span>
            </H2>
            <p className="mt-5 max-w-[42ch] text-[1rem] font-light leading-[1.7] text-[var(--soft)]">
              {ADDRESS.street}
              <br />
              {ADDRESS.city}, {ADDRESS.state} {ADDRESS.zip}
            </p>
            <ul className="mt-6 space-y-1.5 text-[0.85rem] font-light leading-relaxed text-[var(--soft)]">
              {PRICELESS.hours
                .filter((h) => h.hours !== "Closed")
                .map((h) => (
                  <li key={h.day} className="flex gap-4">
                    <span className="w-10 shrink-0 font-medium uppercase tracking-[0.12em] text-[var(--ink)]">
                      {h.day}
                    </span>
                    <span>{h.hours}</span>
                  </li>
                ))}
              <li className="flex gap-4 pt-1 text-[var(--ink)]/55">
                <span className="w-10 shrink-0 font-medium uppercase tracking-[0.12em]">Sun</span>
                <span>Closed</span>
              </li>
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/shop"
                className="border border-[var(--ink)] px-8 py-4 text-[0.72rem] font-medium uppercase tracking-[0.2em] transition hover:bg-[var(--ink)] hover:text-white"
              >
                Shop the warehouse ›
              </Link>
              <a
                href={PRICELESS.socials.googleMaps}
                target="_blank"
                rel="noreferrer"
                className="text-[0.72rem] font-medium uppercase tracking-[0.2em] underline-offset-[6px] hover:underline"
              >
                Open in Google Maps ›
              </a>
            </div>
          </div>
          <div className="relative min-h-[320px] bg-[var(--taupe)] md:min-h-full">
            <iframe
              title="Map to Price-Less Building Center, 825 Washington St, Wausau WI"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                `${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.state} ${ADDRESS.zip}`,
              )}&z=15&output=embed`}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { ReviewsFade } from "@/components/reviews-fade";
import { SwipeCard, SwipeRail } from "@/components/swipe-rail";
import { FeaturedItemsFade } from "@/components/featured-items-fade";
import { BuildersPromo } from "@/components/builders-promo";
import { ADDRESS, PRICELESS } from "@/lib/brands";
import { CATEGORIES, byCategory, listFeatured } from "@/lib/catalog";
import { FLOOR_FEATURES } from "@/lib/items/floor-features";
import { isCatalogLive } from "@/lib/catalog-live";
import { DepartmentMosaic } from "@/components/department-mosaic";
import { fetchReviews, GOOGLE_RATING } from "@/lib/google-reviews";
import { ProductCard } from "@/components/product-card";

const P = "/real-photos";
const B = "/real-photos/business";

const SERVICES = [
  {
    name: "Price-Less Building",
    logo: `${P}/logo-priceless-clean.webp`,
    logoW: 120,
    logoH: 120,
    body: "Discount and surplus doors, windows, cabinets, and lighting, with kitchen and bath depth and the deals reviewers keep calling out.",
    cta: "Shop the warehouse",
    href: "/shop",
    img: `${B}/floor-door-aisle-light-and-dark.jpg`,
  },
  {
    name: "Builders Corner",
    logo: `${P}/logo-builders-corner@2x.webp`,
    logoW: 446,
    logoH: 320,
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
    body: "Our own crew handles the whole remodel, from demo to the final walkthrough.",
    cta: "Start a remodel",
    href: "/four-squared",
    img: `${P}/foursquared/kitchen-white-island-shiplap.jpg`,
  },
];

const BEFORE_AFTER = [
  {
    label: "Kitchen remodel",
    img: `${B}/kitchen-remodel-before-after.jpg`,
    body: "Dated oak galley to a bright white-cabinet kitchen with stone counters, designed, supplied, and installed under one roof.",
  },
  {
    label: "Kitchen & bath",
    img: `${B}/kitchen-and-bath-remodel-split.jpg`,
    body: "A whole-home refresh: cabinetry from Builders Corner, fixtures off the Price-Less floor, installed by the 4 Squared crew.",
  },
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

function H2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`font-display text-[clamp(2rem,1rem+2.9vw,3.3rem)] leading-[1.05] ${className}`}>
      {children}
    </h2>
  );
}

export default async function HomePage() {
  const categoryKeys = Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[];
  const live = isCatalogLive();
  let items: Awaited<ReturnType<typeof listFeatured>> = [];
  if (live) {
    const featuredPool = await listFeatured();
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
  }

  const reviews = await fetchReviews();

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
        <figcaption className="mx-auto flex max-w-[1360px] items-baseline justify-center px-8 py-4 text-center">
          <a
            href="https://www.wsaw.com/2023/06/18/new-mural-coming-downtown-wausau/"
            target="_blank"
            rel="noreferrer"
            className="text-[0.9rem] font-medium text-[var(--ink)] underline-offset-[5px] hover:underline"
          >
            Read the story behind the mural ›
          </a>
        </figcaption>
      </figure>

      {/* Three businesses — photo captions */}
      <section className="bg-[var(--taupe)]">
        <div className="mx-auto max-w-[1360px] px-5 py-10 text-center sm:px-8 sm:py-12 md:py-14">
          <H2 className="mx-auto max-w-[22ch]">
            Three award-winning businesses{" "}
            <span className="font-normal italic">under one roof.</span>
          </H2>
          <div className="mt-7 grid gap-2.5 sm:mt-8 md:mt-10 md:grid-cols-3 md:gap-3">
            {SERVICES.map((s, i) => (
              <Link
                key={s.name}
                href={s.href}
                className="group relative aspect-[3/4] overflow-hidden sm:aspect-[4/5]"
              >
                <Image
                  src={s.img}
                  alt={s.name}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  quality={90}
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5" />
                <div className="absolute left-5 top-5 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-white/75">
                  0{i + 1}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-left text-white sm:p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center bg-white p-1 sm:size-11">
                      <Image
                        src={s.logo}
                        alt=""
                        width={s.logoW}
                        height={s.logoH}
                        className="h-full w-full object-contain"
                      />
                    </span>
                    <h3 className="font-display text-[1.35rem] leading-tight sm:text-[1.5rem]">{s.name}</h3>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[0.95rem] font-light leading-[1.5] text-white/85 sm:text-[1rem]">
                    {s.body}
                  </p>
                  <span className="mt-4 inline-block text-[0.8rem] font-medium uppercase tracking-[0.16em]">
                    {s.cta} ›
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured floor finds — 2-up fade, or live tagged grid when catalog is on */}
      {live && items.length > 0 ? (
        <section className="mx-auto max-w-[1360px] px-5 pt-10 pb-6 sm:px-8 sm:pt-14 sm:pb-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <H2>
                Featured <span className="font-normal italic">finds.</span>
              </H2>
            </div>
            <Link
              href="/shop"
              className="hidden border-b border-[var(--ink)] pb-1 text-[0.8rem] font-medium uppercase tracking-[0.16em] sm:inline-block"
            >
              Shop departments ›
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-5 md:mt-8 md:grid-cols-3 md:gap-x-6 md:gap-y-8">
            {items.map((item, i) => (
              <ProductCard key={item.sku} item={item} priority={i < 3} />
            ))}
          </div>
        </section>
      ) : (
        <FeaturedItemsFade items={FLOOR_FEATURES} />
      )}

      {!live ? <DepartmentMosaic /> : null}

      <BuildersPromo />

      {/* Before / after — show full composite photos (no crop) */}
      <section className="mx-auto max-w-[1360px] px-5 pt-6 pb-10 sm:px-8 sm:pt-8 sm:pb-14">
        <div className="max-w-[46ch]">
          <H2>
            Before, and <span className="font-normal italic">after.</span>
          </H2>
          <p className="mt-3 hidden text-[1.05rem] font-light leading-[1.65] text-[var(--soft)] sm:block">
            Real rooms the in-house crew has finished: shopped, designed, and installed
            on the same lot.
          </p>
        </div>
        <div className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 md:grid-cols-2">
          {BEFORE_AFTER.map((ba) => (
            <figure key={ba.label}>
              <div className="relative w-full overflow-hidden bg-[var(--line)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ba.img}
                  alt={ba.label}
                  className="h-auto w-full object-contain"
                />
              </div>
              <figcaption className="mt-3 sm:mt-5">
                <h3 className="font-display text-[1.2rem] font-semibold sm:text-[1.4rem]">{ba.label}</h3>
                <p className="mt-1.5 hidden text-[0.95rem] font-light leading-[1.7] text-[var(--soft)] sm:mt-2 sm:block">
                  {ba.body}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <ReviewsFade reviews={reviews} />

      {/* Builders Corner finished work */}
      <section className="border-t border-[var(--line)] bg-[var(--cream)]">
        <div className="mx-auto max-w-[1360px] px-5 py-10 sm:px-8 sm:py-14">
          <div className="flex items-end justify-between gap-6">
            <div>
              <H2 className="max-w-[20ch]">
                Built by <span className="font-normal italic">Builders Corner.</span>
              </H2>
              <p className="mt-3 max-w-[46ch] text-[1.05rem] font-light leading-[1.65] text-[var(--soft)]">
                Finished kitchens, baths, and outdoor work from the showroom and shop
                on Washington Street.
              </p>
            </div>
            <Link
              href="/builders-corner"
              className="hidden shrink-0 border-b border-[var(--ink)] pb-1 text-[0.8rem] font-medium uppercase tracking-[0.16em] sm:inline-block"
            >
              See more work ›
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3 md:grid-cols-3">
            {GALLERY.map((src) => (
              <div
                key={src}
                className="relative aspect-[4/5] min-w-0 overflow-hidden bg-[var(--line)]"
              >
                <Image src={src} alt="" fill sizes="(max-width:768px) 45vw, 30vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex items-end justify-between gap-6">
          <div>
            <H2 className="mt-0 sm:mt-0">
              Wausau keeps <span className="font-normal italic">talking.</span>
            </H2>
          </div>
          <Link
            href="/press"
            className="hidden shrink-0 text-[0.8rem] font-medium uppercase tracking-[0.16em] underline-offset-[6px] hover:underline sm:inline-block"
          >
            All press ›
          </Link>
        </div>
        <SwipeRail className="mt-6 md:mt-8 md:grid-cols-3">
          {NEWS.map((n) => (
            <SwipeCard key={n.title}>
              <a
                href={n.url}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col border-t border-[var(--ink)] pt-5 sm:pt-6"
              >
                <div className="flex items-baseline justify-between gap-3 text-[0.75rem] font-medium uppercase tracking-[0.12em] text-[var(--soft)] sm:text-[0.8rem]">
                  <span className="truncate">{n.source}</span>
                  <span className="shrink-0">{n.date}</span>
                </div>
                <h3 className="font-display mt-3 line-clamp-3 text-[1.15rem] font-semibold leading-[1.3] transition group-hover:opacity-70 sm:mt-4 sm:line-clamp-none sm:text-[1.3rem]">
                  {n.title}
                </h3>
                <span className="mt-4 inline-block text-[0.8rem] font-medium uppercase tracking-[0.16em] text-[var(--rust)] sm:mt-5">
                  Read the story ›
                </span>
              </a>
            </SwipeCard>
          ))}
        </SwipeRail>
      </section>

      {/* Facebook — photos lead on mobile */}
      <section className="border-t border-[var(--line)] bg-[var(--cream)]">
        <div className="mx-auto grid max-w-[1240px] items-center gap-6 px-5 py-10 sm:gap-10 sm:px-8 sm:py-14 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <H2 className="mt-0 sm:mt-0">
              Follow along on <span className="font-normal italic">Facebook.</span>
            </H2>
            <p className="mt-3 hidden max-w-[46ch] text-[1.05rem] font-light leading-[1.65] text-[var(--soft)] sm:block">
              New stock, holiday hours, paint days, and community events. We post a few times a
              week. It&rsquo;s the most current look at what&rsquo;s on the floor between visits.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 sm:mt-6">
              <a
                href={PRICELESS.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="border border-[var(--ink)] px-6 py-3.5 text-[0.8rem] font-medium uppercase tracking-[0.16em] transition hover:bg-[var(--ink)] hover:text-white sm:px-8"
              >
                Follow on Facebook ›
              </a>
              <a
                href={PRICELESS.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-[0.8rem] font-medium uppercase tracking-[0.16em] underline-offset-[6px] hover:underline"
              >
                Instagram ›
              </a>
            </div>
          </div>
          <div className="order-1 grid grid-cols-2 gap-2 sm:gap-3 md:order-2">
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
          <div className="flex flex-col justify-center px-5 py-10 sm:px-8 sm:py-14 md:px-14 md:py-16 lg:px-20">
            <H2 className="mt-0 max-w-[16ch] sm:mt-0">
              Come see it. You&rsquo;re in{" "}
              <span className="font-normal italic">Wausau.</span>
            </H2>
            <p className="mt-4 max-w-[42ch] text-[1.05rem] font-light leading-[1.65] text-[var(--soft)]">
              {ADDRESS.street}
              <br />
              {ADDRESS.city}, {ADDRESS.state} {ADDRESS.zip}
            </p>
            <ul className="mt-5 hidden space-y-1.5 text-[0.95rem] font-light leading-relaxed text-[var(--soft)] sm:mt-6 sm:block">
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
            <p className="mt-3 text-[0.95rem] font-light text-[var(--soft)] sm:hidden">
              Mon–Thu 8:30–5:30 · Fri 8:30–4:30 · Sat 8:30–12:30
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 sm:mt-8">
              <Link
                href="/shop"
                className="border border-[var(--ink)] px-6 py-3.5 text-[0.8rem] font-medium uppercase tracking-[0.16em] transition hover:bg-[var(--ink)] hover:text-white sm:px-8"
              >
                Shop the warehouse ›
              </Link>
              <a
                href={PRICELESS.socials.googleMaps}
                target="_blank"
                rel="noreferrer"
                className="text-[0.8rem] font-medium uppercase tracking-[0.16em] underline-offset-[6px] hover:underline"
              >
                Open in Google Maps ›
              </a>
            </div>
          </div>
          <div className="relative min-h-[240px] bg-[var(--taupe)] sm:min-h-[320px] md:min-h-full">
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

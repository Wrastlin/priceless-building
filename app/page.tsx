import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NewsletterBar } from "@/components/newsletter-bar";
import { TrustBlock } from "@/components/trust-block";
import { BrandLogo } from "@/components/brand-logo";
import { SectionHead } from "@/components/section-head";
import { TimelineRail, type TimelineEvent } from "@/components/timeline-rail";
import { ReviewsMasonry } from "@/components/reviews-masonry";
import { CatalogBand } from "@/components/catalog-band";
import { FamilyBand } from "@/components/family-band";
import { BeforeAfterBand } from "@/components/before-after-band";
import { FacebookBand } from "@/components/facebook-band";
import { WhatToExpectBand } from "@/components/what-to-expect-band";
import { WalkthroughBand } from "@/components/walkthrough-band";
import { BrandStatement } from "@/components/brand-statement";
import { CURATED_REVIEWS } from "@/lib/reviews-data";
import { GOOGLE_RATING } from "@/lib/google-reviews";
import { ADDRESS, PRICELESS } from "@/lib/brands";
import { CATEGORIES, byCategory } from "@/lib/catalog";

const MURAL_HERO = "/real-photos/mural-wide.webp";

const TIMELINE: TimelineEvent[] = [
  {
    year: "1978",
    title: "Price-Less Building Center opens in Wausau.",
    body: "A discount and surplus building-materials warehouse on Washington Street, focused on cancelled contractor orders and factory overstock.",
    image: "/real-photos/storefront-sign-on-brick.webp",
    imageAlt: "Hand-painted PRICE-LESS BUILDING CENTER sign on the brick exterior of the original storefront.",
  },
  {
    year: "1983",
    title: "Builders Corner Cabinetry & Design founded.",
    body: "A custom cabinet shop opens in Wausau, specializing in kitchens, baths, and built-ins designed and finished locally.",
    image: "/catalog-images/PL-000404-hero.jpg",
    imageAlt: "A representative Builders Corner kitchen install.",
  },
  {
    year: "2019",
    month: "May",
    title: "A partner group acquires both businesses.",
    body: "A three-person partnership buys Price-Less Building Center and Builders Corner Cabinetry & Design. The two storefronts keep their separate identities.",
    image: "/real-photos/building-exterior.webp",
    imageAlt: "The exterior of the building that houses Price-Less and Builders Corner.",
    source: {
      label: "Read the 2021 Business News profile",
      url: "https://www.readthebusinessnews.com/features/growth_strategies/they-re-building-something/article_70b4788e-a8e3-11eb-ba26-e3a990b7c281.html",
    },
  },
  {
    year: "2023",
    month: "Jun",
    title: "The Build Your Future community mural is painted.",
    body: "Designed by Stephanie Kohli and painted by fifty volunteers from across Wausau, the mural now wraps the side of the building facing Washington Street.",
    image: "/real-photos/mural-wide.webp",
    imageAlt: "The Build Your Future mural on the side of the Price-Less Building Center.",
    source: {
      label: "Read the WSAW story",
      url: "https://www.wsaw.com/2023/06/18/new-mural-coming-downtown-wausau/",
    },
  },
  {
    year: "2025",
    month: "Apr",
    title: "First Easter Bunny visit at the storefront.",
    body: "A community day at the store, with the Easter Bunny visiting kids from across central Wisconsin. The first of what became a recurring seasonal event.",
    image: "/real-photos/community-county-fair.webp",
    imageAlt: "Kids holding a Price-Less sign at a community event.",
    source: {
      label: "Read the WSAW story",
      url: "https://www.wsaw.com/2025/04/13/easter-bunny-visits-local-wausau-business/",
    },
  },
  {
    year: "2025",
    month: "Dec",
    title: "Second annual Santa's Workshop at the showroom.",
    body: "Santa visits the Builders Corner showroom for the second year. WSAW covered both the decorations and the volunteer hours that went into setting it up.",
    image: "/real-photos/santa-at-storefront.webp",
    imageAlt: "Santa at the Price-Less storefront for the holiday workshop.",
    source: {
      label: "Read the WSAW story",
      url: "https://www.wsaw.com/2025/12/11/wausau-business-transforms-shop-into-santas-workshop/",
    },
  },
];

// JSON-LD structured data for the home page. Tells search engines and
// LLMs that this is one local business with two related departments
// (Builders Corner + Four Squared), the address, phone, hours, areas
// served, aggregated rating, and the high-level offer catalog. The
// goal is for any AI-powered or organic search for "kitchen remodel
// Wausau", "discount building materials Wisconsin", or "custom
// cabinetry Wausau" to surface Price-Less and its two sister brands
// together as the unified answer.
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
  image: "https://pricelessbuilding.com/og-image.jpg",
  logo: "https://pricelessbuilding.com/real-photos/logo-priceless-circular@2x.webp",
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
    latitude: 44.9591,
    longitude: -89.6301,
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
    "Wausau, WI",
    "Schofield, WI",
    "Weston, WI",
    "Rib Mountain, WI",
    "Rothschild, WI",
    "Mosinee, WI",
    "Marathon, WI",
    "Marathon County, WI",
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
      name: "Four Squared Construction",
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
    { "@type": "Offer", name: "Built-in cabinetry for pantries, mudrooms, and home offices" },
    { "@type": "Offer", name: "Full kitchen remodel design and installation" },
    { "@type": "Offer", name: "Bath remodel design and installation" },
    { "@type": "Offer", name: "Home renovation general contracting" },
  ],
};

export default function HomePage() {
  // Mixed product grid. Pulls 1-2 items from each category so the
  // catalog band shows real variety instead of just the first eight
  // items by id.
  const categoryKeys = Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[];
  const items = categoryKeys
    .flatMap((cat) => byCategory("priceless", cat).slice(0, 2))
    .slice(0, 12);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD) }}
      />
      <SiteHeader brand="priceless" />

      {/* HERO. Two clean columns: text on the left, looping FB video on the right */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 pt-14 pb-12 md:pt-20 md:pb-20">
          <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-7">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-[var(--muted-foreground)] md:text-lg">
                <span className="inline-flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <OpenToday />
                </span>
                <span className="hidden sm:inline text-[var(--muted-foreground)]/50">·</span>
                <span>Wausau, WI</span>
              </div>
              <h1 className="font-display mt-6 text-5xl leading-[1.05] md:text-6xl lg:text-7xl">
                Wausau&apos;s one-stop shop for materials, <span className="text-[var(--brand-priceless)]">cabinetry, and installs.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base text-[var(--foreground)] md:text-lg">
                Three local brands at 825 Washington Street since 1978. We are happy to help with anything from a single doorknob to a full kitchen — and everything in between.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Link href="/shop" className="btn btn-priceless">Shop everything</Link>
                <Link href="/reviews" className="text-base text-[var(--brand-priceless)] underline decoration-[var(--brand-priceless)]/30 underline-offset-4 hover:decoration-[var(--brand-priceless)] md:text-lg">Read our reviews →</Link>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0b1220] shadow-sm">
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/real-photos/storefront-bg-poster.jpg"
                  aria-hidden="true"
                >
                  <source src="/real-photos/storefront-bg.webm" type="video/webm" />
                  <source src="/real-photos/storefront-bg.mp4" type="video/mp4" />
                </video>
                <div className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-black/70 px-2 py-1 text-xs font-medium uppercase tracking-[0.14em] text-white">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  Live walkthrough
                </div>
              </div>
            </div>
          </div>
        </div>
        <figure className="border-t border-[var(--border)]">
          <div className="relative w-full overflow-hidden bg-[var(--muted)]">
            <Image
              src={MURAL_HERO}
              alt="Build Your Future community mural on the side of the Price-Less Building Center, painted by 50 Wausau volunteers in June 2023"
              width={2400}
              height={750}
              priority
              className="block h-auto w-full object-contain"
              sizes="100vw"
            />
          </div>
          <figcaption className="mx-auto flex max-w-7xl flex-wrap items-baseline justify-between gap-3 border-b border-[var(--border)] px-6 py-3 text-sm">
            <span className="text-[var(--muted-foreground)]">
              "Build Your Future" mural · designed by Stephanie Kohli · painted by 50 Wausau volunteers · June 2023
            </span>
            <a
              href="https://www.wsaw.com/2023/06/18/new-mural-coming-downtown-wausau/"
              target="_blank"
              rel="noreferrer"
              className="font-mono shrink-0 text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4"
            >
              WSAW story →
            </a>
          </figcaption>
        </figure>
      </section>

      {/* STATS STRIP. Only verifiable facts. Unverified numbers replaced
          with honest qualitative claims per user direction. */}
      <section className="border-b bg-[#0b1220] text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-6 py-8 md:grid-cols-4 md:gap-x-6 md:py-10">
          <NumStat n="HUGE" label="savings vs. big-box retail" />
          <NumStat n="1978" label="serving central Wisconsin since" />
          <NumStat n="4.8★" label="on Google · 9 reviews" />
          <NumStat n="MON-SAT" label="open six days a week" />
        </div>
      </section>

      {/* QUICK TRUST BAR. Real ratings + press + tenure, above the fold-ish */}
      <section className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-10 gap-y-4 px-6 py-5">
          <a
            href={PRICELESS.socials.googleMaps}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-baseline gap-2 text-sm"
          >
            <span className="text-[#f5a524]" aria-hidden>★★★★★</span>
            <span className="font-semibold text-[var(--foreground)]">{GOOGLE_RATING.average.toFixed(1)}</span>
            <span className="text-[var(--muted-foreground)]">on Google · {GOOGLE_RATING.count} reviews</span>
            <span className="text-[var(--brand-priceless)] opacity-0 transition group-hover:opacity-100">→</span>
          </a>
          <a
            href={PRICELESS.socials.facebook}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-baseline gap-2 text-sm"
          >
            <span className="text-[#f5a524]" aria-hidden>★★★★★</span>
            <span className="font-semibold text-[var(--foreground)]">5/5</span>
            <span className="text-[var(--muted-foreground)]">on Facebook</span>
          </a>
          <a
            href="https://www.wsaw.com/2023/06/18/new-mural-coming-downtown-wausau/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-baseline gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <span className="font-medium text-[var(--foreground)]">Featured by WSAW NewsChannel 7</span>
          </a>
          <span className="inline-flex items-baseline gap-2 text-sm">
            <span className="font-medium text-[var(--foreground)]">Family-owned in Wausau since 1978</span>
          </span>
        </div>
      </section>

      <CatalogBand items={items} />

      <FamilyBand />

      {/* CUSTOMER STORIES. Handwritten card + Google reviews. */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            headline="What our customers have said about us."
            sub="Every quote here is a real Google, Facebook, or Yelp review. The full set lives on the reviews page; a sample sits below."
            link={{ href: "/reviews", label: "Read all the reviews" }}
          />

          {/* Six-card subset using the same masonry treatment as the
              dedicated reviews page. */}
          <div className="mt-12">
            <ReviewsMasonry items={CURATED_REVIEWS} limit={6} />
          </div>
        </div>
      </section>

      {/* TIMELINE. Combines the old "look around 825 Washington" photo
          grid with the in-the-news press cards. One compact chronology
          of milestones from 1978 through the most recent press coverage,
          each linked to the original article. */}
      <section className="bg-[var(--muted)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            headline="What has happened along the way."
            sub="The two storefronts have a few decades of history between them, and local press has covered most of it. The milestones below link back to the original articles."
          />
          <TimelineRail events={TIMELINE} />
        </div>
      </section>


      <BeforeAfterBand />

      <FacebookBand />

      <WhatToExpectBand />

      <WalkthroughBand />

      <BrandStatement />

      {/* NEWSLETTER. Doubles as the signup hook for the upcoming
          walkthrough launch in addition to the weekly inventory drop. */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <NewsletterBar />
        </div>
      </section>

      <TrustBlock />

      <SiteFooter brand="priceless" />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-2xl text-white">{value}</div>
      <div>{label}</div>
    </div>
  );
}

function FamilyCard({
  href, logoBrand, image, imageAlt, headline, body, tags, cta,
}: {
  href: string;
  logoBrand: "priceless" | "builders" | "four-squared";
  image: string;
  imageAlt: string;
  headline: string;
  body: string;
  tags: string[];
  cta: string;
}) {
  return (
    <Link
      href={href}
      data-reveal
      className="group flex flex-col overflow-hidden border border-white/10 bg-white transition hover:border-white/30"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--muted)]">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width:768px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
          quality={80}
        />
        <div className="absolute left-4 top-4 inline-flex items-center bg-white px-3 py-2 shadow-sm">
          <BrandLogo brand={logoBrand} size="sm" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl leading-snug text-[var(--foreground)] md:text-3xl">
          {headline}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-[var(--foreground)]">
          {body}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs font-medium text-[var(--foreground)]"
            >
              {t}
            </span>
          ))}
        </div>
        <span className="font-mono mt-5 inline-block text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4">
          {cta} →
        </span>
      </div>
    </Link>
  );
}

function NumStat({ n, label, sub }: { n: string; label: string; sub?: string }) {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-4xl leading-none text-white md:text-5xl">{n}</span>
        {sub ? <span className="font-mono text-xs uppercase tracking-wider text-white/80">{sub}</span> : null}
      </div>
      <div className="mt-1 text-xs leading-snug text-white/85">{label}</div>
    </div>
  );
}

function OpenToday() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
  const todayHours = PRICELESS.hours.find((h) => h.day === today)?.hours ?? "Closed";
  if (todayHours === "Closed") {
    return <span className="text-[var(--foreground)]">Closed today · Open Mon 8:30 AM</span>;
  }
  return <span className="text-[var(--foreground)]">Open today, {todayHours}</span>;
}

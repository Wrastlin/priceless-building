import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { NewsletterBar } from "@/components/newsletter-bar";
import { TrustBlock } from "@/components/trust-block";
import { BrandLogo } from "@/components/brand-logo";
import { SectionHead } from "@/components/section-head";
import { TimelineRail, type TimelineEvent } from "@/components/timeline-rail";
import { ReviewsMasonry } from "@/components/reviews-masonry";
import { CURATED_REVIEWS } from "@/lib/reviews-data";
import { GOOGLE_RATING } from "@/lib/google-reviews";
import { ADDRESS, PRICELESS } from "@/lib/brands";
import { CATEGORIES, byBrand } from "@/lib/catalog";

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
  const items = byBrand("priceless").slice(0, 8);
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
              <div className="flex items-center gap-3 text-base text-[var(--muted-foreground)] md:text-lg">
                <span className="size-2 rounded-full bg-emerald-500" />
                <OpenToday />
                <span className="text-[var(--muted-foreground)]/50">·</span>
                <span>Wausau, WI</span>
              </div>
              <h1 className="font-display mt-6 text-5xl leading-[1.05] md:text-6xl lg:text-7xl">
                Discount building materials.<br /><span className="text-[var(--brand-priceless)]">Half off retail.</span>
              </h1>
              <p className="mt-6 max-w-md text-base text-[var(--muted-foreground)] md:text-lg">
                Same brands as the big-box stores, at warehouse prices. 825 Washington Street, Wausau.
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
                <div className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-black/70 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white">
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
              className="font-mono shrink-0 text-[11px] uppercase tracking-[0.18em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4"
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

      {/* CATEGORY STRIP. The grid is the story; the search bar sits as
          a quiet, supporting top strip so people who know what they're
          looking for can jump there without reading a paragraph first. */}
      <section className="bg-[var(--muted)]">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
          {/* Quiet eyebrow + search row. Pairs the "browse the eight
              departments" framing with a thin search input on the right
              at md+. Mobile stacks them. */}
          <div
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8"
            data-reveal
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--brand-priceless)]">
              The catalog · eight departments
            </div>
            <form
              role="search"
              action="/search"
              method="get"
              className="flex h-11 w-full items-center gap-2.5 rounded-md border border-[var(--border)] bg-white px-3.5 transition focus-within:border-[var(--brand-priceless)] hover:border-[var(--foreground)]/30 md:w-96"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-[var(--brand-priceless)]"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                name="q"
                type="search"
                placeholder="Or search doors, windows, cabinets…"
                aria-label="Search the warehouse"
                className="flex-1 min-w-0 border-0 bg-transparent p-0 text-sm font-medium text-[var(--foreground)] placeholder:font-medium placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-0 md:text-base"
              />
            </form>
          </div>

          <div className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-12">
          {(() => {
            const entries = Object.entries(CATEGORIES) as [keyof typeof CATEGORIES, (typeof CATEGORIES)[keyof typeof CATEGORIES]][];
            const [featKey, feat] = entries[0];
            const rest = entries.slice(1);
            return (
              <>
                <Link
                  href={`/shop/${featKey}`}
                  className="group relative col-span-12 block aspect-[4/3] overflow-hidden bg-black md:col-span-7 md:aspect-[16/10]"
                >
                  <Image src={feat.image} alt={feat.label} fill sizes="(min-width:768px) 60vw, 100vw" className="object-cover opacity-85 transition duration-700 group-hover:scale-105 group-hover:opacity-100" quality={75} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute left-6 right-6 bottom-6 text-white">
                    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">Department 01 / Aisle D</div>
                    <div className="font-display mt-2 text-5xl md:text-6xl">{feat.label}.</div>
                    <p className="font-serif mt-2 max-w-md text-base italic text-white/85">{feat.blurb}</p>
                  </div>
                </Link>

                <ol className="col-span-12 divide-y border-y md:col-span-5">
                  {rest.map(([key, cat], i) => (
                    <li key={key}>
                      <Link href={`/shop/${key}`} className="group flex items-center gap-5 py-4">
                        <span className="font-mono w-10 shrink-0 text-[11px] tracking-tight text-[var(--muted-foreground)]">{String(i + 2).padStart(2, "0")}</span>
                        <div className="relative aspect-square w-16 shrink-0 overflow-hidden bg-[var(--muted)]">
                          <Image src={cat.image} alt={cat.label} fill sizes="64px" className="object-cover transition duration-500 group-hover:scale-110" quality={60} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-display text-2xl leading-none">{cat.label}.</div>
                          <div className="mt-1 line-clamp-1 text-xs text-[var(--muted-foreground)]">{cat.blurb}</div>
                        </div>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--brand-priceless)] opacity-0 transition group-hover:opacity-100">Browse →</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </>
            );
          })()}
        </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS. On-the-floor catalog showcase. Sits right
          after the catalog browse + search so people land on real items
          fast. Bg switches back to white now that the standalone search
          section between Categories and Featured has been folded into
          the Categories section above. */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            headline="Some of what is on the floor right now."
            sub="A small sample. The full set lives on the shop page; come walk the warehouse for everything else."
            link={{ href: "/shop", label: "Shop all products" }}
          />
          <div className="mt-10 grid grid-cols-1 gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
            {items.map((it) => <ProductCard key={it.id} item={it} />)}
          </div>
        </div>
      </section>

      {/* THREE-BRAND CALLOUT. Moved earlier so the brand spectrum
          (discount → premier → install) is visible before the social
          proof and history sections. Dark band makes the logos pop and
          gives the page its second anchor after the stat strip. */}
      <section className="bg-[#0b1220] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            align="center"
            invert
            headline="Three different ways to get a project done."
            sub="Most people come for the discount surplus at Price-Less. Some go premier and have Builders Corner design the cabinetry custom. Others hand the whole project to the Four Squared install crew. Each one runs on its own."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <BrandCard
              href="/shop"
              logoBrand="priceless"
              image="/real-photos/storefront-signage.webp"
              imageAlt="The Price-Less Building Center storefront on Washington Street"
              headline="Affordable, brand-new building materials."
              body="A surprisingly cool, wide-open warehouse of doors, windows, cabinets, vanities, hardware, and trim. Same factories as the big-box stores, usually for about half retail. Worth a walk through even if you are just looking for ideas."
              cta="Shop the surplus floor"
            />
            <BrandCard
              href="/builders-corner"
              logoBrand="builders"
              image="/catalog-images/PL-000404-hero.jpg"
              imageAlt="A finished Builders Corner showroom kitchen in white shaker with island and quartz"
              headline="Premier custom cabinetry, designed in Wausau."
              body="The premium side. If you want a kitchen, bath, or built-in designed and built specifically for your house, this is the shop. We measure at your place, draw the room, walk you through finish samples, and build the cabinets locally. Custom installs handled by Four Squared."
              cta="Visit the cabinet showroom"
            />
            <BrandCard
              href="/four-squared"
              logoBrand="four-squared"
              image="/real-photos/install-kitchen-walnut-island-windows.webp"
              imageAlt="A finished walnut kitchen installed by the Four Squared crew, with island, windows, and pendant lights"
              headline="A professional install crew."
              body="An independent finish-carpentry and install company. They handle demo, plumbing, electrical, tile, and trim — start to final walkthrough. They install Builders Corner cabinetry, and they install anything you bring home from Price-Less."
              cta="Meet the install crew"
            />
          </div>
        </div>
      </section>

      {/* BC FEATURE BAND. Goes deeper into Builders Corner specifically
          right after the three-brand row introduces all three. Uses
          the same Price-Less type system as the rest of the home so
          the premium feel comes from the photo + copy + service framing,
          not from a parallel typography world. */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
            <figure className="md:col-span-6" data-reveal>
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--muted)]">
                <Image
                  src="/real-photos/install-kitchen-walnut-island-bar.webp"
                  alt="A premium Builders Corner kitchen with walnut shaker cabinetry, island bar, and pendant lighting."
                  fill
                  sizes="(min-width:768px) 50vw, 100vw"
                  className="object-cover"
                  quality={82}
                />
              </div>
            </figure>
            <div className="md:col-span-6" data-reveal data-reveal-delay="0.08">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--brand-priceless)]">
                The premium side
              </div>
              <h2 className="font-display mt-4 text-[clamp(2rem,1.4rem+3vw,3.5rem)] leading-[1.05]">
                When the surplus floor isn&apos;t the <span className="text-[var(--brand-priceless)]">project.</span>
              </h2>
              <p className="mt-5 text-lg leading-[1.7] text-[var(--foreground)] md:text-xl">
                <span className="font-semibold">Builders Corner</span> is our premium custom cabinet shop next door. Kitchens, baths, and built-ins designed in the showroom and built in our own shop in Wausau. Installed by the Four Squared crew.
              </p>
              <p className="mt-4 text-base leading-[1.7] text-[var(--muted-foreground)] md:text-lg">
                Same building. Different tier. Style and class at every price point.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link
                  href="/builders-corner"
                  className="btn btn-priceless"
                >
                  Read the Builders Corner story →
                </Link>
                <Link
                  href="/four-squared"
                  className="text-base font-semibold text-[var(--brand-priceless)] underline decoration-[var(--brand-priceless)]/30 decoration-2 underline-offset-4 hover:decoration-[var(--brand-priceless)] md:text-lg"
                >
                  Meet the install crew →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUR SQUARED SERVICES. Service cards on a dark band, parallel
          to the BC feature band above. Six image cards spell out what
          the install crew actually does so people don't have to guess. */}
      <section className="bg-[#0a0e14] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            invert
            accent="emerald"
            headline="Need it installed? We do that too."
            sub="Four Squared is the install crew. Whether you bought materials at Price-Less or had cabinets built at Builders Corner, the same crew handles demo through the final walkthrough."
          />

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                t: "Kitchen remodels",
                b: "Cabinets, counters, tile, plumbing, electrical. Start to walkthrough.",
                img: "/real-photos/install-kitchen-white-open.webp",
                alt: "A finished kitchen install with white shaker cabinets and island.",
              },
              {
                t: "Bath remodels",
                b: "Vanities, tile showers, fixtures, trim. Demo, install, and finish.",
                img: "/real-photos/install-bathroom-shaker.webp",
                alt: "A finished bathroom install with shaker vanity and matte black fixtures.",
              },
              {
                t: "Cabinet installation",
                b: "Custom cabinets from Builders Corner or anything you bring on your own.",
                img: "/real-photos/install-kitchen-walnut-marble.webp",
                alt: "A walnut shaker kitchen with white marble counter.",
              },
              {
                t: "Built-ins and millwork",
                b: "Pantries, mudrooms, bookshelves, office walls, laundry runs.",
                img: "/real-photos/install-kitchen-floating-shelf-bowls.webp",
                alt: "A custom built-in shelf with bowls and storage.",
              },
              {
                t: "Tile and finish work",
                b: "Subway, mosaic, large-format. Backsplashes, showers, full-room floors.",
                img: "/real-photos/install-bathroom-blue-tile-shower.webp",
                alt: "A blue subway-tile shower with frameless glass and marble pebble pan.",
              },
              {
                t: "Doors and windows",
                b: "Interior, exterior, French entries. Install only or supplied from Price-Less.",
                img: "/real-photos/install-french-doors-exterior.webp",
                alt: "A pair of white French entry doors on a brick exterior.",
              },
            ].map((s, i) => (
              <article
                key={s.t}
                data-reveal
                data-reveal-delay={((i % 3) * 0.06).toFixed(2)}
                className="group overflow-hidden border border-white/10 bg-white/[0.03] transition hover:border-emerald-400/60"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                  <Image
                    src={s.img}
                    alt={s.alt}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover opacity-90 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
                    quality={78}
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl leading-snug text-white md:text-2xl">
                    {s.t}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">
                    {s.b}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8" data-reveal>
            <p className="max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              Free estimate on any of the above. Same phone as Price-Less, same parking lot as Builders Corner.
            </p>
            <Link
              href="/four-squared"
              className="font-mono inline-flex text-[11px] uppercase tracking-[0.22em] text-emerald-300 underline decoration-2 underline-offset-4 hover:text-emerald-200"
            >
              See the install crew →
            </Link>
          </div>
        </div>
      </section>

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


      {/* BEFORE/AFTER. Install pair on a dark anchor band so the kitchen
          photos read like a portfolio spread. */}
      <section className="bg-[#0b1220] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            invert
            headline="Before and after."
            link={{ href: "/four-squared", label: "Meet the install crew" }}
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <figure>
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0b1220]">
                <Image
                  src="/real-photos/install-kitchen-white-open.webp"
                  alt="A finished real kitchen install: white shaker cabinetry, island, vent hood, LVP floor"
                  fill
                  sizes="(min-width:768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 flex items-baseline gap-2 text-sm">
                <span className="font-semibold uppercase tracking-[0.22em] text-[#ff8b85]">After</span>
                <span className="text-white/70">Finished install by the Four Squared crew.</span>
              </figcaption>
            </figure>
            <figure>
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0b1220]">
                <Image
                  src="/real-photos/install-before-kitchen.webp"
                  alt="A real Wausau kitchen mid-install: white shaker uppers in, kraft paper on the counters, painter's tape edging the floor"
                  fill
                  sizes="(min-width:768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 flex items-baseline gap-2 text-sm">
                <span className="font-semibold uppercase tracking-[0.22em] text-white/55">Mid-install</span>
                <span className="text-white/70">Paper down, tape up, new shaker uppers going in.</span>
              </figcaption>
            </figure>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
            <div className="text-sm text-white/65">
              The surplus floor changes often. Come walk it any day we are open.
            </div>
            <Link href="/shop" className="btn btn-priceless">Shop all products →</Link>
          </div>
        </div>
      </section>

      {/* LATEST FROM FACEBOOK. Compact 2-col block: live Page Plugin on the
          left, short paragraph + social outbound links on the right. Sits
          just above the WHY callout so it acts as a live-pulse signal. */}
      <section className="bg-[var(--muted)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            headline="What we have been up to this week."
            sub="Our Facebook page is the most current view of what is going on at the store. New stock photos, holiday hours, customer thank-you cards, mural updates. We post a few times a week."
          />
          <div className="mt-12 grid items-start gap-10 md:grid-cols-12">
            <div className="flex justify-center md:col-span-6 md:justify-end">
              <div className="w-full max-w-[500px] overflow-hidden border border-[var(--border)] bg-white">
                <iframe
                  src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
                    PRICELESS.socials.facebook,
                  )}&tabs=timeline&width=500&height=700&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
                  className="block h-[600px] w-full sm:h-[680px] md:h-[700px]"
                  style={{ border: 0 }}
                  scrolling="no"
                  allow="encrypted-media"
                  loading="lazy"
                  title="Price-Less Building Center on Facebook"
                />
              </div>
            </div>
            <div className="md:col-span-6">
              <p className="text-base leading-relaxed text-[var(--foreground)] md:text-lg">
                If you would rather follow along between visits, the easiest way is one of the platforms below. Yelp is mostly older reviews; Instagram and Facebook get the day-to-day photos.
              </p>
              <div className="mt-8 flex flex-col gap-4">
                <a
                  href={PRICELESS.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono inline-flex w-fit items-center border border-[var(--border)] bg-white px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] hover:bg-[var(--muted)]"
                >
                  Follow on Facebook →
                </a>
                <a
                  href={PRICELESS.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono inline-flex w-fit items-center border border-[var(--border)] bg-white px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] hover:bg-[var(--muted)]"
                >
                  Follow on Instagram →
                </a>
                <a
                  href={PRICELESS.socials.yelp}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono inline-flex w-fit items-center border border-[var(--border)] bg-white px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] hover:bg-[var(--muted)]"
                >
                  Read us on Yelp →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT TO EXPECT. Replaces the old 3-card grid of choppy fragments
          with three image cards. Each card uses a real photo so the cards
          differentiate visually, and the copy reads as plain prose. */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            headline="A few things worth knowing before you visit."
            sub="We have built this place to be welcoming to anyone looking to liven up their home, at any price range. Here is what is actually going on inside the warehouse."
          />

          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                src: "/real-photos/storefront-sign-on-brick.webp",
                alt: "Hand-painted Price-Less sign on the brick exterior",
                t: "The inventory",
                b: "Brand-new in-the-box stock from cancelled contractor orders, mis-shipments, and factory overstock. Same brands as the big-box stores.",
              },
              {
                src: "/real-photos/storefront-signage.webp",
                alt: "Storefront sign with everyday pricing",
                t: "The pricing",
                b: "Every tag shows our price next to current retail at Home Depot, Lowe's, or Menards. Bring your phone and check.",
              },
              {
                src: "/real-photos/building-exterior.webp",
                alt: "825 Washington Street, Wausau",
                t: "Where to find us",
                b: "825 Washington Street, Wausau. In the same building since 1978. Open Monday through Saturday.",
              },
            ].map((c, i) => (
              <li
                key={c.t}
                data-reveal
                data-reveal-delay={(i * 0.06).toFixed(2)}
                className="overflow-hidden border border-[var(--border)] bg-white"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--muted)]">
                  <Image
                    src={c.src}
                    alt={c.alt}
                    fill
                    sizes="(min-width:768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl leading-snug">{c.t}</h3>
                  <p className="mt-3 text-base leading-relaxed text-[var(--foreground)]">{c.b}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-5 border-t border-[var(--border)] pt-10">
            <Link href="/shop" className="btn btn-priceless">Shop everything →</Link>
            <Link href="/reviews" className="text-base text-[var(--brand-priceless)] underline decoration-[var(--brand-priceless)]/30 underline-offset-4 hover:decoration-[var(--brand-priceless)] md:text-lg">
              Read our 9 Google reviews
            </Link>
          </div>
        </div>
      </section>

      {/* DESIGN WALKTHROUGH. Light band so the step text is comfortable
          to read. The closing brand statement lives in its own dark
          band right after so the contrast actually pops. */}
      <section id="design-walkthrough" className="bg-[var(--muted)] scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            headline="See it in your home before you buy it."
            sub="A walkthrough we are putting together. Photo of your space, the pieces you want, the colors, a render in the same photo, real pricing."
          />

          <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-14">
            <ol className="md:col-span-7">
              {[
                { n: "01", t: "Take a photo.", b: "Wall, room, doorway, or the front of the house." },
                { n: "02", t: "Pick what you want.", b: "Door, window, vanity, cabinet, siding, shelf, trim." },
                { n: "03", t: "Choose colors with us.", b: "Real swatches, side by side, before anything renders." },
                { n: "04", t: "See it in the photo.", b: "A full render placed into the picture you took." },
                { n: "05", t: "Get the price.", b: "Items we actually carry, with the cost next to each one." },
              ].map((s, i) => (
                <li
                  key={s.n}
                  data-reveal
                  data-reveal-delay={(i * 0.06).toFixed(2)}
                  className="grid grid-cols-[56px_1fr] items-start gap-x-5 border-b border-[var(--border)] py-5 first:pt-0 last:border-b-0 last:pb-0 md:grid-cols-[80px_1fr] md:gap-x-8 md:py-6"
                >
                  <div className="font-display text-3xl leading-none text-[var(--brand-priceless)] md:text-4xl">
                    {s.n}
                  </div>
                  <div>
                    <h3 className="font-display text-xl leading-snug md:text-2xl">{s.t}</h3>
                    <p className="mt-1.5 text-base leading-relaxed text-[var(--foreground)]">{s.b}</p>
                  </div>
                </li>
              ))}
            </ol>

            <figure className="md:col-span-5" data-reveal data-reveal-delay="0.12">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-white">
                <Image
                  src="/real-photos/install-kitchen-walnut-island-windows.webp"
                  alt="A finished walnut kitchen install."
                  fill
                  sizes="(min-width:768px) 42vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
                A finished install. The walkthrough lets you preview something like this in your own room first.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* BRAND STATEMENT. One sentence on a dark band, the focus is
          all on the message. Sits between the walkthrough body and the
          newsletter signup so the visual rhythm is: light explainer →
          dark statement → red call to action. */}
      <section className="bg-[#0b1220] text-white">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-28" data-reveal>
          <p className="font-display text-3xl leading-tight md:text-5xl">
            Style and class at <span className="text-[#ff8b85]">every</span> price point.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            We pride ourselves on being affordable to anyone looking to liven up their home, and we try to make the rest of it as easy as possible.
          </p>
        </div>
      </section>

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

function BrandCard({
  href, logoBrand, image, imageAlt, headline, body, cta,
}: {
  href: string;
  logoBrand: "priceless" | "builders" | "four-squared";
  image: string;
  imageAlt: string;
  headline: string;
  body: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      data-reveal
      className="group flex flex-col overflow-hidden border border-white/10 bg-white transition hover:border-white/30"
    >
      {/* PHOTO with logo chip in upper-left. The chip is a white pad
          around the brand mark so it stays legible over any photo. */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width:768px) 33vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
          quality={78}
        />
        <div className="absolute left-4 top-4 inline-flex items-center bg-white px-3 py-2 shadow-sm">
          <BrandLogo brand={logoBrand} size="sm" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl leading-snug text-[var(--foreground)] md:text-[1.625rem]">
          {headline}
        </h3>
        <p className="mt-3 flex-1 text-base leading-relaxed text-[var(--muted-foreground)]">
          {body}
        </p>
        <span className="font-mono mt-5 inline-block text-[11px] uppercase tracking-[0.22em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4">
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
        {sub ? <span className="font-mono text-xs uppercase tracking-wider text-white/60">{sub}</span> : null}
      </div>
      <div className="mt-1 text-xs leading-snug text-white/70">{label}</div>
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

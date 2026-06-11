import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NewsletterBar } from "@/components/newsletter-bar";
import { TrustBlock } from "@/components/trust-block";
import { SectionHead } from "@/components/section-head";
import { TimelineRail, type TimelineEvent } from "@/components/timeline-rail";
import { HomeHero } from "@/components/home-hero";
import { StatsStrip } from "@/components/stats-strip";
import { CatalogBand } from "@/components/catalog-band";
import { FamilyBand } from "@/components/family-band";
import { CustomerReviewsBand } from "@/components/customer-reviews-band";
import { WarehouseGallery } from "@/components/warehouse-gallery";
import { BeforeAfterBand } from "@/components/before-after-band";
import { FacebookBand } from "@/components/facebook-band";
import { WalkthroughBand } from "@/components/walkthrough-band";
import { BrandStatement } from "@/components/brand-statement";
import { GOOGLE_RATING } from "@/lib/google-reviews";
import { ADDRESS, PRICELESS } from "@/lib/brands";
import { CATEGORIES, byCategory } from "@/lib/catalog";

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

export default async function HomePage() {
  // Mixed product grid. Pulls 1-2 items from each category so the
  // catalog band shows real variety instead of just the first eight
  // items by id.
  const categoryKeys = Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[];
  const perCategory = await Promise.all(
    categoryKeys.map((cat) => byCategory("priceless", cat)),
  );
  const items = perCategory.flatMap((list) => list.slice(0, 2)).slice(0, 12);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD) }}
      />
      <SiteHeader brand="priceless" />

      <HomeHero />

      <StatsStrip />

      <CatalogBand items={items} />

      <FamilyBand />

      <CustomerReviewsBand />

      {/* TIMELINE. Replaces the old separate "around 825 Washington"
          photo grid + press cards with one chronology. */}
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

      <WarehouseGallery />

      <FacebookBand />

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

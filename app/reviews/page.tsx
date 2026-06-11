import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ReviewsMasonry } from "@/components/reviews-masonry";
import { CURATED_REVIEWS } from "@/lib/reviews-data";
import { GOOGLE_RATING } from "@/lib/google-reviews";

const HERO = "/real-photos/community-county-fair.webp";
const SITE_URL = "https://pricelessbuilding.com";

export const metadata: Metadata = {
  title: `Customer Reviews · ${GOOGLE_RATING.average}★ on Google · Price-Less Building Center Wausau, WI`,
  description: `Real Google, Facebook, and Yelp reviews from Price-Less Building Center customers in Wausau, Wisconsin. ${GOOGLE_RATING.average} stars across ${GOOGLE_RATING.count} Google reviews. Surplus building materials, custom cabinetry, install crew.`,
  alternates: { canonical: `${SITE_URL}/reviews` },
  openGraph: {
    type: "website",
    title: `Customer Reviews · ${GOOGLE_RATING.average}★ · Price-Less Building Center`,
    description: `Real reviews from customers in Wausau, WI.`,
    url: `${SITE_URL}/reviews`,
    images: [{ url: "/og-mural.jpg", width: 1200, height: 512 }],
  },
};

const REVIEWS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}#org`,
  name: "Price-Less Building Center",
  url: SITE_URL,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: GOOGLE_RATING.average,
    reviewCount: GOOGLE_RATING.count,
    bestRating: 5,
    worstRating: 1,
  },
  review: CURATED_REVIEWS.slice(0, 12).map((r) => ({
    "@type": "Review",
    reviewRating: { "@type": "Rating", ratingValue: r.stars, bestRating: 5 },
    author: { "@type": "Person", name: r.name },
    reviewBody: r.body,
    publisher: { "@type": "Organization", name: r.source },
  })),
};

export default function ReviewsPage() {
  const avg = (
    CURATED_REVIEWS.reduce((s, r) => s + r.stars, 0) / CURATED_REVIEWS.length
  ).toFixed(1);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(REVIEWS_JSON_LD) }}
      />
      <SiteHeader brand="priceless" />

      {/* HERO */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0">
          <Image
            src={HERO}
            alt="Customers at the shop counter"
            fill
            priority
            className="object-cover"
            quality={75}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-20 text-white md:py-28">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs uppercase tracking-wider backdrop-blur">
            What our customers say
          </div>
          <h1 className="font-display mt-5 max-w-3xl text-5xl leading-[1.05] md:text-7xl">
            Reviews from real customers.
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-white/90">
            <div className="flex items-center gap-2 text-2xl">
              <span className="text-amber-400">★★★★★</span>
              <span className="font-display">{avg}/5</span>
            </div>
            <div>Google · Facebook · Yelp</div>
          </div>
          <p className="mt-5 max-w-xl text-sm text-white/80">
            Every review on this page is real, pulled from the public review
            platforms below with attribution. We do not publish testimonials we
            cannot point to.
          </p>
        </div>
      </section>

      {/* MASONRY GRID */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <ReviewsMasonry items={CURATED_REVIEWS} />
      </section>

      {/* LEAVE A REVIEW */}
      <section className="border-t bg-[var(--brand-priceless-dark)] py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/85">
            Bought from us recently?
          </div>
          <h2 className="font-display mt-2 text-4xl md:text-5xl">Leave us a review.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/85">
            Word of mouth keeps the lights on. If we did right by you, a couple
            of sentences on any of the platforms below means the world to us.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://www.google.com/search?q=Price-Less+Building+Center+Wausau"
              target="_blank"
              rel="noreferrer"
              className="btn bg-white text-[var(--brand-priceless)]"
            >
              Review on Google
            </a>
            <a
              href="https://www.facebook.com/p/Price-Less-Building-Center-100057337665027/"
              target="_blank"
              rel="noreferrer"
              className="btn bg-white text-[var(--brand-priceless)]"
            >
              Review on Facebook
            </a>
            <a
              href="https://www.yelp.com/biz/price-less-building-center-wausau"
              target="_blank"
              rel="noreferrer"
              className="btn bg-white text-[var(--brand-priceless)]"
            >
              Review on Yelp
            </a>
          </div>
          <div className="mt-8">
            <Link href="/contact" className="text-sm underline">
              Or send us a private note →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}

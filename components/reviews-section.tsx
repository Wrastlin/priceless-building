import Link from "next/link";
import { ReviewsMasonry } from "@/components/reviews-masonry";
import { CURATED_REVIEWS } from "@/lib/reviews-data";
import { GOOGLE_RATING } from "@/lib/google-reviews";
import { PRICELESS } from "@/lib/brands";

/**
 * Consolidated reviews section. Replaces BOTH the old CustomerReviewsBand
 * (a 6-quote masonry) AND the review half of TrustBlock (rating + 7 more
 * quotes) with one block: the rating + source links + a 6-quote wall +
 * a link to the full reviews page. The map / hours / address that used to
 * live in TrustBlock move to a separate "Visit us" block (not reviews).
 */
function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span role="img" aria-label={`${value.toFixed(1)} out of 5 stars`} className="inline-flex items-center gap-px text-lg text-[#f5a524]">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < full || (i === full && half);
        return <span key={i} className={filled ? "" : "text-[var(--muted-foreground)]/40"} aria-hidden>★</span>;
      })}
    </span>
  );
}

function SourceLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-mono inline-flex items-center border border-[var(--border)] bg-white px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--foreground)] hover:bg-[var(--muted)]"
    >
      {label} →
    </a>
  );
}

export function ReviewsSection() {
  return (
    <section className="border-y bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
              Real store. Real reviews.
            </div>
            <h2 className="font-display mt-3 text-4xl leading-[1.04] md:text-5xl">
              What our customers say<span className="text-[var(--brand-priceless)]">.</span>
            </h2>
            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="font-display text-4xl leading-none">{GOOGLE_RATING.average.toFixed(1)}</span>
              <Stars value={GOOGLE_RATING.average} />
              <span className="text-sm text-[var(--muted-foreground)]">
                {GOOGLE_RATING.count} Google reviews · 5/5 on Facebook
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SourceLink href={PRICELESS.socials.googleMaps} label="Google" />
            <SourceLink href={PRICELESS.socials.yelp} label="Yelp" />
            <SourceLink href={PRICELESS.socials.facebook} label="Facebook" />
          </div>
        </div>

        <div className="mt-10">
          <ReviewsMasonry items={CURATED_REVIEWS} limit={6} />
        </div>

        <Link
          href="/reviews"
          className="font-mono mt-8 inline-flex items-center text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4"
        >
          Read all the reviews →
        </Link>
      </div>
    </section>
  );
}

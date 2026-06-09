import Link from "next/link";
import { ADDRESS, PRICELESS } from "@/lib/brands";
import { fetchReviews, GOOGLE_RATING, type Review } from "@/lib/google-reviews";

/**
 * Trust block. Real address, Google Maps embed of the storefront, live
 * customer reviews (pulled from the Google Places API when configured,
 * with a fallback curated set captured from public Yelp + Facebook
 * listings), hours, and overflow review tiles.
 *
 * The Facebook Page Plugin iframe lives in its own dedicated section
 * above the WHY block on app/page.tsx (moved 2026-06-08); it is no
 * longer rendered inside TrustBlock to avoid duplication.
 *
 * The map iframe uses Google's no-key embed URL.
 * Real Google Reviews via Places API kick in when GOOGLE_PLACES_API_KEY
 * and GOOGLE_PLACES_ID env vars are set, see lib/google-reviews.ts.
 */

const mapsQuery = encodeURIComponent(
  `Price-Less Building Center, ${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.state}`,
);
const mapsEmbed = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
const directions = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;

export async function TrustBlock() {
  const REVIEWS = await fetchReviews();
  return (
    <section id="trust" className="border-y bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
              Real store. Real reviews.
            </div>
            <h2 className="font-display mt-3 text-5xl leading-[1.05] md:text-6xl">
              We've been here{" "}
              <span className="text-[var(--brand-priceless)]">since 1978</span>.
            </h2>
            <div className="mt-5 flex flex-wrap items-baseline gap-3 text-base text-[var(--foreground)] md:text-lg">
              <span className="font-display text-4xl leading-none">{GOOGLE_RATING.average.toFixed(1)}</span>
              <Stars value={GOOGLE_RATING.average} />
              <span className="text-[var(--muted-foreground)]">
                {GOOGLE_RATING.count} Google reviews · 5/5 on Facebook
              </span>
            </div>
            <p className="mt-5 max-w-xl text-base text-[var(--muted-foreground)] md:text-lg">
              {ADDRESS.street} in Wausau. Open Mon through Sat. Family owned.
              Read what our customers say, then come see the warehouse for
              yourself.
            </p>
          </div>
          <div className="md:col-span-5 md:justify-self-end">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={PRICELESS.socials.googleMaps}
                target="_blank"
                rel="noreferrer"
                className="font-mono inline-flex items-center gap-2 border border-[var(--border)] bg-white px-4 py-2 text-xs uppercase tracking-[0.14em] text-[var(--foreground)] hover:bg-[var(--muted)]"
              >
                See reviews on Google →
              </a>
              <a
                href={PRICELESS.socials.yelp}
                target="_blank"
                rel="noreferrer"
                className="font-mono inline-flex items-center gap-2 border border-[var(--border)] bg-white px-4 py-2 text-xs uppercase tracking-[0.14em] text-[var(--foreground)] hover:bg-[var(--muted)]"
              >
                Yelp →
              </a>
              <a
                href={PRICELESS.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="font-mono inline-flex items-center gap-2 border border-[var(--border)] bg-white px-4 py-2 text-xs uppercase tracking-[0.14em] text-[var(--foreground)] hover:bg-[var(--muted)]"
              >
                Facebook →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-12">
          {/* Map */}
          <div className="md:col-span-7">
            <div className="aspect-[4/3] overflow-hidden border border-[var(--border)] md:aspect-[16/10]">
              <iframe
                src={mapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title="Price-Less Building Center on Google Maps"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <div className="font-display text-2xl leading-tight">
                  {ADDRESS.street}, {ADDRESS.city}, {ADDRESS.state} {ADDRESS.zip}
                </div>
                <div className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Free parking in the lot behind the building. Loading dock on
                  the south side for pickups.
                </div>
              </div>
              <a
                href={directions}
                target="_blank"
                rel="noreferrer"
                className="font-mono inline-flex shrink-0 items-center text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4"
              >
                Get directions →
              </a>
            </div>
          </div>

          {/* Reviews */}
          <div className="md:col-span-5">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              What customers say
            </div>
            <ul className="mt-4 space-y-6">
              {REVIEWS.slice(0, 3).map((r, i) => (
                <li key={i} className="border-l-2 border-[var(--brand-priceless)] pl-5">
                  {r.rating ? <Stars value={r.rating} size="sm" /> : null}
                  <p className="mt-2 text-base leading-relaxed text-[var(--foreground)]">
                    &ldquo;{r.quote}&rdquo;
                  </p>
                  <div className="mt-2 flex flex-wrap items-baseline gap-2 text-xs text-[var(--muted-foreground)]">
                    <span className="font-medium text-[var(--foreground)]">{r.author ?? "Customer"}</span>
                    <span>·</span>
                    <span>{r.source}{r.relative ? ` · ${r.relative}` : ""}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              href="/reviews"
              className="font-mono mt-6 inline-flex items-center text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4"
            >
              Read more reviews →
            </Link>

            <div className="mt-10 border-t border-[var(--border)] pt-6">
              <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                Hours
              </div>
              <ul className="mt-3 divide-y divide-[var(--border)]/60">
                {PRICELESS.hours.map((h) => (
                  <li
                    key={h.day}
                    className="flex items-baseline justify-between py-2 text-sm"
                  >
                    <span className="font-medium">{h.day}</span>
                    <span className="text-[var(--muted-foreground)]">{h.hours}</span>
                  </li>
                ))}
              </ul>
              <a
                href={`tel:+1${ADDRESS.phone.replace(/[^0-9]/g, "")}`}
                className="font-mono mt-5 inline-flex items-center text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4"
              >
                Call {ADDRESS.phone}
              </a>
            </div>

            {/* Project CTA. Fills the desktop whitespace under the hours
                and cross-links to the design walkthrough section on the
                home page. */}
            <div className="mt-10 border border-[var(--brand-priceless)] bg-white p-6">
              <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
                Have a project in mind?
              </div>
              <p className="mt-2 text-base leading-relaxed text-[var(--foreground)]">
                We are putting together a step-by-step walkthrough that lets you take a photo of the space, pick out the pieces, and see the finished room before any of it leaves the warehouse.
              </p>
              <Link
                href="/#design-walkthrough"
                className="font-mono mt-4 inline-flex items-center text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4"
              >
                See how it works →
              </Link>
            </div>
          </div>
        </div>

        {/* More customer quotes (Facebook feed lives above the WHY section
            on the home page; we keep just the map, reviews, hours, and the
            overflow tiles here). */}
        {REVIEWS.length > 3 ? (
          <div className="mt-14 border-t border-[var(--border)] pt-10">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              More from our customers
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {REVIEWS.slice(3, 7).map((r, i) => (
                <div key={i} className="bg-[var(--muted)] p-6">
                  {r.rating ? <Stars value={r.rating} size="sm" /> : null}
                  <p className="mt-2 text-base leading-relaxed text-[var(--foreground)]">
                    &ldquo;{r.quote}&rdquo;
                  </p>
                  <div className="mt-3 flex flex-wrap items-baseline gap-2 text-xs text-[var(--muted-foreground)]">
                    <span className="font-medium text-[var(--foreground)]">{r.author ?? "Customer"}</span>
                    <span>·</span>
                    <span>{r.source}{r.relative ? ` · ${r.relative}` : ""}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Stars({ value, size = "md" }: { value: number; size?: "sm" | "md" }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const px = size === "sm" ? "text-sm" : "text-lg";
  return (
    <span aria-label={`${value.toFixed(1)} out of 5 stars`} className={`inline-flex items-center gap-px text-[#f5a524] ${px}`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <span key={i} className={filled ? "" : "text-[var(--muted-foreground)]/40"} aria-hidden>
            ★
          </span>
        );
      })}
    </span>
  );
}

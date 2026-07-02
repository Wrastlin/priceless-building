import Image from "next/image";
import Link from "next/link";
import { SectionHead } from "@/components/section-head";
import { ClosureNotices } from "@/components/closure-notices";
import { PRICELESS } from "@/lib/brands";
import { upcomingNotices } from "@/lib/announcements";

/**
 * "Around the store" — the reliable, never-blank replacement for the live
 * Facebook feed.
 *
 * The live Facebook Page Plugin was pulled because it (a) renders as a blank
 * white box whenever a browser blocks third-party cookies (common on phones,
 * so shoppers could miss a holiday closure) and (b) loads Facebook's JS SDK,
 * which spams the console. In its place:
 *   - an "Hours & holiday closures" panel driven by our own data
 *     (lib/announcements.ts) so store closures always show, and
 *   - a grid of real store photos that links out to the Facebook page.
 *
 * `showHours={false}` drops the weekly-hours mini-list (use it on /contact,
 * which already prints the full hours table) while keeping the closures
 * callout, photos, and follow links.
 */
const RECENT = [
  { src: "/real-photos/santa-at-storefront.webp", alt: "Santa visiting the Builders Corner showroom during the holiday workshop." },
  { src: "/real-photos/mural-wide.webp", alt: "The Build Your Future community mural on the side of the building." },
  { src: "/real-photos/community-county-fair.webp", alt: "Kids holding a Price-Less sign at a community event." },
  { src: "/real-photos/paint-day-rainbow.webp", alt: "Volunteers at the Price-Less Paint Day mural event." },
  { src: "/real-photos/grocery-giveaway-waow.webp", alt: "A grocery giveaway hosted at the store, covered by WAOW." },
  { src: "/real-photos/anniversary-6-year.webp", alt: "Six-year anniversary celebration at Price-Less Building Center." },
];

function FacebookGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

export function FacebookBand({ showHours = true }: { showHours?: boolean }) {
  // Build-time filtered list for the static HTML; the client island re-filters
  // against the visitor's clock so a finished closure drops on its own.
  const initialNotices = upcomingNotices();

  return (
    <section id="around" className="border-y bg-[var(--muted)]/40">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <SectionHead
          kicker="Hours · closures · what's new"
          headline="Around the store."
          sub="Holiday hours and closures go up here first, so you always know before you drive over. We post the day-to-day photos to Facebook and Instagram too."
        />

        <div className="mt-10 grid items-start gap-8 md:grid-cols-12 md:gap-10">
          {/* HOURS + HOLIDAY CLOSURES — our own data, never blank. */}
          <div className="md:col-span-5">
            <div className="rounded-lg border border-[var(--border)] bg-white p-6 md:p-7">
              <ClosureNotices initial={initialNotices} />

              {showHours ? (
                <ul className="mt-5 space-y-1.5 border-t border-[var(--border)] pt-5 text-sm">
                  {PRICELESS.hours.map((h) => (
                    <li key={h.day} className="flex items-center justify-between">
                      <span className="text-[var(--muted-foreground)]">{h.day}</span>
                      <span className={h.hours === "Closed" ? "text-[var(--muted-foreground)]" : "font-medium text-[var(--foreground)]"}>
                        {h.hours}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <Link
                href="/contact#hours"
                className="font-mono mt-6 inline-flex text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4"
              >
                Full hours &amp; directions →
              </Link>
            </div>
          </div>

          {/* LATEST FROM FACEBOOK — real photos, links out to the page. */}
          <div className="md:col-span-7">
            <div className="mb-3 flex items-center gap-2 text-[var(--foreground)]">
              <FacebookGlyph className="size-5 text-[#1877F2]" />
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                Latest from our Facebook
              </span>
            </div>
            <a
              href={PRICELESS.socials.facebook}
              target="_blank"
              rel="noreferrer"
              className="group grid grid-cols-3 gap-2"
              aria-label="See more on the Price-Less Building Center Facebook page"
            >
              {RECENT.map((p) => (
                <span key={p.src} className="relative block aspect-square overflow-hidden bg-[var(--muted)]">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(min-width:768px) 20vw, 30vw"
                    quality={70}
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                </span>
              ))}
            </a>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={PRICELESS.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#1877F2] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f66d0]"
              >
                <FacebookGlyph className="size-4" />
                Follow on Facebook
              </a>
              <a
                href={PRICELESS.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-md border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--brand-priceless)]"
              >
                Instagram →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

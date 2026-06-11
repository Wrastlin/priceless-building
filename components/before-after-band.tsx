import Link from "next/link";
import { SectionHead } from "@/components/section-head";
import { PortfolioFlip, type PortfolioPhoto } from "@/components/portfolio-flip";
import { photosBy } from "@/lib/business-photos";

/**
 * Dynamic install portfolio. Dark heading band sits on a contrasting
 * strip up top; the photo grid lives on white below. Tiles flip on a
 * stagger so the page has constant gentle motion without being
 * distracting. Real install photos only, surfaced from the imported
 * business archive.
 */
export function BeforeAfterBand() {
  const kitchens = photosBy({ subject: "install-kitchen" });
  const baths = photosBy({ subject: "install-bath" });
  const other = photosBy({ subject: "install-other" });
  const deck: PortfolioPhoto[] = [...kitchens, ...baths, ...other].map((p) => ({
    src: p.src,
    alt: p.alt,
  }));
  if (deck.length === 0) return null;

  return (
    <section className="bg-white">
      {/* Dark heading strip. Anchors the section visually and breaks
          the long run of white panels above and below. */}
      <div className="bg-[#0b1220] text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <SectionHead
            invert
            headline="A few of the rooms we have finished."
            sub="Kitchens and baths the in-house install crew has wrapped over the last few years. The tiles below cycle through the full set."
            link={{ href: "/four-squared", label: "Meet the install crew" }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <PortfolioFlip deck={deck} />

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-8">
          <div className="text-base text-[var(--foreground)]">
            We can pull from any of these designs as a starting point for your room.
          </div>
          <Link href="/four-squared" className="btn btn-priceless">
            Start a project →
          </Link>
        </div>
      </div>
    </section>
  );
}

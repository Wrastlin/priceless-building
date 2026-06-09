import { SectionHead } from "@/components/section-head";
import { ReviewsMasonry } from "@/components/reviews-masonry";
import { CURATED_REVIEWS } from "@/lib/reviews-data";

/**
 * Six-card subset of the reviews masonry on the home page. Links to
 * /reviews for the full set. Uses the same component the dedicated
 * reviews page uses so the visual treatment matches exactly.
 */
export function CustomerReviewsBand() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <SectionHead
          headline="What our customers have said about us."
          sub="Every quote here is a real Google, Facebook, or Yelp review. The full set lives on the reviews page; a sample sits below."
          link={{ href: "/reviews", label: "Read all the reviews" }}
        />
        <div className="mt-12">
          <ReviewsMasonry items={CURATED_REVIEWS} limit={6} />
        </div>
      </div>
    </section>
  );
}

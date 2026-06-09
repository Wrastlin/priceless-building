import Image from "next/image";
import type { CuratedReview } from "@/lib/reviews-data";

/**
 * Masonry-style grid of customer reviews. Used by the dedicated
 * /reviews page (full list) and by the home-page reviews section
 * (limited subset). Each card carries the rating, the source badge
 * (Google/Facebook/Yelp), the body, and an optional photo + date.
 */

const SOURCE_BADGE: Record<CuratedReview["source"], string> = {
  Google: "bg-[#4285F4]/10 text-[#1a73e8]",
  Facebook: "bg-[#1877F2]/10 text-[#1877F2]",
  Yelp: "bg-[#d32323]/10 text-[#d32323]",
};

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-base text-amber-500" aria-label={`${n} stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < n ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export function ReviewsMasonry({
  items,
  limit,
}: {
  items: CuratedReview[];
  limit?: number;
}) {
  const list = typeof limit === "number" ? items.slice(0, limit) : items;
  return (
    <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
      {list.map((r, i) => (
        <article
          key={i}
          data-reveal
          data-reveal-delay={((i % 6) * 0.04).toFixed(2)}
          className="mb-5 inline-block w-full break-inside-avoid rounded-2xl border border-[var(--border)] bg-white p-5 shadow-card"
        >
          <div className="flex items-center justify-between gap-3">
            <Stars n={r.stars} />
            <span
              className={
                "rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wider " +
                SOURCE_BADGE[r.source]
              }
            >
              {r.source}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed">&ldquo;{r.body}&rdquo;</p>
          {r.photo ? (
            <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-lg border border-[var(--border)]">
              <Image
                src={r.photo.src}
                alt={r.photo.alt}
                fill
                className="object-cover"
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
              />
            </div>
          ) : null}
          <div className="mt-4 border-t pt-3">
            <div className="font-display text-base">{r.name}</div>
            {r.date ? (
              <div className="text-xs text-[var(--muted-foreground)]">{r.date}</div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

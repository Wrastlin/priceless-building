import Image from "next/image";

export type TimelineEvent = {
  year: string;
  month?: string;
  title: string;
  body: string;
  image?: string;
  imageAlt?: string;
  source?: { label: string; url: string };
};

/**
 * Vertical timeline rail. A single rail runs down the left side; each
 * event has a dot anchored on the rail with a year + title + photo +
 * body to the right.
 *
 * Geometry (kept simple to keep the dots centered on the rail at every
 * breakpoint): the rail line sits at left-3 (12px from the OL edge),
 * each dot is size-4 (16px) positioned at left-1 (4px) so its center
 * lands at 4 + 8 = 12px right on the rail.
 */
export function TimelineRail({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative mt-8 overflow-hidden">
      {/* The vertical rail line itself, sitting behind every dot. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-3 top-3 bottom-3 w-px bg-[var(--border)]"
      />
      {events.map((e, i) => {
        const isLast = i === events.length - 1;
        return (
          <li
            key={`${e.year}-${e.title}`}
            data-reveal
            data-reveal-delay={(i * 0.04).toFixed(2)}
            className="relative pb-10 pl-12 last:pb-0 md:pl-14"
          >
            <span
              aria-hidden
              className={
                "absolute left-1 top-1.5 size-4 rounded-full border-2 border-[var(--brand-priceless)] " +
                (isLast
                  ? "bg-[var(--brand-priceless)]"
                  : "bg-[var(--muted,white)]")
              }
            />
            <div className="grid items-start gap-4 md:grid-cols-[120px_1fr] md:gap-8">
              <div>
                <div className="font-display text-3xl leading-none text-[var(--foreground)] md:text-4xl">
                  {e.year}
                </div>
                {e.month ? (
                  <div className="font-mono mt-1.5 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                    {e.month}
                  </div>
                ) : null}
              </div>
              <article className="grid grid-cols-1 gap-5 md:grid-cols-[260px_1fr] md:gap-6">
                {e.image ? (
                  <div className="relative aspect-[16/9] w-full overflow-hidden border border-[var(--border)] bg-white md:aspect-[4/3]">
                    <Image
                      src={e.image}
                      alt={e.imageAlt ?? e.title}
                      fill
                      sizes="(min-width:768px) 260px, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div>
                  <h3 className="font-display text-xl leading-snug md:text-2xl">
                    {e.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-[var(--foreground)]">
                    {e.body}
                  </p>
                  {e.source ? (
                    <a
                      href={e.source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono mt-4 inline-flex text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4"
                    >
                      {e.source.label} →
                    </a>
                  ) : null}
                </div>
              </article>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

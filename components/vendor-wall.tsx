import { VENDORS, vendorLogo } from "@/lib/vendor-logos";

/**
 * "Brands we carry" — a large, polished, infinite-scroll logo banner.
 *
 * Shows only the vendors we have a verified-correct logo for (downloaded
 * and hand-QA'd into public/vendor-logos/). Every name was read off in-store
 * signage during the walkthrough, so it's an honest reflection of the floor.
 *
 * Logos sit in a dedicated WHITE band (many brand logos carry their own
 * white tile, so a white field lets them blend instead of reading as boxes
 * on the gray section). The track is duplicated and animated -50% for a
 * seamless loop; pauses on hover; respects prefers-reduced-motion.
 */
export function VendorWall({
  heading = "Brands on the floor",
  blurb = "Read straight off the boxes and signage in our aisles. New-in-box surplus from the names contractors already trust.",
}: {
  heading?: string;
  blurb?: string;
}) {
  const logos = VENDORS.map((v) => ({ name: v.name, src: vendorLogo(v.name) })).filter(
    (v): v is { name: string; src: string } => v.src !== null,
  );
  if (logos.length === 0) return null;
  const row = [...logos, ...logos]; // duplicate for a seamless loop

  return (
    <section className="border-b bg-[var(--muted)]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
          Verified vendors · {logos.length} brands
        </div>
        <h2 className="font-display mt-3 text-4xl leading-[1.05] md:text-6xl">{heading}</h2>
        <p className="font-serif mt-4 max-w-2xl text-base italic leading-relaxed text-[var(--muted-foreground)] md:text-lg">
          {blurb}
        </p>

        {/* the banner: a tall white band that frames the logos cleanly */}
        <div className="vendor-marquee relative mt-10 overflow-hidden border border-[var(--border)] bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]">
          {/* Spacing lives on each item (mr), NOT flex `gap`, so the repeating
              unit width is uniform and the -50% loop seams with no jump. */}
          <div className="vendor-marquee__track flex w-max items-center py-12 md:py-16">
            {row.map((v, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${v.name}-${i}`}
                src={v.src}
                alt={v.name}
                aria-hidden={i >= logos.length}
                loading="lazy"
                className="mr-16 h-16 w-auto max-w-[230px] shrink-0 object-contain opacity-90 transition-opacity duration-300 hover:opacity-100 md:mr-24 md:h-24"
              />
            ))}
          </div>
          {/* white edge fades — keep the border crisp, soften the scroll in/out */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent md:w-40" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent md:w-40" />
        </div>
      </div>
    </section>
  );
}

import { VENDORS, vendorLogo } from "@/lib/vendor-logos";

type Logo = { name: string; src: string };

/**
 * Two stacked infinite scroll rows of verified brand logos.
 * No white card/box — open banner on the page background.
 */
export function VendorWall({
  heading = "Brands on the floor",
  blurb = "Read straight off the boxes and signage in our aisles. Surplus from names contractors already trust.",
}: {
  heading?: string;
  blurb?: string;
}) {
  const logos = VENDORS.map((v) => ({ name: v.name, src: vendorLogo(v.name) })).filter(
    (v): v is Logo => v.src !== null,
  );
  if (logos.length === 0) return null;

  const mid = Math.ceil(logos.length / 2);
  const rowA = logos.slice(0, mid);
  const rowB = logos.slice(mid);

  return (
    <section className="border-b border-[var(--line)] bg-[var(--cream)] py-14 sm:py-20">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
        <p className="eyebrow">{logos.length} brands from the walkthrough</p>
        <h2 className="font-display mt-3 text-[clamp(2rem,1rem+2.6vw,3.2rem)] leading-[1.05]">
          {heading}
        </h2>
        <p className="mt-4 max-w-[46ch] text-[1rem] font-light leading-[1.7] text-[var(--soft)]">
          {blurb}
        </p>
      </div>

      <div className="vendor-marquee relative mt-10 space-y-6 sm:mt-12 sm:space-y-8">
        <LogoRow logos={rowA} direction="left" />
        <LogoRow logos={rowB.length >= 4 ? rowB : logos} direction="right" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[var(--cream)] to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[var(--cream)] to-transparent sm:w-24" />
      </div>
    </section>
  );
}

function LogoRow({
  logos,
  direction,
}: {
  logos: Logo[];
  direction: "left" | "right";
}) {
  // Triple the set so -33.333% / +33.333% loops stay seamless at any width.
  const track = [...logos, ...logos, ...logos];
  return (
    <div className="overflow-hidden">
      <div
        className={`vendor-marquee__track flex w-max items-center ${
          direction === "right" ? "vendor-marquee__track--reverse" : ""
        }`}
      >
        {track.map((v, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${direction}-${v.name}-${i}`}
            src={v.src}
            alt={i < logos.length ? v.name : ""}
            aria-hidden={i >= logos.length}
            loading="lazy"
            className="mr-12 h-9 w-auto max-w-[140px] shrink-0 object-contain opacity-75 sm:mr-16 sm:h-11 sm:max-w-[160px] md:mr-20 md:h-12"
          />
        ))}
      </div>
    </div>
  );
}

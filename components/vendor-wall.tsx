import { VENDORS, vendorLogo } from "@/lib/vendor-logos";

type Logo = { name: string; src: string };

/** Repeat until one unit always spills past a phone viewport. */
function fillRow(logos: Logo[], minCount = 14): Logo[] {
  if (logos.length === 0) return logos;
  const out: Logo[] = [];
  while (out.length < minCount) out.push(...logos);
  return out;
}

/**
 * Two stacked continuous scroll rows of verified brand logos.
 * No white card/box — open banner on the page background.
 * Two equal units + -50% translate = seamless loop.
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
  const rowA = fillRow(logos.slice(0, mid), 16);
  const rowB = fillRow(logos.slice(mid).length >= 4 ? logos.slice(mid) : logos, 16);

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

      <div className="vendor-marquee relative mt-10 space-y-8 sm:mt-12 sm:space-y-10">
        <LogoRow logos={rowA} direction="left" />
        <LogoRow logos={rowB} direction="right" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[var(--cream)] to-transparent sm:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--cream)] to-transparent sm:w-16" />
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
  const mark = (v: Logo, key: string, labeled: boolean) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={key}
      src={v.src}
      alt={labeled ? v.name : ""}
      aria-hidden={!labeled}
      loading="lazy"
      className="mr-8 h-14 w-auto max-w-[200px] shrink-0 object-contain opacity-90 sm:mr-10 sm:h-16 sm:max-w-[240px] md:mr-12 md:h-[4.5rem] md:max-w-[280px]"
    />
  );

  return (
    <div className="overflow-hidden">
      <div
        className={`vendor-marquee__track flex w-max items-center ${
          direction === "right" ? "vendor-marquee__track--reverse" : ""
        }`}
      >
        <div className="flex shrink-0 items-center">
          {logos.map((v, i) => mark(v, `${direction}-a-${v.name}-${i}`, true))}
        </div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {logos.map((v, i) => mark(v, `${direction}-b-${v.name}-${i}`, false))}
        </div>
      </div>
    </div>
  );
}

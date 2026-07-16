import { VENDORS, vendorLogo } from "@/lib/vendor-logos";

type Logo = { name: string; src: string };

/** Repeat until one unit always spills past a phone viewport. */
function fillRow(logos: Logo[], minCount = 18): Logo[] {
  if (logos.length === 0) return logos;
  const out: Logo[] = [];
  while (out.length < minCount) out.push(...logos);
  return out;
}

/**
 * One large continuous logo thumbnail river.
 * Fixed-width tiles + two identical units + -50% translate = seamless loop, no snap.
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

  const track = fillRow(logos, 20);

  return (
    <section className="border-b border-[var(--line)] bg-[var(--cream)] py-10 sm:py-14">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
        <p className="eyebrow">{logos.length} brands from the walkthrough</p>
        <h2 className="font-display mt-2 text-[clamp(2rem,1rem+2.6vw,3.2rem)] leading-[1.05]">
          {heading}
        </h2>
        <p className="mt-3 max-w-[46ch] text-[1.05rem] font-light leading-[1.65] text-[var(--soft)]">
          {blurb}
        </p>
      </div>

      <div className="vendor-marquee relative mt-8 sm:mt-10">
        <LogoRiver logos={track} />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[var(--cream)] to-transparent sm:w-12" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[var(--cream)] to-transparent sm:w-12" />
      </div>
    </section>
  );
}

function LogoRiver({ logos }: { logos: Logo[] }) {
  const tile = (v: Logo, key: string, labeled: boolean) => (
    <div
      key={key}
      className="mr-5 flex h-[4.5rem] w-[7.5rem] shrink-0 items-center justify-center sm:mr-7 sm:h-20 sm:w-[9rem] md:mr-8 md:h-24 md:w-[10.5rem]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={v.src}
        alt={labeled ? v.name : ""}
        aria-hidden={!labeled}
        loading="lazy"
        className="max-h-[70%] max-w-[85%] object-contain opacity-90"
      />
    </div>
  );

  return (
    <div className="overflow-hidden">
      <div className="vendor-marquee__track flex w-max items-center">
        <div className="flex shrink-0 items-center">
          {logos.map((v, i) => tile(v, `a-${v.name}-${i}`, true))}
        </div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {logos.map((v, i) => tile(v, `b-${v.name}-${i}`, false))}
        </div>
      </div>
    </div>
  );
}

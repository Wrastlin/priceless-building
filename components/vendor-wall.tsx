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
 * Bare continuous logo thumbnail river — no heading, no section chrome.
 * Fixed-width tiles + two identical units + -50% translate = seamless loop.
 */
export function VendorLogoBar({
  fadeFrom = "white",
}: {
  fadeFrom?: "white" | "cream";
}) {
  const logos = VENDORS.map((v) => ({ name: v.name, src: vendorLogo(v.name) })).filter(
    (v): v is Logo => v.src !== null,
  );
  if (logos.length === 0) return null;

  const track = fillRow(logos, 20);
  const from = fadeFrom === "cream" ? "from-[var(--cream)]" : "from-white";

  return (
    <div className="vendor-marquee relative" aria-label="Brands from the walkthrough">
      <LogoRiver logos={track} />
      <div className={`pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r ${from} to-transparent sm:w-10`} />
      <div className={`pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l ${from} to-transparent sm:w-10`} />
    </div>
  );
}

function LogoRiver({ logos }: { logos: Logo[] }) {
  const tile = (v: Logo, key: string, labeled: boolean) => (
    <div
      key={key}
      className="mr-2.5 flex h-20 w-28 shrink-0 items-center justify-center sm:mr-3 sm:h-24 sm:w-36 md:mr-3.5 md:h-28 md:w-40"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={v.src}
        alt={labeled ? v.name : ""}
        aria-hidden={!labeled}
        loading="lazy"
        className="max-h-[88%] max-w-[92%] object-contain opacity-95"
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

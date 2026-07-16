import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { VENDORS, vendorLogo } from "@/lib/vendor-logos";

type Logo = { name: string; src: string };

function getLogos(): Logo[] {
  return VENDORS.map((v) => ({ name: v.name, src: vendorLogo(v.name) })).filter(
    (v): v is Logo => v.src !== null,
  );
}

/** Repeat until the unit is wide enough that one copy always spills past the viewport. */
function fillRow(logos: Logo[], minCount = 14): Logo[] {
  if (logos.length === 0) return logos;
  const out: Logo[] = [];
  while (out.length < minCount) out.push(...logos);
  return out;
}

/**
 * Temporary comparison page: logo-scroll treatments using real walkthrough marks.
 * Pick one and we'll wire it to home.
 */
export default function LogoBannerExamplesPage() {
  const logos = getLogos();
  const mid = Math.ceil(logos.length / 2);
  const rowA = fillRow(logos.slice(0, mid), 16);
  const rowB = fillRow(logos.slice(mid), 16);
  const allWide = fillRow(logos, 18);

  return (
    <>
      <SiteHeader brand="priceless" />
      <main className="bg-[var(--cream)] pb-24">
        <div className="mx-auto max-w-[900px] px-5 py-12 sm:px-8 sm:py-16">
          <p className="eyebrow">Preview · not on the homepage yet</p>
          <h1 className="font-display mt-3 text-[clamp(2rem,1rem+3vw,3.4rem)] leading-[1.05]">
            Logo banner options.
          </h1>
          <p className="mt-4 max-w-[48ch] text-[1rem] font-light leading-[1.7] text-[var(--soft)]">
            Four continuous-scroll treatments with your real brand marks. Tell
            me which number you want on the home page (or mix traits from two).
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-[0.72rem] font-medium uppercase tracking-[0.18em] underline-offset-4 hover:underline"
          >
            ← Back to home
          </Link>
        </div>

        {/* 1 — Dual continuous (larger + seamless) */}
        <Example
          n="1"
          title="Dual continuous scroll"
          note="Two rows, opposite directions. Larger marks, denser pack, loop that never jumps. Closest to a real storefront ticker."
        >
          <div className="logo-ex relative space-y-8 py-4 sm:space-y-10">
            <SeamlessRow logos={rowA} speed="48s" dir="left" size="lg" gap="wide" />
            <SeamlessRow logos={rowB} speed="56s" dir="right" size="lg" gap="wide" />
            <EdgeFades tone="cream" soft />
          </div>
        </Example>

        {/* 2 — Single wide river */}
        <Example
          n="2"
          title="Single river"
          note="One oversized continuous row. Bigger logos, slower crawl. Reads like a storefront ticker."
          dark
        >
          <div className="logo-ex relative py-6">
            <SeamlessRow logos={allWide} speed="70s" dir="left" size="lg" gap="wide" />
            <EdgeFades tone="ink" />
          </div>
        </Example>

        {/* 3 — Triple weave */}
        <Example
          n="3"
          title="Triple weave"
          note="Three thinner rows at different speeds. Dense but still open. Good if you want every brand to pass often."
        >
          <div className="logo-ex relative space-y-5 py-2">
            <SeamlessRow
              logos={fillRow(
                logos.filter((_, i) => i % 3 === 0),
                12,
              )}
              speed="45s"
              dir="left"
              size="sm"
            />
            <SeamlessRow
              logos={fillRow(
                logos.filter((_, i) => i % 3 === 1),
                12,
              )}
              speed="55s"
              dir="right"
              size="sm"
            />
            <SeamlessRow
              logos={fillRow(
                logos.filter((_, i) => i % 3 === 2),
                12,
              )}
              speed="65s"
              dir="left"
              size="sm"
            />
            <EdgeFades tone="cream" />
          </div>
        </Example>

        {/* 4 — Slow pulse river */}
        <Example
          n="4"
          title="Slow pulse river"
          note="Single row that eases in speed (accelerate, drift, accelerate). Feels less mechanical than a constant crawl."
          dark
        >
          <div className="logo-ex relative py-6">
            <SeamlessRow logos={allWide} speed="48s" dir="left" size="lg" gap="wide" pulse />
            <EdgeFades tone="ink" />
          </div>
        </Example>
      </main>
      <SiteFooter brand="priceless" />
    </>
  );
}

function Example({
  n,
  title,
  note,
  children,
  dark = false,
}: {
  n: string;
  title: string;
  note: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <section
      className={`border-t border-[var(--line)] py-12 sm:py-16 ${
        dark ? "bg-[var(--ink)] text-white" : "bg-[var(--cream)]"
      }`}
    >
      <div className="mx-auto max-w-[900px] px-5 sm:px-8">
        <p
          className={`text-[0.68rem] font-medium uppercase tracking-[0.2em] ${
            dark ? "text-white/55" : "text-[var(--rust)]"
          }`}
        >
          Option {n}
        </p>
        <h2 className="font-display mt-2 text-2xl sm:text-3xl">{title}</h2>
        <p
          className={`mt-2 max-w-[52ch] text-[0.95rem] font-light leading-[1.65] ${
            dark ? "text-white/70" : "text-[var(--soft)]"
          }`}
        >
          {note}
        </p>
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}

/**
 * Two identical units side by side; animate exactly -50% so the seam never jumps.
 */
function SeamlessRow({
  logos,
  speed,
  dir,
  size,
  gap = "normal",
  pulse = false,
}: {
  logos: Logo[];
  speed: string;
  dir: "left" | "right";
  size: "sm" | "md" | "lg" | "xl";
  gap?: "normal" | "wide";
  pulse?: boolean;
}) {
  if (logos.length === 0) return null;

  const h =
    size === "xl"
      ? "h-14 sm:h-16 md:h-[4.5rem]"
      : size === "lg"
        ? "h-12 sm:h-14 md:h-16"
        : size === "md"
          ? "h-9 sm:h-11 md:h-12"
          : "h-7 sm:h-8 md:h-9";
  const mr =
    gap === "wide"
      ? "mr-12 sm:mr-16 md:mr-20"
      : size === "xl"
        ? "mr-8 sm:mr-10 md:mr-12"
        : "mr-10 sm:mr-14 md:mr-16";
  const maxW =
    size === "xl"
      ? "max-w-[200px] sm:max-w-[240px] md:max-w-[280px]"
      : size === "lg"
        ? "max-w-[180px] sm:max-w-[200px]"
        : "max-w-[140px] sm:max-w-[160px]";

  const anim = pulse
    ? "logo-ex__pulse"
    : dir === "right"
      ? "logo-ex__rev"
      : "logo-ex__fwd";

  return (
    <div className="overflow-hidden">
      <div className={`flex w-max items-center ${anim}`} style={{ animationDuration: speed }}>
        <div className="flex shrink-0 items-center">
          {logos.map((v, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`a-${v.name}-${i}`}
              src={v.src}
              alt={v.name}
              className={`${mr} ${h} ${maxW} w-auto shrink-0 object-contain ${
                size === "xl" || size === "lg" ? "opacity-90" : "opacity-80"
              }`}
            />
          ))}
        </div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {logos.map((v, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`b-${v.name}-${i}`}
              src={v.src}
              alt=""
              className={`${mr} ${h} ${maxW} w-auto shrink-0 object-contain ${
                size === "xl" || size === "lg" ? "opacity-90" : "opacity-80"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function EdgeFades({ tone, soft = false }: { tone: "cream" | "ink"; soft?: boolean }) {
  const from = tone === "ink" ? "from-[var(--ink)]" : "from-[var(--cream)]";
  const w = soft ? "w-8 sm:w-16" : "w-12 sm:w-28";
  return (
    <>
      <div className={`pointer-events-none absolute inset-y-0 left-0 ${w} bg-gradient-to-r ${from} to-transparent`} />
      <div className={`pointer-events-none absolute inset-y-0 right-0 ${w} bg-gradient-to-l ${from} to-transparent`} />
    </>
  );
}

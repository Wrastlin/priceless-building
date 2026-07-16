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

/**
 * Temporary comparison page: a few endless-scroll logo treatments using
 * the real walkthrough brand marks. Pick one and we'll wire it to home.
 */
export default function LogoBannerExamplesPage() {
  const logos = getLogos();
  const mid = Math.ceil(logos.length / 2);
  const rowA = logos.slice(0, mid);
  const rowB = logos.slice(mid);

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
            Four endless-scroll treatments with your real brand marks. Tell me
            which number you want on the home page (or mix traits from two).
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-[0.72rem] font-medium uppercase tracking-[0.18em] underline-offset-4 hover:underline"
          >
            ← Back to home
          </Link>
        </div>

        {/* 1 — Dual endless (current direction, refined) */}
        <Example
          n="1"
          title="Dual endless scroll"
          note="Two rows, opposite directions. Continuous loop. Closest to what you have now, cleaned up."
        >
          <div className="logo-ex relative space-y-7 py-2">
            <Row logos={rowA} speed="52s" dir="left" size="md" />
            <Row logos={rowB} speed="60s" dir="right" size="md" />
            <EdgeFades tone="cream" />
          </div>
        </Example>

        {/* 2 — Single wide river */}
        <Example
          n="2"
          title="Single river"
          note="One oversized endless row. Bigger logos, slower crawl. Reads like a storefront ticker."
          dark
        >
          <div className="logo-ex relative py-6">
            <Row logos={logos} speed="70s" dir="left" size="lg" gap="wide" />
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
            <Row logos={logos.filter((_, i) => i % 3 === 0)} speed="45s" dir="left" size="sm" />
            <Row logos={logos.filter((_, i) => i % 3 === 1)} speed="55s" dir="right" size="sm" />
            <Row logos={logos.filter((_, i) => i % 3 === 2)} speed="65s" dir="left" size="sm" />
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
            <Row logos={logos} speed="48s" dir="left" size="lg" gap="wide" pulse />
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

function Row({
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
  size: "sm" | "md" | "lg";
  gap?: "normal" | "wide";
  pulse?: boolean;
}) {
  if (logos.length === 0) return null;
  const track = [...logos, ...logos, ...logos];
  const h =
    size === "lg" ? "h-12 sm:h-14 md:h-16" : size === "md" ? "h-9 sm:h-11 md:h-12" : "h-7 sm:h-8 md:h-9";
  const mr = gap === "wide" ? "mr-14 sm:mr-20 md:mr-24" : "mr-10 sm:mr-14 md:mr-16";
  const maxW = size === "lg" ? "max-w-[180px] sm:max-w-[200px]" : "max-w-[140px] sm:max-w-[160px]";

  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max items-center ${
          pulse ? "logo-ex__pulse" : dir === "right" ? "logo-ex__rev" : "logo-ex__fwd"
        }`}
        style={{ animationDuration: speed }}
      >
        {track.map((v, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${dir}-${v.name}-${i}`}
            src={v.src}
            alt={i < logos.length ? v.name : ""}
            aria-hidden={i >= logos.length}
            className={`${mr} ${h} ${maxW} w-auto shrink-0 object-contain ${
              size === "lg" ? "opacity-90" : "opacity-80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function EdgeFades({ tone }: { tone: "cream" | "ink" }) {
  const from = tone === "ink" ? "from-[var(--ink)]" : "from-[var(--cream)]";
  return (
    <>
      <div className={`pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r ${from} to-transparent sm:w-28`} />
      <div className={`pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l ${from} to-transparent sm:w-28`} />
    </>
  );
}

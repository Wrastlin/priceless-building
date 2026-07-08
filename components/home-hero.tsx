"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { PRICELESS } from "@/lib/brands";

// WebGL mosaic background — client-only, and only mounted on desktop /
// fine-pointer screens. Mobile gets the static poster (below) instead, so
// it stays light and the cursor-reveal (which needs a mouse) isn't wasted.
const MosaicCanvas = dynamic(() => import("@/components/home/mosaic-canvas"), { ssr: false });

const MURAL_HERO = "/real-photos/mural-wide.webp";
// Mobile-only hero photo (the LCP on phones, which never get the mosaic).
// Desktop skips this entirely and fades the mosaic in over the navy
// backdrop, so it never flashes a single photo before snapping to the grid.
const POSTER = "/real-photos/business/wood-cabinets-granite-kitchen.jpg";

export function HomeHero() {
  const [enableCanvas, setEnableCanvas] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const apply = () => setEnableCanvas(mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  return (
    <section className="relative border-b">
      {/* HERO VIEWPORT */}
      <div className="relative min-h-[88svh] w-full overflow-hidden bg-[var(--brand-navy-deep)]">
        {/* Poster — mobile only. On desktop the navy backdrop shows during
            load and the mosaic fades straight in over it, so desktop never
            flashes this single photo before snapping to the grid. */}
        <Image
          src={POSTER}
          alt="A finished kitchen with wood cabinets and granite countertops, built and installed by the Wausau crew."
          fill
          priority
          sizes="100vw"
          quality={80}
          className="object-cover md:hidden"
        />

        {/* Animated photo mosaic (desktop only) */}
        {enableCanvas ? <MosaicCanvas /> : null}

        {/* Legibility overlays: left wash for the headline (desktop) + a
            vertical darken so text stays readable on mobile. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(15,33,56,0.93) 0%, rgba(15,33,56,0.55) 46%, rgba(15,33,56,0.22) 74%, rgba(15,33,56,0.5) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 md:hidden"
          style={{ background: "linear-gradient(to top, rgba(15,33,56,0.9) 0%, rgba(15,33,56,0.35) 60%, rgba(15,33,56,0.55) 100%)" }}
        />

        {/* CONTENT */}
        <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-7xl flex-col justify-center px-6 py-20">
          <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400" />
              <OpenToday />
            </span>
            <span className="text-white/30">·</span>
            <span>Wausau, WI</span>
            <span className="text-white/30">·</span>
            <span className="text-[var(--brand-gold)]">Family-run since 1978</span>
          </div>

          <h1 className="font-display max-w-[16ch] text-[clamp(2.25rem,1.5rem+3.6vw,4.35rem)] leading-[1.08] text-white">
            <span className="block">Wausau&rsquo;s one-stop shop</span>
            <span className="block italic text-[var(--brand-gold)]">for the home you&rsquo;re building.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base text-white/85 md:text-lg">
            Discount and surplus materials, custom cabinetry, and a full install crew. Walk the warehouse, design with our team, install with our crew.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="/shop" className="btn btn-priceless">
              Shop the inventory
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold text-white underline decoration-[var(--brand-gold)]/60 underline-offset-[6px] transition hover:decoration-[var(--brand-gold)]"
            >
              Hours &amp; directions →
            </Link>
          </div>
        </div>
      </div>

      {/* Mural figure. Anchored, with full press attribution. */}
      <figure className="border-t border-[var(--border)]">
        <div className="relative w-full overflow-hidden bg-[var(--muted)]">
          <Image
            src={MURAL_HERO}
            alt="Build Your Future community mural on the side of the Price-Less Building Center, painted by 50 Wausau volunteers in June 2023."
            width={2400}
            height={750}
            loading="lazy"
            className="block h-auto w-full object-contain"
            sizes="100vw"
          />
        </div>
        <figcaption className="mx-auto flex max-w-7xl flex-wrap items-baseline justify-between gap-3 border-b border-[var(--border)] px-6 py-3 text-sm">
          <span className="text-[var(--muted-foreground)]">
            &ldquo;Build Your Future&rdquo; mural · designed by Stephanie Kohli · painted by 50 Wausau volunteers · June 2023
          </span>
          <a
            href="https://www.wsaw.com/2023/06/18/new-mural-coming-downtown-wausau/"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-gold-deep)] underline decoration-2 underline-offset-4"
          >
            WSAW story →
          </a>
        </figcaption>
      </figure>
    </section>
  );
}

function OpenToday() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
  const todayHours = PRICELESS.hours.find((h) => h.day === today)?.hours ?? "Closed";
  if (todayHours === "Closed") {
    return <span className="text-white" suppressHydrationWarning>Closed today · Open Mon 8:30 AM</span>;
  }
  return <span className="text-white" suppressHydrationWarning>Open today, {todayHours}</span>;
}

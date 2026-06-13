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
// LCP poster: a real photo, server-rendered + preloaded. Kept DISTINCT from
// every tile in the mosaic so the hero never shows the same photo twice.
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
      <div className="relative min-h-[88svh] w-full overflow-hidden bg-[#0b1220]">
        {/* Poster — the LCP. Always rendered; the canvas fades in over it. */}
        <Image
          src={POSTER}
          alt="A finished kitchen with wood cabinets and granite countertops, built and installed by the Wausau crew."
          fill
          priority
          sizes="100vw"
          quality={80}
          className="object-cover"
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
              "linear-gradient(90deg, rgba(11,18,32,0.93) 0%, rgba(11,18,32,0.55) 46%, rgba(11,18,32,0.22) 74%, rgba(11,18,32,0.5) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 md:hidden"
          style={{ background: "linear-gradient(to top, rgba(11,18,32,0.9) 0%, rgba(11,18,32,0.35) 60%, rgba(11,18,32,0.55) 100%)" }}
        />

        {/* CONTENT */}
        <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-7xl flex-col justify-center px-6 py-20">
          <div className="font-mono mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.2em] text-white/75">
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400" />
              <OpenToday />
            </span>
            <span className="text-white/30">·</span>
            <span>Wausau, WI</span>
            <span className="text-white/30">·</span>
            <span>Est. 1978</span>
          </div>

          <h1 className="font-display text-[clamp(2.75rem,1.8rem+6vw,7rem)] uppercase leading-[0.92] text-white">
            <span className="block">Wausau&rsquo;s</span>
            <span className="block">one-stop shop</span>
            <span className="block text-[var(--accent)]">for everything.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base text-white/85 md:text-lg">
            Discount and surplus materials, custom cabinetry, and a full install crew. Walk the warehouse, design with our team, install with our crew.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href="/shop"
              className="font-mono inline-flex items-center bg-[var(--brand-priceless)] px-7 py-4 text-sm uppercase tracking-[0.14em] text-white transition hover:bg-[var(--brand-priceless-dark)]"
            >
              Browse the warehouse →
            </Link>
            <Link
              href="/contact"
              className="font-mono text-sm uppercase tracking-[0.14em] text-white underline decoration-white/40 underline-offset-[6px] hover:decoration-white"
            >
              Visit the store
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
            className="font-mono shrink-0 text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4"
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

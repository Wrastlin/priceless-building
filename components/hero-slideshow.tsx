"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GOOGLE_RATING } from "@/lib/google-reviews";

/** Curated ★★★ finished-room heroes — see public/real-photos/CURATED.md */
const SLIDES = [
  "/real-photos/builders-corner-hero.jpg", // dark shaker + marble island — keep
  "/real-photos/foursquared/kitchen-wood-island-black-pendants.jpg",
  "/real-photos/foursquared/kitchen-white-island-shiplap.jpg",
  "/real-photos/business/white-kitchen-wood-island.jpg",
];

/**
 * Rejuvenation-style hero: white-framed image on desktop, centered Utopia
 * type, 4-image crossfade (~4.5s dwell, ~1.8s fade) with a continuous Ken
 * Burns pan so it reads like slow video — not a flash.
 */
export function HeroSlideshow() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="bg-white">
      <div className="px-0 pb-0 md:px-5 md:pb-5">
        <div className="relative h-[74svh] w-full overflow-hidden md:h-[82svh]">
          {SLIDES.map((src, idx) => (
            <div
              key={src}
              className="absolute inset-0 transition-opacity duration-[1800ms] ease-in-out"
              style={{ opacity: idx === i ? 1 : 0 }}
            >
              <Image
                src={src}
                alt=""
                fill
                priority={idx === 0}
                sizes="100vw"
                quality={80}
                className={`object-cover kb-${idx % 2}`}
              />
            </div>
          ))}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(20,18,18,0.26), rgba(20,18,18,0.30) 55%, rgba(20,18,18,0.44))",
            }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
            <p
              className="mb-6 flex max-w-[34ch] flex-col items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.24em] sm:max-w-none sm:flex-row sm:gap-3"
              style={{ textShadow: "0 1px 14px rgba(0,0,0,.55)" }}
            >
              <span className="text-[var(--rust)]" aria-hidden>
                ★★★★★
              </span>
              <span>Family-run in Wausau since 1978 · {GOOGLE_RATING.average} on Google</span>
            </p>
            <h1
              className="font-display max-w-[16ch] text-[clamp(2.6rem,1rem+5.4vw,5.6rem)] leading-[1.02] text-white"
              style={{ textShadow: "0 2px 26px rgba(0,0,0,.45)" }}
            >
              <span className="font-semibold">The whole home,</span>{" "}
              <span className="font-normal italic">priced for less.</span>
            </h1>
            <Link
              href="/shop"
              className="btn-outline-light mt-10 border px-10 py-4 text-[0.7rem] font-medium uppercase tracking-[0.22em] transition"
            >
              Shop the warehouse ›
            </Link>
          </div>
        </div>
      </div>

      <p className="font-display mx-auto max-w-[60ch] px-8 pb-6 pt-16 text-center text-[1.3rem] font-normal italic leading-[1.5] text-[var(--ink)]">
        From a bin find to a finished kitchen — Wausau&rsquo;s discount and surplus
        building yard since 1978.
      </p>

      <style>{`
        @keyframes kb0 { 0%{transform:scale(1.02) translate(0,0)} 100%{transform:scale(1.12) translate(-1.8%,-1.2%)} }
        @keyframes kb1 { 0%{transform:scale(1.02) translate(0,0)} 100%{transform:scale(1.12) translate(1.8%,-0.8%)} }
        .kb-0{animation:kb0 12s ease-in-out infinite alternate}
        .kb-1{animation:kb1 12s ease-in-out infinite alternate}
        @media (prefers-reduced-motion: reduce){ .kb-0,.kb-1{animation:none} }
      `}</style>
    </section>
  );
}

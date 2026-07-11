"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const INK = "#1a1818";
const RUST = "#D04727";

// 4 images, rejuvenation-style: surplus floor + finished rooms. Chosen for
// composition that reads well behind centered type. (Josh has thousands — easy
// to swap these for even stronger frames.)
const SLIDES = [
  "/real-photos/business/dark-base-cabinets-warehouse-row.jpg",
  "/real-photos/business/white-kitchen-wood-island.jpg",
  "/real-photos/business/black-framed-windows-warehouse.jpg",
  "/real-photos/business/white-shaker-kitchen-cabinets.jpg",
];

/** White sticky header that hides on scroll-down and returns on scroll-up (rejuvenation). */
export function SiteNav() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 90 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`sticky top-0 z-50 bg-white transition-transform duration-500 ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
      <div className="relative mx-auto flex max-w-[1360px] items-center px-8 py-5" style={{ color: INK }}>
        <nav className="hidden items-center gap-7 text-[0.7rem] font-medium uppercase tracking-[0.16em] lg:flex">
          <span>Shop</span><span>Cabinetry</span><span>Remodels</span>
        </nav>
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-center">
          <span className="block text-[1.5rem] font-medium tracking-[0.36em] leading-none">PRICE-LESS</span>
          <span className="mt-[6px] block text-[0.56rem] font-medium tracking-[0.44em] opacity-60">WAUSAU · EST. 1978</span>
        </Link>
        <div className="ml-auto flex items-center gap-7 text-[0.7rem] font-medium uppercase tracking-[0.16em]">
          <span className="hidden md:inline">Search</span>
          <span className="hidden md:inline">(715) 848-3855</span>
        </div>
      </div>
    </header>
  );
}

/** Rejuvenation-style hero: white-framed image, centered type, 4-image
 *  crossfade slideshow (~1.2s) with a continuous Ken Burns pan so it reads
 *  like slow video. */
export function HeroSlideshow() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="bg-white">
      <div className="px-0 pb-0 md:px-4 md:pb-4">
        <div className="relative h-[74svh] w-full overflow-hidden md:h-[82svh]">
          {SLIDES.map((src, idx) => (
            <div key={idx} className="absolute inset-0 transition-opacity duration-[1000ms] ease-out" style={{ opacity: idx === i ? 1 : 0 }}>
              <Image src={src} alt="" fill priority={idx === 0} sizes="100vw" quality={82} className={`object-cover kb-${idx % 2}`} />
            </div>
          ))}
          {/* light legibility wash — keeps images bright like rejuvenation */}
          <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(20,18,18,0.26), rgba(20,18,18,0.30) 55%, rgba(20,18,18,0.44))" }} />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
            <p className="mb-6 flex items-center gap-3 text-[0.68rem] font-medium uppercase tracking-[0.24em]" style={{ textShadow: "0 1px 14px rgba(0,0,0,.55)" }}>
              <span style={{ color: RUST }} aria-hidden>★★★★★</span> Family-run in Wausau since 1978
            </p>
            <h1 style={{ fontFamily: "var(--font-utopia)", textShadow: "0 2px 26px rgba(0,0,0,.45)" }} className="max-w-[16ch] text-[clamp(2.6rem,1rem+5.4vw,5.6rem)] leading-[1.02]">
              <span className="font-semibold">The whole home,</span>{" "}
              <span className="italic font-normal">priced for less.</span>
            </h1>
            <Link href="/shop" className="mt-10 border border-white/85 px-10 py-4 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-white hover:text-[#1a1818]">
              Shop the warehouse ›
            </Link>
          </div>
        </div>
      </div>

      {/* centered italic intro line, rejuvenation-style */}
      <p style={{ fontFamily: "var(--font-utopia)" }} className="mx-auto max-w-[60ch] px-8 pb-6 pt-16 text-center text-[1.3rem] font-normal italic leading-[1.5]" >
        From a bin find to a finished kitchen — Wausau&rsquo;s discount and surplus building yard since 1978.
      </p>

      <style>{`
        @keyframes kb0 { 0%{transform:scale(1.02) translate(0,0)} 100%{transform:scale(1.15) translate(-2.2%,-1.6%)} }
        @keyframes kb1 { 0%{transform:scale(1.02) translate(0,0)} 100%{transform:scale(1.15) translate(2.2%,-1%)} }
        .kb-0{animation:kb0 8s ease-out infinite alternate}
        .kb-1{animation:kb1 8s ease-out infinite alternate}
        @media (prefers-reduced-motion: reduce){ .kb-0,.kb-1{animation:none} }
      `}</style>
    </section>
  );
}

"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide smooth scrolling + scroll-triggered reveal animations.
 *
 * - Lenis handles wheel/touch smoothing. The site-header stays sticky
 *   because Lenis does not use CSS transforms; it intercepts native
 *   scroll and eases it.
 * - GSAP ScrollTrigger drives a single one-pass fade-and-rise animation
 *   for anything tagged with data-reveal. Optional data-reveal-delay
 *   adds a per-element offset so we can stagger cards in a grid by
 *   index without writing more JS.
 * - Honors prefers-reduced-motion by skipping everything.
 *
 * Mounted once in app/layout.tsx so every page picks it up.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const delay = parseFloat(el.dataset.revealDelay ?? "0");
        // fromTo (not from): if anything in the pipeline misfires, the
        // element still ends visible at opacity:1, y:0 — never stuck
        // hidden. start: "top 95%" fires earlier so content is on screen
        // by the time the user gets there.
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    });

    // Belt-and-suspenders safety: after 5 seconds, force every reveal
    // element visible regardless of scroll state, so a missed trigger
    // never leaves the page looking broken.
    const safety = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }, 5000);

    return () => {
      window.clearTimeout(safety);
      gsap.ticker.remove(raf);
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  return null;
}

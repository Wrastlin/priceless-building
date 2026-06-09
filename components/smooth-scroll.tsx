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
        gsap.from(el, {
          opacity: 0,
          y: 28,
          duration: 0.85,
          delay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });
    });

    return () => {
      gsap.ticker.remove(raf);
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  return null;
}

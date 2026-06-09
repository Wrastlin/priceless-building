"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Site-wide smooth scrolling + clean scroll-reveal.
 *
 * - Lenis eases wheel + trackpad scrolling on desktop. Touch is left
 *   native (Lenis's `smoothTouch` is false by default), which is what
 *   mobile users expect.
 * - Reveal animations are pure CSS (see [data-reveal] in globals.css).
 *   This component just adds `.is-visible` exactly once per element
 *   via an IntersectionObserver. No GSAP ScrollTrigger. The animation
 *   cannot re-fire on scroll up/down, so there is no flicker.
 * - A 5-second safety fallback marks any still-unrevealed element
 *   visible regardless, so content is never stranded if IO misfires.
 * - Honors prefers-reduced-motion (Lenis disabled, CSS auto-skips
 *   the reveal transition).
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Lenis (skip if user prefers reduced motion).
    let lenis: Lenis | null = null;
    let rafId = 0;
    if (!reduced) {
      lenis = new Lenis({ duration: 1.05, smoothWheel: true });
      const tick = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }

    // Reveal: one IO, fires .is-visible exactly once per element.
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    let io: IntersectionObserver | null = null;
    if (!reduced && "IntersectionObserver" in window && targets.length) {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            const delay = parseFloat(el.dataset.revealDelay ?? "0");
            // Per-element stagger respected via inline transition-delay.
            if (delay > 0) el.style.transitionDelay = `${delay}s`;
            el.classList.add("is-visible");
            io!.unobserve(el);
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
      );
      for (const el of targets) io.observe(el);
    } else if (reduced) {
      // Reduced motion: mark everything visible immediately.
      for (const el of targets) el.classList.add("is-visible");
    }

    // Belt-and-suspenders: never leave a reveal element invisible.
    const safety = window.setTimeout(() => {
      for (const el of targets) {
        if (!el.classList.contains("is-visible")) el.classList.add("is-visible");
      }
    }, 5000);

    return () => {
      window.clearTimeout(safety);
      io?.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);

  return null;
}

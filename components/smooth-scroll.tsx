"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Site-wide motion engine. One Lenis momentum-scroll instance drives
 * GSAP's ScrollTrigger, and a per-route gsap.context() wires the
 * premium scroll choreography the leading building-brand sites use:
 *
 *   [data-reveal]            fade + rise on enter (FOUC-safe, CSS-primed)
 *   [data-rise]              masked headline reveal (text rises from a clip)
 *   [data-clip]             clip-path image unveil + inner scale settle
 *   [data-count]            number counts up on enter
 *   [data-parallax]         gentle y-parallax while scrolling through
 *   [data-magnetic]         button pulls toward the cursor (fine pointers)
 *
 * Plus a lerped custom cursor and a hide-on-scroll-down / solidify nav.
 * Everything eases out (expo/quart), nothing bounces, and the whole
 * system is gated behind prefers-reduced-motion.
 *
 * The [data-reveal] path keeps its own IntersectionObserver + CSS so
 * the ~40 components already marked up with it animate unchanged; the
 * new attributes are opt-in on top.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  // Lenis + ScrollTrigger + cursor + nav live for the whole session.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    // Lenis drives ScrollTrigger. Using GSAP's ticker (not a private
    // rAF loop) keeps scroll position and trigger math on one clock, so
    // pins and scrubs never drift.
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Route hash / same-page anchors glide through Lenis.
    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { duration: 1.2 });
    };
    document.addEventListener("click", onAnchor);

    // ---- Custom lerped cursor (fine pointers only) ----
    const fine = window.matchMedia("(pointer:fine)").matches;
    let cursorEl: HTMLDivElement | null = null;
    let onMove: ((e: MouseEvent) => void) | null = null;
    let onOver: ((e: MouseEvent) => void) | null = null;
    let onOut: (() => void) | null = null;
    let cursorTick: ((t: number) => void) | null = null;
    if (fine) {
      cursorEl = document.createElement("div");
      cursorEl.className = "site-cursor";
      document.body.appendChild(cursorEl);
      let mx = window.innerWidth / 2,
        my = window.innerHeight / 2,
        cx = mx,
        cy = my;
      onMove = (e) => {
        mx = e.clientX;
        my = e.clientY;
      };
      onOver = (e) => {
        const t = e.target as HTMLElement;
        if (t.closest("a,button,[data-magnetic],[role='button'],input,select,textarea"))
          cursorEl!.classList.add("is-hover");
      };
      onOut = () => cursorEl!.classList.remove("is-hover");
      window.addEventListener("mousemove", onMove);
      document.addEventListener("mouseover", onOver);
      document.addEventListener("mouseout", onOut);
      cursorTick = () => {
        cx += (mx - cx) * 0.18;
        cy += (my - cy) * 0.18;
        cursorEl!.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      };
      gsap.ticker.add(cursorTick);
    }

    // ---- Nav: solidify on scroll, hide on scroll-down / show on up ----
    const nav = document.querySelector<HTMLElement>("[data-site-header]");
    let lastY = window.scrollY;
    const onScrollNav = () => {
      if (!nav) return;
      const y = window.scrollY;
      nav.classList.toggle("is-solid", y > 20);
      nav.classList.toggle("is-hidden", y > lastY && y > 420);
      lastY = y;
    };
    window.addEventListener("scroll", onScrollNav, { passive: true });

    return () => {
      gsap.ticker.remove(onTick);
      if (cursorTick) gsap.ticker.remove(cursorTick);
      document.removeEventListener("click", onAnchor);
      if (onMove) window.removeEventListener("mousemove", onMove);
      if (onOver) document.removeEventListener("mouseover", onOver);
      if (onOut) document.removeEventListener("mouseout", onOut);
      window.removeEventListener("scroll", onScrollNav);
      cursorEl?.remove();
      lenis.destroy();
    };
  }, []);

  // Per-route: (1) the existing FOUC-safe [data-reveal] IO reveal, and
  // (2) a fresh gsap.context() holding all the new scroll animations,
  // reverted on navigation so nothing leaks between pages.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- [data-reveal] : unchanged IntersectionObserver + CSS path ---
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"),
    );
    if (reduced) {
      for (const el of targets) el.classList.add("is-visible");
    }
    let io: IntersectionObserver | null = null;
    if (!reduced && "IntersectionObserver" in window && targets.length) {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            const delay = parseFloat(el.dataset.revealDelay ?? "0");
            if (delay > 0) el.style.transitionDelay = `${delay}s`;
            el.classList.add("is-visible");
            io!.unobserve(el);
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
      );
      for (const el of targets) io.observe(el);
    }
    const safety = window.setTimeout(() => {
      for (const el of targets) {
        if (!el.classList.contains("is-visible")) el.classList.add("is-visible");
      }
    }, 5000);

    if (reduced) {
      return () => {
        window.clearTimeout(safety);
        io?.disconnect();
      };
    }

    // --- new GSAP behaviors, scoped so route changes revert cleanly ---
    const ctx = gsap.context(() => {
      const EASE = "expo.out";

      // Masked headline reveal. Wrap the element's content once in a
      // clipping span so the text rises out from behind its own edge.
      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
        if (!el.dataset.riseReady) {
          const inner = document.createElement("span");
          inner.className = "rise-inner";
          while (el.firstChild) inner.appendChild(el.firstChild);
          el.appendChild(inner);
          el.classList.add("rise-mask");
          el.dataset.riseReady = "1";
        }
        const inner = el.querySelector<HTMLElement>(".rise-inner");
        if (!inner) return;
        gsap.fromTo(
          inner,
          { yPercent: 118 },
          {
            yPercent: 0,
            duration: 1.15,
            ease: EASE,
            delay: parseFloat(el.dataset.riseDelay ?? "0"),
            scrollTrigger: { trigger: el, start: "top 90%" },
          },
        );
      });

      // Clip-path image unveil + inner scale settle.
      gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
        const media = el.querySelector<HTMLElement>("img, video") ?? el;
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%" } });
        tl.fromTo(
          el,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15, ease: EASE },
        ).fromTo(media, { scale: 1.22 }, { scale: 1, duration: 1.5, ease: EASE }, 0);
      });

      // Count-ups. data-count is the target; data-dec / data-suffix /
      // data-plain shape the display.
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const end = parseFloat(el.dataset.count ?? "0");
        const dec = parseInt(el.dataset.dec ?? "0", 10);
        const suffix = el.dataset.suffix ?? "";
        const prefix = el.dataset.prefix ?? "";
        const obj = { v: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () =>
            gsap.to(obj, {
              v: end,
              duration: 1.7,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = prefix + obj.v.toFixed(dec) + suffix;
              },
            }),
        });
      });

      // Gentle parallax while the element is on screen.
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amt = parseFloat(el.dataset.parallax ?? "12");
        gsap.fromTo(
          el,
          { yPercent: -amt / 2 },
          {
            yPercent: amt / 2,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      // Magnetic buttons (fine pointers only).
      if (window.matchMedia("(pointer:fine)").matches) {
        gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((el) => {
          const strength = parseFloat(el.dataset.magnetic ?? "0.4");
          const move = (e: MouseEvent) => {
            const r = el.getBoundingClientRect();
            gsap.to(el, {
              x: (e.clientX - (r.left + r.width / 2)) * strength,
              y: (e.clientY - (r.top + r.height / 2)) * strength,
              duration: 0.6,
              ease: "power3.out",
            });
          };
          const reset = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });
          el.addEventListener("mousemove", move);
          el.addEventListener("mouseleave", reset);
        });
      }

      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      window.clearTimeout(safety);
      io?.disconnect();
      ctx.revert();
    };
  }, [pathname]);

  return null;
}

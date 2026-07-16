"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HeaderSearch } from "./header-search";
import { MainMenu } from "./main-menu";
import { CATEGORIES } from "@/lib/catalog-meta";

const PHONE_DISPLAY = "(715) 848-3855";

/** Rejuvenation-style category row — sits under the utility bar, above the hero. */
const CATEGORY_LINKS: { href: string; label: string; accent?: boolean }[] = [
  ...Object.entries(CATEGORIES).map(([slug, meta]) => ({
    href: `/shop/${slug}`,
    label: meta.label,
  })),
  { href: "/builders-corner", label: "Cabinetry" },
  { href: "/four-squared", label: "Remodels" },
  { href: "/shop", label: "Shop all", accent: true },
];

/**
 * Fixed header (Rejuvenation pattern): utility bar + category strip, pinned
 * to the viewport, hides on scroll-down, returns on scroll-up. A matching
 * spacer keeps page content from sliding under it. `fixed` (not sticky) so
 * Lenis smooth-scroll can't drag the bar down the page.
 */
export function SiteHeader({ brand }: { brand: "priceless" | "builders" | "four-squared" }) {
  const [hidden, setHidden] = useState(false);
  const [height, setHeight] = useState(108);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const measure = () => setHeight(el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y <= 40) setHidden(false);
        else if (y > last + 4) setHidden(true); // scrolling down → hide
        else if (y < last - 4) setHidden(false); // scrolling up → show
        last = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-white transition-transform duration-500 ease-out ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-3 px-4 py-3 md:gap-6 md:px-8 md:py-3.5">
          <Link
            href="/"
            className="flex min-w-0 shrink-0 items-center gap-3"
            aria-label="Price-Less Building Center, Wausau, Wisconsin · Home"
          >
            <Image
              src="/real-photos/logo-priceless-clean.webp"
              alt="Price-Less Building Center logo"
              width={960}
              height={960}
              priority
              className="h-11 w-auto object-contain md:h-12"
            />
            <span className="hidden min-w-0 flex-col leading-none sm:flex">
              <span className="text-[0.95rem] font-medium uppercase tracking-[0.14em] text-[var(--ink)] md:text-[1.05rem]">
                Price-<span className="text-[var(--rust)]">Less</span> Building
              </span>
              <span className="mt-1.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[var(--soft)]">
                Wausau, WI · Est. 1978
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
            <HeaderSearch />
            <a
              href={`tel:${PHONE_DISPLAY.replace(/[^0-9+]/g, "")}`}
              aria-label={`Call ${PHONE_DISPLAY}`}
              className="hidden h-9 items-center gap-2 border border-[var(--line)] px-3 text-[0.8rem] font-medium uppercase tracking-[0.12em] text-[var(--ink)] transition hover:border-[var(--ink)] xl:inline-flex"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--rust)]">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
              </svg>
              {PHONE_DISPLAY}
            </a>
            <MainMenu current={brand} phone={PHONE_DISPLAY} />
          </div>
        </div>

        <nav
          aria-label="Shop by category"
          className="border-t border-[var(--line)]"
        >
          <ul className="mx-auto flex max-w-[1360px] items-center gap-5 overflow-x-auto px-4 py-3 pe-8 text-[0.8rem] font-medium uppercase tracking-[0.12em] text-[var(--ink)] [-ms-overflow-style:none] [scrollbar-width:none] md:justify-center md:gap-7 md:px-8 md:py-3.5 md:text-[0.85rem] [&::-webkit-scrollbar]:hidden">
            {CATEGORY_LINKS.map((link) => (
              <li key={link.href + link.label} className="shrink-0 last:mr-2">
                <Link
                  href={link.href}
                  className={`whitespace-nowrap transition hover:opacity-55 ${
                    link.accent ? "text-[var(--rust)]" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {/* Spacer — same height as the fixed bar so content starts below it */}
      <div aria-hidden style={{ height }} />
    </>
  );
}

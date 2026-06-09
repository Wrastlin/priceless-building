"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/catalog";

/**
 * Universal main-menu drawer. Replaces the old mobile-only nav drawer.
 *
 * Triggered by the hamburger button rendered inline by the site-header
 * at every breakpoint. Inside, the drawer shows:
 *
 *   1. A 2-column image grid of shop departments (people register
 *      pictures faster than they register a list of twelve text links).
 *   2. The rest of the site nav as a compact list (about, reviews,
 *      contact, tour, map, etc).
 *   3. A brand-switcher row with the Price-Less, Builders Corner, and
 *      Four Squared pills so you can hop between the three identities.
 *   4. A phone-call CTA at the bottom.
 *
 * Close affordances per WAI-ARIA: tap a link, tap the backdrop, press
 * Escape, tap the close button. Body scroll is locked while open so iOS
 * Safari does not rubber-band the underlying page.
 */

const SECONDARY_NAV: { href: string; label: string }[] = [
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Visit · contact" },
];

export function MainMenu({
  current,
  phone,
}: {
  current: "priceless" | "builders" | "four-squared";
  phone: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const departments = Object.entries(CATEGORIES).slice(0, 8) as [
    string,
    { label: string; image: string; blurb: string },
  ][];

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="main-menu-drawer"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center gap-2.5 rounded-md border border-[var(--border)] bg-white px-3.5 text-base font-semibold text-[var(--foreground)] transition hover:border-[var(--foreground)]/30 hover:bg-[var(--muted)]"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        <span className="hidden sm:inline">Menu</span>
      </button>

      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={
          "fixed inset-0 z-50 bg-black/45 backdrop-blur-sm transition-opacity duration-200 " +
          (open ? "opacity-100" : "pointer-events-none opacity-0")
        }
      />

      <aside
        id="main-menu-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={
          "fixed inset-y-0 right-0 z-50 flex w-[92%] max-w-[460px] flex-col bg-white shadow-2xl transition-transform duration-250 md:max-w-[560px] " +
          (open ? "translate-x-0" : "translate-x-full pointer-events-none")
        }
        style={{ transitionTimingFunction: "cubic-bezier(.2,.8,.2,1)" }}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
            Menu
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-[var(--foreground)] hover:bg-[var(--muted)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <section className="px-5 pt-5">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              Shop by department
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-3">
              {departments.map(([key, dept]) => (
                <li key={key}>
                  <Link
                    href={`/shop/${key}`}
                    onClick={() => setOpen(false)}
                    className="group block overflow-hidden border border-[var(--border)] bg-white transition hover:border-[var(--brand-priceless)]"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--muted)]">
                      <Image
                        src={dept.image}
                        alt={dept.label}
                        fill
                        sizes="(min-width: 768px) 280px, 50vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-center justify-between px-3 py-2.5">
                      <span className="font-display text-base leading-none">
                        {dept.label}
                      </span>
                      <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)] opacity-0 transition group-hover:opacity-100">
                        →
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="font-mono mt-4 inline-flex items-center text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4"
            >
              Shop everything →
            </Link>
          </section>

          <section className="mt-8 border-t border-[var(--border)] px-5 pt-5">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              The rest of the site
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
              {SECONDARY_NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-base text-[var(--foreground)] transition hover:text-[var(--brand-priceless)]"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8 border-t border-[var(--border)] px-5 pt-5 pb-6">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              Our other brands
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <BrandPill
                href="/"
                onClick={() => setOpen(false)}
                color="priceless"
                active={current === "priceless"}
                title="Price-Less Building"
                subtitle="Discount + surplus building materials"
              />
              <BrandPill
                href="/builders-corner"
                onClick={() => setOpen(false)}
                color="builders"
                active={current === "builders"}
                title="Builders Corner"
                subtitle="Premium custom cabinetry + materials"
              />
              <BrandPill
                href="/four-squared"
                onClick={() => setOpen(false)}
                color="four-squared"
                active={current === "four-squared"}
                title="Four Squared"
                subtitle="Custom installation + home renovations"
              />
            </div>
          </section>
        </div>

        <div className="border-t border-[var(--border)] p-4">
          <a
            href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
            onClick={() => setOpen(false)}
            className="btn btn-priceless w-full"
          >
            Call {phone}
          </a>
        </div>
      </aside>
    </>
  );
}

function BrandPill({
  href,
  onClick,
  color,
  active,
  title,
  subtitle,
}: {
  href: string;
  onClick: () => void;
  color: "priceless" | "builders" | "four-squared";
  active: boolean;
  title: string;
  subtitle: string;
}) {
  const swatchClass =
    color === "priceless"
      ? "bg-[var(--brand-priceless)]"
      : color === "builders"
        ? "bg-[var(--brand-builders)]"
        : "bg-emerald-700";
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={
        "group flex items-center gap-3 border border-[var(--border)] p-3 transition " +
        (active
          ? "border-[var(--foreground)]/30 bg-[var(--muted)]"
          : "hover:border-[var(--foreground)]/30 hover:bg-[var(--muted)]")
      }
    >
      <span aria-hidden className={`size-2.5 rounded-full ${swatchClass}`} />
      <span className="flex flex-1 flex-col leading-tight">
        <span className="font-display text-base">{title}</span>
        <span className="text-xs text-[var(--muted-foreground)]">{subtitle}</span>
      </span>
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)] group-hover:text-[var(--brand-priceless)]">
        {active ? "Current" : "Visit →"}
      </span>
    </Link>
  );
}

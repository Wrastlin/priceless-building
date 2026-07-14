"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CATEGORIES } from "@/lib/catalog-meta";

/**
 * Universal main-menu drawer. Lead with site sections + departments so a
 * first-time visitor can find their way fast; the three companies sit lower.
 *
 * Rendered via portal to document.body so the header's hide-on-scroll
 * `transform` cannot trap `position: fixed` (that was collapsing the
 * drawer to header height).
 */

type PathTone = "priceless" | "builders" | "four-squared" | "start";

const SITE_NAV: { href: string; label: string }[] = [
  { href: "/shop", label: "Shop all" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Visit + contact" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
];

const COMPANIES: { href: string; label: string; sub: string; tone: PathTone }[] = [
  {
    href: "/shop",
    label: "Price-Less Building",
    sub: "Surplus doors, windows, cabinets, vanities, lighting, hardware.",
    tone: "priceless",
  },
  {
    href: "/builders-corner",
    label: "Builders Corner",
    sub: "Premium custom cabinetry — designed here, built in our Wausau shop.",
    tone: "builders",
  },
  {
    href: "/four-squared",
    label: "4 Squared",
    sub: "Kitchens, baths, and full renovations by the in-house crew.",
    tone: "four-squared",
  },
  {
    href: "/contact",
    label: "Start a project",
    sub: "Visit, call, or send us photos of your space.",
    tone: "start",
  },
];

export function MainMenu({
  current,
  phone,
}: {
  current: "priceless" | "builders" | "four-squared";
  phone: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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

  const drawer =
    mounted &&
    createPortal(
      <>
        <div
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className={
            "fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm transition-opacity duration-200 " +
            (open ? "opacity-100" : "pointer-events-none opacity-0")
          }
        />

        <aside
          id="main-menu-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className={
            "fixed inset-y-0 right-0 z-[90] flex h-dvh w-[92%] max-w-[460px] flex-col bg-white shadow-2xl transition-transform duration-250 md:max-w-[560px] " +
            (open ? "translate-x-0" : "translate-x-full pointer-events-none")
          }
          style={{ transitionTimingFunction: "cubic-bezier(.2,.8,.2,1)" }}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-[var(--line)] px-5 py-4">
            <span className="eyebrow">Menu</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center text-[var(--ink)] transition hover:bg-[var(--cream)]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <section className="px-5 pt-5">
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 border border-[var(--line)] px-4 py-3 transition hover:border-[var(--ink)] hover:bg-[var(--cream)]"
              >
                <span className="grid size-9 shrink-0 place-items-center bg-[var(--cream)] text-[var(--ink)]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <span className="flex flex-1 flex-col leading-tight">
                  <span className="font-medium">My account</span>
                  <span className="text-sm font-light text-[var(--soft)]">Sign in or create an account</span>
                </span>
                <span className="text-sm text-[var(--soft)]">→</span>
              </Link>
            </section>

            <section className="px-5 pt-6">
              <div className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-[var(--soft)]">
                Explore
              </div>
              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
                {SITE_NAV.map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="block py-2 text-base text-[var(--ink)] transition hover:opacity-55"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-6 border-t border-[var(--line)] px-5 pt-5">
              <div className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-[var(--soft)]">
                Shop by department
              </div>
              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
                {departments.map(([key, dept]) => (
                  <li key={key}>
                    <Link
                      href={`/shop/${key}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 py-2 text-base text-[var(--ink)] transition hover:opacity-55"
                    >
                      <span className="relative size-9 shrink-0 overflow-hidden bg-[var(--taupe)]">
                        <Image src={dept.image} alt="" fill sizes="36px" className="object-cover" />
                      </span>
                      <span className="leading-tight">{dept.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-6 border-t border-[var(--line)] px-5 pb-6 pt-5">
              <div className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-[var(--soft)]">
                Our companies
              </div>
              <ul className="mt-3 flex flex-col gap-2.5">
                {COMPANIES.map((p) => (
                  <li key={`${p.tone}-${p.href}`}>
                    <PrimaryRow
                      {...p}
                      onClick={() => setOpen(false)}
                      active={p.tone !== "priceless" && p.tone !== "start" && current === p.tone}
                    />
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="shrink-0 border-t border-[var(--line)] p-4">
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
              onClick={() => setOpen(false)}
              className="btn btn-priceless w-full"
            >
              Call {phone}
            </a>
          </div>
        </aside>
      </>,
      document.body,
    );

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="main-menu-drawer"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 border border-[var(--line)] bg-white px-2.5 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[var(--ink)] transition hover:border-[var(--ink)] hover:bg-[var(--cream)]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        <span className="hidden sm:inline">Menu</span>
      </button>
      {drawer}
    </>
  );
}

function PrimaryRow({
  href,
  label,
  sub,
  tone,
  active,
  onClick,
}: {
  href: string;
  label: string;
  sub: string;
  tone: PathTone;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={
        "group flex items-center gap-4 border border-[var(--line)] p-4 transition " +
        (active
          ? "border-[var(--ink)]/40 bg-[var(--cream)]"
          : "hover:border-[var(--ink)]/30 hover:bg-[var(--cream)]")
      }
    >
      <PrimaryIcon tone={tone} />
      <span className="flex flex-1 flex-col gap-1">
        <span className="font-display text-lg leading-tight">{label}</span>
        <span className="text-sm font-light leading-snug text-[var(--soft)]">{sub}</span>
      </span>
      <span className="text-sm text-[var(--soft)] group-hover:text-[var(--ink)]">→</span>
    </Link>
  );
}

function PrimaryIcon({ tone }: { tone: PathTone }) {
  if (tone === "priceless") {
    return (
      <span className="grid size-14 shrink-0 place-items-center border border-[var(--line)] bg-white">
        <Image
          src="/real-photos/logo-priceless-clean.webp"
          alt=""
          width={960}
          height={960}
          className="h-11 w-auto object-contain"
        />
      </span>
    );
  }
  if (tone === "builders") {
    return (
      <span className="grid size-14 shrink-0 place-items-center border border-[var(--line)] bg-white">
        <Image
          src="/real-photos/logo-builders-corner-real.jpg"
          alt=""
          width={446}
          height={320}
          className="h-8 w-auto object-contain"
        />
      </span>
    );
  }
  if (tone === "four-squared") {
    return (
      <span className="grid size-14 shrink-0 place-items-center border border-[var(--line)] bg-white p-1.5">
        <Image
          src="/real-photos/logo-4squared.jpg"
          alt=""
          width={140}
          height={140}
          className="h-full w-full object-contain"
        />
      </span>
    );
  }
  return (
    <span className="grid size-14 shrink-0 place-items-center bg-[var(--ink)] text-white">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    </span>
  );
}

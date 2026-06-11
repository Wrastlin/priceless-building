"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/catalog-meta";

/**
 * Universal main-menu drawer. Lead the drawer with the high-value
 * paths first — shop everything, premium custom cabinetry, install
 * crew, and start-a-project — instead of dropping the visitor into a
 * grid of eight individual shop departments. Department browsing is
 * still available, compact, near the bottom.
 *
 * Close affordances per WAI-ARIA: tap a link, tap the backdrop, press
 * Escape, tap the close button. Body scroll is locked while open so iOS
 * Safari does not rubber-band the underlying page.
 */

type PathTone = "priceless" | "builders" | "four-squared" | "start";

const PRIMARY_PATHS: { href: string; label: string; sub: string; tone: PathTone }[] = [
  {
    href: "/shop",
    label: "Shop the warehouse",
    sub: "Surplus doors, windows, cabinets, vanities, lighting, hardware.",
    tone: "priceless",
  },
  {
    href: "/builders-corner",
    label: "Premium custom cabinetry",
    sub: "Designed in our showroom, built in our Wausau shop.",
    tone: "builders",
  },
  {
    href: "/four-squared",
    label: "Custom installs + remodels",
    sub: "Kitchens, baths, full renovations by the in-house crew.",
    tone: "four-squared",
  },
  {
    href: "/contact",
    label: "Start a project",
    sub: "Visit, call, or send us photos of your space.",
    tone: "start",
  },
];

const SITE_NAV: { href: string; label: string }[] = [
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Visit + contact" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contractors", label: "Contractor accounts" },
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
          {/* Primary paths. The four entry points people actually want:
              shop, cabinetry, installs, start-a-project. */}
          <section className="px-5 pt-5">
            <ul className="flex flex-col gap-2.5">
              {PRIMARY_PATHS.map((p) => (
                <li key={p.href}>
                  <PrimaryRow {...p} onClick={() => setOpen(false)} active={p.tone !== "priceless" && p.tone !== "start" && current === p.tone} />
                </li>
              ))}
            </ul>
          </section>

          {/* Department list. Compact, secondary — for the visitor who
              already knows exactly what they want. */}
          <section className="mt-8 border-t border-[var(--border)] px-5 pt-5">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              Or jump straight to a department
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
              {departments.map(([key, dept]) => (
                <li key={key}>
                  <Link
                    href={`/shop/${key}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 py-2 text-base text-[var(--foreground)] transition hover:text-[var(--brand-priceless)]"
                  >
                    <span className="relative size-9 shrink-0 overflow-hidden bg-[var(--muted)]">
                      <Image src={dept.image} alt="" fill sizes="36px" className="object-cover" />
                    </span>
                    <span className="leading-tight">{dept.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Standard site nav. */}
          <section className="mt-8 border-t border-[var(--border)] px-5 pt-5 pb-6">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              The rest of the site
            </div>
            <ul className="mt-3 grid grid-cols-3 gap-x-4 gap-y-1">
              {SITE_NAV.map((n) => (
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
        "group flex items-center gap-4 border border-[var(--border)] p-4 transition " +
        (active
          ? "border-[var(--foreground)]/40 bg-[var(--muted)]"
          : "hover:border-[var(--foreground)]/30 hover:bg-[var(--muted)]")
      }
    >
      <PrimaryIcon tone={tone} />
      <span className="flex flex-1 flex-col gap-1">
        <span className="font-display text-lg leading-tight">{label}</span>
        <span className="text-sm leading-snug text-[var(--muted-foreground)]">{sub}</span>
      </span>
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)] group-hover:text-[var(--brand-priceless)]">
        →
      </span>
    </Link>
  );
}

function PrimaryIcon({ tone }: { tone: PathTone }) {
  // 56px square tile, white background, brand logo or icon centered.
  // Reads as a real visual anchor instead of the old colored dot.
  if (tone === "priceless") {
    return (
      <span className="grid size-14 shrink-0 place-items-center border border-[var(--border)] bg-white">
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
      <span className="grid size-14 shrink-0 place-items-center border border-[var(--border)] bg-white">
        <Image
          src="/real-photos/logo-builders-corner@2x.webp"
          alt=""
          width={446}
          height={320}
          className="h-8 w-auto object-contain"
        />
      </span>
    );
  }
  if (tone === "four-squared") {
    // FS brand mark: four squares, sized to fill the icon tile.
    return (
      <span className="grid size-14 shrink-0 place-items-center border border-[var(--border)] bg-white">
        <svg width="32" height="32" viewBox="0 0 20 20" aria-hidden="true" className="text-emerald-700">
          <rect x="0" y="0" width="9" height="9" fill="currentColor" />
          <rect x="11" y="0" width="9" height="9" fill="currentColor" />
          <rect x="0" y="11" width="9" height="9" fill="currentColor" />
          <rect x="11" y="11" width="9" height="9" fill="currentColor" />
        </svg>
      </span>
    );
  }
  // start: a build/wrench glyph so it reads as action, not brand.
  return (
    <span className="grid size-14 shrink-0 place-items-center border border-[var(--border)] bg-[var(--brand-priceless)] text-white">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    </span>
  );
}

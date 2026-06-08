"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Mobile slide-in drawer. Right-side sheet that holds the full nav, a
 * brand switcher, and the phone CTA at the bottom. Triggered by a
 * hamburger button rendered inline in the site-header on mobile widths.
 *
 * Close affordances (per WAI-ARIA dialog pattern):
 *   - tap any link
 *   - tap the backdrop
 *   - press Escape
 *   - tap the X
 *
 * Animation uses native CSS transitions on transform + opacity, no
 * libraries. The drawer mounts in the React tree always so the open/close
 * transition is symmetric; pointer-events are gated on `open` so it doesn't
 * intercept clicks when hidden.
 *
 * Body scroll is locked while open so the page underneath doesn't
 * shimmy on iOS Safari. We track previous overflow + paddingRight so we
 * restore them cleanly even if multiple drawers stack in the future.
 */

export type DrawerNavItem = { href: string; label: string };

export function MobileDrawer({
  brand,
  nav,
  phone,
}: {
  brand: "priceless" | "builders";
  nav: ReadonlyArray<DrawerNavItem>;
  phone: string;
}) {
  const [open, setOpen] = useState(false);
  const isPL = brand === "priceless";

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    // Compensate for the scrollbar width so the layout doesn't jump.
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

  const accent = isPL ? "var(--brand-priceless)" : "var(--brand-builders)";
  const switcherHref = isPL ? "/builders-corner" : "/";
  const switcherLabel = isPL ? "Builders Corner →" : "← Price-Less Building";

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-drawer"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-md text-[var(--foreground)] hover:bg-[var(--muted)] md:hidden"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {/* Backdrop. Faded scrim that swallows taps outside the panel. */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-200 md:hidden " +
          (open ? "opacity-100" : "pointer-events-none opacity-0")
        }
      />

      {/* Panel */}
      <aside
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={
          "fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-[360px] flex-col bg-white shadow-2xl transition-transform duration-250 md:hidden " +
          (open ? "translate-x-0" : "translate-x-full pointer-events-none")
        }
        style={{ transitionTimingFunction: "cubic-bezier(.2,.8,.2,1)" }}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: accent }}>
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

        <nav className="flex-1 overflow-y-auto px-2 py-2">
          <ul className="flex flex-col">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={
                    isPL
                      ? "font-mono block px-4 py-3.5 text-sm uppercase tracking-[0.14em] text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--brand-priceless)]"
                      : "font-couture block px-4 py-3.5 text-base text-[var(--brand-builders)] hover:bg-[var(--muted)] hover:text-[var(--brand-builders-gold)]"
                  }
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-[var(--border)] px-4 pt-4">
            <Link
              href={switcherHref}
              onClick={() => setOpen(false)}
              className={
                isPL
                  ? "font-couture block py-2 text-base italic text-[var(--brand-builders)] underline decoration-[var(--brand-builders-gold)] decoration-2 underline-offset-4"
                  : "font-couture block py-2 text-base italic text-[var(--muted-foreground)]"
              }
            >
              {switcherLabel}
            </Link>
          </div>
        </nav>

        <div className="border-t border-[var(--border)] p-4">
          <a
            href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
            onClick={() => setOpen(false)}
            className="btn btn-priceless w-full"
            style={isPL ? undefined : { background: "var(--brand-builders)" }}
          >
            Call {phone}
          </a>
        </div>
      </aside>
    </>
  );
}

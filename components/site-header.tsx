import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { CartButton } from "./cart-button";
import { MainMenu } from "./main-menu";

const PHONE_DISPLAY = "(715) 848-3855";

/**
 * Universal site header.
 *
 * One layout serves all three brand contexts. The current brand gets
 * the prominent logo + wordmark on the far left; the other two appear
 * as compact brand pills next to it, each with their own icon and
 * brand color. Right side carries the cart, the phone CTA, and the
 * hamburger button that opens the main menu drawer with shop-by-
 * department picture cards.
 *
 * No second-row text nav. The hamburger handles the breadth so people
 * see images (cabinets, doors, vanities) instead of twelve text links.
 */
export function SiteHeader({ brand }: { brand: "priceless" | "builders" | "four-squared" }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:gap-6 md:px-6">
        {/* Active brand on the far left. The other two brands are not
            promoted up here; they live in the main menu drawer with
            full positioning (Premium materials / Custom installation). */}
        <ActiveBrand brand={brand} />

        {/* Right cluster. All three controls share the same h-11 pill
            shape, neutral border, and mono uppercase weight so they
            read as one group instead of three competing sizes. */}
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={`tel:${PHONE_DISPLAY.replace(/[^0-9+]/g, "")}`}
            aria-label={`Call ${PHONE_DISPLAY}`}
            className="font-mono hidden h-11 items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 text-[11px] uppercase tracking-[0.22em] text-[var(--brand-priceless)] transition hover:border-[var(--brand-priceless)] hover:bg-[var(--brand-priceless)] hover:text-white lg:inline-flex"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>{PHONE_DISPLAY}</span>
          </a>
          {brand === "priceless" ? <CartButton /> : null}
          <MainMenu current={brand} phone={PHONE_DISPLAY} />
        </div>
      </div>
    </header>
  );
}

function ActiveBrand({ brand }: { brand: "priceless" | "builders" | "four-squared" }) {
  if (brand === "priceless") {
    return (
      <Link
        href="/"
        className="flex shrink-0 items-center gap-3"
        aria-label="Price-Less Building Center, Wausau, Wisconsin"
      >
        <Image
          src="/real-photos/logo-priceless-circular@2x.webp"
          alt=""
          width={446}
          height={558}
          priority
          className="h-12 w-auto object-contain md:h-14"
        />
        <span className="hidden min-w-0 flex-col leading-none sm:flex">
          <span className="font-display text-lg tracking-tight text-foreground md:text-xl">
            Price-<span className="text-[var(--brand-priceless)]">Less</span> Building
          </span>
          <span className="mt-1 truncate text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)] md:text-xs">
            Wausau, WI · Est. 1978
          </span>
        </span>
      </Link>
    );
  }
  if (brand === "builders") {
    return (
      <Link
        href="/builders-corner"
        className="flex shrink-0 items-center gap-3"
        aria-label="Builders Corner Cabinetry &amp; Design"
      >
        <BrandLogo brand="builders" size="md" />
      </Link>
    );
  }
  return (
    <Link
      href="/four-squared"
      className="flex shrink-0 items-center gap-2"
      aria-label="Four Squared Construction"
    >
      <BrandLogo brand="four-squared" size="md" />
    </Link>
  );
}


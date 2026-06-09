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

        {/* Right cluster: phone CTA, cart, hamburger. */}
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <a
            href={`tel:${PHONE_DISPLAY.replace(/[^0-9+]/g, "")}`}
            className="font-mono hidden text-sm uppercase tracking-[0.18em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4 md:inline"
          >
            {PHONE_DISPLAY}
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


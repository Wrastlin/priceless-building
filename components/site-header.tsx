import Image from "next/image";
import Link from "next/link";
import { CartButton } from "./cart-button";
import { HeaderSearch } from "./header-search";
import { MainMenu } from "./main-menu";

const PHONE_DISPLAY = "(715) 848-3855";

/**
 * Universal site header. ONE navigation across the whole site.
 *
 * The Price-Less logo + wordmark always sits on the left and always
 * links back to the home page, no matter which sub-brand article
 * (Builders Corner, Four Squared) the user is currently reading.
 * Builders Corner and Four Squared are sub-facets of the same
 * operation; they do not replace the brand chrome.
 *
 * The right side carries search, phone, cart, and the menu hamburger
 * — same controls across every page so people always know where to
 * find them.
 */
export function SiteHeader({ brand }: { brand: "priceless" | "builders" | "four-squared" }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:gap-6 md:px-6">
        {/* Price-Less brand on the left, always. Home is always one
            click away from anywhere on the site. */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="Price-Less Building Center, Wausau, Wisconsin · Home"
        >
          <Image
            src="/real-photos/logo-priceless-clean.webp"
            alt="Price-Less Building Center logo"
            width={960}
            height={960}
            priority
            className="h-12 w-auto object-contain md:h-14"
          />
          <span className="hidden min-w-0 flex-col leading-none sm:flex">
            <span className="font-display text-lg tracking-tight text-foreground md:text-xl">
              Price-<span className="text-[var(--brand-priceless)]">Less</span> Building
            </span>
            <span className="mt-1 truncate text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)] md:text-xs">
              Wausau, WI · Est. 1978
            </span>
          </span>
        </Link>

        {/* Right cluster. Search, phone, cart, menu — same controls
            on every page so the experience never shifts. */}
        <div className="flex shrink-0 items-center gap-2">
          <HeaderSearch />
          <a
            href={`tel:${PHONE_DISPLAY.replace(/[^0-9+]/g, "")}`}
            aria-label={`Call ${PHONE_DISPLAY}`}
            className="hidden h-11 items-center gap-2.5 rounded-md border border-[var(--border)] bg-white px-3.5 text-base font-semibold text-[var(--brand-priceless)] transition hover:border-[var(--brand-priceless)] hover:bg-[var(--brand-priceless)] hover:text-white lg:inline-flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>{PHONE_DISPLAY}</span>
          </a>
          <CartButton />
          <MainMenu current={brand} phone={PHONE_DISPLAY} />
        </div>
      </div>
    </header>
  );
}

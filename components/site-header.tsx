import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { CartButton } from "./cart-button";
import { MobileDrawer } from "./mobile-drawer";

const PHONE_DISPLAY = "(715) 848-3855";

/**
 * Two-row site header. Brand-aware typography:
 *   - Price-Less uses Bebas display + mono utility chrome (warehouse feel).
 *   - Builders Corner uses Cormorant Garamond throughout (luxury hospitality).
 *
 * All type sizes sit on the Utopia fluid scale via Tailwind tokens.
 * Avoid micro-text. Every label here reads on a 32-inch monitor from
 * across the room.
 */
export function SiteHeader({ brand }: { brand: "priceless" | "builders" }) {
  const isPL = brand === "priceless";
  const nav = isPL
    ? [
        { href: "/shop", label: "Shop" },
        { href: "/shop/doors", label: "Doors" },
        { href: "/shop/windows", label: "Windows" },
        { href: "/shop/cabinets", label: "Cabinets" },
        { href: "/tour", label: "Tour" },
        { href: "/aisle-map", label: "Map" },
        { href: "/four-squared", label: "Four Squared" },
        { href: "/search", label: "Search" },
      ]
    : [
        { href: "/builders-corner/kitchens", label: "Kitchens" },
        { href: "/builders-corner/baths", label: "Baths" },
        { href: "/builders-corner/gallery", label: "Gallery" },
        { href: "/builders-corner/door-styles", label: "Door styles" },
        { href: "/builders-corner/finishes", label: "Finishes" },
        { href: "/builders-corner/process", label: "Process" },
        { href: "/builders-corner/consultation", label: "Consult" },
      ];

  if (!isPL) {
    // Builders Corner header. Two rows so the brand wordmark, nav, and
    // contact all have room to breathe without wrapping. Sizes use the
    // Utopia scale consistently per role: monogram = display step,
    // tagline + phone = body step, nav links = small step.
    return (
      <header className="sticky top-0 z-40 border-b border-[var(--brand-builders)]/15 bg-white">
        {/* TOP. Brand + contact, never wraps */}
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 whitespace-nowrap px-6 py-4 md:px-10">
          <Link href="/builders-corner" className="flex items-center gap-4" aria-label="Builders Corner Cabinetry &amp; Design">
            <BrandLogo brand="builders" size="md" />
          </Link>

          <div className="flex items-center gap-3 md:gap-5">
            <a
              href="tel:+17158483855"
              className="hidden border-b border-[var(--brand-builders-gold)] pb-0.5 text-sm text-[var(--brand-builders)] md:inline md:text-base"
            >
              {PHONE_DISPLAY}
            </a>
            <MobileDrawer brand="builders" nav={nav} phone={PHONE_DISPLAY} />
          </div>
        </div>

        {/* BOTTOM. Nav, restrained scale, never overflows */}
        <nav className="mx-auto hidden max-w-[1600px] items-center gap-x-8 gap-y-2 border-t border-[var(--brand-builders)]/10 px-6 py-3 md:flex md:px-10">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="font-couture text-sm text-[var(--brand-builders)] transition hover:text-[var(--brand-builders-gold)]"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/"
            className="font-couture ml-auto text-sm italic text-[var(--muted-foreground)] hover:text-[var(--brand-priceless)]"
          >
            ← Price-Less
          </Link>
        </nav>
      </header>
    );
  }

  // Price-Less header. Warehouse feel, utility mono chrome (kept as-is).
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3" aria-label="Price-Less Building Center, Wausau, Wisconsin">
          <Image
            src="/real-photos/logo-priceless-circular@2x.webp"
            alt=""
            width={446}
            height={558}
            priority
            className="h-14 w-auto md:h-16 object-contain"
          />
          <span className="hidden flex-col leading-none md:flex">
            <span className="font-display text-xl tracking-tight text-foreground">
              Price-<span className="text-[var(--brand-priceless)]">Less</span> Building Center
            </span>
            <span className="mt-1 text-xs text-[var(--muted-foreground)]">Wausau, WI · Est. 1978</span>
          </span>
        </Link>

        <div className="flex items-center gap-3 md:gap-5">
          <CartButton />
          <a
            href="tel:+17158483855"
            className="font-mono hidden border-b-2 border-[var(--brand-priceless)] pb-0.5 text-sm uppercase tracking-[0.18em] text-[var(--brand-priceless)] md:inline md:text-base"
          >
            {PHONE_DISPLAY}
          </a>
          <MobileDrawer brand="priceless" nav={nav} phone={PHONE_DISPLAY} />
        </div>
      </div>

      <nav className="mx-auto hidden max-w-7xl items-center gap-7 border-t border-[var(--border)] px-6 py-3 md:flex">
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="font-mono text-sm uppercase tracking-[0.14em] text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
          >
            {n.label}
          </Link>
        ))}
        <Link
          href="/builders-corner"
          className="font-couture ml-auto text-sm italic text-[var(--brand-builders)] underline decoration-[var(--brand-builders-gold)] decoration-2 underline-offset-4 hover:text-[var(--brand-builders-gold)]"
        >
          Builders Corner →
        </Link>
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          {new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()} · OPEN 8–5
        </span>
      </nav>
    </header>
  );
}

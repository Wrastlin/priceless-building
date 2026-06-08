import Image from "next/image";

/**
 * Brand logo renderer. One place to keep the marks accurate.
 *
 *  - "priceless"  → the REAL Price-Less circular badge with phone + address,
 *                   pulled from their Google Business listing.
 *  - "builders"   → the REAL Builders Corner cursive "B" wordmark, pulled
 *                   from their Google Business listing.
 *  - "four-squared" → 4-square SVG icon + bold sans wordmark. Four Squared
 *                   Construction does not publish a standalone logo.
 *
 * Each variant supports a size prop ("sm" | "md" | "lg") so the mark sits
 * correctly inline next to a name OR as a standalone block.
 *
 * The hand-painted storefront sign image (sign-logo.webp) is preserved
 * in the asset library as an authentic piece of the brand, but the
 * canonical mark in use across the site is the circular badge above.
 */
export function BrandLogo({
  brand,
  size = "md",
  className = "",
}: {
  brand: "priceless" | "builders" | "four-squared";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  if (brand === "priceless") {
    const h = size === "sm" ? "h-10" : size === "lg" ? "h-24" : "h-16";
    return (
      <Image
        src="/real-photos/logo-priceless-circular@2x.webp"
        alt="Price-Less Building Center"
        width={446}
        height={558}
        className={`${h} w-auto select-none object-contain ${className}`}
      />
    );
  }

  if (brand === "builders") {
    const h = size === "sm" ? "h-10" : size === "lg" ? "h-24" : "h-16";
    return (
      <Image
        src="/real-photos/logo-builders-corner@2x.webp"
        alt="Builder's Corner Cabinetry"
        width={446}
        height={320}
        className={`${h} w-auto select-none object-contain ${className}`}
      />
    );
  }

  // four-squared
  const sq = size === "sm" ? 14 : size === "lg" ? 26 : 18;
  const wordSize = size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-base";
  return (
    <span className={`inline-flex items-center gap-2 leading-none ${className}`}>
      <svg width={sq} height={sq} viewBox="0 0 20 20" aria-hidden="true" className="text-emerald-700">
        <rect x="0" y="0" width="9" height="9" fill="currentColor" />
        <rect x="11" y="0" width="9" height="9" fill="currentColor" />
        <rect x="0" y="11" width="9" height="9" fill="currentColor" />
        <rect x="11" y="11" width="9" height="9" fill="currentColor" />
      </svg>
      <span className={`font-semibold tracking-tight text-foreground ${wordSize}`}>
        Four Squared
      </span>
    </span>
  );
}

/** Cross-brand badge for footer / about-page chips. Uses the real Price-Less
 *  circular seal (with phone + address). */
export function CircularSeal({ className = "h-16" }: { className?: string }) {
  return (
    <Image
      src="/real-photos/logo-priceless-circular@2x.webp"
      alt="Price-Less Building Center · 715-848-3855 · 825 Washington St, Wausau, WI"
      width={446}
      height={558}
      className={`w-auto select-none object-contain ${className}`}
    />
  );
}

import Link from "next/link";

/**
 * One section-header pattern across the site.
 *
 * Pre-existing pages each invented their own horizontal "kicker + giant
 * headline + medium subtitle" row, which crammed 3 type sizes onto a
 * single baseline and read as chaos. This component locks in one stacked
 * hierarchy:
 *
 *   Kicker (eyebrow label, gold)
 *   Headline (display serif, fluid 4xl-5xl)
 *   Optional sub-paragraph (body, sm-base)
 *   Optional text link (sentence case, gold underline)
 *
 * All left-aligned, vertical rhythm, generous breathing room. One look
 * everywhere. No more horizontal three-size jams.
 */
export function SectionHead({
  kicker,
  headline,
  sub,
  link,
  accent = "priceless",
  align = "left",
  bordered = false,
  invert = false,
  font = "display",
  className = "",
}: {
  kicker?: string;
  headline: React.ReactNode;
  sub?: React.ReactNode;
  link?: { href: string; label: string };
  accent?: "priceless" | "builders" | "emerald";
  align?: "left" | "center";
  bordered?: boolean;
  invert?: boolean;
  /** "display" = Besley slab (Price-Less). "couture" = Marcellus, the
   *  elegant Builder's Corner voice. */
  font?: "display" | "couture";
  className?: string;
}) {
  // Kicker: the shared .eyebrow treatment. Non-default accents keep
  // their own hue via explicit utilities (same weight/tracking).
  const kickerClass =
    accent === "builders"
      ? `text-xs font-semibold uppercase tracking-[0.18em] ${invert ? "text-[var(--brand-builders-gold)]" : "text-[var(--brand-builders)]"}`
      : accent === "emerald"
        ? `text-xs font-semibold uppercase tracking-[0.18em] ${invert ? "text-emerald-300" : "text-emerald-700"}`
        : `eyebrow ${invert ? "eyebrow-on-dark" : ""}`;
  const headlineColor = invert ? "text-white" : "text-[var(--foreground)]";
  const subColor = invert ? "text-white/85" : "text-[var(--muted-foreground)]";
  const linkColor = invert ? "text-[var(--cream)]" : "text-[var(--brand-navy)]";
  const borderColor = invert ? "border-white/10" : "border-[var(--border)]";
  const wrap =
    align === "center"
      ? "mx-auto max-w-3xl text-center"
      : "max-w-3xl";
  return (
    <header
      data-reveal
      className={`${wrap} ${bordered ? `border-b ${borderColor} pb-7` : ""} ${className}`}
    >
      {kicker ? (
        <div className={kickerClass}>
          {kicker}
        </div>
      ) : null}
      <h2
        className={
          font === "couture"
            ? `font-couture mt-4 text-[clamp(2.1rem,1.4rem+3.2vw,3.6rem)] leading-[1.12] ${headlineColor}`
            : `font-display mt-3 text-[clamp(2rem,1.4rem+3vw,3.5rem)] leading-[1.05] ${headlineColor}`
        }
      >
        {headline}
      </h2>
      {sub ? (
        <p className={`mt-4 max-w-2xl text-base leading-relaxed md:text-lg ${subColor} ${align === "center" ? "mx-auto" : ""}`}>
          {sub}
        </p>
      ) : null}
      {link ? (
        <div className={`mt-5 ${align === "center" ? "" : ""}`}>
          <Link
            href={link.href}
            className={`inline-flex items-center text-sm font-semibold underline decoration-[var(--brand-gold)]/60 underline-offset-4 ${linkColor}`}
          >
            {link.label} →
          </Link>
        </div>
      ) : null}
    </header>
  );
}

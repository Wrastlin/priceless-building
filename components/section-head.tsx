import Link from "next/link";

/**
 * One section-header pattern across the site.
 *
 * Pre-existing pages each invented their own horizontal "kicker + giant
 * headline + medium subtitle" row, which crammed 3 type sizes onto a
 * single baseline and read as chaos. This component locks in one stacked
 * hierarchy:
 *
 *   KICKER (mono, 11px, brand color)
 *   Headline (display, fluid 4xl-5xl)
 *   Optional sub-paragraph (body, sm-base)
 *   Optional right-aligned link (mono, 11px)
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
  className?: string;
}) {
  const accentColor =
    accent === "builders" ? "text-[var(--brand-builders)]" :
    accent === "emerald" ? "text-emerald-700" :
    "text-[var(--brand-priceless)]";
  const accentInvert =
    accent === "builders" ? "text-[#9dbcff]" :
    accent === "emerald" ? "text-emerald-300" :
    "text-[#ff8b85]";
  const headlineColor = invert ? "text-white" : "text-[var(--foreground)]";
  const subColor = invert ? "text-white/70" : "text-[var(--muted-foreground)]";
  const kickerColor = invert ? accentInvert : accentColor;
  const linkColor = invert ? accentInvert : accentColor;
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
        <div className={`font-mono text-xs uppercase tracking-[0.14em] ${kickerColor}`}>
          {kicker}
        </div>
      ) : null}
      <h2
        className={`font-display mt-3 text-[clamp(2rem,1.4rem+3vw,3.5rem)] leading-[1.05] ${headlineColor}`}
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
            className={`font-mono inline-flex items-center text-xs uppercase tracking-[0.14em] underline decoration-2 underline-offset-4 ${linkColor}`}
          >
            {link.label} →
          </Link>
        </div>
      ) : null}
    </header>
  );
}

import Link from "next/link";
import { CircularSeal } from "./brand-logo";
import { ADDRESS, BUILDERS, PRICELESS } from "@/lib/brands";
import { CATEGORIES } from "@/lib/catalog-meta";

// Department links are derived from the same CATEGORIES metadata that
// generates the /shop/[category] routes and the SEO sitemap, so the
// footer stays in sync automatically when a department is added or removed.
const SHOP_LINKS = [
  { href: "/shop", label: "Shop all" },
  ...Object.entries(CATEGORIES).map(([slug, meta]) => ({
    href: `/shop/${slug}`,
    label: meta.label,
  })),
  { href: "/search", label: "Search" },
  { href: "/compare", label: "Compare vs. big box" },
  { href: "/gift-cards", label: "Gift cards" },
];

// Full public-site navigation. Admin (/admin/*) routes are intentionally
// omitted (staff-only), as are dynamic/template routes (/shop/item/[sku],
// /blog/[slug]) and /connections (local-only, 404s in production).
const NAV_SECTIONS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Shop",
    links: SHOP_LINKS,
  },
  {
    title: "Brands & services",
    links: [
      { href: "/builders-corner", label: "Builders Corner" },
      { href: "/four-squared", label: "4 Squared install" },
      { href: "/contractors", label: "Contractor program" },
      { href: "/financing", label: "Financing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/reviews", label: "Reviews" },
      { href: "/press", label: "Press" },
      { href: "/careers", label: "Careers" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
      { href: "/track", label: "Track an order" },
      { href: "/cart", label: "Cart" },
      { href: "/checkout", label: "Checkout" },
    ],
  },
  {
    title: "Account & policies",
    links: [
      { href: "/account", label: "My account" },
      { href: "/login", label: "Sign in" },
      { href: "/policies/pricing", label: "Pricing policy" },
      { href: "/policies/returns", label: "Returns policy" },
      { href: "/sitemap-overview", label: "Site map" },
    ],
  },
];

/**
 * Editorial footer. No bento, no colored brand band. Just a thin
 * top border, oversized brand wordmark, mono columns, a full
 * public-page navigation block, and a brand-red baseline strip.
 */
export function SiteFooter({ brand }: { brand: "priceless" | "builders" }) {
  const b = brand === "priceless" ? PRICELESS : BUILDERS;
  return (
    <footer className="border-t border-[var(--border)] bg-white">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
        {/* OVERSIZED BRAND ROW */}
        <div className="grid items-end gap-10 border-b pb-12 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
              Visit us · {ADDRESS.city}, {ADDRESS.state}
            </div>
            <div className="font-display mt-4 text-6xl leading-[1.05] md:text-8xl">
              825 Washington<br />
              <span className={brand === "priceless" ? "text-[var(--brand-priceless)]" : "text-[var(--brand-builders-gold)]"}>Street.</span>
            </div>
          </div>
          <div className="md:col-span-4">
            <a
              href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`}
              className="font-mono block text-sm uppercase tracking-[0.14em] underline decoration-[var(--brand-priceless)] decoration-2 underline-offset-4"
            >
              {ADDRESS.phone} →
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(`${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.state} ${ADDRESS.zip}`)}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono mt-3 block text-sm uppercase tracking-[0.14em] underline decoration-[var(--muted-foreground)]/40 decoration-2 underline-offset-4"
            >
              Get directions →
            </a>
          </div>
        </div>

        {/* COLUMNS */}
        <div className="mt-12 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Hours</div>
            <ul className="mt-4 space-y-1.5">
              {b.hours.map((h) => (
                <li key={h.day} className="font-mono flex justify-between gap-3 text-xs uppercase tracking-[0.12em]">
                  <span className="text-[var(--foreground)]">{h.day}</span>
                  <span className="text-[var(--muted-foreground)]">{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              {brand === "priceless" ? "Shop" : "Studio"}
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {brand === "priceless" ? (
                <>
                  <li><FooterLink href="/shop/doors">Doors</FooterLink></li>
                  <li><FooterLink href="/shop/windows">Windows</FooterLink></li>
                  <li><FooterLink href="/shop/cabinets">Cabinets</FooterLink></li>
                  <li><FooterLink href="/shop/vanities">Vanities</FooterLink></li>
                  <li><FooterLink href="/shop/hardware">Hardware</FooterLink></li>
                </>
              ) : (
                <>
                  <li><FooterLink href="/builders-corner">Builders Corner</FooterLink></li>
                  <li><FooterLink href="/four-squared">4 Squared install</FooterLink></li>
                  <li><FooterLink href="/contact">Visit the showroom</FooterLink></li>
                </>
              )}
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              Sister brands
            </div>
            <div className="mt-4 flex items-start gap-4">
              <CircularSeal className="h-20 shrink-0" />
              <ul className="space-y-2 text-sm">
                <li><FooterLink href="/">Price-Less Building</FooterLink></li>
                <li><FooterLink href="/builders-corner">Builders Corner</FooterLink></li>
                <li><FooterLink href="/four-squared">4 Squared</FooterLink></li>
              </ul>
            </div>
            <div className="font-mono mt-6 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              Policies
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><FooterLink href="/policies/returns">Returns</FooterLink></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              Follow
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={"facebook" in b.socials ? b.socials.facebook : "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[var(--brand-priceless)]"
                >
                  Facebook ↗
                </a>
              </li>
              {"instagram" in b.socials && b.socials.instagram ? (
                <li>
                  <a
                    href={b.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[var(--brand-priceless)]"
                  >
                    Instagram ↗
                  </a>
                </li>
              ) : null}
              <li><FooterLink href="/contact">Contact</FooterLink></li>
            </ul>
          </div>
        </div>

        {/* FULL SITE NAVIGATION — every public page, grouped by section */}
        <nav
          aria-label="All pages"
          className="mt-12 grid gap-x-8 gap-y-10 border-t border-[var(--border)] pt-12 sm:grid-cols-2 lg:grid-cols-5"
        >
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                {section.title}
              </div>
              <ul className="mt-3 space-y-1">
                {section.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="block py-1 text-sm text-[var(--foreground)] hover:text-[var(--brand-priceless)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* BASELINE */}
      <div className="border-t bg-[var(--brand-priceless-dark)] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-6 py-3">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-white/85">
            © {new Date().getFullYear()} Price-Less Building · Builders Corner · 4 Squared
          </span>
          <span className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-white/85">
            <span>{ADDRESS.city}, {ADDRESS.state} · Same building since 1978</span>
            <Link href="/account" className="text-white/80 underline decoration-white/30 underline-offset-2 hover:text-white">
              My account
            </Link>
            <Link href="/login" className="text-white/80 underline decoration-white/30 underline-offset-2 hover:text-white">
              Employee sign in
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block py-2 text-base text-[var(--foreground)] hover:text-[var(--brand-priceless)]"
    >
      {children}
    </Link>
  );
}

import Link from "next/link";
import { CircularSeal } from "./brand-logo";
import { ADDRESS, BUILDERS, PRICELESS } from "@/lib/brands";

/**
 * Deep-navy anchor footer. Oversized serif address wordmark in cream
 * with a brass accent line, warm label columns, and a hairline
 * baseline. The dark band grounds every page the way the hero opens it.
 */
export function SiteFooter({ brand }: { brand: "priceless" | "builders" }) {
  const b = brand === "priceless" ? PRICELESS : BUILDERS;
  return (
    <footer className="bg-[var(--brand-navy-deep)] text-[var(--cream)]">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
        {/* OVERSIZED BRAND ROW */}
        <div className="grid items-end gap-10 border-b border-white/12 pb-12 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-gold)]">
              Visit us · {ADDRESS.city}, {ADDRESS.state}
            </div>
            <div className="font-display mt-4 text-5xl leading-[1.05] md:text-7xl">
              825 Washington<br />
              <span className="italic text-[var(--brand-gold)]">Street.</span>
            </div>
          </div>
          <div className="md:col-span-4">
            <a
              href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`}
              className="block text-sm font-semibold underline decoration-[var(--brand-gold)]/70 decoration-2 underline-offset-4 hover:decoration-[var(--brand-gold)]"
            >
              {ADDRESS.phone} →
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(`${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.state} ${ADDRESS.zip}`)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block text-sm font-semibold underline decoration-white/30 decoration-2 underline-offset-4 hover:decoration-[var(--brand-gold)]"
            >
              Get directions →
            </a>
          </div>
        </div>

        {/* COLUMNS */}
        <div className="mt-12 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-gold)]">Hours</div>
            <ul className="mt-4 space-y-1.5">
              {b.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-3 text-sm">
                  <span className="text-[var(--cream)]">{h.day}</span>
                  <span className="text-white/60">{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-gold)]">
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
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-gold)]">
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
            <div className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-gold)]">
              Policies
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><FooterLink href="/policies/returns">Returns</FooterLink></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-gold)]">
              Follow
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={"facebook" in b.socials ? b.socials.facebook : "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="block py-2 text-base text-[var(--cream)] hover:text-[var(--brand-gold)]"
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
                    className="block py-2 text-base text-[var(--cream)] hover:text-[var(--brand-gold)]"
                  >
                    Instagram ↗
                  </a>
                </li>
              ) : null}
              <li><FooterLink href="/contact">Contact</FooterLink></li>
            </ul>

            <div className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-gold)]">
              Account
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><FooterLink href="/account">My account</FooterLink></li>
              <li><FooterLink href="/login">Employee sign in</FooterLink></li>
            </ul>
          </div>
        </div>
      </div>

      {/* BASELINE — copyright + location only. */}
      <div className="border-t border-white/12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-6 py-3">
          <span className="text-xs uppercase tracking-[0.14em] text-white/60">
            © {new Date().getFullYear()} Price-Less Building · Builders Corner · 4 Squared
          </span>
          <span className="text-xs uppercase tracking-[0.14em] text-white/60">
            {ADDRESS.city}, {ADDRESS.state} · Same building since 1978
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
      className="block py-2 text-base text-[var(--cream)] hover:text-[var(--brand-gold)]"
    >
      {children}
    </Link>
  );
}

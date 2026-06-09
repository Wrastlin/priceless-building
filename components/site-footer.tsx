import Link from "next/link";
import { CircularSeal } from "./brand-logo";
import { ADDRESS, BUILDERS, PRICELESS } from "@/lib/brands";

/**
 * Editorial footer. No bento, no colored brand band. Just a thin
 * top border, oversized brand wordmark, mono columns, and a brand-red
 * baseline strip.
 */
export function SiteFooter({ brand }: { brand: "priceless" | "builders" }) {
  const b = brand === "priceless" ? PRICELESS : BUILDERS;
  return (
    <footer className="border-t border-[var(--border)] bg-white">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
        {/* OVERSIZED BRAND ROW */}
        <div className="grid items-end gap-10 border-b pb-12 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--brand-priceless)]">
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
              className="font-mono block text-sm uppercase tracking-[0.18em] underline decoration-[var(--brand-priceless)] decoration-2 underline-offset-4"
            >
              {ADDRESS.phone} →
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(`${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.state} ${ADDRESS.zip}`)}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono mt-3 block text-sm uppercase tracking-[0.18em] underline decoration-[var(--muted-foreground)]/40 decoration-2 underline-offset-4"
            >
              Get directions →
            </a>
          </div>
        </div>

        {/* COLUMNS */}
        <div className="mt-12 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Hours</div>
            <ul className="mt-4 space-y-1.5">
              {b.hours.map((h) => (
                <li key={h.day} className="font-mono flex justify-between gap-3 text-[11px] uppercase tracking-[0.12em]">
                  <span className="text-[var(--foreground)]">{h.day}</span>
                  <span className="text-[var(--muted-foreground)]">{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
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
                  <li><FooterLink href="/four-squared">Four Squared install</FooterLink></li>
                  <li><FooterLink href="/contact">Visit the showroom</FooterLink></li>
                </>
              )}
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Sister brands
            </div>
            <div className="mt-4 flex items-start gap-4">
              <CircularSeal className="h-20 shrink-0" />
              <ul className="space-y-2 text-sm">
                <li><FooterLink href="/">Price-Less Building</FooterLink></li>
                <li><FooterLink href="/builders-corner">Builders Corner</FooterLink></li>
                <li><FooterLink href="/four-squared">Four Squared</FooterLink></li>
              </ul>
            </div>
            <div className="font-mono mt-6 text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Policies
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><FooterLink href="/policies/returns">Returns</FooterLink></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
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
      </div>

      {/* BASELINE */}
      <div className="border-t bg-[var(--brand-priceless-dark)] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-6 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
            © {new Date().getFullYear()} Price-Less Building · Builders Corner · Four Squared
          </span>
          <span className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
            <span>{ADDRESS.city}, {ADDRESS.state} · Same building since 1978</span>
            <a href="/admin" className="text-white/60 underline decoration-white/30 underline-offset-2 hover:text-white">
              Staff sign in
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-[var(--foreground)] hover:text-[var(--brand-priceless)]">
      {children}
    </Link>
  );
}

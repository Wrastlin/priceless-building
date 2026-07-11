import Image from "next/image";
import Link from "next/link";
import { ADDRESS, BUILDERS, PRICELESS } from "@/lib/brands";

/**
 * Rejuvenation-style footer: white band, ink type, sharp columns.
 * Real brand marks from the production asset set.
 */
export function SiteFooter({ brand }: { brand: "priceless" | "builders" }) {
  const b = brand === "priceless" ? PRICELESS : BUILDERS;
  return (
    <footer className="border-t border-[var(--line)] bg-white text-[var(--ink)]">
      <div className="mx-auto max-w-[1360px] px-6 pt-16 pb-10 md:px-8">
        <div className="grid items-end gap-10 border-b border-[var(--line)] pb-12 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="flex items-center gap-4">
              <Image
                src="/real-photos/logo-priceless-clean.webp"
                alt="Price-Less Building Center"
                width={960}
                height={960}
                className="h-16 w-auto object-contain"
              />
              <div>
                <div className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-[var(--rust)]">
                  Visit us · {ADDRESS.city}, {ADDRESS.state}
                </div>
                <div className="font-display mt-2 text-3xl leading-[1.05] md:text-5xl">
                  825 Washington
                  <br />
                  <span className="font-normal italic">Street.</span>
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-4">
            <a
              href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`}
              className="block text-[0.8rem] font-medium uppercase tracking-[0.14em] underline decoration-[var(--rust)]/70 decoration-1 underline-offset-4 hover:decoration-[var(--rust)]"
            >
              {ADDRESS.phone} ›
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(`${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.state} ${ADDRESS.zip}`)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block text-[0.8rem] font-medium uppercase tracking-[0.14em] underline decoration-[var(--line)] decoration-1 underline-offset-4 hover:decoration-[var(--ink)]"
            >
              Get directions ›
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[var(--rust)]">Hours</div>
            <ul className="mt-4 space-y-1.5">
              {b.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-3 text-sm font-light">
                  <span>{h.day}</span>
                  <span className="text-[var(--soft)]">{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[var(--rust)]">
              {brand === "priceless" ? "Shop" : "Studio"}
            </div>
            <ul className="mt-4 space-y-2 text-sm font-light">
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
            <div className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[var(--rust)]">
              Sister brands
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Image src="/real-photos/logo-priceless-clean.webp" alt="Price-Less" width={64} height={64} className="h-12 w-auto object-contain" />
              <Image src="/real-photos/logo-builders-corner-real.jpg" alt="Builders Corner" width={90} height={60} className="h-10 w-auto object-contain" />
              <Image src="/real-photos/logo-4squared.jpg" alt="4 Squared" width={64} height={64} className="h-12 w-auto object-contain" />
            </div>
            <ul className="mt-4 space-y-2 text-sm font-light">
              <li><FooterLink href="/">Price-Less Building</FooterLink></li>
              <li><FooterLink href="/builders-corner">Builders Corner</FooterLink></li>
              <li><FooterLink href="/four-squared">4 Squared</FooterLink></li>
            </ul>
            <div className="mt-6 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[var(--rust)]">
              Policies
            </div>
            <ul className="mt-4 space-y-2 text-sm font-light">
              <li><FooterLink href="/policies/returns">Returns</FooterLink></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[var(--rust)]">
              Follow
            </div>
            <ul className="mt-4 space-y-2 text-sm font-light">
              <li>
                <a
                  href={"facebook" in b.socials ? b.socials.facebook : "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="block py-1 hover:opacity-60"
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
                    className="block py-1 hover:opacity-60"
                  >
                    Instagram ↗
                  </a>
                </li>
              ) : null}
              <li><FooterLink href="/contact">Contact</FooterLink></li>
            </ul>

            <div className="mt-6 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[var(--rust)]">
              Account
            </div>
            <ul className="mt-4 space-y-2 text-sm font-light">
              <li><FooterLink href="/account">My account</FooterLink></li>
              <li><FooterLink href="/login">Employee sign in</FooterLink></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--line)]">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-2 px-6 py-4 md:px-8">
          <span className="text-[0.7rem] uppercase tracking-[0.14em] text-[var(--soft)]">
            © {new Date().getFullYear()} Price-Less Building · Builders Corner · 4 Squared
          </span>
          <span className="text-[0.7rem] uppercase tracking-[0.14em] text-[var(--soft)]">
            {ADDRESS.city}, {ADDRESS.state} · Same building since 1978
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block py-1 hover:opacity-60">
      {children}
    </Link>
  );
}

import Link from "next/link";
import { ADDRESS, BUILDERS } from "@/lib/brands";

const TEL = `tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`;
const DIRECTIONS = `https://maps.google.com/?q=${encodeURIComponent(
  `Builders Corner ${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.state}`,
)}`;

// Compact grouped hours read cleaner than seven wrapping rows.
const HOURS = [
  { d: "Mon – Thu", h: "8:30 AM – 5:30 PM" },
  { d: "Friday", h: "8:30 AM – 4:30 PM" },
  { d: "Saturday", h: "8:30 AM – 12:30 PM" },
  { d: "Sunday", h: "Closed" },
];

/**
 * Builder's Corner's own footer. Light, editorial, and elegant, in
 * keeping with the reference remodeler sites, distinct from the dense
 * Price-Less store footer (which carries cart, account, and surplus
 * chrome that has no place here). A closing consultation invitation,
 * quiet contact details, and a single line tying it to the family.
 */
export function BuildersFooter() {
  return (
    <footer className="bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Closing invitation */}
        <div className="grid gap-x-10 gap-y-8 border-t border-[var(--border)] py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-7">
            <div className="eyebrow">Builder&rsquo;s Corner &middot; Wausau</div>
            <p className="font-couture mt-6 text-[clamp(2rem,1.25rem+2.8vw,3.5rem)] leading-[1.1] text-[var(--brand-navy)]">
              Let&rsquo;s design the room you keep coming back to.
            </p>
          </div>
          <div className="flex flex-col justify-end gap-4 md:col-span-5 md:items-end">
            <Link href="#consult" className="btn btn-builders w-fit">
              Book a free consultation
            </Link>
            <a
              href={TEL}
              className="text-sm font-semibold text-[var(--brand-navy)] underline decoration-[var(--brand-gold)]/50 decoration-2 underline-offset-[6px] transition hover:decoration-[var(--brand-gold)]"
            >
              Or call {ADDRESS.phone}
            </a>
          </div>
        </div>

        {/* Details */}
        <div className="grid gap-x-10 gap-y-12 border-t border-[var(--border)] py-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Visit the showroom
            </div>
            <p className="mt-5 font-couture text-xl leading-snug text-[var(--brand-navy)]">
              {ADDRESS.street}
              <br />
              {ADDRESS.city}, {ADDRESS.state}
            </p>
            <a
              href={DIRECTIONS}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm font-semibold text-[var(--brand-navy)] underline decoration-[var(--brand-gold)]/50 decoration-2 underline-offset-[6px] transition hover:decoration-[var(--brand-gold)]"
            >
              Get directions →
            </a>
          </div>

          <div className="md:col-span-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Showroom hours
            </div>
            <dl className="mt-5 space-y-2.5 text-[0.95rem]">
              {HOURS.map((row) => (
                <div key={row.d} className="flex justify-between gap-6">
                  <dt className="text-[var(--muted-foreground)]">{row.d}</dt>
                  <dd className="whitespace-nowrap text-[var(--foreground)]">{row.h}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Explore
            </div>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              <li>
                <a href="#work" className="text-[var(--foreground)] transition hover:text-[var(--brand-navy)]">
                  Our work
                </a>
              </li>
              <li>
                <a href="#process" className="text-[var(--foreground)] transition hover:text-[var(--brand-navy)]">
                  Process
                </a>
              </li>
              <li>
                <a
                  href={"facebook" in BUILDERS.socials ? BUILDERS.socials.facebook : "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--foreground)] transition hover:text-[var(--brand-navy)]"
                >
                  Facebook ↗
                </a>
              </li>
              <li>
                <Link href="/" className="text-[var(--foreground)] transition hover:text-[var(--brand-navy)]">
                  Price-Less family ↗
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Baseline */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] py-8 text-xs text-[var(--muted-foreground)]">
          <span>© {new Date().getFullYear()} Builder&rsquo;s Corner Cabinetry &amp; Design</span>
          <span>Designed &amp; built in Wausau, WI, since 1983</span>
        </div>
      </div>
    </footer>
  );
}

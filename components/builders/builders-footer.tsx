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
        <div className="grid gap-x-10 gap-y-8 border-t border-[var(--line)] py-14 md:grid-cols-12 md:py-20">
          <div className="md:col-span-7">
            <div className="eyebrow">Builder&rsquo;s Corner &middot; Wausau</div>
            <p className="font-display mt-4 text-[clamp(1.8rem,1.1rem+2.4vw,3rem)] leading-[1.1] text-[var(--ink)]">
              Let&rsquo;s design the room you keep coming back to.
            </p>
          </div>
          <div className="flex flex-col justify-end gap-4 md:col-span-5 md:items-end">
            <Link href="#consult" className="btn btn-builders w-fit">
              Book a free consultation
            </Link>
            <a
              href={TEL}
              className="text-sm font-medium text-[var(--ink)] underline decoration-[var(--rust)]/40 decoration-2 underline-offset-[6px] transition hover:decoration-[var(--rust)]"
            >
              Or call {ADDRESS.phone}
            </a>
          </div>
        </div>

        {/* Details */}
        <div className="grid gap-x-10 gap-y-10 border-t border-[var(--line)] py-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-[var(--soft)]">
              Visit the showroom
            </div>
            <p className="font-display mt-4 text-xl leading-snug text-[var(--ink)]">
              {ADDRESS.street}
              <br />
              {ADDRESS.city}, {ADDRESS.state}
            </p>
            <a
              href={DIRECTIONS}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm font-medium text-[var(--ink)] underline decoration-[var(--rust)]/40 decoration-2 underline-offset-[6px] transition hover:decoration-[var(--rust)]"
            >
              Get directions →
            </a>
          </div>

          <div className="md:col-span-4">
            <div className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-[var(--soft)]">
              Showroom hours
            </div>
            <dl className="mt-4 space-y-2 text-[0.9rem]">
              {HOURS.map((row) => (
                <div key={row.d} className="flex justify-between gap-6">
                  <dt className="text-[var(--soft)]">{row.d}</dt>
                  <dd className="whitespace-nowrap text-[var(--ink)]">{row.h}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="md:col-span-3">
            <div className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-[var(--soft)]">
              Explore
            </div>
            <ul className="mt-4 space-y-2.5 text-[0.9rem]">
              <li>
                <a href="#work" className="text-[var(--ink)] transition hover:opacity-55">
                  Our work
                </a>
              </li>
              <li>
                <a href="#process" className="text-[var(--ink)] transition hover:opacity-55">
                  Process
                </a>
              </li>
              <li>
                <a
                  href={BUILDERS.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--ink)] transition hover:opacity-55"
                >
                  Facebook ↗
                </a>
              </li>
              <li>
                <Link href="/" className="text-[var(--ink)] transition hover:opacity-55">
                  Price-Less family ↗
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] py-6 text-xs text-[var(--soft)]">
          <span>© {new Date().getFullYear()} Builder&rsquo;s Corner Cabinetry &amp; Design</span>
          <span>Designed &amp; built in Wausau, WI, since 1983</span>
        </div>
      </div>
    </footer>
  );
}

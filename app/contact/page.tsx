import Image from "next/image";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FacebookBand } from "@/components/facebook-band";
import { ADDRESS, PRICELESS } from "@/lib/brands";
import { submitContactLead } from "@/lib/actions/leads";

const STOREFRONT = "/real-photos/storefront-signage.webp";

async function submit(formData: FormData) {
  "use server";
  const result = await submitContactLead(formData);
  if (result.ok) {
    redirect("/contact?sent=1");
  } else {
    redirect(`/contact?error=${encodeURIComponent(result.error)}`);
  }
}

export const metadata = {
  title: "Contact & Visit · Price-Less Building Center",
  description:
    "Hours, directions, phone and a contact form for Price-Less Building Center in Wausau, WI.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const sp = await searchParams;
  return (
    <>
      <SiteHeader brand="priceless" />
      {sp.sent ? (
        <div className="bg-emerald-50 border-b border-emerald-200">
          <div className="mx-auto max-w-7xl px-6 py-3 text-sm text-emerald-900">
            <strong>Thanks. Message sent.</strong> We&apos;ll get back to you within one business day. For anything urgent please call <a href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`} className="underline">{ADDRESS.phone}</a>.
          </div>
        </div>
      ) : null}
      {sp.error ? (
        <div className="bg-rose-50 border-b border-rose-200">
          <div className="mx-auto max-w-7xl px-6 py-3 text-sm text-rose-900">
            <strong>Couldn&apos;t send:</strong> {sp.error}
          </div>
        </div>
      ) : null}

      {/* HERO. Editorial asymmetric */}
      <section className="relative overflow-hidden bg-[var(--muted)]">
        <div className="absolute inset-0">
          <Image src={STOREFRONT} alt="Price-Less Building Center storefront" fill priority className="object-cover" quality={80} />
          {/* Heavy, even scrim. The storefront photo is busy (people, signage)
              and on mobile the two columns stack over the middle of it, so the
              whole hero has to stay dark enough for white text to read. */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/85" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 pt-28 pb-20 text-white md:grid-cols-12 md:pt-40 md:pb-28">
          <div className="md:col-span-8">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-black/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white ring-1 ring-white/15 backdrop-blur-sm">
              <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
              <span>Open Mon&ndash;Sat &middot; Walk-ins welcome</span>
            </div>
            <h1 className="font-display mt-8 max-w-[18ch] text-[3rem] leading-[1.05] text-white sm:text-[4rem] md:text-[5.5rem]">
              Come see the <span className="text-[var(--brand-gold)]">warehouse.</span>
            </h1>
            <p className="font-serif mt-8 max-w-xl text-lg italic leading-snug text-white/90 md:text-xl">
              Easy parking out front, contractor load bay around back. Look for the red brick building with the white &ldquo;PRICE-LESS&rdquo; sign on the roof.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a href={`tel:${ADDRESS.phone.replace(/[^0-9+]/g, "")}`} className="btn btn-priceless">Call {ADDRESS.phone}</a>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.state} ${ADDRESS.zip}`)}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold uppercase tracking-[0.14em] text-white/85 underline decoration-[var(--brand-gold)] decoration-2 underline-offset-4"
              >
                Get directions →
              </a>
            </div>
          </div>
          <aside className="md:col-span-4 md:pt-16">
            <div className="border-l border-white/20 pl-5">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
                When we&apos;re open
              </div>
              <p className="mt-4 text-base leading-relaxed text-white/85">
                Monday through Friday until 5:30 PM, Saturday morning until 12:30 PM. Full week shown below.
              </p>
              <a
                href="#hours"
                className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.14em] text-white/80 underline decoration-white/40 decoration-2 underline-offset-4 hover:text-white"
              >
                Jump to full hours →
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* VISIT INFO + HOURS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="eyebrow">Visit</div>
            <h2 className="font-display mt-2 text-2xl md:text-3xl">The address.</h2>
            <p className="mt-4 text-[var(--muted-foreground)]">
              {ADDRESS.street}<br />
              {ADDRESS.city}, {ADDRESS.state} {ADDRESS.zip}
            </p>
            <p className="mt-3 text-[var(--muted-foreground)]">
              <a href="tel:+17158483855" className="font-semibold text-[var(--foreground)] underline">{ADDRESS.phone}</a>
            </p>
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
              Off the north end of Washington Street, just past the rail crossing. You can&apos;t miss it.
            </p>
          </div>

          <div id="hours" className="md:col-span-1 scroll-mt-24">
            <div className="eyebrow">Hours</div>
            <h2 className="font-display mt-2 text-2xl md:text-3xl">When we&apos;re open.</h2>
            <ul className="mt-4 divide-y rounded-[14px] border bg-white">
              {PRICELESS.hours.map((h) => (
                <li key={h.day} className="flex items-center justify-between px-4 py-3 text-base">
                  <span className="font-semibold">{h.day}</span>
                  <span className={h.hours === "Closed" ? "text-[var(--muted-foreground)]" : "text-[var(--foreground)]"}>{h.hours}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              Closed Sundays. If we are not on the floor when you walk in, ring the bell at the counter.
            </p>
          </div>

          <div className="md:col-span-1">
            <div className="eyebrow">Contractors</div>
            <h2 className="font-display mt-2 text-2xl md:text-3xl">Coming in for a load?</h2>
            <p className="mt-4 text-[var(--muted-foreground)]">
              Call ahead and we'll have your will-call staged at the back bay. Forklift on site,
              72-hour holds on paid items.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Will-call &amp; holds: <a className="underline" href="tel:+17158483855">{ADDRESS.phone}</a></li>
              <li>Wholesale &amp; bulk: <a className="underline" href="mailto:pricelessbuildingcenter@gmail.com?subject=Wholesale%20or%20bulk%20inquiry">pricelessbuildingcenter@gmail.com</a></li>
            </ul>
          </div>
        </div>
      </section>

      {/* AROUND THE STORE — holiday closures + Facebook. Hours are already
          in the table above, so hide the weekly-hours mini-list here. */}
      <FacebookBand showHours={false} />

      {/* MAP + FORM */}
      <section className="bg-[var(--muted)]/40 py-16">
        <div className="mx-auto grid max-w-7xl gap-px border bg-[var(--border)] px-0 lg:grid-cols-2">
          {/* MAP */}
          <div className="bg-white">
            <div className="aspect-[4/3] w-full">
              <iframe
                title="Map to Price-Less Building Center"
                src="https://www.google.com/maps?q=825+Washington+St+Wausau+WI&output=embed"
                className="h-full w-full border-0"
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="border-t p-8">
              <div className="eyebrow">Drop a pin</div>
              <h3 className="font-display mt-3 text-3xl leading-tight">
                Eight minutes from <span className="text-[var(--brand-gold-deep)]">the freeway.</span>
              </h3>
              <p className="font-serif mt-3 text-sm italic leading-relaxed text-[var(--muted-foreground)]">
                US-51 / I-39 sits eight minutes east, downtown Wausau ten minutes west, and roughly forty minutes pulls you in from Stevens Point, Antigo, and Merrill.
              </p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.state} ${ADDRESS.zip}`)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-navy)] underline decoration-[var(--brand-gold)] decoration-2 underline-offset-4"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>

          {/* FORM */}
          <div className="bg-white p-8 md:p-12">
            <div className="eyebrow">Send us a note</div>
            <h2 className="font-display mt-3 text-4xl leading-[1.05] md:text-5xl">
              Got a project? <span className="text-[var(--brand-gold-deep)]">Tell us.</span>
            </h2>
            <p className="font-serif mt-4 text-base italic leading-relaxed text-[var(--muted-foreground)]">
              Sourcing something specific? We'll check the shelf and call you back inside one business day. For urgent will-call, please use the phone instead.
            </p>

            <form action={submit} className="mt-6 grid gap-5">
              <Field label="Your name" name="name" required>
                <input
                  name="name"
                  required
                  type="text"
                  placeholder="Pat Lindgren"
                  className="w-full rounded-md border-2 border-[var(--foreground)]/25 bg-white px-3.5 py-3 text-base focus:border-[var(--brand-navy)] focus:outline-none focus:ring-0"
                />
              </Field>

              <Field label="Email" name="email" required>
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="name@yourbusiness.com"
                  className="w-full rounded-md border-2 border-[var(--foreground)]/25 bg-white px-3.5 py-3 text-base focus:border-[var(--brand-navy)] focus:outline-none focus:ring-0"
                />
              </Field>

              <Field label="Phone (optional)" name="phone">
                <input
                  name="phone"
                  type="tel"
                  placeholder="(715) 555-0123"
                  className="w-full rounded-md border-2 border-[var(--foreground)]/25 bg-white px-3.5 py-3 text-base focus:border-[var(--brand-navy)] focus:outline-none focus:ring-0"
                />
              </Field>

              <Field label="What are you looking for?" name="looking_for" required>
                <select
                  name="looking_for"
                  required
                  defaultValue=""
                  className="w-full rounded-md border-2 border-[var(--foreground)]/25 bg-white px-3.5 py-3 text-base focus:border-[var(--brand-navy)] focus:outline-none focus:ring-0"
                >
                  <option value="" disabled>Choose a department…</option>
                  <option value="doors">Doors (interior, exterior, reclaimed)</option>
                  <option value="windows">Windows</option>
                  <option value="cabinets">Cabinets</option>
                  <option value="vanities">Vanities</option>
                  <option value="countertops">Countertops</option>
                  <option value="hardware">Hardware</option>
                  <option value="lighting">Lighting</option>
                  <option value="trim">Trim & millwork</option>
                  <option value="builders_corner">Custom kitchen / bath (Builders Corner)</option>
                  <option value="other">Something else</option>
                </select>
              </Field>

              <Field label="Message" name="message" required>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us sizes, finish, qty, when you need it…"
                  className="w-full resize-y border border-[var(--border)] bg-transparent px-3 py-2 text-base focus:border-[var(--brand-navy)] focus:outline-none focus:ring-0"
                />
              </Field>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <p className="text-xs text-[var(--muted-foreground)]">
                  We respond within one business day. No marketing list. We hate them too.
                </p>
                <button type="submit" className="btn btn-priceless">Send message</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* PHONE CTA */}
      <section className="bg-[var(--brand-navy-deep)] py-14 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
          <div>
            <div className="eyebrow eyebrow-on-dark">Faster than a form</div>
            <div className="font-display mt-2 text-3xl md:text-4xl">Pick up the phone.</div>
            <p className="mt-2 max-w-xl text-sm text-white/80">
              During warehouse hours, a real person on the floor answers every call. Tell us what
              you need and we'll walk over and look at it for you.
            </p>
          </div>
          <a href="tel:+17158483855" className="btn bg-white text-[var(--brand-navy)] hover:bg-white/90">
            {ADDRESS.phone}
          </a>
        </div>
      </section>

      <SiteFooter brand="priceless" />
    </>
  );
}

function Field({
  label,
  name,
  required,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={name} className="block">
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
        {label}{required ? " *" : ""}
      </div>
      {children}
    </label>
  );
}

import Image from "next/image";
import { SectionHead } from "@/components/section-head";
import { PRICELESS } from "@/lib/brands";

/**
 * "Around the store lately" — a light, link-out social panel.
 *
 * Note: this used to embed Facebook's Page Plugin (an <iframe> to
 * facebook.com/plugins/page.php). That plugin loads Facebook's own JS SDK,
 * which throws a stream of non-fatal "ErrorUtils caught an error" messages
 * from static.xx.fbcdn.net into the console on every visit. Those are
 * Facebook's errors, inside their cross-origin frame — nothing on our side
 * can silence them. We replaced the live embed with our own real photos so
 * the console stays clean and the section still reads as a living storefront.
 * Restore the plugin only if a live feed is worth the third-party noise.
 */
const RECENT = [
  { src: "/real-photos/santa-at-storefront.webp", alt: "Santa visiting the Builders Corner showroom during the holiday workshop." },
  { src: "/real-photos/mural-wide.webp", alt: "The Build Your Future community mural on the side of the building." },
  { src: "/real-photos/community-county-fair.webp", alt: "Kids holding a Price-Less sign at a community event." },
  { src: "/real-photos/paint-day-rainbow.webp", alt: "Volunteers at the Price-Less Paint Day mural event." },
  { src: "/real-photos/grocery-giveaway-waow.webp", alt: "A grocery giveaway hosted at the store, covered by WAOW." },
  { src: "/real-photos/anniversary-6-year.webp", alt: "Six-year anniversary celebration at Price-Less Building Center." },
];

export function FacebookBand() {
  return (
    <section className="bg-[var(--muted)]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <SectionHead
          headline="Around the store lately."
          sub="Between visits, our Facebook and Instagram are the most current view of what is going on at the store. New stock photos, holiday hours, customer thank-you cards, mural updates. We post a few times a week."
        />
        <div className="mt-12 grid items-start gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <a
              href={PRICELESS.socials.facebook}
              target="_blank"
              rel="noreferrer"
              className="group grid grid-cols-2 gap-2 sm:grid-cols-3"
              aria-label="See more on the Price-Less Building Center Facebook page"
            >
              {RECENT.map((p) => (
                <span key={p.src} className="relative block aspect-square overflow-hidden bg-[var(--muted)]">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(min-width:768px) 18vw, 45vw"
                    quality={70}
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                </span>
              ))}
            </a>
          </div>
          <div className="md:col-span-5">
            <p className="text-base leading-relaxed text-[var(--foreground)] md:text-lg">
              If you would rather follow along between visits, the easiest way is one of the platforms below. Yelp is mostly older reviews; Instagram and Facebook get the day-to-day photos.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <SocialPill href={PRICELESS.socials.facebook} label="Follow on Facebook" />
              <SocialPill href={PRICELESS.socials.instagram} label="Follow on Instagram" />
              <SocialPill href={PRICELESS.socials.yelp} label="Read us on Yelp" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialPill({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-mono inline-flex w-fit items-center border border-[var(--border)] bg-white px-4 py-2 text-xs uppercase tracking-[0.14em] text-[var(--foreground)] hover:bg-[var(--muted)]"
    >
      {label} →
    </a>
  );
}

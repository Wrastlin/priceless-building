import { SectionHead } from "@/components/section-head";
import { PRICELESS } from "@/lib/brands";

/**
 * Live Facebook Page Plugin on the left, short paragraph + social
 * outbound links on the right. Acts as a live-pulse signal so the
 * page feels active.
 */
export function FacebookBand() {
  return (
    <section className="bg-[var(--muted)]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <SectionHead
          headline="What we have been up to this week."
          sub="Our Facebook page is the most current view of what is going on at the store. New stock photos, holiday hours, customer thank-you cards, mural updates. We post a few times a week."
        />
        <div className="mt-12 grid items-start gap-10 md:grid-cols-12">
          <div className="flex justify-center md:col-span-6 md:justify-end">
            {/* FB plugin renders fixed-width content. Use a smaller
                width param on mobile and clip overflow on the parent so
                nothing leaks past the right edge of the card. */}
            <div className="w-full max-w-[500px] overflow-hidden border border-[var(--border)] bg-white">
              <iframe
                src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
                  PRICELESS.socials.facebook,
                )}&tabs=timeline&width=340&height=700&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
                className="block h-[600px] w-full sm:h-[680px] md:h-[700px]"
                style={{ border: 0, maxWidth: "100%" }}
                scrolling="no"
                allow="encrypted-media"
                loading="lazy"
                title="Price-Less Building Center on Facebook"
              />
            </div>
          </div>
          <div className="md:col-span-6">
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

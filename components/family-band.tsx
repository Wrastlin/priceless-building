import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { SectionHead } from "@/components/section-head";

/**
 * "The rest of the family" band on the home page. Two big image cards
 * for the sub-brands (Builders Corner + Four Squared) with logo chips,
 * a one-sentence pitch each, visible service tags, and a CTA to the
 * full article. Replaces the older three-brand callout + BC feature
 * band + FS services band trio.
 */
export function FamilyBand() {
  return (
    <section className="bg-[#0b1220] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <SectionHead
          invert
          headline="The rest of the family."
          sub="Two more local brands across the parking lot. Use just one, or have all three work on the same project."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <FamilyCard
            href="/builders-corner"
            logoBrand="builders"
            image="/real-photos/install-kitchen-walnut-island-bar.webp"
            imageAlt="A premium Builders Corner kitchen with walnut shaker cabinetry, island bar, and pendant lighting."
            headline="Builders Corner."
            body="Premium custom cabinetry. Kitchens, baths, and built-ins designed in the showroom and built in our own shop in Wausau."
            tags={["Custom kitchens", "Custom baths", "Built-ins"]}
            cta="Read the Builders Corner story"
          />
          <FamilyCard
            href="/four-squared"
            logoBrand="four-squared"
            image="/real-photos/install-kitchen-white-open.webp"
            imageAlt="A finished kitchen install by the Four Squared crew: white shaker, island, hood, LVP."
            headline="Four Squared."
            body="The install crew. Demo, plumbing, electrical, tile, finish carpentry — start to final walkthrough. Installs cabinets from Builders Corner or anything you bring."
            tags={["Kitchen remodels", "Bath remodels", "Cabinet install", "Built-ins", "Tile + trim", "Doors + windows"]}
            cta="Meet the install crew"
          />
        </div>
      </div>
    </section>
  );
}

function FamilyCard({
  href,
  logoBrand,
  image,
  imageAlt,
  headline,
  body,
  tags,
  cta,
}: {
  href: string;
  logoBrand: "priceless" | "builders" | "four-squared";
  image: string;
  imageAlt: string;
  headline: string;
  body: string;
  tags: string[];
  cta: string;
}) {
  return (
    <Link
      href={href}
      data-reveal
      className="group flex flex-col overflow-hidden border border-white/10 bg-white transition hover:border-white/30"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--muted)]">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width:768px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
          quality={80}
        />
        <div className="absolute left-4 top-4 inline-flex items-center bg-white px-3 py-2 shadow-sm">
          <BrandLogo brand={logoBrand} size="sm" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl leading-snug text-[var(--foreground)] md:text-3xl">
          {headline}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-[var(--foreground)]">
          {body}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs font-medium text-[var(--foreground)]"
            >
              {t}
            </span>
          ))}
        </div>
        <span className="font-mono mt-5 inline-block text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)] underline decoration-2 underline-offset-4">
          {cta} →
        </span>
      </div>
    </Link>
  );
}

import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, type Category } from "@/lib/catalog-meta";
import { WALKTHROUGH_INVENTORY, type InventoryType } from "@/lib/walkthrough-inventory";
import { assignUniquePhotos } from "@/lib/department-photos";

const DEPTS = Object.keys(CATEGORIES) as Category[];

type Thumb = { t: InventoryType; src: string };

/**
 * Pre-assign up to 4 preview thumbnails per department such that no photo
 * repeats anywhere in the showcase: the running `used` set is seeded with
 * every department hero and grows as thumbnails are picked.
 */
function buildThumbs(): Map<Category, Thumb[]> {
  const used: string[] = DEPTS.map((k) => CATEGORIES[k].image);
  const map = new Map<Category, Thumb[]>();
  for (const key of DEPTS) {
    const types = WALKTHROUGH_INVENTORY[key]?.types ?? [];
    const assigned = assignUniquePhotos(key, types.map((t) => t.name), used);
    const picked = types
      .map((t, i) => ({ t, src: assigned[i] }))
      .filter((x): x is Thumb => x.src !== null)
      .slice(0, 4);
    picked.forEach((p) => used.push(p.src));
    map.set(key, picked);
  }
  return map;
}

function deptStats(category: Category) {
  const dept = WALKTHROUGH_INVENTORY[category];
  if (!dept) return { typeCount: 0, priceFrom: null as number | null, brandCount: 0 };
  const lows = dept.types.map((t) => t.priceLow).filter((p): p is number => p != null);
  return {
    typeCount: dept.types.length,
    priceFrom: lows.length ? Math.min(...lows) : null,
    brandCount: dept.brands.length,
  };
}

/**
 * "What's on the floor" — an image-first map of every department, built
 * from the in-store walkthrough. Each panel leads with a real photo and
 * previews the actual product types carried, so the page reads like
 * walking the aisles rather than a list of words.
 */
export function StoreShowcase() {
  const thumbsByKey = buildThumbs();
  return (
    <section className="border-y bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="eyebrow">
          {DEPTS.length} departments · everything under one roof
        </div>
        <h2 className="font-display mt-3 max-w-4xl text-4xl leading-[1.05] md:text-6xl">
          What&rsquo;s on the floor<span className="text-[var(--brand-gold-deep)]">.</span>
        </h2>
        <p className="font-serif mt-4 max-w-2xl text-base italic leading-relaxed text-[var(--muted-foreground)] md:text-lg">
          A whole-store walkthrough, department by department. Surplus moves
          weekly, so treat this as a depth guide for what you&rsquo;ll find when
          you walk in.
        </p>

        {/* MOBILE: one compact horizontal strip instead of eight stacked
            panels — this section used to run ~7,000px tall on a phone. Swipe
            sideways to browse departments; tap through to the full grid. */}
        <ul className="-mx-6 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-3 md:hidden">
          {DEPTS.map((key) => {
            const cat = CATEGORIES[key];
            const { priceFrom } = deptStats(key);
            return (
              <li key={key} className="snap-start shrink-0" style={{ width: "min(60vw, 240px)" }}>
                <Link href={`/shop/${key}`} className="group relative block aspect-[3/4] overflow-hidden rounded-[14px] bg-[var(--muted)]">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    sizes="60vw"
                    quality={70}
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute inset-x-4 bottom-4 text-white">
                    <div className="font-display text-2xl leading-none">{cat.label}</div>
                    {priceFrom != null && (
                      <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/85">from ${priceFrom}</div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* DESKTOP: the full walkthrough with product-type thumbnails. */}
        <div className="mt-12 hidden grid-cols-1 gap-x-8 gap-y-12 md:grid md:grid-cols-2">
          {DEPTS.map((key) => {
            const cat = CATEGORIES[key];
            const { priceFrom } = deptStats(key);
            const thumbs = thumbsByKey.get(key) ?? [];
            return (
              <div key={key}>
                <Link
                  href={`/shop/${key}`}
                  className="group relative block aspect-[16/9] overflow-hidden rounded-[14px] bg-[var(--muted)]"
                >
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    sizes="(min-width:768px) 44vw, 92vw"
                    quality={70}
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-4 text-white">
                    <h3 className="font-display text-3xl leading-none md:text-4xl">{cat.label}</h3>
                    {priceFrom != null && (
                      <span className="shrink-0 pb-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/85">
                        from ${priceFrom}
                      </span>
                    )}
                  </div>
                </Link>

                {thumbs.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {thumbs.map(({ t, src }) => (
                      <Link key={t.name} href={`/shop/${key}`} className="group block">
                        <div className="relative aspect-square overflow-hidden rounded-[14px] bg-[var(--muted)]">
                          <Image
                            src={src}
                            alt={t.name}
                            fill
                            sizes="(min-width:768px) 11vw, 22vw"
                            quality={70}
                            className="object-cover transition duration-700 group-hover:scale-[1.05]"
                          />
                        </div>
                        <div className="mt-1.5 line-clamp-1 text-[11px] leading-tight text-[var(--muted-foreground)]">
                          {t.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                <Link
                  href={`/shop/${key}`}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-[var(--brand-navy)] underline decoration-[var(--brand-gold)]/60 underline-offset-4 hover:decoration-[var(--brand-gold)]"
                >
                  Browse all {cat.label.toLowerCase()} →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

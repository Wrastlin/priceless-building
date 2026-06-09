import Image from "next/image";
import { SectionHead } from "@/components/section-head";
import { photosBy } from "@/lib/business-photos";

/**
 * Around-the-warehouse gallery. Pulls a deterministic mix of real
 * business photos — warehouse interiors, signs, and product shots —
 * from the imported Facebook archive. Twelve images in a 3-col mobile
 * to 4-col desktop masonry-feel grid.
 */
export function WarehouseGallery() {
  // Build a hand-picked mix so the grid stays varied (no all-doors,
  // no all-kitchen-shots in a row). Pull the top of each subject
  // bucket then interleave.
  const warehouses = photosBy({ subject: "warehouse-interior" }).slice(0, 6);
  const products = photosBy({ subject: "product-shot" }).slice(0, 6);
  const installs = photosBy({ subject: "install-kitchen" }).slice(0, 3);
  const signs = photosBy({ subject: "sign" }).slice(0, 1);

  const ordered: typeof warehouses = [];
  const buckets = [warehouses, products, installs, signs];
  for (let i = 0; ordered.length < 12; i++) {
    let added = false;
    for (const b of buckets) {
      if (i < b.length) {
        ordered.push(b[i]);
        added = true;
        if (ordered.length === 12) break;
      }
    }
    if (!added) break;
  }

  if (ordered.length === 0) return null;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <SectionHead
          headline="Around the warehouse."
          sub="A slice of what is on the floor, in the showroom, and on the walls. Real photos, not stock."
        />
        <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {ordered.map((p, i) => (
            <li
              key={p.src}
              data-reveal
              data-reveal-delay={((i % 4) * 0.04).toFixed(2)}
              className="group relative aspect-[4/3] overflow-hidden bg-[var(--muted)]"
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(min-width:768px) 25vw, 50vw"
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
                quality={75}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

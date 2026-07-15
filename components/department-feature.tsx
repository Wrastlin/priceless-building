import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, type Category } from "@/lib/catalog-meta";
import {
  DEPARTMENT_DEPTH,
  departmentFeaturePhotos,
} from "@/lib/department-depth";

/**
 * Promotional department feature — a short story + a couple of real floor
 * photos. No quantity cards, price chips, or inventory-grid styling.
 */
export function DepartmentFeature({ category }: { category: Category }) {
  const cat = CATEGORIES[category];
  const depth = DEPARTMENT_DEPTH[category];
  const photos = departmentFeaturePhotos(category).slice(0, 3);
  if (!cat || photos.length === 0) return null;

  const [lead, ...rest] = photos;

  return (
    <section className="border-b border-[var(--line)] bg-white">
      <div className="mx-auto max-w-[1360px] px-6 py-14 md:px-8 md:py-20">
        <p className="eyebrow">On the floor</p>
        <h2 className="font-display mt-3 max-w-[22ch] text-[clamp(1.9rem,1rem+2.4vw,3rem)] leading-[1.05]">
          A wide selection of{" "}
          <span className="font-normal italic">{cat.label.toLowerCase()}.</span>
        </h2>
        <p className="mt-4 max-w-[48ch] text-[1rem] font-light leading-[1.7] text-[var(--soft)]">
          {depth.detail}
        </p>

        <div className="mt-10 grid gap-3 md:grid-cols-12 md:gap-4">
          <div className="relative aspect-[4/3] overflow-hidden bg-[var(--taupe)] md:col-span-7 md:aspect-[16/11]">
            <Image
              src={lead}
              alt={`${cat.label} on the Price-Less warehouse floor`}
              fill
              sizes="(min-width:768px) 58vw, 100vw"
              quality={78}
              className="object-cover"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:col-span-5 md:grid-cols-1 md:gap-4">
            {rest.map((src) => (
              <div
                key={src}
                className="relative aspect-[4/3] overflow-hidden bg-[var(--taupe)] md:aspect-auto md:min-h-[calc(50%-0.5rem)] md:flex-1"
              >
                <Image
                  src={src}
                  alt={`${cat.label} selection at Price-Less`}
                  fill
                  sizes="(min-width:768px) 35vw, 50vw"
                  quality={75}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="tel:7158483855"
            className="bg-[var(--ink)] px-6 py-3 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-white"
          >
            Call to hold · (715) 848-3855
          </a>
          <Link
            href="/contact"
            className="border border-[var(--ink)] px-6 py-3 text-[0.7rem] font-medium uppercase tracking-[0.2em]"
          >
            Visit 825 Washington ›
          </Link>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, type Category } from "@/lib/catalog-meta";
import {
  departmentFeaturePhotos,
} from "@/lib/department-depth";

/**
 * Promotional department feature — a short story + a couple of real floor
 * photos. No quantity cards, price chips, or inventory-grid styling.
 */
export function DepartmentFeature({ category }: { category: Category }) {
  const cat = CATEGORIES[category];
  const photos = departmentFeaturePhotos(category).slice(0, 3);
  if (!cat || photos.length === 0) return null;

  const [lead, ...rest] = photos;

  return (
    <section className="border-b border-[var(--line)] bg-white">
      <div className="mx-auto max-w-[1360px] px-6 py-10 md:px-8 md:py-14">
        <h2 className="font-display max-w-[22ch] text-[clamp(1.9rem,1rem+2.4vw,3rem)] leading-[1.05]">
          {cat.label} on the floor.
        </h2>
        <p className="mt-3 max-w-[48ch] text-[1.05rem] font-light leading-[1.65] text-[var(--soft)]">
          Real aisle photos from the warehouse. Call with a size and we&rsquo;ll
          check what&rsquo;s here.
        </p>

        <div className="mt-8 grid gap-2.5 md:mt-10 md:grid-cols-12 md:gap-3">
          <div className="relative aspect-[4/3] min-w-0 overflow-hidden bg-[var(--taupe)] md:col-span-7 md:aspect-[16/11]">
            <Image
              src={lead}
              alt={`${cat.label} on the Price-Less warehouse floor`}
              fill
              sizes="(min-width:768px) 58vw, 100vw"
              quality={78}
              className="object-cover"
            />
          </div>
          <div className="grid min-w-0 gap-2.5 sm:grid-cols-2 md:col-span-5 md:grid-cols-1 md:gap-3">
            {rest.map((src) => (
              <div
                key={src}
                className="relative aspect-[4/3] min-w-0 overflow-hidden bg-[var(--taupe)] md:aspect-auto md:min-h-[calc(50%-0.375rem)]"
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

        <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4">
          <a
            href="tel:7158483855"
            className="bg-[var(--ink)] px-6 py-3.5 text-[0.8rem] font-medium uppercase tracking-[0.16em] text-white"
          >
            Call to hold · (715) 848-3855
          </a>
          <Link
            href="/contact"
            className="border border-[var(--ink)] px-6 py-3.5 text-[0.8rem] font-medium uppercase tracking-[0.16em]"
          >
            Visit 825 Washington ›
          </Link>
        </div>
      </div>
    </section>
  );
}

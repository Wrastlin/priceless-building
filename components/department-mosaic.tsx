import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, type Category } from "@/lib/catalog-meta";
import { DEPARTMENT_DEPTH } from "@/lib/department-depth";

const DEPTS = Object.keys(CATEGORIES) as Category[];

/**
 * Department mosaic — even grid of floor photos.
 * Uniform aspect + min-w-0 keeps every tile aligned (no spill).
 */
export function DepartmentMosaic() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1360px] px-5 py-10 md:px-8 md:py-14">
        <h2 className="font-display mx-auto max-w-[18ch] text-center text-[clamp(2rem,1rem+2.8vw,3.2rem)] leading-[1.05]">
          Shop by <span className="font-normal italic">department.</span>
        </h2>
        <p className="mx-auto mt-3 max-w-[46ch] text-center text-[1.05rem] font-light leading-[1.65] text-[var(--soft)]">
          Real floor photos from the warehouse. Come dig, or call and we&rsquo;ll
          check exact sizes.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-2.5 md:mt-10 md:grid-cols-4 md:gap-3">
          {DEPTS.map((key) => {
            const cat = CATEGORIES[key];
            const depth = DEPARTMENT_DEPTH[key];
            return (
              <Link
                key={key}
                href={`/shop/${key}`}
                className="group relative block min-w-0 aspect-[4/5] overflow-hidden bg-[var(--taupe)]"
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(min-width:768px) 25vw, 50vw"
                  quality={78}
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-3.5 text-white sm:p-4 md:p-5">
                  <h3 className="font-display text-[1.15rem] leading-tight sm:text-xl md:text-2xl">
                    {cat.label}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-white/90 sm:text-[0.75rem] md:text-[0.8rem]">
                    {depth.headline} ›
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

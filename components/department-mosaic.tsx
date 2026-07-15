import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, type Category } from "@/lib/catalog-meta";
import { DEPARTMENT_DEPTH } from "@/lib/department-depth";

const DEPTS = Object.keys(CATEGORIES) as Category[];

/**
 * Department mosaic — even 2×4 grid of floor photos with warehouse-depth
 * headlines. Uniform tile aspect so mobile doesn't stagger / zigzag.
 */
export function DepartmentMosaic() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1360px] px-6 py-16 md:px-8 md:py-24">
        <p className="eyebrow text-center">Shop by department</p>
        <h2 className="font-display mx-auto mt-4 max-w-[18ch] text-center text-[clamp(2rem,1rem+2.8vw,3.2rem)] leading-[1.05]">
          What&rsquo;s on the <span className="font-normal italic">floor.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-[46ch] text-center text-[0.95rem] font-light leading-[1.65] text-[var(--soft)]">
          Conservative counts from our last warehouse walk. Surplus moves
          weekly — come dig, or call and we&rsquo;ll check exact sizes.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {DEPTS.map((key) => {
            const cat = CATEGORIES[key];
            const depth = DEPARTMENT_DEPTH[key];
            return (
              <Link
                key={key}
                href={`/shop/${key}`}
                className="group relative block aspect-[4/5] overflow-hidden bg-[var(--taupe)] sm:aspect-[3/4] md:aspect-[4/5]"
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
                  className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white md:p-5">
                  <h3 className="font-display text-xl leading-none md:text-2xl">{cat.label}</h3>
                  <p className="mt-2 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-white/85 md:text-[0.68rem] md:tracking-[0.18em]">
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

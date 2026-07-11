import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, type Category } from "@/lib/catalog-meta";
import { countPublished } from "@/lib/catalog";

const DEPTS = Object.keys(CATEGORIES) as Category[];

/**
 * Rejuvenation-style department mosaic — big photos, short labels, almost
 * no chrome. Image-forward first; the product grid below does the browsing.
 */
export async function DepartmentMosaic() {
  const counts = await Promise.all(
    DEPTS.map(async (key) => [key, await countPublished({ brand: "priceless", category: key })] as const),
  );
  const countMap = Object.fromEntries(counts) as Record<Category, number>;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1360px] px-6 py-16 md:px-8 md:py-24">
        <p className="eyebrow text-center">Shop by department</p>
        <h2 className="font-display mx-auto mt-4 max-w-[18ch] text-center text-[clamp(2rem,1rem+2.8vw,3.2rem)] leading-[1.05]">
          What&rsquo;s on the <span className="font-normal italic">floor.</span>
        </h2>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {DEPTS.map((key, i) => {
            const cat = CATEGORIES[key];
            const count = countMap[key] ?? 0;
            const wide = i === 0 || i === 5;
            return (
              <Link
                key={key}
                href={`/shop/${key}`}
                className={`group relative block overflow-hidden bg-[var(--taupe)] ${
                  wide ? "aspect-[4/3] md:col-span-2 md:aspect-[16/10]" : "aspect-[3/4] md:aspect-[4/5]"
                }`}
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes={wide ? "(min-width:768px) 50vw, 100vw" : "(min-width:768px) 25vw, 50vw"}
                  quality={78}
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white md:p-6">
                  <h3 className="font-display text-2xl leading-none md:text-3xl">{cat.label}</h3>
                  <p className="mt-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-white/80">
                    {count > 0 ? `${count} in stock` : "Browse"} ›
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

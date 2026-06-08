import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";

const EMPTY_AISLE = "/real-photos/building-exterior.webp";

const POPULAR: Array<keyof typeof CATEGORIES> = ["doors", "windows", "cabinets", "vanities"];

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Image src={EMPTY_AISLE} alt="An empty warehouse aisle" fill priority className="object-cover opacity-40" quality={70} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-start justify-center px-6 py-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs uppercase tracking-wider backdrop-blur">
          404 · Aisle not found
        </div>
        <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] md:text-7xl">
          LOOKS LIKE THIS AISLE IS EMPTY.
        </h1>
        <p className="mt-5 max-w-xl text-white/80">
          We could not find what you came in for. Either the page moved, the link is wrong, or
          this SKU sold out and rolled off the floor. Try one of the busy aisles instead.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-priceless">Back to the front counter</Link>
          <Link href="/shop" className="btn btn-outline border-white/40 bg-transparent text-white">Browse the warehouse</Link>
        </div>

        <div className="mt-12 w-full">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
            Popular aisles
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {POPULAR.map((key) => {
              const cat = CATEGORIES[key];
              return (
                <Link
                  key={key}
                  href={`/shop/${key}`}
                  className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-black"
                >
                  <Image src={cat.image} alt={cat.label} fill sizes="(min-width:640px) 25vw, 50vw" className="object-cover opacity-75 transition group-hover:scale-105 group-hover:opacity-100" quality={70} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="font-display text-lg text-white">{cat.label}</div>
                    <div className="mt-0.5 text-[11px] text-white/75">{cat.blurb}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <p className="mt-12 text-xs text-white/50">
          Still stuck? Call the floor at <a href="tel:+17158483855" className="underline">(715) 848-3855</a>.
        </p>
      </div>
    </main>
  );
}

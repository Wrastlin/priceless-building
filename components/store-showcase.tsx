import { STORE_SHOWCASE, SHOWCASE_DEPARTMENTS, type Collection } from "@/lib/store-showcase";

const TIER_RANK: Record<string, number> = {
  "A full wall": 4,
  "Thousands of feet": 4,
  Hundreds: 3,
  "Hundreds of feet": 3,
  Dozens: 2,
  "Stocked deep": 1,
  "By the foot": 1,
  "In stock": 0,
};

function CollectionRow({ c }: { c: Collection }) {
  const big = TIER_RANK[c.tier] >= 3;
  return (
    <div className="flex flex-col gap-2 border-t border-[var(--border)] py-5 first:border-t-0">
      <div className="flex items-baseline justify-between gap-4">
        <h4 className="font-display text-xl leading-tight md:text-2xl">{c.name}</h4>
        <span
          className={`font-mono shrink-0 whitespace-nowrap text-xs uppercase tracking-[0.12em] ${
            big ? "text-[var(--brand-priceless)]" : "text-[var(--muted-foreground)]"
          }`}
        >
          {c.approx ? `${c.approx} · ` : ""}
          {c.tier}
        </span>
      </div>
      {c.brands.length > 0 && (
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
          {c.brands.join(" · ")}
        </div>
      )}
    </div>
  );
}

/**
 * "Everything on the floor" — what the store actually carries, at scale.
 * Not a product catalog: a breadth map built from the in-store walkthrough,
 * with conservative, frame-grounded depth ("Hundreds", "A full wall").
 */
export function StoreShowcase() {
  return (
    <section className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
          {SHOWCASE_DEPARTMENTS.length} departments · everything under one roof
        </div>
        <h2 className="font-display mt-3 max-w-4xl text-4xl leading-[1.04] md:text-6xl">
          What&rsquo;s on the floor right now<span className="text-[var(--brand-priceless)]">.</span>
        </h2>
        <p className="font-serif mt-4 max-w-2xl text-base italic leading-relaxed text-[var(--muted-foreground)] md:text-lg">
          A whole-store walkthrough, counted aisle by aisle. Surplus moves
          weekly, so think of this as the depth you&rsquo;ll find when you walk
          in, not a fixed list. Come dig.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {SHOWCASE_DEPARTMENTS.map((dept) => (
            <div key={dept}>
              <div className="flex items-baseline gap-3 border-b-2 border-[var(--foreground)] pb-2">
                <h3 className="font-display text-2xl leading-none md:text-3xl">{dept}</h3>
                <span className="font-mono text-xs text-[var(--muted-foreground)]">
                  {STORE_SHOWCASE[dept].length}
                </span>
              </div>
              <div className="mt-2">
                {STORE_SHOWCASE[dept].map((c) => (
                  <CollectionRow key={c.name} c={c} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { WALKTHROUGH_INVENTORY, type InventoryType } from "@/lib/walkthrough-inventory";

const SELECTION_LABEL: Record<InventoryType["selection"], string> = {
  extensive: "Extensive selection",
  good: "Good selection",
  limited: "Limited stock",
  few: "A few in stock",
};

function priceRange(t: InventoryType): string {
  if (t.priceLow == null) return "Ask for price";
  if (t.priceHigh == null || t.priceHigh === t.priceLow) return `$${t.priceLow}`;
  return `$${t.priceLow}–$${t.priceHigh}`;
}

/**
 * "On the floor right now" — the verified product mix for a department,
 * pulled from the in-store walkthrough catalog (real product types, real
 * tag prices, real brands carried). Honest by design: price ranges come
 * straight off the tags, and we describe selection breadth rather than
 * claiming exact unit counts.
 */
export function DepartmentInventory({ category }: { category: string }) {
  const dept = WALKTHROUGH_INVENTORY[category];
  if (!dept || dept.types.length === 0) return null;

  return (
    <section className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--brand-priceless)]">
          On the floor right now
        </div>
        <h2 className="font-display mt-3 text-4xl leading-[1.05] md:text-5xl">
          What we&rsquo;re carrying<span className="text-[var(--brand-priceless)]">.</span>
        </h2>
        <p className="font-serif mt-3 max-w-2xl text-base italic leading-relaxed text-[var(--muted-foreground)] md:text-lg">
          Surplus moves fast, so this is the current mix from our last floor
          walk, not a fixed price list. Come see it, or call and we&rsquo;ll
          check stock and exact sizes for you.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-px border bg-[var(--border)] md:grid-cols-2">
          {dept.types.map((t) => (
            <div key={t.name} className="flex flex-col gap-3 bg-white p-6">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl leading-tight">{t.name}</h3>
                <span className="font-mono whitespace-nowrap text-sm text-[var(--brand-priceless)]">
                  {priceRange(t)}
                </span>
              </div>
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                {SELECTION_LABEL[t.selection]}
              </div>
              {t.brands.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {t.brands.map((b) => (
                    <span
                      key={b}
                      className="font-mono border border-[var(--border)] px-2 py-1 text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {dept.brands.length > 0 && (
          <p className="font-mono mt-6 text-xs leading-relaxed tracking-[0.06em] text-[var(--muted-foreground)]">
            Brands seen in this department:{" "}
            <span className="text-[var(--foreground)]">{dept.brands.join(" · ")}</span>
          </p>
        )}
      </div>
    </section>
  );
}

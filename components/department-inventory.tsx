import Image from "next/image";
import { WALKTHROUGH_INVENTORY, type InventoryType } from "@/lib/walkthrough-inventory";
import { typePhoto } from "@/lib/department-photos";

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
 * tag prices, real brands carried). Image-first: every product type leads
 * with a real photo so the page reads like a store aisle, not a price list.
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

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {dept.types.map((t) => (
            <div key={t.name} className="group flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--muted)]">
                <Image
                  src={typePhoto(category, t.name)}
                  alt={t.name}
                  fill
                  sizes="(min-width:1024px) 22vw, (min-width:640px) 30vw, 45vw"
                  quality={70}
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <span className="font-mono absolute left-2 top-2 bg-white/95 px-2 py-1 text-[10px] uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                  {SELECTION_LABEL[t.selection]}
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg leading-tight md:text-xl">{t.name}</h3>
                <span className="font-mono shrink-0 whitespace-nowrap text-sm text-[var(--brand-priceless)]">
                  {priceRange(t)}
                </span>
              </div>
              {t.brands.length > 0 && (
                <div className="font-mono mt-1.5 text-[11px] leading-relaxed text-[var(--muted-foreground)]">
                  {t.brands.slice(0, 4).join(" · ")}
                  {t.brands.length > 4 ? ` +${t.brands.length - 4}` : ""}
                </div>
              )}
            </div>
          ))}
        </div>

        {dept.brands.length > 0 && (
          <p className="font-mono mt-10 text-xs leading-relaxed tracking-[0.06em] text-[var(--muted-foreground)]">
            Brands seen in this department:{" "}
            <span className="text-[var(--foreground)]">{dept.brands.join(" · ")}</span>
          </p>
        )}
      </div>
    </section>
  );
}

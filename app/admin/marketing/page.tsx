import Link from "next/link";
import Image from "next/image";
import { InventoryAppShell } from "@/components/inventory/inventory-app-shell";
import { listAdminAll, findBySku } from "@/lib/items/store";
import { MarketingCompose } from "./marketing-compose";

export const dynamic = "force-dynamic";

/**
 * Social marketing for floor inventory — same shell as intake/inventory.
 */
export default async function MarketingPage({
  searchParams,
}: {
  searchParams: Promise<{ sku?: string }>;
}) {
  const sp = await searchParams;
  const [item, items] = await Promise.all([
    sp.sku ? findBySku(sp.sku) : Promise.resolve(null),
    listAdminAll(),
  ]);

  const floor = items.filter((it) => it.status !== "sold" && it.status !== "archived");

  if (item && item.status !== "archived") {
    return (
      <InventoryAppShell
        active="marketing"
        title={item.title}
        subtitle={`Generate post · ${item.sku}`}
        backHref="/admin/marketing"
        actions={
          <Link href={`/admin/inventory/${item.sku}`} className="inv-btn inv-btn-ghost hidden sm:inline-flex">
            Back to item
          </Link>
        }
      >
        <p className="mb-5 max-w-2xl text-[14px] text-[var(--muted-foreground)]">
          Copy listing text for Facebook Marketplace, Instagram, eBay, Craigslist, or a flyer — then
          mark the channel on the item. Nothing posts automatically.
        </p>
        <MarketingCompose item={item} />
      </InventoryAppShell>
    );
  }

  return (
    <InventoryAppShell active="marketing" title="Generate post">
      <div className="mb-6 max-w-lg">
        <p className="inv-eyebrow mb-2">Social sell</p>
        <h2 className="font-[family-name:var(--font-display)] text-[1.6rem] font-medium tracking-[-0.01em] leading-tight">
          Pick an item, copy a listing
        </h2>
        <p className="mt-2 text-[14px] text-[var(--muted-foreground)]">
          Ready-to-paste copy for Marketplace, Instagram, eBay, Craigslist, or a flyer.
        </p>
      </div>

      {floor.length === 0 ? (
        <div className="rounded-[14px] border border-[var(--border)] bg-white p-6 text-[14px] text-[var(--muted-foreground)]">
          No floor items yet. Add one in{" "}
          <Link href="/admin/inventory/intake" className="text-[var(--brand-navy)] underline">
            intake
          </Link>
          .
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {floor.map((it) => (
            <li key={it.id}>
              <Link
                href={`/admin/marketing?sku=${it.sku}`}
                className="group block overflow-hidden rounded-[14px] border border-[var(--border)] bg-white transition hover:border-[var(--brand-navy)]"
              >
                <div className="relative aspect-[4/3] w-full bg-[var(--surface)]">
                  {it.photos?.[0] || it.image ? (
                    <Image
                      src={it.photos?.[0] || it.image}
                      alt={it.title}
                      fill
                      sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                      className="object-cover"
                      quality={75}
                    />
                  ) : null}
                </div>
                <div className="p-3">
                  <div className="line-clamp-2 text-sm font-medium">{it.title}</div>
                  <div className="mt-1 flex items-baseline justify-between gap-2 text-xs text-[var(--muted-foreground)]">
                    <span className="font-mono">{it.sku}</span>
                    <span className="font-semibold tabular-nums text-[var(--foreground)]">
                      ${it.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </InventoryAppShell>
  );
}

import { AdminShell } from "@/components/admin-shell";
import { listAdminAll } from "@/lib/items/store";
import type { CatalogItem } from "@/lib/items/types";
import { LabelSheet, type UnitLabel } from "./label-sheet";

export const dynamic = "force-dynamic";

/**
 * DK-1201 sticker printing (Brother QL series, 1.1" × 3.5" die-cut).
 *
 * One physical sticker per UNIT: an item covering tags #51–#57 yields seven
 * stickers, each with its own unit number and the item's SKU barcode, so any
 * single door maps back to its record at the register.
 *
 * Select by ?skus=PL-1,PL-2 (the batch script emits this URL), or with no
 * param: every inventoried item, newest first — "print what I just captured".
 */
export default async function Labels({
  searchParams,
}: {
  searchParams: Promise<{ skus?: string }>;
}) {
  const { skus } = await searchParams;
  const all = await listAdminAll();

  let items: CatalogItem[];
  if (skus) {
    const wanted = skus.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
    const bySku = new Map(all.map((i) => [i.sku.toUpperCase(), i]));
    items = wanted.map((s) => bySku.get(s)).filter((i): i is CatalogItem => !!i);
  } else {
    items = all
      .filter((i) => i.inventoriedAt)
      .sort((a, b) => (b.inventoriedAt ?? "").localeCompare(a.inventoriedAt ?? ""));
  }

  // Expand each record into per-unit labels.
  const labels: UnitLabel[] = items.flatMap((item) => {
    const start = item.tagRange?.start;
    const end = item.tagRange?.end ?? start;
    const units =
      start !== undefined && end !== undefined
        ? Array.from({ length: end - start + 1 }, (_, i) => start + i)
        : [undefined];
    return units.map((unit) => ({
      sku: item.sku,
      unit,
      title: item.title.replace(/\s*\(tags? #[\d–-]+\)$/, ""),
      dimensions: item.dimensions,
      price: item.price,
    }));
  });

  return (
    <AdminShell
      active="labels"
      title={`Print stickers (${labels.length})`}
      crumbs={[{ label: "Inventory", href: "/admin/inventory" }, { label: "Stickers" }]}
    >
      <LabelSheet labels={labels} />
    </AdminShell>
  );
}

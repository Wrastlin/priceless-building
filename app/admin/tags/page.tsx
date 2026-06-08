import { AdminShell } from "@/components/admin-shell";
import { TagPrinter } from "./tag-printer";
import { CATALOG } from "@/lib/catalog";

export default async function TagsPage({ searchParams }: { searchParams: Promise<{ sku?: string }> }) {
  const sp = await searchParams;
  const initial = sp.sku ? CATALOG.filter((c) => c.sku === sp.sku) : CATALOG.slice(0, 4);
  return (
    <AdminShell active="tags" title="Print tags">
      <p className="admin-help mb-5 max-w-2xl">
        4×3&quot; thermal tag with Code 128 barcode, tag price, retail comparison, and aisle location. Sends to the floor printer (Brother QL-820NWB).
      </p>
      <TagPrinter initialItems={initial} all={CATALOG} />
    </AdminShell>
  );
}

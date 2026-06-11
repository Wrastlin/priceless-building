import { AdminShell } from "@/components/admin-shell";
import { TagPrinter } from "./tag-printer";
import { listCatalog } from "@/lib/catalog";

export default async function TagsPage({ searchParams }: { searchParams: Promise<{ sku?: string }> }) {
  const sp = await searchParams;
  const all = await listCatalog();
  const initial = sp.sku ? all.filter((c) => c.sku === sp.sku) : all.slice(0, 4);
  return (
    <AdminShell active="tags" title="Print tags">
      <p className="admin-help mb-5 max-w-2xl">
        4×3&quot; thermal tag with Code 128 barcode, tag price, retail comparison, and aisle location. Sends to the floor printer (Brother QL-820NWB).
      </p>
      <TagPrinter initialItems={initial} all={all} />
    </AdminShell>
  );
}

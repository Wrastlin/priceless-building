import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { listCatalog } from "@/lib/catalog";
import { InventoryTable } from "./inventory-table";

export const dynamic = "force-dynamic";

export default async function InventoryList() {
  const items = await listCatalog();
  return (
    <AdminShell
      active="inventory"
      title={`Inventory (${items.length})`}
      actions={
        <>
          <Link href="/admin/tags" className="admin-btn admin-btn-outline">
            Print tags
          </Link>
          <Link href="/admin/inventory/new" className="admin-btn admin-btn-primary">
            + Add item
          </Link>
        </>
      }
    >
      <InventoryTable items={items} />
    </AdminShell>
  );
}

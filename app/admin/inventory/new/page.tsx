import { AdminShell } from "@/components/admin-shell";
import { NewItemForm } from "./new-item-form";

export default function NewItem() {
  return (
    <AdminShell
      active="add"
      title="Add new item"
      crumbs={[{ label: "Inventory", href: "/admin/inventory" }, { label: "Add item" }]}
    >
      <p className="admin-help mb-5 max-w-3xl">
        Left: snap the photos and let AI identify and price the item. Right: review the
        details, set the tag price, and save. Marketing copy, scene photos, and the tag
        preview are tucked under Optional tools below.
      </p>
      <NewItemForm />
    </AdminShell>
  );
}

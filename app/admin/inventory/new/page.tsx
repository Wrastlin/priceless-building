import { AdminShell } from "@/components/admin-shell";
import { NewItemForm } from "./new-item-form";

export default function NewItem() {
  return (
    <AdminShell
      active="add"
      title="Add new item"
      crumbs={[{ label: "Inventory", href: "/admin/inventory" }, { label: "Add item" }]}
    >
      <p className="admin-help mb-5 max-w-2xl">
        Snap a photo, describe what it is, pull live retail comparables, set a tag price, and generate the SKU + printable tag.
      </p>
      <NewItemForm />
    </AdminShell>
  );
}

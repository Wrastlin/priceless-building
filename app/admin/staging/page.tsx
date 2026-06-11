import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { listDrafts } from "@/lib/items/store";
import { StagingCard } from "./staging-card";

export const dynamic = "force-dynamic";

export default async function StagingPage() {
  const drafts = await listDrafts();

  return (
    <AdminShell
      active="staging"
      title="Staging"
      crumbs={[{ label: "Staging" }]}
      actions={
        <Link href="/admin/inventory/new" className="admin-btn admin-btn-primary">
          Add item
        </Link>
      }
    >
      <div className="mb-4 text-sm text-muted-foreground">
        Drafts waiting for a manager to approve before they land on the storefront.
      </div>

      {drafts.length === 0 ? (
        <div className="admin-card flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="text-base font-semibold text-foreground">No items waiting for review.</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Use{" "}
            <Link href="/admin/inventory/new" className="text-foreground underline hover:no-underline">
              Add item
            </Link>{" "}
            to add one.
          </div>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {drafts.map((d) => (
            <StagingCard key={d.sku} draft={d} />
          ))}
        </ul>
      )}
    </AdminShell>
  );
}

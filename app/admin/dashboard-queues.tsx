import Link from "next/link";
import type { CatalogItem } from "@/lib/items/types";
import { ItemThumbZoom } from "@/components/item-thumb-zoom";

/**
 * The dashboard's two work queues (In staging / Recently published) as
 * image-led rows. A micro-thumbnail per item makes the queues scannable at
 * a glance instead of a wall of titles + SKUs.
 */
export function DashboardQueues({
  drafts,
  recent,
  oldestDraft,
}: {
  drafts: CatalogItem[];
  recent: CatalogItem[];
  oldestDraft?: CatalogItem;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="admin-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">In staging</h2>
            <p className="mt-0.5 admin-help">Drafts waiting on approval.</p>
          </div>
          <Link href="/admin/staging" className="text-sm text-[var(--brand-priceless)] hover:underline">
            See all
          </Link>
        </div>
        {drafts.length === 0 ? (
          <div className="px-5 py-8 text-sm text-muted-foreground">
            No drafts right now.{" "}
            <Link href="/admin/inventory/new" className="text-[var(--brand-priceless)] hover:underline">
              Add one
            </Link>
            .
          </div>
        ) : (
          <ul className="divide-y divide-border text-sm">
            {drafts.slice(0, 6).map((d) => (
              <QueueRow key={d.id} item={d} actionHref="/admin/staging" actionLabel="Review" />
            ))}
          </ul>
        )}
        {oldestDraft ? (
          <div className="border-t border-border bg-[#fafaf9] px-5 py-2 text-xs text-muted-foreground">
            Oldest draft: {oldestDraft.sku} · {oldestDraft.title}
          </div>
        ) : null}
      </div>

      <div className="admin-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">Recently published</h2>
            <p className="mt-0.5 admin-help">Live on the storefront. Marketing-ready.</p>
          </div>
          <Link href="/admin/inventory" className="text-sm text-[var(--brand-priceless)] hover:underline">
            See all
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="px-5 py-8 text-sm text-muted-foreground">
            No live items yet. Approve a draft in{" "}
            <Link href="/admin/staging" className="text-[var(--brand-priceless)] hover:underline">
              staging
            </Link>
            .
          </div>
        ) : (
          <ul className="divide-y divide-border text-sm">
            {recent.map((p) => (
              <QueueRow key={p.id} item={p} actionHref={`/admin/marketing?sku=${p.sku}`} actionLabel="Make a post" />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function QueueRow({
  item,
  actionHref,
  actionLabel,
}: {
  item: CatalogItem;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <li className="flex items-center gap-3 px-5 py-3">
      <ItemThumbZoom item={item} className="h-16 w-24 shrink-0 rounded-md" iconClass="h-8 w-8" />
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium text-foreground">{item.title}</div>
        <div className="text-xs text-muted-foreground">
          <span className="font-mono">{item.sku}</span> · {item.category}
        </div>
      </div>
      <Link href={actionHref} className="admin-btn admin-btn-outline shrink-0 px-2.5 py-1 text-xs">
        {actionLabel}
      </Link>
    </li>
  );
}

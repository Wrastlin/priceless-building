import Image from "next/image";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { listDrafts } from "@/lib/items/store";
import { approveDraftAction, rejectDraftAction } from "@/lib/actions/staging";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

function timeSince(iso?: string): string {
  if (!iso) return "just now";
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return "just now";
  const m = Math.floor(ms / 60_000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default async function StagingPage() {
  const drafts = listDrafts();

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
          {drafts.map((d) => {
            const approve = approveDraftAction.bind(null, d.sku);
            const reject = rejectDraftAction.bind(null, d.sku);
            return (
              <li key={d.sku} className="admin-card overflow-hidden">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f4f4f3]">
                  {d.image ? (
                    <Image
                      src={d.image}
                      alt={d.title}
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                      unoptimized={d.image.startsWith("data:")}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      No photo
                    </div>
                  )}
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      {d.category}
                      {d.manufacturer ? ` · ${d.manufacturer}` : ""}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-foreground">{d.title}</div>
                    {d.subtitle ? (
                      <div className="mt-0.5 text-xs text-muted-foreground">{d.subtitle}</div>
                    ) : null}
                  </div>

                  <dl className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <dt className="text-muted-foreground">Tag price</dt>
                      <dd className="font-mono text-sm font-semibold tabular-nums text-foreground">
                        {formatCurrency(d.price || 0)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Retail comp</dt>
                      <dd className="font-mono text-sm tabular-nums text-foreground">
                        {d.comparable ? formatCurrency(d.comparable.price) : "—"}
                        {d.comparable ? (
                          <span className="ml-1 text-[10px] text-muted-foreground">
                            {d.comparable.retailer}
                          </span>
                        ) : null}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Location</dt>
                      <dd className="text-foreground">{d.location ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">SKU</dt>
                      <dd className="font-mono text-xs text-foreground">{d.sku}</dd>
                    </div>
                  </dl>

                  <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                    <span>By {d.createdBy ?? "unknown"}</span>
                    <span>{timeSince(d.createdAt)}</span>
                  </div>

                  <div className="flex gap-2">
                    <form action={approve} className="flex-1">
                      <button type="submit" className="admin-btn admin-btn-primary w-full">
                        Approve
                      </button>
                    </form>
                    <form action={reject} className="flex-1">
                      <button type="submit" className="admin-btn admin-btn-outline w-full">
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </AdminShell>
  );
}

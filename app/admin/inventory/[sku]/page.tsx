import Link from "next/link";
import { notFound } from "next/navigation";
import { InventoryAppShell } from "@/components/inventory/inventory-app-shell";
import { PrintLabels } from "@/components/inventory/print-labels";
import { ChannelChecklist } from "@/components/inventory/channel-checklist";
import { findBySku } from "@/lib/items/store";
import { getItemPrivate } from "@/lib/items/private-store";
import { formatCurrency } from "@/lib/utils";
import { ItemGallery } from "./item-gallery";
import { CostPanel } from "./cost-panel";
import { DetailsEditor } from "./details-editor";
import { MarkSoldButton } from "./mark-sold-button";
import { RefreshComparables } from "./refresh-comparables";

export default async function EditItem({
  params,
  searchParams,
}: {
  params: Promise<{ sku: string }>;
  searchParams: Promise<{ printMsg?: string }>;
}) {
  const { sku } = await params;
  const sp = await searchParams;
  const item = await findBySku(sku);
  if (!item) notFound();
  const priv = await getItemPrivate(item.sku);
  const compare = item.compareAt ?? item.msrp;

  return (
    <InventoryAppShell
      active="inventory"
      title={item.title}
      subtitle={item.sku}
      backHref="/admin/inventory"
      actions={
        <>
          <Link
            href={`/admin/inventory/${item.sku}/sell-sheet`}
            className="inv-btn inv-btn-ghost hidden sm:inline-flex"
          >
            Sell sheet
          </Link>
          <Link
            href={`/admin/marketing?sku=${item.sku}`}
            className="inv-btn inv-btn-ghost hidden sm:inline-flex"
          >
            Generate post
          </Link>
          <MarkSoldButton sku={item.sku} price={item.price} status={item.status} />
        </>
      }
    >
      {sp.printMsg ? (
        <p className="mb-4 rounded-[12px] bg-[color-mix(in_oklch,var(--sale-red)_10%,white)] px-3 py-2 text-[13px] text-[var(--sale-red)]">
          Saved, but print: {sp.printMsg}
        </p>
      ) : null}

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="inv-eyebrow mb-1">On the floor</p>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[14px] text-[var(--muted-foreground)]">
            <span className="font-mono text-[var(--foreground)]">{item.sku}</span>
            <span className="capitalize">{item.status}</span>
            <span>{item.inStock} in stock</span>
            {item.location ? <span>{item.location}</span> : null}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[1.75rem] font-semibold tabular-nums leading-none">
            {formatCurrency(item.price)}
          </div>
          {compare && compare > item.price ? (
            <div className="mt-1 text-[13px] text-[var(--sale-red)]">
              Compare {formatCurrency(compare)} · save {Math.round((1 - item.price / compare) * 100)}%
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.35fr]">
        <div className="space-y-4">
          <ItemGallery
            sku={item.sku}
            cover={item.photos?.[0] || item.image}
            gallery={item.photos?.slice(1) ?? item.gallery ?? []}
            alt={item.title}
          />
          <PrintLabels sku={item.sku} />
          <Link
            href={`/admin/inventory/${item.sku}/sell-sheet`}
            className="inv-btn inv-btn-outline flex w-full justify-center text-[13px]"
          >
            Open print sell sheet
          </Link>
        </div>

        <div className="space-y-4">
          <Panel title="Details">
            {item.tagRange ? (
              <p className="mb-3 text-[13px] text-[var(--muted-foreground)]">
                Stickers{" "}
                <span className="font-mono font-semibold text-[var(--foreground)]">
                  {item.tagRange.start === item.tagRange.end
                    ? `#${item.tagRange.start}`
                    : `#${item.tagRange.start}–#${item.tagRange.end}`}
                </span>
              </p>
            ) : null}
            <DetailsEditor item={item} />
          </Panel>

          <Panel title="Social channels">
            <div className="mb-3 flex flex-wrap gap-2">
              <Link
                href={`/admin/inventory/${item.sku}/sell-sheet`}
                className="inv-btn inv-btn-secondary text-[13px]"
              >
                Sell sheet
              </Link>
              <Link href={`/admin/marketing?sku=${item.sku}`} className="inv-btn inv-btn-secondary text-[13px]">
                Generate post
              </Link>
              <Link href="/admin/connections" className="inv-btn inv-btn-outline text-[13px]">
                Connections
              </Link>
            </div>
            <ChannelChecklist sku={item.sku} initial={item.channels} />
          </Panel>

          <Panel title="Cost · internal">
            <CostPanel
              sku={item.sku}
              price={item.price}
              initialCost={priv?.cost ?? null}
              initialSourceLot={priv?.sourceLot ?? null}
              compareAt={item.compareAt ?? item.msrp ?? null}
            />
          </Panel>

          <Panel title={`Comparables${item.comparables?.length ? ` (${item.comparables.length})` : ""}`}>
            <RefreshComparables sku={item.sku} title={item.title} />
            {item.comparables && item.comparables.length > 0 ? (
              <ul className="mt-3 divide-y divide-[var(--border)]">
                {item.comparables.map((c, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[48px_1fr_auto] items-center gap-3 py-2.5 text-sm"
                  >
                    <div className="relative aspect-square overflow-hidden rounded bg-[var(--surface)]">
                      {c.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.image} alt="" className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-[var(--brand-navy)]">{c.source}</div>
                      <div className="truncate text-[var(--muted-foreground)]">{c.title}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-semibold tabular-nums">
                        {formatCurrency(c.price)}
                      </div>
                      {c.url ? (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-[var(--brand-navy)] underline"
                        >
                          view →
                        </a>
                      ) : null}
                    </div>
                  </li>
                ))}
                {(() => {
                  const prices = item.comparables!.map((c) => c.price).filter((p) => p > 0);
                  if (prices.length === 0) return null;
                  const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
                  return (
                    <li className="flex items-center justify-between py-2.5 text-sm">
                      <span className="font-medium text-[var(--muted-foreground)]">Retail average</span>
                      <span className="font-mono font-semibold tabular-nums">{formatCurrency(avg)}</span>
                    </li>
                  );
                })()}
              </ul>
            ) : (
              <p className="mt-2 text-[13px] text-[var(--muted-foreground)]">
                No comparables saved yet. Run a refresh to pull SerpAPI retail matches.
              </p>
            )}
          </Panel>
        </div>
      </div>
    </InventoryAppShell>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-white p-5">
      <h2 className="border-b border-[var(--border)] pb-2 text-[15px] font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

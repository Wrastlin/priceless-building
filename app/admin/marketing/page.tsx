import Link from "next/link";
import Image from "next/image";
import { InventoryAppShell } from "@/components/inventory/inventory-app-shell";
import { listAdminAll, findBySku } from "@/lib/items/store";
import { isOwner } from "@/lib/auth/session";
import { isRealCapture, isSeedable, seedStatus } from "@/lib/marketing/seeds";
import { SeedChip } from "@/components/inventory/seed-status";
import { MarketingCompose } from "./marketing-compose";

export const dynamic = "force-dynamic";

function startOfWeekIso(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - diff);
  return d.toISOString();
}

/**
 * Social marketing for floor inventory — same shell as intake/inventory.
 * For owners this is also the promote-and-measure cockpit: intake volume,
 * the ad-kit seed queue, and channel coverage in one band.
 */
export default async function MarketingPage({
  searchParams,
}: {
  searchParams: Promise<{ sku?: string }>;
}) {
  const sp = await searchParams;
  const [item, items, owner] = await Promise.all([
    sp.sku ? findBySku(sp.sku) : Promise.resolve(null),
    listAdminAll(),
    isOwner(),
  ]);

  const floor = items.filter((it) => it.status !== "sold" && it.status !== "archived");

  if (item && item.status !== "archived") {
    return (
      <InventoryAppShell
        active="marketing"
        title={item.title}
        subtitle={`Generate post · ${item.sku}`}
        backHref="/admin/marketing"
        actions={
          <Link href={`/admin/inventory/${item.sku}`} className="inv-btn inv-btn-ghost hidden sm:inline-flex">
            Back to item
          </Link>
        }
      >
        <p className="mb-5 max-w-2xl text-[14px] text-[var(--muted-foreground)]">
          Copy listing text for Facebook Marketplace, Instagram, eBay, Craigslist, or a flyer — then
          mark the channel on the item. Nothing posts automatically.
        </p>
        <MarketingCompose item={item} />
      </InventoryAppShell>
    );
  }

  const weekStart = startOfWeekIso();
  const real = items.filter(isRealCapture);
  const capturedThisWeek = real.filter((it) => (it.createdAt ?? "") >= weekStart).length;
  const seeds = floor.filter(isRealCapture).filter(isSeedable);
  const newSeeds = seeds
    .filter((it) => seedStatus(it) === "new")
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  const kitsReady = real.filter((it) => it.marketing?.status === "processed").length;
  const listedOnChannels = real.filter(
    (it) => it.channels && Object.keys(it.channels).length > 0,
  ).length;

  return (
    <InventoryAppShell active="marketing" title="Generate post">
      <div className="mb-6 max-w-lg">
        <p className="inv-eyebrow mb-2">Social sell</p>
        <h2 className="font-[family-name:var(--font-display)] text-[1.6rem] font-medium tracking-[-0.01em] leading-tight">
          Pick an item, copy a listing
        </h2>
        <p className="mt-2 text-[14px] text-[var(--muted-foreground)]">
          Ready-to-paste copy for Marketplace, Instagram, eBay, Craigslist, or a flyer.
        </p>
      </div>

      {owner ? (
        <>
          <div className="mb-6 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Captured this week" value={capturedThisWeek} caption="items by the team" />
            <Stat label="New seeds" value={newSeeds.length} caption="photos awaiting an ad kit" />
            <Stat label="Ad kits ready" value={kitsReady} caption="in the marketing library" />
            <Stat label="Listed on channels" value={listedOnChannels} caption="of floor items" />
          </div>

          {newSeeds.length > 0 ? (
            <section className="mb-8">
              <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                Ad kit queue · newest first
              </h3>
              <ul className="flex gap-3 overflow-x-auto pb-2">
                {newSeeds.slice(0, 12).map((it) => (
                  <li key={it.sku} className="w-40 shrink-0">
                    <Link
                      href={`/admin/inventory/${it.sku}`}
                      className="block overflow-hidden rounded-[14px] border border-[var(--border)] bg-white transition hover:border-[var(--brand-navy)]"
                    >
                      <div className="relative aspect-square w-full bg-[var(--surface)]">
                        {it.photos?.[0] || it.image ? (
                          <Image
                            src={it.photos?.[0] || it.image}
                            alt={it.title}
                            fill
                            sizes="160px"
                            className="object-cover"
                            quality={60}
                          />
                        ) : null}
                      </div>
                      <div className="p-2.5">
                        <div className="line-clamp-2 text-[13px] font-medium leading-snug">{it.title}</div>
                        <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-[var(--muted-foreground)]">
                          <span className="font-mono">{it.sku}</span>
                          {it.createdBy ? (
                            <span className="truncate">{it.createdBy.split("@")[0]}</span>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-1 text-[12px] text-[var(--muted-foreground)]">
                Every intake photo is a permanent seed. Process the queue on the studio Mac:{" "}
                <span className="font-mono">node scripts/marketing-seeds.mjs list</span> — kits mark
                themselves Ready here when they ship.
              </p>
            </section>
          ) : null}
        </>
      ) : null}

      {floor.length === 0 ? (
        <div className="rounded-[14px] border border-[var(--border)] bg-white p-6 text-[14px] text-[var(--muted-foreground)]">
          No floor items yet. Add one in{" "}
          <Link href="/admin/inventory/intake" className="text-[var(--brand-navy)] underline">
            intake
          </Link>
          .
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {floor.map((it) => (
            <li key={it.id}>
              <Link
                href={`/admin/marketing?sku=${it.sku}`}
                className="group block overflow-hidden rounded-[14px] border border-[var(--border)] bg-white transition hover:border-[var(--brand-navy)]"
              >
                <div className="relative aspect-[4/3] w-full bg-[var(--surface)]">
                  {it.photos?.[0] || it.image ? (
                    <Image
                      src={it.photos?.[0] || it.image}
                      alt={it.title}
                      fill
                      sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                      className="object-cover"
                      quality={70}
                    />
                  ) : null}
                  {owner && it.marketing?.status === "processed" ? (
                    <span className="absolute left-2 top-2">
                      <SeedChip status="processed" />
                    </span>
                  ) : null}
                </div>
                <div className="p-3">
                  <div className="line-clamp-2 text-sm font-medium">{it.title}</div>
                  <div className="mt-1 flex items-baseline justify-between gap-2 text-xs text-[var(--muted-foreground)]">
                    <span className="font-mono">{it.sku}</span>
                    <span className="font-semibold tabular-nums text-[var(--foreground)]">
                      ${it.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </InventoryAppShell>
  );
}

function Stat({ label, value, caption }: { label: string; value: number; caption: string }) {
  return (
    <div className="rounded-[14px] border border-[var(--border)] bg-white p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-1 text-[2rem] font-semibold tabular-nums leading-none">{value}</p>
      <p className="mt-1 text-[12px] text-[var(--muted-foreground)]">{caption}</p>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Camera, DoorOpen, AppWindow, Package, Boxes, Lamp, Wrench, Layers } from "lucide-react";
import { InventoryAppShell } from "@/components/inventory/inventory-app-shell";
import { listAdminAll } from "@/lib/items/store";
import { DEFAULT_CATEGORIES } from "@/lib/intake/taxonomy";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

const ICONS: Record<string, typeof DoorOpen> = {
  DoorOpen,
  AppWindow,
  Package,
  Boxes,
  Lamp,
  Wrench,
  Layers,
};

function coverOf(item: { image?: string; photos?: string[]; gallery?: string[] }) {
  return item.photos?.[0] || item.image || item.gallery?.[0] || "";
}

export default async function InventoryHome({
  searchParams,
}: {
  searchParams: Promise<{ dept?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const items = await listAdminAll();
  const q = (sp.q ?? "").trim().toLowerCase();
  const dept = sp.dept?.trim();

  let filtered = items;
  if (dept) filtered = filtered.filter((it) => it.category === dept);
  if (q) {
    filtered = filtered.filter((it) => {
      const hay = [it.title, it.sku, it.manufacturer, it.subtitle, it.location]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (hay.includes(q)) return true;
      // sticker number search
      const n = Number(q);
      if (it.tagRange && Number.isFinite(n)) {
        return n >= it.tagRange.start && n <= it.tagRange.end;
      }
      return false;
    });
  }

  const counts = new Map<string, number>();
  for (const it of items) {
    counts.set(it.category, (counts.get(it.category) ?? 0) + 1);
  }

  return (
    <InventoryAppShell
      active="inventory"
      actions={
        <Link href="/admin/inventory/intake" className="inv-btn inv-btn-primary">
          <Camera size={16} />
          New intake
        </Link>
      }
    >
      <div className="mb-8">
        <p className="inv-eyebrow mb-2">Floor stock</p>
        <h2 className="font-[family-name:var(--font-display)] text-[1.75rem] font-medium tracking-[-0.01em] leading-[1.15] sm:text-[2rem]">
          {items.length.toLocaleString()} items on the floor
        </h2>
        <p className="mt-2 max-w-xl text-[15px] text-[var(--muted-foreground)]">
          Photograph, price-compare, print a QR label, then generate a social post — selling stays in admin until we wire the website later.
        </p>
      </div>

      <form className="mb-6" action="/admin/inventory" method="get">
        {dept ? <input type="hidden" name="dept" value={dept} /> : null}
        <input
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Search title, SKU, or sticker #"
          className="inv-input max-w-lg"
          aria-label="Search inventory"
        />
      </form>

      {!dept && !q ? (
        <section className="mb-10">
          <div className="mb-3 flex items-end justify-between gap-3">
            <h3 className="text-[15px] font-semibold">Departments</h3>
            <span className="text-[12px] text-[var(--muted-foreground)]">{DEFAULT_CATEGORIES.length} departments</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {DEFAULT_CATEGORIES.map((c) => {
              const Icon = ICONS[c.icon] ?? Boxes;
              const n = counts.get(c.id) ?? 0;
              return (
                <Link key={c.id} href={`/admin/inventory?dept=${c.id}`} className="inv-tile">
                  <span className="inv-tile-icon">
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <span>
                    <span className="block text-[14px] font-semibold leading-tight">{c.label}</span>
                    <span className="mt-0.5 block text-[12px] text-[var(--muted-foreground)]">
                      {n} {n === 1 ? "item" : "items"}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <h3 className="text-[15px] font-semibold">
            {dept
              ? DEFAULT_CATEGORIES.find((c) => c.id === dept)?.label ?? dept
              : q
                ? "Search results"
                : "Recent"}
          </h3>
          <div className="flex items-center gap-3 text-[12px] text-[var(--muted-foreground)]">
            <span>{filtered.length} shown</span>
            {dept || q ? (
              <Link href="/admin/inventory" className="font-medium text-[var(--brand-navy)] hover:underline">
                Clear
              </Link>
            ) : null}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-[14px] border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-14 text-center">
            <p className="font-[family-name:var(--font-display)] text-xl font-medium">Nothing here yet</p>
            <p className="mx-auto mt-2 max-w-sm text-[14px] text-[var(--muted-foreground)]">
              Start an intake to photograph an item, set a price, and print a QR label.
            </p>
            <Link href="/admin/inventory/intake" className="inv-btn inv-btn-primary mt-6 inline-flex">
              <Camera size={16} />
              Start intake
            </Link>
          </div>
        ) : (
          <div className="rounded-[14px] border border-[var(--border)] bg-white px-3 sm:px-4">
            {filtered.slice(0, 80).map((it) => {
              const cover = coverOf(it);
              const compare = it.compareAt ?? it.msrp;
              return (
                <Link key={it.sku} href={`/admin/inventory/${it.sku}`} className="inv-row">
                  {cover ? (
                    <Image
                      src={cover}
                      alt=""
                      width={56}
                      height={56}
                      className="inv-thumb"
                      unoptimized={cover.startsWith("data:")}
                    />
                  ) : (
                    <div className="inv-thumb flex items-center justify-center text-[10px] text-[var(--muted-foreground)]">
                      No photo
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-semibold leading-tight">{it.title}</div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-[var(--muted-foreground)]">
                      <span className="font-mono">{it.sku}</span>
                      <span>·</span>
                      <span className="capitalize">{it.status}</span>
                      {it.inStock > 1 ? (
                        <>
                          <span>·</span>
                          <span>×{it.inStock}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[15px] font-semibold tabular-nums">{formatCurrency(it.price)}</div>
                    {compare && compare > it.price ? (
                      <div className="text-[11px] tabular-nums text-[var(--sale-red)]">
                        save {Math.round((1 - it.price / compare) * 100)}%
                      </div>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </InventoryAppShell>
  );
}

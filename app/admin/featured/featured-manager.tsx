"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { setFeaturedAction } from "@/lib/actions/staging";

type Slim = { sku: string; title: string; image: string; category: string; price: number; featured: boolean };

export function FeaturedManager({ items, minimum }: { items: Slim[]; minimum: number }) {
  const [feat, setFeat] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((i) => [i.sku, i.featured])),
  );
  const [q, setQ] = useState("");
  const [, start] = useTransition();

  const count = Object.values(feat).filter(Boolean).length;
  const featured = items.filter((i) => feat[i.sku]);
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [] as Slim[];
    return items
      .filter((i) => !feat[i.sku] && (i.title.toLowerCase().includes(s) || i.sku.toLowerCase().includes(s)))
      .slice(0, 24);
  }, [q, items, feat]);

  function toggle(sku: string, val: boolean) {
    setFeat((p) => ({ ...p, [sku]: val }));
    start(async () => {
      try {
        await setFeaturedAction(sku, val);
        toast.success(val ? "Added to featured" : "Removed from featured");
      } catch {
        toast.error("Could not update");
        setFeat((p) => ({ ...p, [sku]: !val }));
      }
    });
  }

  const below = count < minimum;

  return (
    <div className="space-y-8">
      <div className={`admin-card flex flex-wrap items-center justify-between gap-3 ${below ? "border-amber-400 bg-amber-50" : ""}`}>
        <div>
          <div className="admin-label">Featured pool</div>
          <div className="text-2xl font-semibold">
            {count} <span className="text-[var(--muted-foreground)]">/ {minimum} minimum</span>
          </div>
        </div>
        <p className="max-w-md text-sm text-[var(--muted-foreground)]">
          {below
            ? `Add at least ${minimum - count} more so the home page always has enough to rotate through.`
            : "Healthy pool. The home page rotates a fresh subset from these on each refresh."}
        </p>
      </div>

      <section>
        <div className="admin-label mb-3">Currently featured ({featured.length})</div>
        {featured.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">Nothing featured yet. Search below to add items.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((i) => (
              <ItemCard key={i.sku} item={i} featured onToggle={toggle} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="admin-label mb-3">Add more</div>
        <input
          className="admin-input w-full max-w-md"
          placeholder="Search by title or SKU…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {q.trim() && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {results.length ? (
              results.map((i) => <ItemCard key={i.sku} item={i} featured={false} onToggle={toggle} />)
            ) : (
              <p className="text-sm text-[var(--muted-foreground)]">No matches.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function ItemCard({ item, featured, onToggle }: { item: Slim; featured: boolean; onToggle: (sku: string, val: boolean) => void }) {
  return (
    <div className="admin-card overflow-hidden p-0">
      <div className="relative aspect-[4/3] bg-[var(--muted)]">
        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="240px" unoptimized={item.image.startsWith("data:")} />
      </div>
      <div className="p-3">
        <div className="line-clamp-2 text-sm font-medium">{item.title}</div>
        <div className="font-mono mt-1 text-xs text-[var(--muted-foreground)]">{item.sku} · ${item.price}</div>
        <button
          type="button"
          onClick={() => onToggle(item.sku, !featured)}
          className={`admin-btn mt-3 w-full ${featured ? "admin-btn-outline" : "admin-btn-primary"}`}
        >
          {featured ? "★ Remove" : "☆ Feature"}
        </button>
      </div>
    </div>
  );
}

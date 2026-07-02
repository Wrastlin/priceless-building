"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { CatalogItem } from "@/lib/items/types";
import { updateItemDetailsAction, type EditableItemFields } from "@/lib/actions/staging";
import { formatCurrency } from "@/lib/utils";
import { PhotoLightbox } from "@/components/photo-lightbox";
import { StagingActions } from "./staging-actions";

interface DraftFields {
  title: string;
  subtitle: string;
  price: number;
  msrp: number | "";
  manufacturer: string;
  dimensions: string;
  location: string;
  inStock: number;
}

function fromItem(d: CatalogItem): DraftFields {
  return {
    title: d.title ?? "",
    subtitle: d.subtitle ?? "",
    price: d.price ?? 0,
    msrp: d.msrp ?? "",
    manufacturer: d.manufacturer ?? "",
    dimensions: d.dimensions ?? "",
    location: d.location ?? "",
    inStock: d.inStock ?? 1,
  };
}

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

/**
 * One draft in the staging queue, laid out as a wide row (not a tall card
 * in a cramped grid). Read view: thumbnail on the left, scannable details
 * in the middle, approve / reject / edit on the right. Tapping Edit swaps
 * the row into a two-column photo + fields editor; Save persists via
 * `updateItemDetailsAction` and snaps back to the read view. Lets a manager
 * fix a typo or price before approving without re-creating the draft.
 */
export function StagingCard({ draft }: { draft: CatalogItem }) {
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState<DraftFields>(() => fromItem(draft));
  const [saved, setSaved] = useState<CatalogItem>(draft);
  const [saving, startSaving] = useTransition();
  const [zoom, setZoom] = useState<number | null>(null);
  const galleryCount = saved.gallery?.length ?? 0;
  const photos = [saved.image, ...(saved.gallery ?? [])]
    .filter(Boolean)
    .map((src) => ({ src: src as string, alt: saved.title }));

  function set<K extends keyof DraftFields>(key: K, value: DraftFields[K]) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  function cancelEdit() {
    setFields(fromItem(saved));
    setEditing(false);
  }

  function save() {
    const payload: EditableItemFields = {
      title: fields.title.trim(),
      subtitle: fields.subtitle.trim(),
      price: Number(fields.price) || 0,
      msrp: fields.msrp === "" ? null : Number(fields.msrp),
      dimensions: fields.dimensions.trim() || null,
      manufacturer: fields.manufacturer.trim() || null,
      location: fields.location.trim() || null,
      inStock: Number(fields.inStock) || 0,
    };
    startSaving(async () => {
      try {
        await updateItemDetailsAction(saved.sku, payload);
        // Reflect changes locally; the server revalidates the list page
        // but we don't need to wait for that to leave edit mode.
        setSaved((s) => ({
          ...s,
          ...payload,
          msrp: payload.msrp === null ? undefined : (payload.msrp ?? s.msrp),
          dimensions: payload.dimensions === null ? undefined : (payload.dimensions ?? s.dimensions),
          manufacturer: payload.manufacturer === null ? undefined : (payload.manufacturer ?? s.manufacturer),
          location: payload.location === null ? undefined : (payload.location ?? s.location),
        }));
        setEditing(false);
        toast.success("Draft updated");
      } catch (err) {
        toast.error(`Save failed: ${err instanceof Error ? err.message : "unknown"}`);
      }
    });
  }

  const thumb = (
    <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded bg-[#f4f4f3] sm:w-60">
      {saved.image ? (
        <button
          type="button"
          onClick={() => setZoom(0)}
          aria-label={`Enlarge photo of ${saved.title}`}
          className="group/zoom block h-full w-full cursor-zoom-in"
        >
          <Image
            src={saved.image}
            alt={saved.title}
            fill
            sizes="(min-width: 640px) 240px, 100vw"
            className="object-cover"
            unoptimized={saved.image.startsWith("data:")}
          />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition group-hover/zoom:bg-black/30 group-hover/zoom:opacity-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
            </svg>
          </span>
        </button>
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
          No photo
        </div>
      )}
      {galleryCount > 0 ? (
        <span className="font-mono pointer-events-none absolute bottom-1.5 right-1.5 bg-black/70 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white">
          +{galleryCount} more
        </span>
      ) : null}
    </div>
  );

  return (
    <li className="admin-card p-4">
      <PhotoLightbox photos={photos} index={zoom} onClose={() => setZoom(null)} />
      {editing ? (
        <div className="grid gap-4 sm:grid-cols-[15rem_1fr]">
          {thumb}
          <div className="space-y-3">
            <EditableRow label="Title">
              <input
                value={fields.title}
                onChange={(e) => set("title", e.target.value)}
                className="admin-input text-sm"
              />
            </EditableRow>
            <EditableRow label="Subtitle">
              <input
                value={fields.subtitle}
                onChange={(e) => set("subtitle", e.target.value)}
                className="admin-input text-sm"
              />
            </EditableRow>
            <div className="grid grid-cols-2 gap-3">
              <EditableRow label="Tag price">
                <input
                  type="number"
                  value={fields.price}
                  onChange={(e) => set("price", Number(e.target.value) || 0)}
                  className="admin-input font-mono text-sm tabular-nums"
                />
              </EditableRow>
              <EditableRow label="Retail (MSRP)">
                <input
                  type="number"
                  value={fields.msrp === "" ? "" : fields.msrp}
                  onChange={(e) => set("msrp", e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="—"
                  className="admin-input font-mono text-sm tabular-nums"
                />
              </EditableRow>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <EditableRow label="Manufacturer">
                <input
                  value={fields.manufacturer}
                  onChange={(e) => set("manufacturer", e.target.value)}
                  className="admin-input text-sm"
                />
              </EditableRow>
              <EditableRow label="Dimensions">
                <input
                  value={fields.dimensions}
                  onChange={(e) => set("dimensions", e.target.value)}
                  className="admin-input text-sm"
                />
              </EditableRow>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <EditableRow label="Aisle / bin">
                <input
                  value={fields.location}
                  onChange={(e) => set("location", e.target.value)}
                  className="admin-input text-sm"
                />
              </EditableRow>
              <EditableRow label="In stock">
                <input
                  type="number"
                  value={fields.inStock}
                  onChange={(e) => set("inStock", Number(e.target.value) || 0)}
                  className="admin-input font-mono text-sm tabular-nums"
                />
              </EditableRow>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="admin-btn admin-btn-primary"
              >
                {saving ? "Saving…" : "Save draft"}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="admin-btn admin-btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {thumb}

          {/* Details */}
          <div className="min-w-0 flex-1">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              {saved.category}
              {saved.manufacturer ? ` · ${saved.manufacturer}` : ""}
            </div>
            <div className="mt-1 text-base font-semibold text-foreground">{saved.title}</div>
            {saved.subtitle ? (
              <div className="mt-0.5 text-sm text-muted-foreground">{saved.subtitle}</div>
            ) : null}

            <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1.5 text-sm">
              <span>
                <span className="text-muted-foreground">Tag </span>
                <span className="font-mono font-semibold tabular-nums text-foreground">
                  {formatCurrency(saved.price || 0)}
                </span>
              </span>
              <span>
                <span className="text-muted-foreground">Retail comp </span>
                <span className="font-mono tabular-nums text-foreground">
                  {saved.comparable ? formatCurrency(saved.comparable.price) : "–"}
                </span>
                {saved.comparable ? (
                  <span className="ml-1 text-[10px] text-muted-foreground">{saved.comparable.retailer}</span>
                ) : null}
              </span>
              <span>
                <span className="text-muted-foreground">Location </span>
                <span className="text-foreground">{saved.location ?? "–"}</span>
              </span>
              <span className="font-mono text-xs text-muted-foreground">SKU {saved.sku}</span>
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              By {saved.createdBy ?? "unknown"} · {timeSince(saved.createdAt)}
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 flex-col gap-2 sm:w-48">
            <StagingActions sku={saved.sku} title={saved.title} />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="admin-btn admin-btn-outline flex-1 text-xs"
              >
                Edit before approving
              </button>
              <Link
                href={`/admin/tags?sku=${saved.sku}`}
                target="_blank"
                className="admin-btn admin-btn-outline text-xs"
              >
                Tag
              </Link>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

function EditableRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono mb-1 block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

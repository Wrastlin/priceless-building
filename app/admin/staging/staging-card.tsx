"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { CatalogItem } from "@/lib/items/types";
import { updateItemDetailsAction, type EditableItemFields } from "@/lib/actions/staging";
import { formatCurrency } from "@/lib/utils";
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
 * Single draft card in the staging queue. Renders a read-only view
 * with Approve / Reject / Edit buttons. Tapping Edit swaps the body
 * into editable inputs; Save persists via `updateItemDetailsAction`
 * and snaps back to the read-only view. Lets a manager fix typos or
 * tweak a price before approving without re-creating the draft.
 */
export function StagingCard({ draft }: { draft: CatalogItem }) {
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState<DraftFields>(() => fromItem(draft));
  const [saved, setSaved] = useState<CatalogItem>(draft);
  const [saving, startSaving] = useTransition();
  const galleryCount = saved.gallery?.length ?? 0;

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

  return (
    <li className="admin-card overflow-hidden">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f4f4f3]">
        {saved.image ? (
          <Image
            src={saved.image}
            alt={saved.title}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            unoptimized={saved.image.startsWith("data:")}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No photo
          </div>
        )}
        {galleryCount > 0 ? (
          <span className="font-mono absolute bottom-2 right-2 bg-black/70 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-white">
            +{galleryCount} more
          </span>
        ) : null}
      </div>

      <div className="space-y-3 p-4">
        {editing ? (
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
            <div className="grid grid-cols-2 gap-2">
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
            <div className="grid grid-cols-2 gap-2">
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
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="admin-btn admin-btn-primary flex-1"
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
        ) : (
          <>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                {saved.category}
                {saved.manufacturer ? ` · ${saved.manufacturer}` : ""}
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground">{saved.title}</div>
              {saved.subtitle ? (
                <div className="mt-0.5 text-xs text-muted-foreground">{saved.subtitle}</div>
              ) : null}
            </div>

            <dl className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-muted-foreground">Tag price</dt>
                <dd className="font-mono text-sm font-semibold tabular-nums text-foreground">
                  {formatCurrency(saved.price || 0)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Retail comp</dt>
                <dd className="font-mono text-sm tabular-nums text-foreground">
                  {saved.comparable ? formatCurrency(saved.comparable.price) : "–"}
                  {saved.comparable ? (
                    <span className="ml-1 text-[10px] text-muted-foreground">
                      {saved.comparable.retailer}
                    </span>
                  ) : null}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Location</dt>
                <dd className="text-foreground">{saved.location ?? "–"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">SKU</dt>
                <dd className="font-mono text-xs text-foreground">{saved.sku}</dd>
              </div>
            </dl>

            <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
              <span>By {saved.createdBy ?? "unknown"}</span>
              <span>{timeSince(saved.createdAt)}</span>
            </div>

            <div className="flex gap-2">
              <StagingActions sku={saved.sku} title={saved.title} />
            </div>
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
                Preview tag
              </Link>
            </div>
          </>
        )}
      </div>
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

"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateItemDetailsAction, type EditableItemFields } from "@/lib/actions/staging";
import type { CatalogItem } from "@/lib/items/types";

/**
 * Manual entry for items that came in through the rapid capture pass with
 * only a photo or a sticker number — type in the details when you have them
 * (or when the physical tag was missing/unpriced).
 */
export function DetailsEditor({ item }: { item: CatalogItem }) {
  const [title, setTitle] = useState(item.title);
  const [subtitle, setSubtitle] = useState(item.subtitle ?? "");
  const [price, setPrice] = useState(item.price > 0 ? String(item.price) : "");
  const [dimensions, setDimensions] = useState(item.dimensions ?? "");
  const [manufacturer, setManufacturer] = useState(item.manufacturer ?? "");
  const [location, setLocation] = useState(item.location ?? "");
  const [inStock, setInStock] = useState(String(item.inStock));
  const [saving, startSaving] = useTransition();

  function save() {
    const fields: EditableItemFields = {
      title: title.trim() || item.title,
      subtitle: subtitle.trim(),
      price: price.trim() ? Number(price) : 0,
      dimensions: dimensions.trim() || null,
      manufacturer: manufacturer.trim() || null,
      location: location.trim() || null,
      inStock: Math.max(0, Math.floor(Number(inStock) || 0)),
    };
    startSaving(async () => {
      try {
        await updateItemDetailsAction(item.sku, fields);
        toast.success("Details saved");
      } catch (err) {
        toast.error(`Save failed: ${err instanceof Error ? err.message : "unknown"}`);
      }
    });
  }

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="admin-label">Title</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="admin-input w-full" />
      </label>
      <label className="block">
        <span className="admin-label">Subtitle / spec</span>
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="admin-input w-full" />
      </label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="block">
          <span className="admin-label">Price ($)</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="admin-input w-full font-mono tabular-nums"
          />
        </label>
        <label className="block">
          <span className="admin-label">Dimensions</span>
          <input value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder={'24" or 32×80'} className="admin-input w-full" />
        </label>
        <label className="block">
          <span className="admin-label">Manufacturer</span>
          <input value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} className="admin-input w-full" />
        </label>
        <label className="block">
          <span className="admin-label">Qty</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={inStock}
            onChange={(e) => setInStock(e.target.value)}
            className="admin-input w-full font-mono tabular-nums"
          />
        </label>
      </div>
      <label className="block">
        <span className="admin-label">Aisle / location</span>
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Aisle D · Bay 4" className="admin-input w-full" />
      </label>
      <button type="button" onClick={save} disabled={saving} className="admin-btn admin-btn-primary">
        {saving ? "Saving…" : "Save details"}
      </button>
    </div>
  );
}

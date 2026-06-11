"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { addPhotosToItemAction } from "@/lib/actions/staging";
import type { CatalogItem } from "@/lib/items/types";
import { SCENES, type SceneKey } from "@/lib/marketing/scene-prompts";

interface VariantResult {
  scene: string;
  image: string | null;
  reason?: string;
}

/**
 * Generate photo-realistic marketing variants for a published item.
 *
 * Pick one or more scenes (kitchen, bathroom, front-entry, etc.), tap
 * Generate, and the source photo (the real cover shot) is piped to
 * Nano Banana with a camera-spec prompt. Successful variants land in
 * a preview row; from there the user can "Add to gallery" to persist
 * them on the item so the marketing composer picks them up.
 */
export function GenerateVariants({ item }: { item: CatalogItem }) {
  const defaults: SceneKey[] = ["kitchen", "front-entry"];
  const [picked, setPicked] = useState<Set<SceneKey>>(new Set(defaults));
  const [results, setResults] = useState<VariantResult[]>([]);
  const [running, setRunning] = useState(false);
  const [saving, startSaving] = useTransition();

  function toggle(key: SceneKey) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function generate() {
    if (picked.size === 0) {
      toast.error("Pick at least one scene.");
      return;
    }
    setRunning(true);
    setResults([]);
    try {
      const res = await fetch("/api/marketing-variants", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sku: item.sku,
          image: item.image,
          scenes: Array.from(picked),
        }),
      });
      const data = (await res.json()) as { variants?: VariantResult[]; reason?: string };
      if (!data.variants || data.variants.length === 0) {
        toast.error(`Generation failed: ${data.reason ?? "no variants returned"}`);
        return;
      }
      setResults(data.variants);
      const ok = data.variants.filter((v) => v.image).length;
      const failed = data.variants.length - ok;
      toast.success(`${ok} variant${ok === 1 ? "" : "s"} ready${failed ? ` · ${failed} failed` : ""}`);
    } catch (err) {
      toast.error(`Request failed: ${err instanceof Error ? err.message : "unknown"}`);
    } finally {
      setRunning(false);
    }
  }

  function addToGallery(dataUrl: string, scene: string) {
    startSaving(async () => {
      try {
        await addPhotosToItemAction(item.sku, [dataUrl]);
        toast.success(`Saved ${scene} variant to gallery.`);
        // Remove from preview row so the user knows it landed.
        setResults((r) => r.filter((v) => v.image !== dataUrl));
      } catch (err) {
        toast.error(`Save failed: ${err instanceof Error ? err.message : "unknown"}`);
      }
    });
  }

  function addAll() {
    const urls = results.map((r) => r.image).filter((u): u is string => !!u);
    if (urls.length === 0) return;
    startSaving(async () => {
      try {
        await addPhotosToItemAction(item.sku, urls);
        toast.success(`Saved ${urls.length} variants to gallery.`);
        setResults([]);
      } catch (err) {
        toast.error(`Save failed: ${err instanceof Error ? err.message : "unknown"}`);
      }
    });
  }

  return (
    <section className="admin-card mt-6 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Generate marketing variants</h2>
          <p className="mt-0.5 admin-help">
            Photo-realistic renders of <strong>this exact item</strong> placed in real environments.
            Source: your real cover photo. The model is locked to preserve the product;
            it changes only the surroundings.
          </p>
        </div>
        <button
          type="button"
          onClick={generate}
          disabled={running || picked.size === 0}
          className="admin-btn admin-btn-primary"
        >
          {running ? `Generating ${picked.size}…` : `Generate ${picked.size} variant${picked.size === 1 ? "" : "s"}`}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {SCENES.map((s) => {
          const on = picked.has(s.key);
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => toggle(s.key)}
              className={
                "rounded-full border px-3 py-1 text-xs transition " +
                (on
                  ? "border-[var(--brand-priceless)] bg-[var(--brand-priceless)] text-white"
                  : "border-border bg-white text-foreground hover:border-[var(--brand-priceless)]")
              }
              title={s.sub}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {results.length > 0 ? (
        <div className="mt-5">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-semibold text-foreground">Preview</h3>
            <button
              type="button"
              onClick={addAll}
              disabled={saving || results.every((r) => !r.image)}
              className="admin-btn admin-btn-outline px-2.5 py-1 text-xs"
            >
              Add all to gallery
            </button>
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
            {results.map((v) => (
              <li key={v.scene} className="overflow-hidden border border-border bg-white">
                {v.image ? (
                  <>
                    <div className="relative aspect-[4/3] w-full bg-[#fafaf9]">
                      <Image
                        src={v.image}
                        alt={`${item.title} in ${v.scene}`}
                        fill
                        sizes="(min-width:768px) 33vw, 50vw"
                        className="object-cover"
                        unoptimized
                      />
                      <span className="font-mono absolute right-1 top-1 bg-amber-600/95 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.1em] text-white">
                        AI
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 p-2">
                      <span className="text-xs font-medium text-foreground">
                        {SCENES.find((s) => s.key === v.scene)?.label ?? v.scene}
                      </span>
                      <button
                        type="button"
                        onClick={() => addToGallery(v.image!, v.scene)}
                        disabled={saving}
                        className="admin-btn admin-btn-primary px-2.5 py-1 text-xs"
                      >
                        Add
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex aspect-[4/3] flex-col items-center justify-center gap-1 bg-[#fafaf9] p-3 text-center">
                    <span className="text-xs font-semibold text-foreground">
                      {SCENES.find((s) => s.key === v.scene)?.label ?? v.scene}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Failed: {v.reason ?? "no image"}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <p className="admin-help mt-3">
            Marketing variants are <strong>additions</strong>, not replacements. Your real cover photo always ships first
            in any listing.
          </p>
        </div>
      ) : null}
    </section>
  );
}

/**
 * One-shot: import priceless-intake data/items.json into Supabase via the
 * item store. Run from priceless-building with env loaded:
 *
 *   cd priceless-building && npx tsx --env-file=.env.local scripts/import-intake-items.ts
 *
 * Requires DEV_ADMIN_BYPASS or a session won't apply — this script uses the
 * service-role path via direct supabase insert when SERVICE_ROLE is set.
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

const ROOT = path.resolve(__dirname, "../..");
const INTAKE = path.join(ROOT, "priceless-intake");
const ITEMS_JSON = path.join(INTAKE, "data/items.json");
const UPLOADS = path.join(INTAKE, "data/uploads");

type IntakeItem = {
  id: string;
  sku: string;
  category: string;
  subcategory?: string;
  title: string;
  manufacturer?: string;
  dimensions?: string;
  color?: string;
  material?: string;
  condition?: string;
  price?: number;
  compareAt?: number;
  msrp?: number;
  listPrice?: number;
  compareAtSource?: "tag" | "market";
  quantity?: number;
  photos?: string[];
  description?: string;
  status?: string;
  createdAt?: string;
  comparables?: unknown[];
  tagExtract?: unknown;
  specs?: Record<string, string>;
};

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  }

  const raw = JSON.parse(await readFile(ITEMS_JSON, "utf8")) as {
    items?: IntakeItem[];
  };
  const items = raw.items ?? (raw as unknown as IntakeItem[]);
  if (!Array.isArray(items) || items.length === 0) {
    console.log("No items found");
    return;
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  await supabase.storage.createBucket("item-photos", { public: true }).catch(() => {});

  for (const it of items) {
    const photoUrls: string[] = [];
    for (let i = 0; i < (it.photos?.length ?? 0); i++) {
      const rel = it.photos![i]!;
      // Intake serves /api/photo/<file>
      const file = rel.replace(/^\/api\/photo\//, "").replace(/^\//, "");
      const abs = path.join(UPLOADS, file);
      try {
        const bytes = await readFile(abs);
        const ext = path.extname(file).slice(1) || "jpg";
        const dest = `${it.sku.toLowerCase()}/${i + 1}.${ext}`;
        const { error } = await supabase.storage
          .from("item-photos")
          .upload(dest, bytes, { contentType: `image/${ext === "jpg" ? "jpeg" : ext}`, upsert: true });
        if (error) {
          console.warn(it.sku, "photo", file, error.message);
          continue;
        }
        const { data } = supabase.storage.from("item-photos").getPublicUrl(dest);
        photoUrls.push(data.publicUrl);
      } catch (e) {
        console.warn(it.sku, "missing photo", file, e);
      }
    }

    const catalog = {
      id: it.id || randomUUID(),
      sku: it.sku,
      brand: "priceless" as const,
      category: it.category,
      subcategory: it.subcategory,
      status: "draft" as const,
      title: it.title,
      subtitle: [it.manufacturer, it.dimensions].filter(Boolean).join(" · "),
      price: it.price ?? 0,
      compareAt: it.compareAt,
      compareAtSource: it.compareAtSource,
      listPrice: it.listPrice,
      msrp: it.compareAt ?? it.msrp,
      image: photoUrls[0] ?? "",
      gallery: photoUrls.slice(1),
      photos: photoUrls,
      inStock: it.quantity ?? 1,
      manufacturer: it.manufacturer,
      dimensions: it.dimensions,
      color: it.color,
      material: it.material,
      condition: it.condition,
      description: it.description,
      specs: it.specs,
      comparables: it.comparables,
      tagExtract: it.tagExtract,
      inventoriedAt: it.createdAt ?? new Date().toISOString(),
      createdAt: it.createdAt ?? new Date().toISOString(),
      fulfillment: { pickup: true, localDelivery: true, ships: false },
    };

    const { error } = await supabase.from("items").upsert(
      {
        sku: catalog.sku,
        status: catalog.status,
        brand: catalog.brand,
        category: catalog.category,
        data: catalog,
      },
      { onConflict: "sku" },
    );
    if (error) console.error("FAIL", it.sku, error.message);
    else console.log("OK", it.sku, photoUrls.length, "photos");
  }

  // list uploads dir for sanity
  try {
    const files = await readdir(UPLOADS);
    console.log("uploads available:", files.length);
  } catch {
    console.log("no uploads dir");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

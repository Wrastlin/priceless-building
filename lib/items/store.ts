/**
 * Item store — universal read layer.
 *
 * On the SERVER:
 *  - Reads `data/items.json` synchronously via fs.readFileSync at
 *    first call, then caches in memory.
 *  - If the file doesn't exist, seeds it from SEED_ITEMS.
 *  - Validates the JSON shape on load; throws on corruption.
 *
 * On the CLIENT (browser bundles):
 *  - fs / path / next-cache modules are dynamically required behind a
 *    `typeof window === "undefined"` guard so the client bundle never
 *    pulls them in. The client falls back to the in-memory SEED_ITEMS.
 *    That's safe for the only client consumer (track/page lookups by
 *    SKU on seed items).
 *
 * Writes always run on the server through helpers in this file. They
 * use node:fs/promises and call `revalidatePath` to refresh the
 * storefront + staging pages.
 *
 * TODO (prod): swap the disk backend for Supabase. Sync helpers keep
 * working if the cache is hydrated at server start.
 */
import type { CatalogItem, Brand, Category, ItemStatus } from "@/lib/items/types";
import { SEED_ITEMS } from "@/lib/items/seed";

export type { CatalogItem, Brand, Category, ItemStatus } from "@/lib/items/types";

const IS_SERVER = typeof window === "undefined";

let CACHE: CatalogItem[] | null = null;

function validateItem(it: unknown, idx: number): asserts it is CatalogItem {
  if (!it || typeof it !== "object") {
    throw new Error(`items.json[${idx}]: not an object`);
  }
  const o = it as Record<string, unknown>;
  for (const key of ["id", "sku", "brand", "category", "status", "title", "subtitle", "image"]) {
    if (typeof o[key] !== "string") {
      throw new Error(`items.json[${idx}]: missing or non-string "${key}"`);
    }
  }
  if (typeof o.price !== "number") throw new Error(`items.json[${idx}]: "price" not number`);
  if (typeof o.inStock !== "number") throw new Error(`items.json[${idx}]: "inStock" not number`);
  const validStatus = ["draft", "staged", "published", "archived"];
  if (!validStatus.includes(o.status as string)) {
    throw new Error(`items.json[${idx}]: bad status "${String(o.status)}"`);
  }
}

function dataPaths() {
  // Avoid hoisting these requires to module top-level so Turbopack
  // doesn't pull node:path/node:fs into client bundles.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("node:path") as typeof import("node:path");
  const dir = path.join(process.cwd(), "data");
  const file = path.join(dir, "items.json");
  return { dir, file };
}

function loadFromDisk(): CatalogItem[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("node:fs") as typeof import("node:fs");
  const { dir, file } = dataPaths();
  if (!fs.existsSync(file)) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const tmp = file + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(SEED_ITEMS, null, 2), "utf8");
    fs.renameSync(tmp, file);
    return [...SEED_ITEMS];
  }
  const raw = fs.readFileSync(file, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error("items.json: top-level must be an array");
  }
  parsed.forEach(validateItem);
  return parsed as CatalogItem[];
}

/** Reads JSON once per process and caches in memory. */
export function loadAll(): CatalogItem[] {
  if (CACHE === null) {
    CACHE = IS_SERVER ? loadFromDisk() : [...SEED_ITEMS];
  }
  return CACHE;
}

async function persist(next: CatalogItem[]): Promise<void> {
  if (!IS_SERVER) throw new Error("Writes are server-only");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("node:fs") as typeof import("node:fs");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fsp = require("node:fs/promises") as typeof import("node:fs/promises");
  const { dir, file } = dataPaths();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tmp = file + ".tmp";
  await fsp.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
  await fsp.rename(tmp, file);
  CACHE = next;
}

function bustPaths() {
  if (!IS_SERVER) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { revalidatePath } = require("next/cache") as typeof import("next/cache");
    revalidatePath("/");
    revalidatePath("/shop", "layout");
    revalidatePath("/admin/staging");
    revalidatePath("/admin/inventory");
  } catch {
    // outside a request context (e.g. ad-hoc node script). Disk +
    // cache are the source of truth; next render rebuilds.
  }
}

// ----- SYNC READS -----

export function listPublished(): CatalogItem[] {
  return loadAll().filter((it) => it.status === "published");
}

export function listDrafts(): CatalogItem[] {
  return loadAll().filter((it) => it.status === "draft");
}

export function listStaged(): CatalogItem[] {
  return loadAll().filter((it) => it.status === "staged");
}

export function findBySku(sku: string): CatalogItem | undefined {
  return loadAll().find((it) => it.sku === sku);
}

export function byBrand(brand: Brand): CatalogItem[] {
  return listPublished().filter((it) => it.brand === brand);
}

export function byCategory(brand: Brand, category: Category): CatalogItem[] {
  return listPublished().filter((it) => it.brand === brand && it.category === category);
}

// ----- ASYNC WRITES (server only) -----

export type CreateDraftInput = Omit<CatalogItem, "status" | "createdAt"> & {
  status?: ItemStatus;
};

export async function createDraft(input: CreateDraftInput): Promise<CatalogItem> {
  const all = loadAll();
  if (all.some((it) => it.sku === input.sku)) {
    throw new Error(`createDraft: SKU "${input.sku}" already exists`);
  }
  const item: CatalogItem = {
    ...input,
    status: input.status ?? "draft",
    createdAt: new Date().toISOString(),
  };
  await persist([...all, item]);
  bustPaths();
  return item;
}

export async function setStatus(sku: string, status: ItemStatus): Promise<CatalogItem> {
  const all = loadAll();
  const idx = all.findIndex((it) => it.sku === sku);
  if (idx === -1) throw new Error(`setStatus: no item with sku "${sku}"`);
  const next = [...all];
  next[idx] = { ...next[idx], status };
  await persist(next);
  bustPaths();
  return next[idx];
}

export async function updateItem(sku: string, partial: Partial<CatalogItem>): Promise<CatalogItem> {
  const all = loadAll();
  const idx = all.findIndex((it) => it.sku === sku);
  if (idx === -1) throw new Error(`updateItem: no item with sku "${sku}"`);
  const next = [...all];
  next[idx] = { ...next[idx], ...partial, sku: next[idx].sku };
  await persist(next);
  bustPaths();
  return next[idx];
}

export async function deleteItem(sku: string): Promise<void> {
  const all = loadAll();
  const next = all.filter((it) => it.sku !== sku);
  if (next.length === all.length) {
    throw new Error(`deleteItem: no item with sku "${sku}"`);
  }
  await persist(next);
  bustPaths();
}

// internal — for tooling/tests
export { SEED_ITEMS };

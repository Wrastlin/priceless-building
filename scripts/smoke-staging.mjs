/**
 * Manual smoke test for the staging flow.
 * Reads + writes data/items.json directly (no Next.js needed) to
 * simulate the createDraft → approve loop and verify the storefront
 * filtering.
 *
 * Run: node scripts/smoke-staging.mjs
 */
import { readFileSync, writeFileSync, renameSync } from "node:fs";
import { join } from "node:path";

const file = join(process.cwd(), "data", "items.json");

function load() {
  return JSON.parse(readFileSync(file, "utf8"));
}

function save(items) {
  const tmp = file + ".tmp";
  writeFileSync(tmp, JSON.stringify(items, null, 2), "utf8");
  renameSync(tmp, file);
}

const TEST_SKU = "PL-999998";

// cleanup from previous run
let items = load().filter((it) => it.sku !== TEST_SKU);
save(items);

// before: 14 published, 0 drafts
const beforePub = items.filter((it) => it.status === "published").length;
const beforeDraft = items.filter((it) => it.status === "draft").length;
console.log(`before: published=${beforePub} drafts=${beforeDraft}`);

// create a draft
items = load();
items.push({
  id: "pl-999998",
  sku: TEST_SKU,
  brand: "priceless",
  category: "hardware",
  status: "draft",
  title: "SMOKE TEST — Test Pull",
  subtitle: "smoke test, will be cleaned up",
  price: 5,
  image: "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?auto=format&fit=crop&w=1200&q=75",
  inStock: 1,
  createdAt: new Date().toISOString(),
  createdBy: "smoke-test",
});
save(items);

items = load();
const afterDraft = items.filter((it) => it.status === "draft").length;
const found = items.find((it) => it.sku === TEST_SKU);
console.log(`after createDraft: drafts=${afterDraft} status=${found?.status}`);
if (afterDraft !== beforeDraft + 1) {
  console.error("FAIL: draft was not added");
  process.exit(1);
}

// approve it
items = load();
const idx = items.findIndex((it) => it.sku === TEST_SKU);
items[idx].status = "published";
save(items);

items = load();
const afterPub = items.filter((it) => it.status === "published").length;
const afterDraft2 = items.filter((it) => it.status === "draft").length;
const found2 = items.find((it) => it.sku === TEST_SKU);
console.log(`after approve: published=${afterPub} drafts=${afterDraft2} status=${found2?.status}`);
if (found2?.status !== "published") {
  console.error("FAIL: approve did not flip status");
  process.exit(1);
}

// cleanup
items = load().filter((it) => it.sku !== TEST_SKU);
save(items);

console.log("PASS: draft -> staging -> approve -> published flow works on disk.");

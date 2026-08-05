#!/usr/bin/env node
/** Create the clean+vanity items as drafts via the real intake route. Sequential (SKU minting scans rows). */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const S = "/private/tmp/claude-501/-Users-aaron-Priceless-Building-Center/ac2d5cc2-65ce-4da3-9a69-ca7c6234dd08/scratchpad";
const FULL = path.join(S, "jul23-full");
const API = "http://localhost:3002/api/admin/intake/items";
const MASTER = process.argv[2] || "master-clean.json";
const OUTFILE = process.argv[3] || "created.json";
const items = JSON.parse(readFileSync(path.join(S, MASTER), "utf8"));

const dataUrl = (n) => "data:image/jpeg;base64," + readFileSync(path.join(FULL, `IMG_${n}.jpg`)).toString("base64");

const results = [];
for (let i = 0; i < items.length; i++) {
  const it = items[i];
  const photos = it.photos.slice(0, 6).map(dataUrl);
  const body = {
    title: it.title,
    category: it.category,
    price: it.price ?? 0,
    dimensions: it.dimensions || undefined,
    note: it.note || undefined,
    quantity: 1,
    photos,
    print: false,
  };
  try {
    const res = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.sku) throw new Error(json.error || `HTTP ${res.status}`);
    results.push({ i: i + 1, sku: json.sku, title: it.title });
    console.log(`${String(i + 1).padStart(2)}  ${json.sku}  ${it.title.slice(0, 50)}`);
  } catch (e) {
    results.push({ i: i + 1, error: String(e.message), title: it.title });
    console.log(`${String(i + 1).padStart(2)}  FAIL  ${it.title.slice(0, 40)} :: ${e.message}`);
  }
}
const ok = results.filter((r) => r.sku);
console.log(`\ncreated ${ok.length}/${items.length}`);
writeFileSync(path.join(S, OUTFILE), JSON.stringify(results, null, 2));

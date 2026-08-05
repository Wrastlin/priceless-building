#!/usr/bin/env node
/**
 * Classify + (optionally) purge sandbox/mock items from the prod items table.
 * MODE: "plan" (default) = fetch, classify, back up, report — NO deletes.
 *       "delete"        = after review, delete the mock set in batches.
 *
 * Real  = jsonb data.createdAt present AND data.createdBy !== "sandbox".
 * Mock  = data.createdBy === "sandbox"  OR  no data.createdAt.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const MODE = process.argv[2] || "plan";
const S = "/private/tmp/claude-501/-Users-aaron-Priceless-Building-Center/ac2d5cc2-65ce-4da3-9a69-ca7c6234dd08/scratchpad";
const ENV = "/Users/aaron/Priceless Building Center/priceless-building/.env.local";
const env = Object.fromEntries(readFileSync(ENV, "utf8").split("\n").map((l) => {
  const m = /^([A-Z0-9_]+)=(.*)$/.exec(l.trim()); return m ? [m[1], m[2].replace(/^"|"$/g, "")] : ["", ""];
}));
const url = env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/+$/, "");
const key = env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

async function fetchAll() {
  const PAGE = 1000, all = [];
  for (let from = 0; ; from += PAGE) {
    const r = await fetch(`${url}/rest/v1/items?select=sku,created_at,data&order=sku.asc`, {
      headers: { ...H, Range: `${from}-${from + PAGE - 1}` },
    });
    if (!r.ok) throw new Error(`fetch ${r.status}: ${await r.text()}`);
    const rows = await r.json();
    all.push(...rows);
    if (rows.length < PAGE) break;
  }
  return all;
}

const isReal = (d) => !!(d && d.createdAt) && d.createdBy !== "sandbox";

const rows = await fetchAll();
const keep = rows.filter((r) => isReal(r.data));
const drop = rows.filter((r) => !isReal(r.data));

// Backup EVERYTHING before any change.
writeFileSync(path.join(S, "items-backup-full.json"), JSON.stringify(rows, null, 2));

// Safety guardrails.
const dropCreators = {};
for (const r of drop) { const c = r.data?.createdBy ?? "(none)"; dropCreators[c] = (dropCreators[c] ?? 0) + 1; }
const keepCreators = {};
for (const r of keep) { const c = r.data?.createdBy ?? "(none)"; keepCreators[c] = (keepCreators[c] ?? 0) + 1; }

console.log(`total rows:   ${rows.length}`);
console.log(`KEEP (real):  ${keep.length}   creators: ${JSON.stringify(keepCreators)}`);
console.log(`DROP (mock):  ${drop.length}   creators: ${JSON.stringify(dropCreators)}`);
console.log(`backup written: items-backup-full.json (${rows.length} rows)`);

// Abort conditions — never delete if the real set looks wrong.
const dropHasDev = drop.some((r) => r.data?.createdBy === "dev@local");
if (keep.length < 60) { console.error("ABORT: keep set < 60, unexpected."); process.exit(2); }
if (dropHasDev) { console.error("ABORT: a dev@local item is in the drop set."); process.exit(2); }
writeFileSync(path.join(S, "keep-skus.json"), JSON.stringify(keep.map((r) => r.sku), null, 2));
writeFileSync(path.join(S, "drop-skus.json"), JSON.stringify(drop.map((r) => r.sku), null, 2));
console.log("\nKEEP sample (first 75):");
console.log(keep.slice(0, 75).map((r) => r.sku).join(", "));

if (MODE !== "delete") {
  console.log("\n[plan mode] no rows deleted. Re-run with 'delete' to purge the DROP set.");
  process.exit(0);
}

// DELETE the mock set by SKU in batches.
const skus = drop.map((r) => r.sku);
let deleted = 0;
for (let i = 0; i < skus.length; i += 100) {
  const batch = skus.slice(i, i + 100);
  const inList = batch.map((s) => `"${s.replace(/"/g, '""')}"`).join(",");
  const r = await fetch(`${url}/rest/v1/items?sku=in.(${encodeURIComponent(inList)})`, { method: "DELETE", headers: H });
  if (!r.ok) { console.error(`batch ${i} DELETE ${r.status}: ${(await r.text()).slice(0, 200)}`); process.exit(1); }
  deleted += batch.length;
  if (i % 500 === 0) console.log(`  deleted ${deleted}/${skus.length}`);
}
console.log(`\ndeleted ${deleted} mock rows.`);
const after = await fetchAll();
console.log(`remaining rows: ${after.length}  (expected ${keep.length})`);

#!/usr/bin/env node
/**
 * Fetch Home Depot / Lowe's / Menards–style in-home lifestyle reference
 * photos via SerpAPI Google Images.
 *
 * Usage (from priceless-building):
 *   node --env-file=.env.local scripts/fetch-lifestyle-refs.mjs
 *   node --env-file=.env.local scripts/fetch-lifestyle-refs.mjs --category doors --limit 8
 *   node --env-file=.env.local scripts/fetch-lifestyle-refs.mjs --dry-run
 *
 * Writes:
 *   public/staging/references/<category>/<slug>-NN.jpg
 *   public/staging/references/manifest.json
 *
 * These are REFERENCE plates for Gemini home-staging (sell sheets +
 * marketing variants) — not for republishing as our own photos.
 */

import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_ROOT = path.join(ROOT, "public", "staging", "references");

/** Box-store + lifestyle queries per inventory category. */
const QUERY_BANK = {
  doors: [
    "interior door installed in home hallway site:homedepot.com",
    "front entry door curb appeal house exterior site:homedepot.com",
    "6 lite exterior door installed on house site:lowes.com",
    "prehung interior door in living room home staging",
    "craftman front door on suburban home exterior",
  ],
  windows: [
    "vinyl window installed in house exterior site:homedepot.com",
    "double hung window interior view living room site:lowes.com",
    "bay window in living room home interior",
  ],
  vanities: [
    "bathroom vanity installed with mirror site:homedepot.com",
    "single sink vanity in bathroom interior site:lowes.com",
    "bathroom vanity real home remodel before after",
  ],
  cabinets: [
    "kitchen cabinets installed white shaker site:homedepot.com",
    "kitchen cabinet run in real home interior site:lowes.com",
    "base cabinets installed kitchen remodel",
  ],
  lighting: [
    "pendant light installed over kitchen island site:homedepot.com",
    "vanity light fixture bathroom interior site:lowes.com",
  ],
  trim: [
    "baseboard trim installed living room site:homedepot.com",
    "door casing trim interior home",
  ],
  countertops: [
    "quartz countertop installed kitchen site:homedepot.com",
    "granite countertop kitchen island home",
  ],
  hardware: [
    "cabinet hardware knobs on kitchen cabinets site:homedepot.com",
    "door lever lockset installed interior door",
  ],
};

function parseArgs(argv) {
  const out = { category: null, limit: 6, dryRun: false, retailers: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") out.dryRun = true;
    else if (a === "--category") out.category = argv[++i];
    else if (a === "--limit") out.limit = Math.max(1, Number(argv[++i]) || 6);
    else if (a === "--no-retailer-filter") out.retailers = false;
  }
  return out;
}

function slug(s) {
  return s
    .toLowerCase()
    .replace(/site:\S+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

async function serpImages(apiKey, q) {
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_images");
  url.searchParams.set("q", q);
  url.searchParams.set("hl", "en");
  url.searchParams.set("gl", "us");
  url.searchParams.set("tbs", "itp:photo,isz:l");
  url.searchParams.set("api_key", apiKey);
  const res = await fetch(url, { signal: AbortSignal.timeout(45_000) });
  if (!res.ok) throw new Error(`SerpAPI ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  return Array.isArray(json.images_results) ? json.images_results : [];
}

async function download(url, dest) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(30_000),
    headers: { "User-Agent": "PricelessBuildingCenterRefBot/1.0 (lifestyle staging refs)" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`download ${res.status}`);
  const ctype = res.headers.get("content-type") || "";
  if (!ctype.startsWith("image/")) throw new Error(`not image: ${ctype}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

function loadManifest() {
  const p = path.join(OUT_ROOT, "manifest.json");
  if (!existsSync(p)) return { fetchedAt: null, items: [] };
  return JSON.parse(readFileSync(p, "utf8"));
}

function saveManifest(m) {
  mkdirSync(OUT_ROOT, { recursive: true });
  writeFileSync(path.join(OUT_ROOT, "manifest.json"), JSON.stringify(m, null, 2));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const apiKey = process.env.SERPAPI_KEY?.trim();
  if (!apiKey) {
    console.error("SERPAPI_KEY missing — set in .env.local");
    process.exit(1);
  }

  const categories = args.category
    ? [args.category]
    : Object.keys(QUERY_BANK);

  for (const cat of categories) {
    if (!QUERY_BANK[cat]) {
      console.error(`Unknown category "${cat}". Known: ${Object.keys(QUERY_BANK).join(", ")}`);
      process.exit(1);
    }
  }

  const manifest = loadManifest();
  const seenUrls = new Set(manifest.items.map((i) => i.sourceUrl));

  for (const category of categories) {
    const dir = path.join(OUT_ROOT, category);
    mkdirSync(dir, { recursive: true });
    let saved = 0;

    for (const q of QUERY_BANK[category]) {
      if (saved >= args.limit) break;
      console.log(`\n[${category}] ${q}`);
      if (args.dryRun) continue;

      let results;
      try {
        results = await serpImages(apiKey, q);
      } catch (e) {
        console.warn("  serp fail:", e.message);
        continue;
      }

      for (const hit of results) {
        if (saved >= args.limit) break;
        const original = hit.original || hit.link;
        if (!original || seenUrls.has(original)) continue;
        // Prefer large originals; skip tiny thumbs
        if ((hit.original_width || 0) > 0 && hit.original_width < 600) continue;

        const base = `${slug(q)}-${String(saved + 1).padStart(2, "0")}`;
        const ext = /\.png(\?|$)/i.test(original) ? "png" : "jpg";
        const file = `${base}.${ext}`;
        const dest = path.join(dir, file);

        try {
          await download(original, dest);
        } catch (e) {
          console.warn(`  skip ${original.slice(0, 80)}… (${e.message})`);
          continue;
        }

        const entry = {
          category,
          query: q,
          file: `staging/references/${category}/${file}`,
          sourceUrl: original,
          sourcePage: hit.link || hit.source || null,
          title: hit.title || null,
          width: hit.original_width || null,
          height: hit.original_height || null,
          fetchedAt: new Date().toISOString(),
        };
        manifest.items.push(entry);
        seenUrls.add(original);
        saved++;
        console.log(`  + ${file}`);
      }
    }
    console.log(`[${category}] saved ${saved} new refs`);
  }

  manifest.fetchedAt = new Date().toISOString();
  if (!args.dryRun) saveManifest(manifest);
  console.log(`\nManifest: ${path.join(OUT_ROOT, "manifest.json")} (${manifest.items.length} total)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Marketing seed queue — the bridge between floor intake (Supabase items,
 * captured by employees at stocking) and the local ad-kit pipeline
 * (product-ad skill: master → cutout → placements → feed post/micro/clip).
 *
 *   node scripts/marketing-seeds.mjs list [--status new|processed|skipped|all] [--json]
 *   node scripts/marketing-seeds.mjs pull <SKU>        # download photos → docs/motion/seeds/<slug>/
 *   node scripts/marketing-seeds.mjs done <SKU> --deliverables master,cutout,feed-post [--note "..."]
 *   node scripts/marketing-seeds.mjs skip <SKU> [--note "..."]
 *
 * Compounding-library law: the slug is minted ONCE (short title + sku) and
 * never renamed; seed folders are never overwritten (existing files are kept).
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SEEDS_DIR = path.join(ROOT, "docs", "motion", "seeds");

async function env() {
  const raw = await fs.readFile(path.join(ROOT, ".env.local"), "utf8");
  const out = {};
  for (const line of raw.split("\n")) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (m) out[m[1]] = m[2].replace(/^"|"$/g, "");
  }
  const url = out.NEXT_PUBLIC_SUPABASE_URL;
  const key = out.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }
  return { url: url.replace(/\/+$/, ""), key };
}

async function rest(method, pathname, { url, key }, body, range) {
  const res = await fetch(`${url}${pathname}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: method === "PATCH" ? "return=representation" : "count=none",
      ...(range ? { Range: range } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${pathname}: ${res.status} ${await res.text()}`);
  return res.json();
}

function slugFor(item) {
  const words = (item.title ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .split(/\s+/)
    .filter((w) => w && w !== "untitled")
    .slice(0, 4);
  const sku = item.sku.toLowerCase();
  const base = words.join("-");
  return base ? `${base}-${sku}` : sku;
}

function photoUrls(item) {
  const list = item.photos?.length ? item.photos : item.image ? [item.image] : [];
  return list.filter((u) => typeof u === "string" && /^https?:/.test(u));
}

async function fetchAll(cfg) {
  // PostgREST caps a single response at 1000 rows — page with Range headers.
  const PAGE = 1000;
  const all = [];
  for (let from = 0; ; from += PAGE) {
    const rows = await rest(
      "GET",
      "/rest/v1/items?select=data&order=sku.asc",
      cfg,
      undefined,
      `${from}-${from + PAGE - 1}`,
    );
    all.push(...rows.map((r) => r.data).filter(Boolean));
    if (rows.length < PAGE) break;
  }
  return all;
}

async function fetchOne(cfg, sku) {
  const rows = await rest(
    "GET",
    `/rest/v1/items?select=data&sku=eq.${encodeURIComponent(sku.toUpperCase())}`,
    cfg,
  );
  const item = rows[0]?.data;
  if (!item) throw new Error(`No item ${sku}`);
  return item;
}

async function saveMarketing(cfg, item, marketing) {
  const data = { ...item, marketing };
  await rest("PATCH", `/rest/v1/items?sku=eq.${encodeURIComponent(item.sku)}`, cfg, { data });
  return marketing;
}

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

function statusOf(item) {
  return item.marketing?.status ?? "new";
}

const [, , cmd, skuArg] = process.argv;
const cfg = await env();

if (cmd === "list" || cmd === undefined) {
  const want = arg("status") ?? "new";
  const items = (await fetchAll(cfg)).filter(
    (it) =>
      it.status !== "sold" &&
      it.status !== "archived" &&
      photoUrls(it).length > 0 &&
      // Real captures only — the sandbox demo catalog stamps createdBy
      // "sandbox" and the fake seed catalog has no createdAt.
      it.createdAt &&
      it.createdBy !== "sandbox",
  );
  const rows = items
    .filter((it) => want === "all" || statusOf(it) === want)
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
    .map((it) => ({
      sku: it.sku,
      status: statusOf(it),
      slug: it.marketing?.slug ?? slugFor(it),
      title: it.title,
      category: it.category,
      photos: photoUrls(it).length,
      dimensions: it.dimensions ?? "",
      capturedBy: it.createdBy ?? "",
      createdAt: (it.createdAt ?? "").slice(0, 10),
      deliverables: (it.marketing?.deliverables ?? []).join(","),
    }));
  if (process.argv.includes("--json")) console.log(JSON.stringify(rows, null, 2));
  else {
    console.log(`${rows.length} seed(s) · status=${want}`);
    for (const r of rows) {
      console.log(
        `${r.sku}  [${r.status}]  ${r.title}  · ${r.category} · ${r.photos} photo(s) · ${r.capturedBy} · ${r.createdAt}\n    slug: ${r.slug}${r.dimensions ? `  · ${r.dimensions}` : ""}${r.deliverables ? `  · shipped: ${r.deliverables}` : ""}`,
      );
    }
  }
} else if (cmd === "pull") {
  if (!skuArg) throw new Error("pull <SKU>");
  const item = await fetchOne(cfg, skuArg);
  const marketing = item.marketing?.slug
    ? item.marketing
    : await saveMarketing(cfg, item, { slug: slugFor(item), status: statusOf(item) });
  const dir = path.join(SEEDS_DIR, marketing.slug);
  await fs.mkdir(dir, { recursive: true });
  const urls = photoUrls(item);
  const files = [];
  for (let i = 0; i < urls.length; i++) {
    const name = `source-${String(i + 1).padStart(2, "0")}.jpg`;
    const dest = path.join(dir, name);
    try {
      await fs.access(dest);
      files.push(name); // keep existing — seeds are never overwritten
      continue;
    } catch {}
    const res = await fetch(urls[i]);
    if (!res.ok) {
      console.error(`  photo ${i + 1}: HTTP ${res.status}, skipped`);
      continue;
    }
    await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
    files.push(name);
  }
  const seed = {
    sku: item.sku,
    slug: marketing.slug,
    title: item.title,
    category: item.category,
    subcategory: item.subcategory ?? null,
    dimensions: item.dimensions ?? null,
    specs: item.specs ?? {},
    price: item.price ?? null,
    capturedBy: item.createdBy ?? null,
    createdAt: item.createdAt ?? null,
    photos: files,
    pulledAt: new Date().toISOString(),
  };
  await fs.writeFile(path.join(dir, "seed.json"), JSON.stringify(seed, null, 2));
  console.log(`Pulled ${item.sku} → ${dir}`);
  console.log(`  slug: ${marketing.slug}`);
  console.log(`  photos: ${files.join(", ") || "none downloadable"}`);
  console.log(`  next: product-ad pipeline on the best source photo, then:`);
  console.log(`  node scripts/marketing-seeds.mjs done ${item.sku} --deliverables master,cutout,placement,feed-post`);
} else if (cmd === "done" || cmd === "skip") {
  if (!skuArg) throw new Error(`${cmd} <SKU>`);
  const item = await fetchOne(cfg, skuArg);
  const prior = item.marketing ?? { slug: slugFor(item), status: "new" };
  const deliverables = arg("deliverables")
    ? Array.from(
        new Set([...(prior.deliverables ?? []), ...arg("deliverables").split(",").map((s) => s.trim()).filter(Boolean)]),
      )
    : prior.deliverables;
  const marketing = {
    ...prior,
    status: cmd === "done" ? "processed" : "skipped",
    ...(cmd === "done" ? { processedAt: prior.processedAt ?? new Date().toISOString() } : {}),
    ...(deliverables?.length ? { deliverables } : {}),
    ...(arg("note") ? { note: arg("note") } : {}),
  };
  await saveMarketing(cfg, item, marketing);
  console.log(`${item.sku} → ${marketing.status}${deliverables?.length ? ` · ${deliverables.join(",")}` : ""}`);
} else {
  console.error("Usage: marketing-seeds.mjs [list|pull|done|skip] …");
  process.exit(1);
}

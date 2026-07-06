#!/usr/bin/env node
/**
 * Batch inventory capture — feed a folder of phone photos (one photo per
 * physical item: the door edge with its tag), get one draft inventory record
 * per photo with a consecutive sticker number, verbatim tag transcription,
 * and the photo stored in Supabase Storage.
 *
 *   node scripts/batch-capture.mjs ~/Downloads/door-photos \
 *     [--category doors] [--start 1] [--api http://localhost:3002] [--dry]
 *
 * - HEIC/PNG/JPG accepted; converted + downscaled via macOS `sips`.
 * - Sticker numbers auto-continue from the highest existing tagRange in the
 *   database unless --start is given.
 * - Photos are processed with limited concurrency and 429-aware retry so the
 *   Gemini rate limiter never drops an item.
 * - Ends with a CSV report (batch-report-<ts>.csv next to the photos) and a
 *   ready /admin/labels?skus=… URL for printing the DK-1201 stickers.
 *
 * Requires the dev server running with admin access (DEV_ADMIN_BYPASS=1) —
 * the script mints a throwaway authenticated session for the database role,
 * exactly like a signed-in staffer.
 */
import { createClient } from "@supabase/supabase-js";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";

// ---------- args ----------
const args = process.argv.slice(2);
const folder = args.find((a) => !a.startsWith("--"));
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : dflt;
};
const CATEGORY = opt("category", "doors");
const API = opt("api", "http://localhost:3002");
const DRY = args.includes("--dry");
let startArg = opt("start", null);

if (!folder) {
  console.error("Usage: node scripts/batch-capture.mjs <photo-folder> [--category doors] [--start N] [--api URL] [--dry]");
  process.exit(1);
}

// ---------- env ----------
const envFile = resolve(import.meta.dirname, "../.env.local");
const env = Object.fromEntries(
  readFileSync(envFile, "utf8")
    .split("\n")
    .filter((l) => /^[A-Z]/.test(l))
    .map((l) => [
      l.slice(0, l.indexOf("=")),
      l.slice(l.indexOf("=") + 1).trim().replace(/^["']|["']$/g, ""),
    ]),
);
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// ---------- collect photos ----------
const IMAGE_RE = /\.(heic|jpe?g|png|webp)$/i;
const files = readdirSync(resolve(folder))
  .filter((f) => IMAGE_RE.test(f))
  .sort() // filename order = the order you shot them = sticker order
  .map((f) => join(resolve(folder), f));
if (files.length === 0) {
  console.error(`No photos found in ${folder}`);
  process.exit(1);
}
console.log(`${files.length} photos · category=${CATEGORY} · api=${API}${DRY ? " · DRY RUN" : ""}`);

// ---------- next sticker number ----------
async function highestExistingTag() {
  const { data, error } = await admin.from("items").select("data->tagRange");
  if (error) throw new Error(`tag scan: ${error.message}`);
  let max = 0;
  for (const row of data ?? []) {
    const r = row.tagRange;
    if (r && typeof r.end === "number" && r.end > max) max = r.end;
  }
  return max;
}
let nextTag = startArg ? Number(startArg) : (await highestExistingTag()) + 1;
console.log(`Sticker numbers start at #${nextTag}`);

// ---------- session cookie (authenticated DB role) ----------
async function mintCookie() {
  const email = "batch-capture@example.com";
  const password = "batch-" + Math.random().toString(36).slice(2) + "A1!";
  const { data: list } = await admin.auth.admin.listUsers({ perPage: 200 });
  const existing = list?.users?.find((u) => u.email === email);
  if (existing) await admin.auth.admin.deleteUser(existing.id);
  const { error: cErr } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (cErr) throw cErr;
  const anon = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false },
  });
  const { data, error } = await anon.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const ref = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
  const value = "base64-" + Buffer.from(JSON.stringify(data.session)).toString("base64url");
  const CHUNK = 3180;
  if (value.length <= CHUNK) return `sb-${ref}-auth-token=${value}`;
  return Array.from({ length: Math.ceil(value.length / CHUNK) }, (_, i) =>
    `sb-${ref}-auth-token.${i}=${value.slice(i * CHUNK, (i + 1) * CHUNK)}`,
  ).join("; ");
}
async function cleanupUser() {
  const { data: list } = await admin.auth.admin.listUsers({ perPage: 200 });
  const u = list?.users?.find((x) => x.email === "batch-capture@example.com");
  if (u) await admin.auth.admin.deleteUser(u.id);
}

// ---------- convert one photo ----------
const work = mkdtempSync(join(tmpdir(), "batch-capture-"));
function toDataUrl(file) {
  const out = join(work, basename(file).replace(/\.[^.]+$/, "") + ".jpg");
  execFileSync("sips", ["-s", "format", "jpeg", "-Z", "1600", file, "--out", out], { stdio: "ignore" });
  return "data:image/jpeg;base64," + readFileSync(out).toString("base64");
}

// ---------- submit with retry ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function submit(cookie, body) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(`${API}/api/capture-item`, {
      method: "POST",
      headers: { "content-type": "application/json", cookie },
      body: JSON.stringify(body),
    });
    if (res.status === 429) {
      const wait = Number(res.headers.get("retry-after") ?? 5) * 1000;
      await sleep(wait + 1000);
      continue;
    }
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.sku) return json;
    if (attempt < 4 && res.status >= 500) { await sleep(2000 * (attempt + 1)); continue; }
    throw new Error(json.reason ?? `HTTP ${res.status}`);
  }
  throw new Error("rate-limited after 5 attempts");
}

// ---------- run ----------
const rows = [["file", "sticker", "sku", "title", "price", "raw_tag_text", "error"]];
const skus = [];
const CONCURRENCY = 2;
let done = 0;

const cookie = DRY ? "" : await mintCookie();
try {
  // Pre-assign sticker numbers in filename order, then process concurrently.
  const jobs = files.map((file) => ({ file, tag: nextTag++ }));
  const queue = [...jobs];
  async function worker() {
    while (queue.length > 0) {
      const { file, tag } = queue.shift();
      const name = basename(file);
      try {
        const dataUrl = toDataUrl(file);
        if (DRY) {
          rows.push([name, `#${tag}`, "(dry)", "", "", "", ""]);
        } else {
          const out = await submit(cookie, {
            category: CATEGORY,
            count: 1,
            tagStart: tag,
            images: [dataUrl],
          });
          skus.push(out.sku);
          rows.push([
            name, `#${tag}`, out.sku,
            (out.extract?.productName ?? "").replaceAll(",", ";"),
            out.extract?.price ?? "",
            (out.extract?.rawText ?? "").replaceAll("\n", " / ").replaceAll(",", ";"),
            "",
          ]);
        }
      } catch (err) {
        rows.push([name, `#${tag}`, "", "", "", "", String(err.message ?? err).replaceAll(",", ";")]);
      }
      done++;
      process.stdout.write(`\r${done}/${files.length} processed`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
} finally {
  if (!DRY) await cleanupUser().catch(() => {});
  rmSync(work, { recursive: true, force: true });
}

console.log("");
const report = join(resolve(folder), `batch-report-${Date.now()}.csv`);
writeFileSync(report, rows.map((r) => r.join(",")).join("\n"));
const failed = rows.slice(1).filter((r) => r[6]).length;
console.log(`Done: ${rows.length - 1 - failed} saved, ${failed} failed`);
console.log(`Report: ${report}`);
if (skus.length > 0) {
  console.log(`Print stickers: ${API}/admin/labels?skus=${skus.join(",")}`);
}

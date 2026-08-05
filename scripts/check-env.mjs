#!/usr/bin/env node
/**
 * Env readiness check for cloud / mobile dev boxes.
 *
 *   node scripts/check-env.mjs        # human report, exit 1 if not ready
 *   node scripts/check-env.mjs --json # machine-readable
 *
 * Confirms the MINIMAL set for full backend access + owner admin + AI intake
 * is present, then live-pings the real Supabase backend with the service-role
 * key so "you have all the access needed to our backend" is proven, not
 * assumed. Never prints secret values — only whether each name is set, plus
 * the public Supabase host.
 *
 * Mirrors the gates in lib/auth/session.ts, lib/items/store.ts,
 * lib/supabase/admin.ts, lib/ai/gemini.ts. Keep in sync if those change.
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const JSON_OUT = process.argv.includes("--json");

// Load .env.local (then .env) into a plain map WITHOUT clobbering real
// process.env — a cloud host may inject vars directly instead of a file.
function loadEnvFile(file) {
  const out = {};
  if (!existsSync(file)) return out;
  for (const raw of readFileSync(file, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const fileEnv = { ...loadEnvFile(path.join(ROOT, ".env")), ...loadEnvFile(path.join(ROOT, ".env.local")) };
const get = (k) => (process.env[k] ?? fileEnv[k] ?? "").trim();
const isSet = (k) => get(k).length > 0;

const REQUIRED = [
  ["NEXT_PUBLIC_SUPABASE_URL", "Supabase project URL (public) — the CONFIGURED gate for reads/writes"],
  ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "Supabase anon key (public) — other half of the gate"],
  ["SUPABASE_SERVICE_ROLE_KEY", "Service-role key (SECRET) — server writes + locked tables, no interactive login"],
  ["GEMINI_API_KEY", "Gemini key (SECRET) — the whole AI intake pipeline"],
];

const OWNER = [
  ["DEV_ADMIN_BYPASS", "owner access with no OAuth (needs `next dev`); or set ALLOWED_EMAILS + sign in"],
  ["ALLOWED_EMAILS", "owner tier by email (alternative to the bypass)"],
];

const RECOMMENDED = [
  ["SERPAPI_KEY", "live comparable prices (else DOOR fixtures for every item)"],
];

const OPTIONAL = [
  ["PHOTOROOM_API_KEY", "opaque-item cutouts"],
  ["REMOVE_BG_API_KEY", "cutout fallback provider"],
  ["RESEND_API_KEY", "lead/inquiry email delivery"],
  ["NEXT_PUBLIC_TURNSTILE_SITE_KEY", "bot protection on customer forms"],
  ["NEXT_PUBLIC_CATALOG_LIVE", "publish real SKU grids on the storefront"],
];

function hostOf(url) {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

async function pingSupabase() {
  const url = get("NEXT_PUBLIC_SUPABASE_URL");
  const key = get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return { ok: false, reason: "missing URL or service-role key" };
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/items?select=sku&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status} from items table` };
    const rows = await res.json();
    const count = res.headers.get("content-range");
    return { ok: true, sample: Array.isArray(rows) ? rows.length : 0, range: count };
  } catch (e) {
    return { ok: false, reason: e?.name === "TimeoutError" ? "timeout (8s)" : String(e?.message || e) };
  }
}

async function pingGemini() {
  const key = get("GEMINI_API_KEY");
  if (!key) return { ok: false, reason: "no key" };
  try {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models", {
      headers: { "x-goog-api-key": key },
      signal: AbortSignal.timeout(8000),
    });
    return res.ok ? { ok: true } : { ok: false, reason: `HTTP ${res.status}` };
  } catch (e) {
    return { ok: false, reason: e?.name === "TimeoutError" ? "timeout (8s)" : String(e?.message || e) };
  }
}

const missingRequired = REQUIRED.filter(([k]) => !isSet(k)).map(([k]) => k);
const hasOwner = OWNER.some(([k]) => isSet(k));

const [supabase, gemini] = await Promise.all([pingSupabase(), pingGemini()]);

const ready = missingRequired.length === 0 && hasOwner && supabase.ok;

if (JSON_OUT) {
  console.log(
    JSON.stringify(
      {
        ready,
        supabaseHost: hostOf(get("NEXT_PUBLIC_SUPABASE_URL")),
        required: Object.fromEntries(REQUIRED.map(([k]) => [k, isSet(k)])),
        ownerAccess: hasOwner,
        recommended: Object.fromEntries(RECOMMENDED.map(([k]) => [k, isSet(k)])),
        optional: Object.fromEntries(OPTIONAL.map(([k]) => [k, isSet(k)])),
        backend: supabase,
        gemini,
      },
      null,
      2,
    ),
  );
  process.exit(ready ? 0 : 1);
}

const ok = (b) => (b ? "  ✓ set  " : "  ✗ MISS ");
const line = (k, desc) => console.log(`${ok(isSet(k))} ${k.padEnd(38)} ${desc}`);

console.log("\n  Price-Less cloud/mobile env readiness\n  " + "─".repeat(58));
const host = hostOf(get("NEXT_PUBLIC_SUPABASE_URL"));
console.log(`  Backend project: ${host || "(unset)"}\n`);

console.log("  REQUIRED");
REQUIRED.forEach(([k, d]) => line(k, d));
console.log("\n  OWNER ACCESS (need at least one)");
OWNER.forEach(([k, d]) => line(k, d));
console.log("\n  RECOMMENDED");
RECOMMENDED.forEach(([k, d]) => line(k, d));
console.log("\n  OPTIONAL");
OPTIONAL.forEach(([k, d]) => line(k, d));

console.log("\n  LIVE CHECKS");
console.log(
  `  ${supabase.ok ? "✓" : "✗"} Supabase backend  ${
    supabase.ok ? `reachable (items table OK${supabase.range ? `, range ${supabase.range}` : ""})` : supabase.reason
  }`,
);
console.log(
  `  ${gemini.ok ? "✓" : "✗"} Gemini API        ${gemini.ok ? "key valid (models list OK)" : gemini.reason}`,
);

console.log("\n  " + "─".repeat(58));
if (ready) {
  console.log("  READY — full backend access + owner admin + AI intake. Run: npm run cloud\n");
} else {
  console.log("  NOT READY");
  if (missingRequired.length) console.log("   • missing required: " + missingRequired.join(", "));
  if (!hasOwner) console.log("   • no owner access: set DEV_ADMIN_BYPASS=1 (dev) or ALLOWED_EMAILS");
  if (!supabase.ok) console.log("   • backend unreachable: " + supabase.reason);
  console.log("   → fill .env.cloud.example into .env.local, then re-run: npm run check-env\n");
}
process.exit(ready ? 0 : 1);

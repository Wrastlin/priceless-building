/**
 * Comparable-price search adapter. Hits SerpApi's Google Shopping engine
 * when SERPAPI_KEY is set; falls back to a deterministic mock so the UI
 * keeps working in local/dev without billing the real API.
 *
 * Used by /admin/inventory/new and /admin/inventory/[sku] to populate
 * the "live retail comparable" panel that drives our tag pricing.
 *
 * Valuation needs a real sample — not 4–6 Home Depot hits. We pull a deep
 * Google Shopping page, prefer big-box retailers, then backfill from the
 * rest of the market until we have enough prices for a trimmed mean.
 */

export type Comparable = {
  source: string;
  title: string;
  price: number;
  url: string;
  image: string;
  /** ISO timestamp the comparable was captured, so the price evidence is dated. */
  capturedAt?: string;
};

const FALLBACK: Comparable[] = [
  { source: "Home Depot", title: "Masonite Cheyenne 6-Panel Pre-Hung Interior Door", price: 189, url: "https://www.homedepot.com/", image: "/test-images/01-interior-door-shaker.jpg" },
  { source: "Menards", title: "Mastercraft Primed 6-Panel Pre-Hung Door 32×80", price: 174, url: "https://www.menards.com/", image: "/test-images/01-interior-door-shaker.jpg" },
  { source: "Lowe's", title: "RELIABILT 6-Panel Solid-Core Primed Pre-Hung", price: 159, url: "https://www.lowes.com/", image: "/test-images/01-interior-door-shaker.jpg" },
  { source: "Amazon", title: "JELD-WEN 6-Panel Hollow-Core Primed Pre-Hung", price: 152, url: "https://www.amazon.com/", image: "/test-images/02-exterior-door-black-steel.jpg" },
];

/** Preferred retailers for building materials (order = display preference). */
const PREFERRED_RETAILERS = [
  "home depot",
  "menards",
  "lowe",
  "amazon",
  "ace hardware",
  "floor & decor",
  "build.com",
  "wayfair",
  "ferguson",
  "supply house",
];

/** Minimum comps before we treat a valuation sample as usable. */
export const MIN_COMPS_FOR_VALUE = 12;
/** Cap stored/shown comps so the panel stays usable. */
export const MAX_COMPS = 24;

export interface FindOptions {
  /**
   * Broaden the reach. Off (default): still pulls a deep page, prefers
   * known building retailers, then backfills other sellers until we have
   * enough prices for a real trimmed-mean estimate.
   *
   * On: skip the preferred-first pass and take the full shopping mix
   * (specialty / manufacturer / online) up to MAX_COMPS.
   */
  broaden?: boolean;
}

type RawHit = {
  source?: string;
  title: string;
  price?: string;
  extracted_price?: number;
  product_link?: string;
  link?: string;
  thumbnail?: string;
};

function isPreferred(source: string): boolean {
  const s = source.toLowerCase();
  return PREFERRED_RETAILERS.some((r) => s.includes(r));
}

function mapHit(r: RawHit, capturedAt: string): Comparable | null {
  const price = r.extracted_price ?? Number((r.price ?? "0").replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(price) || price <= 0) return null;
  return {
    source: r.source?.trim() || "Online",
    title: r.title,
    price,
    url: r.product_link ?? r.link ?? "#",
    image: r.thumbnail ?? "",
    capturedAt,
  };
}

function dedupeKey(c: Comparable): string {
  // Collapse near-identical listings (same retailer + rounded price + title stem).
  const stem = c.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 48);
  return `${c.source.toLowerCase()}|${Math.round(c.price)}|${stem}`;
}

async function serpShopping(query: string, apiKey: string, num: number): Promise<RawHit[]> {
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_shopping");
  url.searchParams.set("q", query);
  url.searchParams.set("location", "Wausau, Wisconsin, United States");
  url.searchParams.set("hl", "en");
  url.searchParams.set("gl", "us");
  url.searchParams.set("num", String(num));
  url.searchParams.set("api_key", apiKey);

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      next: { revalidate: 60 * 60 * 6 },
      signal: AbortSignal.timeout(15_000),
    });
  } catch (err) {
    throw new Error(
      `Comparable search timed out or failed to reach SerpApi: ${err instanceof Error ? err.message : "unknown"}`,
    );
  }
  if (!res.ok) {
    throw new Error(`Comparable search failed: SerpApi returned HTTP ${res.status}`);
  }
  const json = (await res.json()) as { shopping_results?: RawHit[] };
  return json.shopping_results ?? [];
}

function mergeRanked(preferred: Comparable[], rest: Comparable[], limit: number): Comparable[] {
  const out: Comparable[] = [];
  const seen = new Set<string>();
  for (const c of [...preferred, ...rest]) {
    const k = dedupeKey(c);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(c);
    if (out.length >= limit) break;
  }
  return out;
}

export async function findComparables(
  query: string,
  opts: FindOptions = {},
): Promise<Comparable[]> {
  const key = process.env.SERPAPI_KEY?.trim();
  // No key configured = local/dev. Return the deterministic fixtures so the
  // UI works without billing. This is the ONLY path that returns fixtures —
  // when a key IS configured, a real upstream error throws (rather than
  // silently masquerading fixture door prices as live results for, say, a
  // vanity), so the caller can surface it.
  if (!key) return FALLBACK;

  const broaden = opts.broaden === true;
  const q = query.trim();
  if (q.length < 3) return [];

  const capturedAt = new Date().toISOString();
  const raw = await serpShopping(q, key, 60);
  const mapped = raw
    .map((r) => mapHit(r, capturedAt))
    .filter((c): c is Comparable => c !== null);

  let comps: Comparable[];
  if (broaden) {
    comps = mergeRanked([], mapped, MAX_COMPS);
  } else {
    const preferred = mapped.filter((c) => isPreferred(c.source));
    const others = mapped.filter((c) => !isPreferred(c.source));
    comps = mergeRanked(preferred, others, MAX_COMPS);
  }

  // Second pass: if the sample is still thin, try a broader shopping query
  // (drop model noise, keep category nouns) and merge.
  if (comps.length < MIN_COMPS_FOR_VALUE) {
    const loose = q
      .replace(/\b(sku|model|#)\b/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (loose.length >= 3 && loose.toLowerCase() !== q.toLowerCase()) {
      try {
        const extraRaw = await serpShopping(loose, key, 40);
        const extra = extraRaw
          .map((r) => mapHit(r, capturedAt))
          .filter((c): c is Comparable => c !== null);
        comps = mergeRanked(comps, extra, MAX_COMPS);
      } catch {
        // Keep the first-pass sample; thin is better than failing the save.
      }
    }
  }

  return comps;
}

/**
 * 25% trimmed mean ("interquartile mean"): sort the comparable prices,
 * drop the lowest 25% and the highest 25%, and average the middle 50%.
 * This throws out the cheap junk listings and the overpriced outliers
 * that otherwise drag the average around, leaving a price that reflects
 * the real middle of the market.
 *
 * The trim count floors, so small samples keep more: with fewer than 4
 * comparables nothing is dropped (and we just average them all) — there
 * aren't enough points to call any of them outliers.
 */
export function averagePrice(comparables: Comparable[]): number {
  const prices = comparables
    .map((c) => c.price)
    .filter((p) => p > 0)
    .sort((a, b) => a - b);
  if (prices.length === 0) return 0;

  const trim = Math.floor(prices.length * 0.25);
  const middle = trim > 0 ? prices.slice(trim, prices.length - trim) : prices;
  const set = middle.length > 0 ? middle : prices;

  return Math.round(set.reduce((s, p) => s + p, 0) / set.length);
}

/** Median of comparable prices — robust check alongside the trimmed mean. */
export function medianPrice(comparables: Comparable[]): number {
  const prices = comparables
    .map((c) => c.price)
    .filter((p) => p > 0)
    .sort((a, b) => a - b);
  if (prices.length === 0) return 0;
  const mid = Math.floor(prices.length / 2);
  if (prices.length % 2 === 1) return Math.round(prices[mid]!);
  return Math.round((prices[mid - 1]! + prices[mid]!) / 2);
}

/**
 * Market anchor for compare-at: blend trimmed mean with median so a
 * cluster of identical HD SKUs can't fully dominate, and a thin sample
 * still has a usable number.
 */
export function marketAnchor(comparables: Comparable[]): number {
  const avg = averagePrice(comparables);
  const med = medianPrice(comparables);
  if (avg <= 0) return med;
  if (med <= 0) return avg;
  return Math.round(avg * 0.6 + med * 0.4);
}

/**
 * Suggest a tag price from a comparable retail average using tiered
 * discount rules. Cheap items don't get the same aggressive discount
 * as expensive items because a 40% cut on a $10 item leaves no margin
 * for the staff time to document + tag + photograph it.
 *
 * Tier rules (retail → tag % of retail):
 *   < $25    → 100% (no discount, full price)
 *   < $50    → 85%
 *   < $100   → 75%
 *   < $500   → 70%
 *   $500+    → 60%
 *
 * A staffer can always override via the margin slider on Add Item.
 */
export function suggestTagPrice(retailAvg: number): number {
  if (retailAvg <= 0) return 0;
  const pct = pricingTier(retailAvg);
  return Math.round(retailAvg * pct);
}

export function pricingTier(retailAvg: number): number {
  if (retailAvg < 25) return 1.0;
  if (retailAvg < 50) return 0.85;
  if (retailAvg < 100) return 0.75;
  if (retailAvg < 500) return 0.7;
  return 0.6;
}

export function tierLabel(retailAvg: number): string {
  if (retailAvg < 25) return "No discount (cheap-item floor)";
  if (retailAvg < 50) return "15% off (mid-low tier)";
  if (retailAvg < 100) return "25% off (mid tier)";
  if (retailAvg < 500) return "30% off (premium tier)";
  return "40% off (high-ticket tier)";
}

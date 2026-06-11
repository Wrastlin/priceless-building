/**
 * Comparable-price search adapter. Hits SerpApi's Google Shopping engine
 * when SERPAPI_KEY is set; falls back to a deterministic mock so the UI
 * keeps working in local/dev without billing the real API.
 *
 * Used by /admin/inventory/new and /admin/inventory/[sku] to populate
 * the "live retail comparable" panel that drives our tag pricing.
 */

export type Comparable = {
  source: string;
  title: string;
  price: number;
  url: string;
  image: string;
};

const FALLBACK: Comparable[] = [
  { source: "Home Depot", title: "Masonite Cheyenne 6-Panel Pre-Hung Interior Door", price: 189, url: "https://www.homedepot.com/", image: "/test-images/01-interior-door-shaker.jpg" },
  { source: "Menards", title: "Mastercraft Primed 6-Panel Pre-Hung Door 32×80", price: 174, url: "https://www.menards.com/", image: "/test-images/01-interior-door-shaker.jpg" },
  { source: "Lowe's", title: "RELIABILT 6-Panel Solid-Core Primed Pre-Hung", price: 159, url: "https://www.lowes.com/", image: "/test-images/01-interior-door-shaker.jpg" },
  { source: "Amazon", title: "JELD-WEN 6-Panel Hollow-Core Primed Pre-Hung", price: 152, url: "https://www.amazon.com/", image: "/test-images/02-exterior-door-black-steel.jpg" },
];

const RETAILERS = ["The Home Depot", "Menards", "Lowe's", "Amazon"];

export interface FindOptions {
  /**
   * Broaden the reach. Off (default): results are restricted to the four
   * mainstream big-box retailers and capped tight — best for common
   * building materials where those four set the real market price.
   *
   * On: drop the retailer whitelist so specialty stores, manufacturers,
   * and online sellers come through, and pull a deeper result set. Use
   * this for unique / special-value items (antique hardware, designer
   * fixtures, discontinued lines) that the big four simply don't carry.
   */
  broaden?: boolean;
}

export async function findComparables(
  query: string,
  opts: FindOptions = {},
): Promise<Comparable[]> {
  const key = process.env.SERPAPI_KEY?.trim();
  if (!key) return FALLBACK;

  const broaden = opts.broaden === true;

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_shopping");
  url.searchParams.set("q", query);
  url.searchParams.set("location", "Wausau, Wisconsin, United States");
  // Pull a deeper page when broadening so there's enough to surface
  // specialty sellers; the narrow path only needs enough to fill the
  // four-retailer whitelist.
  url.searchParams.set("num", broaden ? "60" : "40");
  url.searchParams.set("api_key", key);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 * 60 * 24 } });
    if (!res.ok) return FALLBACK;
    const json = (await res.json()) as { shopping_results?: { source?: string; title: string; price?: string; extracted_price?: number; product_link?: string; link?: string; thumbnail?: string }[] };
    const raw = json.shopping_results ?? [];
    const scoped = broaden
      ? raw.filter((r) => r.source) // any source with a name
      : raw.filter((r) => r.source && RETAILERS.some((retailer) => r.source!.toLowerCase().includes(retailer.toLowerCase().split(" ").pop()!)));
    const results = scoped
      .slice(0, broaden ? 15 : 6)
      .map((r) => ({
        source: r.source ?? "Online",
        title: r.title,
        price: r.extracted_price ?? Number((r.price ?? "0").replace(/[^0-9.]/g, "")),
        url: r.product_link ?? r.link ?? "#",
        image: r.thumbnail ?? "",
      }))
      .filter((r) => r.price > 0);
    return results.length > 0 ? results : FALLBACK;
  } catch {
    return FALLBACK;
  }
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

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

export async function findComparables(query: string): Promise<Comparable[]> {
  const key = process.env.SERPAPI_KEY?.trim();
  if (!key) return FALLBACK;

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_shopping");
  url.searchParams.set("q", query);
  url.searchParams.set("location", "Wausau, Wisconsin, United States");
  url.searchParams.set("api_key", key);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 * 60 * 24 } });
    if (!res.ok) return FALLBACK;
    const json = (await res.json()) as { shopping_results?: { source?: string; title: string; price?: string; extracted_price?: number; product_link?: string; link?: string; thumbnail?: string }[] };
    const results = (json.shopping_results ?? [])
      .filter((r) => r.source && RETAILERS.some((retailer) => r.source!.toLowerCase().includes(retailer.toLowerCase().split(" ").pop()!)))
      .slice(0, 6)
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

export function averagePrice(comparables: Comparable[]): number {
  if (comparables.length === 0) return 0;
  return Math.round(comparables.reduce((s, c) => s + c.price, 0) / comparables.length);
}

export function suggestTagPrice(retailAvg: number): number {
  // 45% of retail is our default markdown vs. big box.
  return Math.round(retailAvg * 0.45);
}

// GET /sitemap.xml
//
// SEO sitemap. Lists every customer-facing route on both brands.
// Admin paths are intentionally excluded.

import { CATEGORIES, listCatalog } from "@/lib/catalog";

const BASE = "https://pricelessbuilding.com";

const STATIC: string[] = [
  "/", "/shop",
  "/about", "/contact", "/financing",
  "/contractors", "/reviews", "/blog", "/gift-cards",
  "/builders-corner", "/four-squared",
  "/faq", "/press", "/careers",
  "/policies/pricing", "/policies/returns",
];

const BLOG_SLUGS = ["buying-surplus-doors", "how-we-price", "reclaimed-windows", "cabinet-boxes-revealed"];

export async function GET() {
  const urls: string[] = [];
  for (const p of STATIC) urls.push(`${BASE}${p}`);
  for (const cat of Object.keys(CATEGORIES)) urls.push(`${BASE}/shop/${cat}`);
  for (const item of await listCatalog()) urls.push(`${BASE}/shop/item/${item.sku}`);
  for (const s of BLOG_SLUGS) urls.push(`${BASE}/blog/${s}`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u}</loc><changefreq>weekly</changefreq></url>`)
    .join("\n")}\n</urlset>`;
  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
  });
}

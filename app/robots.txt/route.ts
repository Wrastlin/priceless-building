// GET /robots.txt. Blocks crawlers from /admin, exposes sitemap.

export async function GET() {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /api",
    "",
    "Sitemap: https://pricelessbuilding.com/sitemap.xml",
  ].join("\n");
  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/plain", "Cache-Control": "public, max-age=3600" },
  });
}

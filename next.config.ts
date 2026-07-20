import type { NextConfig } from "next";

// Image optimization is OFF by default. Vercel’s Image Optimization quota
// returns 402 once exhausted, which blanks category heroes and floor grids
// while still-cached variants keep working — so “some” pages look broken.
// Serve originals unless IMAGE_OPTIMIZATION=on is set after quota is healthy.
const optimizeImages = process.env.IMAGE_OPTIMIZATION === "on";

const config: NextConfig = {
  // Force a single canonical host. Both apex and www currently serve 200,
  // and that split is a known source of OAuth state/cookie mismatches
  // (bad_oauth_state). Canonicalize www -> apex so sign-in always starts
  // and finishes on the same origin Supabase is configured for.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.pricelessbuilding.com" }],
        destination: "https://pricelessbuilding.com/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    // Default: serve originals (unoptimized) so an exhausted Vercel quota
    // can't 402 category/hero photos. Set IMAGE_OPTIMIZATION=on to re-enable
    // responsive WebP thumbnails via /_next/image once quota is available.
    // Pagination caps each grid to 24 images, so far fewer transforms run.
    unoptimized: !optimizeImages,
    minimumCacheTTL: 2678400, // 31 days — keep optimized variants cached, minimize re-transforms
    remotePatterns: [
      { protocol: "https", hostname: "jlacypqvbajwzvgiseia.supabase.co" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.gstatic.com" },
    ],
    qualities: [50, 55, 60, 65, 70, 75, 78, 80, 85, 90, 92, 95, 100],
  },
};

export default config;

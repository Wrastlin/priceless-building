import type { NextConfig } from "next";

// Image optimization is ON by default. The optimizer draws on the Vercel image
// quota; if that's exhausted, /_next/image returns 402 and grids break. Set
// IMAGE_OPTIMIZATION=off in the environment (then redeploy) to instantly fall
// back to serving originals — no code change needed.
const optimizeImages = process.env.IMAGE_OPTIMIZATION !== "off";

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
    // When optimization is off (IMAGE_OPTIMIZATION=off) we serve originals so
    // an exhausted Vercel quota can't 402 the whole grid. When on (default),
    // the optimizer makes small responsive WebP thumbnails (~300px) driven by
    // each <Image>'s `sizes` prop — the biggest weight win on the listings.
    // Pagination caps each grid to 24 images, so far fewer transforms run.
    unoptimized: !optimizeImages,
    minimumCacheTTL: 2678400, // 31 days — keep optimized variants cached, minimize re-transforms
    remotePatterns: [
      { protocol: "https", hostname: "jlacypqvbajwzvgiseia.supabase.co" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.gstatic.com" },
    ],
    qualities: [50, 55, 60, 65, 70, 75, 80, 85, 90, 92, 95, 100],
  },
};

export default config;

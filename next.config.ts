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
    // the optimizer makes small responsive WebP thumbnails driven by each
    // <Image>'s `sizes` prop. Keep qualities to exactly two values so each
    // source only produces width×2 transform variants (not a quality sprawl).
    unoptimized: !optimizeImages,
    minimumCacheTTL: 2678400, // 31 days — keep optimized variants cached, minimize re-transforms
    remotePatterns: [
      { protocol: "https", hostname: "jlacypqvbajwzvgiseia.supabase.co" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.gstatic.com" },
    ],
    // 70 = cards/thumbs, 80 = heroes/feature. Do not add more without a reason.
    qualities: [70, 80],
  },
};

export default config;

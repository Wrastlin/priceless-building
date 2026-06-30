import type { NextConfig } from "next";

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
    // Image optimizer is ON. It generates small responsive WebP thumbnails
    // from the originals, so a grid downloads ~300px images instead of
    // full-resolution photos — the single biggest weight win on the listing
    // pages. The `sizes` prop on each <Image> drives the srcset.
    //
    // IMPORTANT (plan dependency): the optimizer draws on the Vercel image
    // quota. It was previously disabled (`unoptimized: true`) because the
    // quota was exhausted and /_next/image returned 402
    // (OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED). Pagination now caps each grid
    // to 24 images so far fewer transforms run, but on the current plan this
    // still depends on the quota being lifted (plan upgrade). If 402s return,
    // re-add `unoptimized: true` to fall back to serving originals.
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

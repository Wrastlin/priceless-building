import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    // Vercel's image-optimization quota is exhausted on this project, so the
    // optimizer endpoint (/_next/image) returns 402 for any uncached
    // transformation (x-vercel-error: OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED).
    // A redeploy clears the edge cache of already-optimized images, which is
    // why most photos broke at once after the last merge. Serving the original
    // files directly bypasses the optimizer; every raw asset returns 200.
    // Re-enable optimization (drop this line) only after upgrading the Vercel
    // plan or wiring an external image loader.
    unoptimized: true,
    remotePatterns: [],
    qualities: [50, 55, 60, 65, 70, 75, 80, 85, 90, 92, 95, 100],
  },
};

export default config;

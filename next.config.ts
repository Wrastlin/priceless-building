import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [],
    qualities: [50, 55, 60, 65, 70, 75, 80, 85, 90, 92, 95, 100],
  },
};

export default config;

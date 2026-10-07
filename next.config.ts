import withPWAInit from "@ducanh2912/next-pwa";
import withBundleAnalyzerInit from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = withBundleAnalyzerInit({
  enabled: process.env.ANALYZE === "true",
});

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  sw: "sw.js",
});

const nextConfig: NextConfig = {
  turbopack: {},
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Core Web Vitals (CLS/LCP optimization)
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
  },
};

export default withBundleAnalyzer(withPWA(nextConfig));

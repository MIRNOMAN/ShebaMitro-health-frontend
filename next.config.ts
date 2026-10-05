import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  disable: false,
  register: true,
  sw: "sw.js",
});

const nextConfig: NextConfig = {
  turbopack: {},
};

export default withPWA(nextConfig);

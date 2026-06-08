import type { NextConfig } from "next";
import { resolve } from "path";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  turbopack: {
    root: resolve("."),
  },
};

// Enables access to Cloudflare bindings (e.g. KV) when running `next dev`.
initOpenNextCloudflareForDev();

export default nextConfig;

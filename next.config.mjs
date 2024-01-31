import "./src/env/client.mjs";
import "./src/env/server.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/ingest/:path*",
        destination: "https://app.posthog.com/:path*",
      },
    ];
  },
  staticPageGenerationTimeout: 1000,
};

export default nextConfig;

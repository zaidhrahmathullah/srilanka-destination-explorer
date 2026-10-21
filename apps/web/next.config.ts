import type { NextConfig } from "next";

const backendApiUrl =
  process.env.BACKEND_API_URL ??
  "http://localhost:4000/api";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendApiUrl.replace(/\/$/, "")}/:path*`,
      },
    ];
  },
};

export default nextConfig;
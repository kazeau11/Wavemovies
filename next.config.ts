import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/watch/:path*",
        headers: [
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
  images: {
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "wsrv.nl" },
      { protocol: "https", hostname: "db.1flex.org" },
      { protocol: "https", hostname: "**.1flex.org" },
      { protocol: "https", hostname: "commondatastorage.googleapis.com" },
    ],
  },
};

export default nextConfig;

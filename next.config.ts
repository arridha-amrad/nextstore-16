import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },
      {
        hostname: "m.media-amazon.com",
        protocol: "https",
      },
      {
        hostname: "p16-images-sign-sg.tokopedia-static.net",
        protocol: "https",
      },
      {
        hostname: "localhost",
        protocol: "http",
      },
      {
        hostname: "cdn.jsdelivr.net",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;

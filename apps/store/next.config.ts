import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev: allows the HMR/dev-resource requests from a browser on another LAN
  // machine (e.g. accessing this box's IP over SSH). Update if the IP changes.
  allowedDevOrigins: ['192.168.1.100'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "contribution.usercontent.google.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
      },
    ],
  },
};

export default nextConfig;

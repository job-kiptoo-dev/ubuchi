import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {

    qualities: [25, 50, 75, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nxiwkagsqlrisrnhzela.supabase.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
};

export default nextConfig;


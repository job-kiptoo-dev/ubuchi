import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //   images: {
  //   domains: ["res.cloudinary.com"],
  // },

  images: {
  domains: [
      "nxiwkagsqlrisrnhzela.supabase.co", // Supabase storage
      "res.cloudinary.com",               // Cloudinary
      "example.com",                      // Optional: if you still use example.com URLs
        ],}
};

export default nextConfig;

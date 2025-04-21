import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "glyph-storage.s3.eu-north-1.amazonaws.com",
    ],
  },
};

export default nextConfig;

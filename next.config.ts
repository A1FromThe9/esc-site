import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Uploaded media is mocked/stored locally in this demo. Placeholder portraits
  // are local SVGs; real uploads would go to Vercel Blob.
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;

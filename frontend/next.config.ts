import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/v1/:path*",
  //       destination: "http://localhost:5000/api/v1/:path*", // Proxy به Express
  //     },
  //   ];
  // },
};

export default nextConfig;

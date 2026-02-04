import type { NextConfig } from "next";
// import withSerwistInit from "@serwist/next";

// const withSerwist = withSerwistInit({
//   swSrc: "app/sw.ts",
//   swDest: "public/sw.js",
// });

const nextConfig: NextConfig = {
  devIndicators: false,
};

export default nextConfig; // withSerwist(nextConfig);



/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produces a self-contained server bundle for a small, production-ready Docker image.
  output: "standalone",
  reactStrictMode: true,
};

export default nextConfig;

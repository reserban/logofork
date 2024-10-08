/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["img.youtube.com"],
  },
  experimental: {
    serverComponentsExternalPackages: ["sharp"],
  },
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;

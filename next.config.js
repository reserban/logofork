/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["sharp", "puppeteer"],
  },
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;

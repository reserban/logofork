/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["sharp", "puppeteer"],
  },
};

module.exports = nextConfig;

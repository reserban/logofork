/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: {
    api: {
      bodyParser: {
        sizeLimit: "10mb",
      },
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        zlib: false,
        crypto: false,
      };
    }
    config.externals = [...config.externals, "canvas", "jsdom"];
    return config;
  },
};

export default nextConfig;

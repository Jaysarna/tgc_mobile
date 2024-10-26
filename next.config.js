/** @type {import('next').NextConfig} */

const TerserPlugin = require('terser-webpack-plugin');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["app.tgc67.online", "tgc67.online", 'api.newworldtrending.com'],
  },
  webpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      if (!config.optimization) config.optimization = {};
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
      ];
    }
    return config;
  },
}

module.exports = nextConfig

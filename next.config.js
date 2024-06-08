/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "blob: https://stripe-images.s3.amazonaws.com",
      },
      {
        hostname: "stripe-images.s3.amazonaws.com",
      },
      {
        hostname: "plotix-media.s3.eu-north-1.amazonaws.com",
      },
      {
        hostname: "localhost",
        pathname: "**",
        protocol: "http",
      },
      {
        hostname: "logo.clearbit.com",
        pathname: "**",
        port: "",
        protocol: "https",
      },
    ],
    domains: ['images.unsplash.com'],
  },
};

module.exports = nextConfig;
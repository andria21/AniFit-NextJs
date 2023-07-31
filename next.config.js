/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.pexels.com"],
  },
  env: {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  }
};
module.exports = nextConfig

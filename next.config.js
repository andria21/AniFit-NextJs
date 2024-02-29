/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  cacheOnFrontEndNav: false,
  reloadOnOnline: true,
  disable: false,
})

const nextConfig = {
  images: {
    domains: ["images.pexels.com", "images.unsplash.com"],
  },
  env: {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    API_URL: process.env.API_URL,
  }
};
module.exports = withPWA(nextConfig)

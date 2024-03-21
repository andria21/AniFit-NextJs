/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  disable: false,
})

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },  
  env: {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    API_URL: process.env.API_URL,
  }
};
module.exports = withPWA(nextConfig)

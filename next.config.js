/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Local images from /public/images, plus product photos from Shopify's CDN.
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.shopify.com' }],
  },
};

module.exports = nextConfig;

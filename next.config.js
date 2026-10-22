/** Host of the Worker that serves the pictures the client uploads in the admin (see lib/site-images.ts). */
function workerHost() {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUBSCRIBE_URL || '').hostname;
  } catch {
    return null;
  }
}

const host = workerHost();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Local images from /public/images, product photos from Shopify's CDN, and (when the Worker
    // address is set) pictures uploaded in the admin. The Worker pattern is limited to /api/img/.
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      ...(host ? [{ protocol: 'https', hostname: host, pathname: '/api/img/**' }] : []),
    ],
  },
};

module.exports = nextConfig;

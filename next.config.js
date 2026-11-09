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

  // The sign-up confirm / unsubscribe pages and the admin are plain files in /public (moved over from the
  // holding page). Without this, /admin would not find its index.html.
  async rewrites() {
    return [{ source: '/admin', destination: '/admin/index.html' }];
  },

  async headers() {
    const csp = (value) => ({ key: 'Content-Security-Policy', value });
    const statusPage =
      "default-src 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://*.workers.dev; manifest-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests";
    const admin =
      "default-src 'none'; script-src 'self' https://www.gstatic.com https://apis.google.com; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://*.googleapis.com https://*.workers.dev; frame-src https://biggs-6ed18.firebaseapp.com https://content.googleapis.com; manifest-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests";
    const adminHeaders = [
      csp(admin),
      { key: 'Cache-Control', value: 'no-store' },
      { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
    ];
    return [
      { source: '/confirm.html', headers: [csp(statusPage)] },
      { source: '/unsubscribe.html', headers: [csp(statusPage)] },
      { source: '/admin', headers: adminHeaders },
      { source: '/admin/:path*', headers: adminHeaders },
    ];
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve AVIF (smaller than WebP) when the browser supports it, falling
    // back to WebP. Improves LCP on this image-heavy photography site.
    formats: ["image/avif", "image/webp"],
  },

  /**
   * Vercel Skew Protection.
   *
   * This replaces the `export const dynamic = "force-dynamic"` that used to sit
   * on the homepage and all nine service pages. That directive did fix the bug
   * it was written for — after a deploy, a client-side navigation could be
   * answered by an older build and revert the hero photo — but it did so by
   * taking every commercial page off the CDN and re-rendering it on the server
   * for every visitor and every crawler.
   *
   * Pinning `deploymentId` makes Next tag its asset and RSC requests with the
   * deployment that served the page, so a client running an old build is routed
   * to that same old build (or reloaded) instead of getting a mismatched
   * payload. The pages can then be statically generated again.
   *
   * IMPORTANT: also switch Skew Protection ON in Vercel
   * (Project → Settings → Advanced → Skew Protection). The env var is populated
   * by Vercel automatically; locally it is undefined, which is a safe no-op.
   */
  deploymentId: process.env.VERCEL_DEPLOYMENT_ID,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // The photographs never change once published — they are versioned by
        // filename — so let the CDN and browsers hold on to them.
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve AVIF (smaller than WebP) when the browser supports it, falling
    // back to WebP. Improves LCP on this image-heavy photography site.
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;

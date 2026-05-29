/**
 * Image library helpers.
 * All photos live in /public/images/<silo>/ as optimised WebP (JPG fallback
 * alongside). Filenames are SEO keyword-rich and sequentially numbered.
 */

export type SiteImage = {
  src: string; // WebP path
  jpg: string; // JPG fallback path
  alt: string;
};

type SiloKey =
  | "corporate-headshots"
  | "actor-headshots"
  | "model-portfolios"
  | "personal-branding"
  | "musician-portraits"
  | "singer-portraits"
  | "sports-portraits"
  | "creative-portraits"
  | "family";

const SILOS: Record<SiloKey, { slug: string; count: number; alt: string }> = {
  "corporate-headshots": {
    slug: "corporate-headshot-sydney",
    count: 49,
    alt: "Corporate headshot photographed in Sydney by Nick Brand Photography",
  },
  "actor-headshots": {
    slug: "actor-headshots-sydney",
    count: 6,
    alt: "Actor headshot photographed in Sydney by Nick Brand Photography",
  },
  "model-portfolios": {
    slug: "model-portfolio-sydney",
    count: 20,
    alt: "Model portfolio image photographed in Sydney by Nick Brand Photography",
  },
  "personal-branding": {
    slug: "personal-branding-photography-sydney",
    count: 2,
    alt: "Personal branding photograph taken in Sydney by Nick Brand Photography",
  },
  "musician-portraits": {
    slug: "musician-portrait-sydney",
    count: 10,
    alt: "Musician portrait photographed in Sydney by Nick Brand Photography",
  },
  "singer-portraits": {
    slug: "singer-portrait-sydney",
    count: 17,
    alt: "Singer portrait photographed in Sydney by Nick Brand Photography",
  },
  "sports-portraits": {
    slug: "sports-portrait-sydney",
    count: 8,
    alt: "Sports portrait photographed in Sydney by Nick Brand Photography",
  },
  "creative-portraits": {
    slug: "creative-portrait-sydney",
    count: 1,
    alt: "Creative portrait photographed in Sydney by Nick Brand Photography",
  },
  family: {
    slug: "family-portrait-sydney",
    count: 18,
    alt: "Family portrait photographed in Sydney by Nick Brand Photography",
  },
};

/**
 * Return an array of images for a silo.
 * @param silo  the silo key
 * @param limit optional cap on number of images
 * @param altOverride optional descriptive alt prefix for stronger context
 */
export function getImages(
  silo: SiloKey,
  limit?: number,
  altOverride?: string,
): SiteImage[] {
  const meta = SILOS[silo];
  const n = limit ? Math.min(limit, meta.count) : meta.count;
  const out: SiteImage[] = [];
  for (let i = 1; i <= n; i++) {
    const num = String(i).padStart(2, "0");
    const base = `/images/${silo}/${meta.slug}-${num}`;
    // Alt text: prefer a descriptive override (e.g. "Corporate headshots in
    // Lane Cove") because it gives search engines and screen readers real
    // context. We intentionally do NOT append "— image N" — that's noise,
    // not signal. When several images in a gallery share alt text it is
    // still better than indexed placeholders.
    out.push({
      src: `${base}.webp`,
      jpg: `${base}.jpg`,
      alt: altOverride
        ? `${altOverride} by Nick Brand Photography`
        : meta.alt,
    });
  }
  return out;
}

/** A single image by silo + index (1-based). */
export function getImage(silo: SiloKey, index = 1, alt?: string): SiteImage {
  return getImages(silo, index, alt)[index - 1];
}

/** Portrait of Nick for the About page. */
export const nickPortrait: SiteImage = {
  src: "/images/about/nick-brand-photographer-sydney.webp",
  jpg: "/images/about/nick-brand-photographer-sydney.jpg",
  alt: "Nick Brand, Sydney corporate and portrait photographer",
};

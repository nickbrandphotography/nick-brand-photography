/**
 * Image library helpers.
 * All photos live in /public/images/<silo>/ as optimised WebP (JPG fallback
 * alongside). Filenames are SEO keyword-rich and sequentially numbered.
 *
 * Every image carries its intrinsic width/height (from lib/image-dimensions)
 * so next/image renders it at its true aspect ratio — full frame, never
 * cropped, and with no layout shift.
 */

import { getDimensions } from "./image-dimensions";

export type SiteImage = {
  src: string; // WebP path
  jpg: string; // JPG fallback path
  alt: string;
  width: number; // intrinsic pixel width
  height: number; // intrinsic pixel height
};

export type SiloKey =
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
    const [width, height] = getDimensions(base);
    // Alt text: prefer a descriptive override (e.g. "Corporate headshots in
    // Lane Cove") because it gives search engines and screen readers real
    // context. We intentionally do NOT append "— image N" — that's noise.
    out.push({
      src: `${base}.webp`,
      jpg: `${base}.jpg`,
      alt: altOverride
        ? `${altOverride} by Nick Brand Photography`
        : meta.alt,
      width,
      height,
    });
  }
  return out;
}

/** A single image by silo + index (1-based). */
export function getImage(silo: SiloKey, index = 1, alt?: string): SiteImage {
  return getImages(silo, index, alt)[index - 1];
}

/**
 * A hand-picked gallery image: an explicit silo + index plus its own unique
 * alt text. Used by lib/galleries.ts to curate which photos appear where
 * (varied people, staggered light/dark backgrounds, no cross-page repeats).
 */
export type GalleryPick = { silo: SiloKey; i: number; alt: string };

/** Build SiteImages from an explicit, curated list of picks. */
export function pickImages(picks: GalleryPick[]): SiteImage[] {
  return picks.map(({ silo, i, alt }) => {
    const meta = SILOS[silo];
    const num = String(i).padStart(2, "0");
    const base = `/images/${silo}/${meta.slug}-${num}`;
    const [width, height] = getDimensions(base);
    return { src: `${base}.webp`, jpg: `${base}.jpg`, alt, width, height };
  });
}

/** Portrait of Nick for the About page and blog author byline. */
const NICK_BASE = "/images/about/nick-brand-photographer-sydney";
const [nickW, nickH] = getDimensions(NICK_BASE);
export const nickPortrait: SiteImage = {
  src: `${NICK_BASE}.webp`,
  jpg: `${NICK_BASE}.jpg`,
  alt: "Nick Brand, Sydney corporate and portrait photographer",
  width: nickW,
  height: nickH,
};

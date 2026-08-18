/**
 * Image library helpers.
 * All photos live in /public/images/<silo>/ as optimised WebP (JPG fallback
 * alongside). Filenames are SEO keyword-rich and sequentially numbered.
 *
 * Every image carries its intrinsic width/height (from lib/image-dimensions)
 * so next/image renders it at its true aspect ratio — full frame, never
 * cropped, and with no layout shift.
 *
 * Silo counts are read from lib/image-dimensions.ts, which is generated from
 * what is actually on disk by `npm run ingest`. They used to be hand-written
 * here, which is how `personal-branding` ended up advertised as a $2,800
 * service backed by two photographs without anyone noticing.
 */

import { getDimensions, getSiloCount } from "./image-dimensions";
import { getAlt } from "./image-alts";

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
  | "corporate-events"
  | "team-headshots"
  | "family";

/**
 * Filename stem and generic fallback description per silo.
 * `slug` must match what scripts/ingest-images.mjs writes for that category.
 */
const SILOS: Record<SiloKey, { slug: string; alt: string }> = {
  "corporate-headshots": {
    slug: "corporate-headshot-sydney",
    alt: "Corporate headshot photographed in Sydney by Nick Brand Photography",
  },
  "actor-headshots": {
    slug: "actor-headshots-sydney",
    alt: "Actor headshot photographed in Sydney by Nick Brand Photography",
  },
  "model-portfolios": {
    slug: "model-portfolio-sydney",
    alt: "Model portfolio image photographed in Sydney by Nick Brand Photography",
  },
  "personal-branding": {
    slug: "personal-branding-photography-sydney",
    alt: "Personal branding photograph taken in Sydney by Nick Brand Photography",
  },
  "musician-portraits": {
    slug: "musician-portrait-sydney",
    alt: "Musician portrait photographed in Sydney by Nick Brand Photography",
  },
  "singer-portraits": {
    slug: "singer-portrait-sydney",
    alt: "Singer portrait photographed in Sydney by Nick Brand Photography",
  },
  "sports-portraits": {
    slug: "sports-portrait-sydney",
    alt: "Sports portrait photographed in Sydney by Nick Brand Photography",
  },
  "creative-portraits": {
    slug: "creative-portrait-sydney",
    alt: "Creative portrait photographed in Sydney by Nick Brand Photography",
  },
  "corporate-events": {
    slug: "corporate-event-photography-sydney",
    alt: "Corporate event photographed in Sydney by Nick Brand Photography",
  },
  "team-headshots": {
    slug: "on-site-team-headshots-sydney",
    alt: "On-site team headshot session photographed in a Sydney office by Nick Brand Photography",
  },
  family: {
    slug: "family-portrait-sydney",
    alt: "Family portrait photographed in Sydney by Nick Brand Photography",
  },
};

/** How many images a silo actually contains right now. */
export function siloCount(silo: SiloKey): number {
  return getSiloCount(silo);
}

/** Build the SiteImage for a silo + 1-based index. */
function build(silo: SiloKey, index: number, altOverride?: string): SiteImage {
  const meta = SILOS[silo];
  const num = String(index).padStart(2, "0");
  const base = `/images/${silo}/${meta.slug}-${num}`;
  const [width, height] = getDimensions(base);
  return {
    src: `${base}.webp`,
    jpg: `${base}.jpg`,
    // Alt text: an explicit override wins, then a real per-image description
    // from lib/image-alts.ts, then the silo's generic line. We intentionally do
    // NOT append "— image N"; that's noise for both search and screen readers.
    alt: altOverride
      ? `${altOverride} by Nick Brand Photography`
      : (getAlt(base) ?? meta.alt),
    width,
    height,
  };
}

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
  const available = siloCount(silo);
  const n = limit ? Math.min(limit, available) : available;
  const out: SiteImage[] = [];
  for (let i = 1; i <= n; i++) out.push(build(silo, i, altOverride));
  return out;
}

/**
 * A single image by silo + index (1-based).
 * Falls back to image 1 if the requested index no longer exists, so a hero
 * reference can't blow up a page after images are reorganised.
 */
export function getImage(silo: SiloKey, index = 1, alt?: string): SiteImage {
  const available = siloCount(silo);
  const safe = available === 0 ? index : Math.min(Math.max(index, 1), available);
  return build(silo, safe, alt);
}

/**
 * A hand-picked gallery image: an explicit silo + index, optionally with its
 * own alt text. Used by lib/galleries.ts to curate which photos appear where
 * (varied people, staggered light/dark backgrounds, no cross-page repeats).
 * Omit `alt` to fall back to lib/image-alts.ts and then the silo default.
 */
export type GalleryPick = { silo: SiloKey; i: number; alt?: string };

/** Build SiteImages from an explicit, curated list of picks. */
export function pickImages(picks: GalleryPick[]): SiteImage[] {
  return picks.map(({ silo, i, alt }) => {
    const img = build(silo, i);
    return alt ? { ...img, alt } : img;
  });
}

/**
 * Every numbered image in a silo, as gallery picks — for silos that are shown
 * whole rather than curated. Returns [] when the silo is empty, which is what
 * lets the corporate events page swap its gallery for an honest note until
 * event photography is actually ingested.
 */
export function siloPicks(silo: SiloKey, limit?: number): GalleryPick[] {
  const n = limit ? Math.min(limit, siloCount(silo)) : siloCount(silo);
  return Array.from({ length: n }, (_, k) => ({ silo, i: k + 1 }));
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

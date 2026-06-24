#!/usr/bin/env node
/**
 * recrop-images.mjs — generate ratio-specific, face-aware crops of every
 * site image so photos stop being decapitated by `object-cover`.
 *
 * WHY: the site shows each image in several fixed-ratio containers (4:5 heroes
 * and galleries, 3:2 homepage cards, 16:9 blog heroes). A single source file
 * can't fit all three, so the browser centre-crops and cuts heads off. This
 * script pre-renders a correctly-framed variant for each ratio a silo needs,
 * using Sharp's `attention` strategy (biases the crop toward faces / high
 * detail). Where attention guesses wrong, a per-image OVERRIDE sets the crop.
 *
 * NON-DESTRUCTIVE: originals are never modified. Variants are written next to
 * them as `<base>-<ratio>.webp` and `<base>-<ratio>.jpg`
 * (e.g. corporate-headshot-sydney-04-3x2.webp).
 *
 * USAGE:
 *   npm run recrop            # generate everything
 *   npm run recrop -- --dry   # list what would be generated, write nothing
 *   npm run recrop -- --silo=family   # one silo only
 *   npm run recrop -- --force # overwrite existing variants
 *
 * After running, wire the variants into lib/images.ts so each slot requests
 * its ratio (see scripts/README-recrop.md).
 */

import sharp from "sharp";
import { readdir, mkdir, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

const SRC_ROOT = path.resolve(process.cwd(), "public", "images");

/** Target ratios → max output box (images are never upscaled past their source). */
const RATIOS = {
  "4x5": { ratio: 4 / 5, maxW: 1200, maxH: 1500 }, // heroes, galleries, about
  "3x2": { ratio: 3 / 2, maxW: 1200, maxH: 800 }, //  homepage service cards
  "16x9": { ratio: 16 / 9, maxW: 1600, maxH: 900 }, // blog post heroes
};

/** Which ratio variants each silo actually needs (from real on-site usage). */
const SILO_RATIOS = {
  "corporate-headshots": ["4x5", "3x2", "16x9"],
  "personal-branding": ["4x5", "3x2", "16x9"],
  "actor-headshots": ["4x5", "3x2", "16x9"], // 16x9 = service-page OG image
  family: ["4x5", "3x2", "16x9"], //              16x9 = service-page OG image
  about: ["4x5"],
};

/**
 * Per-image crop overrides for the cases where `attention` picks the wrong
 * region. Key = "<silo>/<basename-without-extension>". Value = { ratio: gravity }.
 * Gravity is any Sharp position: "north" (top), "south", "centre", "east",
 * "west", or "attention" / "entropy". Pre-populated from the June 2026 image
 * audit — extend as needed.
 */
const OVERRIDES = {
  // Full-length speakers: attention locks onto the belt/hand, so pin to the top.
  "personal-branding/personal-branding-photography-sydney-01": {
    "16x9": "north",
    "3x2": "north",
  },
  "personal-branding/personal-branding-photography-sydney-02": {
    "16x9": "north",
  },
};

/**
 * Images no crop can rescue (panoramas / group shots forced into tall slots).
 * The script still renders a best-effort variant but warns you to swap the
 * source image instead. Key = "<silo>/<basename-without-extension>".
 */
const SWAP_RECOMMENDED = new Set([
  "corporate-headshots/corporate-headshot-sydney-27", // 6-person panorama
  "family/family-portrait-sydney-02", // wide ocean-pool shot
]);

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const FORCE = args.includes("--force");
const siloArg = args.find((a) => a.startsWith("--silo="))?.split("=")[1];

const RATIO_SUFFIX = /-(?:4x5|3x2|16x9)\.(?:webp|jpg|jpeg)$/i;

async function exists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/** Crop one source file to one ratio, writing webp + jpg. Returns a log line. */
async function makeVariant(silo, srcFile, base, ratioKey) {
  const { ratio, maxW, maxH } = RATIOS[ratioKey];
  const key = `${silo}/${base}`;
  const gravity = OVERRIDES[key]?.[ratioKey] ?? sharp.strategy.attention;

  const meta = await sharp(srcFile).metadata();
  // Fit the target box inside the source without upscaling.
  let outW = Math.min(maxW, meta.width);
  let outH = Math.round(outW / ratio);
  if (outH > Math.min(maxH, meta.height)) {
    outH = Math.min(maxH, meta.height);
    outW = Math.round(outH * ratio);
  }

  const outBaseRel = `${silo}/${base}-${ratioKey}`;
  const webpOut = path.join(SRC_ROOT, `${outBaseRel}.webp`);
  const jpgOut = path.join(SRC_ROOT, `${outBaseRel}.jpg`);

  const gravLabel = typeof gravity === "string" ? gravity : "attention";
  const warn = SWAP_RECOMMENDED.has(key) ? "  ⚠ SWAP image (panorama)" : "";
  const line = `  ${base}-${ratioKey}  ${outW}x${outH}  [${gravLabel}]${warn}`;

  if (DRY) return line;
  if (!FORCE && (await exists(webpOut)) && (await exists(jpgOut))) {
    return `  ${base}-${ratioKey}  (exists, skipped)`;
  }

  const pipeline = sharp(srcFile).resize(outW, outH, {
    fit: "cover",
    position: gravity,
  });
  await pipeline
    .clone()
    .webp({ quality: 80 })
    .toFile(webpOut);
  await pipeline
    .clone()
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(jpgOut);
  return line;
}

async function run() {
  const silos = Object.keys(SILO_RATIOS).filter((s) => !siloArg || s === siloArg);
  if (!silos.length) {
    console.error(`No matching silo for --silo=${siloArg}`);
    process.exit(1);
  }

  console.log(
    DRY ? "DRY RUN — nothing will be written\n" : "Generating ratio variants…\n",
  );
  let made = 0;
  const warnings = [];

  for (const silo of silos) {
    const dir = path.join(SRC_ROOT, silo);
    if (!(await exists(dir))) continue;
    const files = (await readdir(dir))
      .filter((f) => /\.(jpe?g)$/i.test(f) && !RATIO_SUFFIX.test(f))
      .sort();
    if (!files.length) continue;

    console.log(`${silo}/`);
    for (const file of files) {
      const base = file.replace(/\.(jpe?g)$/i, "");
      const srcFile = path.join(dir, file);
      for (const ratioKey of SILO_RATIOS[silo]) {
        const line = await makeVariant(silo, srcFile, base, ratioKey);
        console.log(line);
        if (!line.includes("skipped")) made++;
        if (line.includes("SWAP")) warnings.push(`${silo}/${base}`);
      }
    }
    console.log("");
  }

  console.log(
    `${DRY ? "Would generate" : "Generated"} ${made} variant(s) (webp + jpg each).`,
  );
  if (warnings.length) {
    console.log(
      `\n⚠ ${warnings.length} image(s) are wrong-ratio for their slot and should be ` +
        `replaced rather than cropped:\n  - ${[...new Set(warnings)].join("\n  - ")}`,
    );
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

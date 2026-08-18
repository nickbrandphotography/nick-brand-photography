#!/usr/bin/env node
/**
 * ingest-images.mjs — turn a folder of camera originals into web-ready,
 * SEO-named site images, and keep the generated metadata in sync.
 *
 * WHY THIS EXISTS
 * The original 132 photos were processed by hand in an earlier session and the
 * script wasn't kept, which is why adding new work meant editing three files by
 * hand and why `personal-branding` sat at two images for months. This is the
 * missing half of the pipeline: drop originals into a category folder, run one
 * command, and everything downstream updates itself.
 *
 * WHAT IT DOES
 *   1. Reads source-images/<Category>/ and maps each category to a silo.
 *   2. Skips anything already ingested (tracked in public/images/image-manifest.csv).
 *   3. Resizes to a 2000px long edge, writes <slug>-NN.webp + <slug>-NN.jpg.
 *   4. Embeds copyright and creator into the EXIF of the JPGs.
 *   5. Appends to image-manifest.csv.
 *   6. Regenerates lib/image-dimensions.ts (dimensions AND per-silo counts),
 *      so lib/images.ts never needs a hand-edited `count:` again.
 *
 * IMPORTANT — NUMBERING IS APPEND-ONLY.
 * Existing files are never renamed or renumbered, because lib/galleries.ts
 * references images by index. New photos continue from the highest number
 * already in the silo.
 *
 * USAGE
 *   npm run ingest                 # process every category
 *   npm run ingest -- --dry        # report what would happen, write nothing
 *   npm run ingest -- --cat=Events # one category only
 *   npm run ingest -- --thumbs     # also write 480px contact sheets to
 *                                  # .image-review/ for writing alt text
 *
 * AFTER RUNNING
 *   - Add alt text for the new images in lib/image-alts.ts (keyed by the
 *     public path without extension). Until then they fall back to the silo's
 *     generic description, which works but wastes the Google Images value.
 *   - Run `npm run build` and check the new galleries look right.
 */

import sharp from "sharp";
import { readdir, mkdir, writeFile, readFile, access, stat } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC_ROOT = path.join(ROOT, "source-images");
const OUT_ROOT = path.join(ROOT, "public", "images");
const MANIFEST = path.join(OUT_ROOT, "image-manifest.csv");
const DIMENSIONS_FILE = path.join(ROOT, "lib", "image-dimensions.ts");
const REVIEW_DIR = path.join(ROOT, ".image-review");

const MAX_EDGE = 2000;
const COPYRIGHT = "© Nick Brand Photography";
const CREATOR = "Nick Brand";

/**
 * source-images/<folder> → the silo it feeds and the SEO filename stem.
 *
 * To add a category: create the folder, add a line here, run the script.
 * The `slug` becomes the filename, so keep it descriptive and human — these
 * strings are read by Google Images.
 */
const CATEGORIES = {
  // Existing
  Corporate: { silo: "corporate-headshots", slug: "corporate-headshot-sydney" },
  Actor: { silo: "actor-headshots", slug: "actor-headshots-sydney" },
  Model: { silo: "model-portfolios", slug: "model-portfolio-sydney" },
  Musician: { silo: "musician-portraits", slug: "musician-portrait-sydney" },
  Singer: { silo: "singer-portraits", slug: "singer-portrait-sydney" },
  Family: { silo: "family", slug: "family-portrait-sydney" },
  "Sports portraits": { silo: "sports-portraits", slug: "sports-portrait-sydney" },
  Writer: { silo: "creative-portraits", slug: "creative-portrait-sydney" },
  Presenter: {
    silo: "personal-branding",
    slug: "personal-branding-photography-sydney",
  },

  // New — drop files in and run the script.
  Branding: {
    silo: "personal-branding",
    slug: "personal-branding-photography-sydney",
  },
  Events: {
    silo: "corporate-events",
    slug: "corporate-event-photography-sydney",
  },
  Team: {
    silo: "team-headshots",
    slug: "on-site-team-headshots-sydney",
  },
};

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const THUMBS = args.includes("--thumbs");
const catArg = args.find((a) => a.startsWith("--cat="))?.split("=")[1];

const IMAGE_RE = /\.(jpe?g|png|tiff?|webp)$/i;
const RATIO_SUFFIX = /-(?:4x5|3x2|16x9)$/i;

async function exists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function readManifest() {
  if (!(await exists(MANIFEST))) {
    return {
      header:
        "silo,original,new_basename,orig_dimensions,web_dimensions,orig_KB,webp_KB,jpg_KB,public_path",
      rows: [],
    };
  }
  const text = await readFile(MANIFEST, "utf8");
  const lines = text.trim().split(/\r?\n/);
  return { header: lines[0], rows: lines.slice(1).filter(Boolean) };
}

/** Highest NN already used in a silo, so numbering continues rather than collides. */
async function highestIndex(silo, slug) {
  const dir = path.join(OUT_ROOT, silo);
  if (!(await exists(dir))) return 0;
  const files = await readdir(dir);
  let max = 0;
  const re = new RegExp(`^${slug}-(\\d+)\\.(webp|jpg)$`, "i");
  for (const f of files) {
    const m = f.match(re);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max;
}

async function processOne(srcFile, silo, slug, index) {
  const num = String(index).padStart(2, "0");
  const base = `${slug}-${num}`;
  const outDir = path.join(OUT_ROOT, silo);
  const webpOut = path.join(outDir, `${base}.webp`);
  const jpgOut = path.join(outDir, `${base}.jpg`);

  const input = sharp(srcFile, { failOn: "none" }).rotate(); // honour EXIF orientation
  const meta = await input.metadata();

  // Never upscale. Fit the long edge to MAX_EDGE.
  const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);
  const scale = longEdge > MAX_EDGE ? MAX_EDGE / longEdge : 1;
  const outW = Math.round((meta.width ?? 0) * scale);
  const outH = Math.round((meta.height ?? 0) * scale);

  if (DRY) {
    return {
      base,
      line: `  ${path.basename(srcFile)}  →  ${base}  (${meta.width}x${meta.height} → ${outW}x${outH})`,
      dims: [outW, outH],
      row: null,
    };
  }

  await mkdir(outDir, { recursive: true });

  const resized = sharp(srcFile, { failOn: "none" })
    .rotate()
    .resize(outW, outH, { fit: "inside", withoutEnlargement: true });

  await resized.clone().webp({ quality: 80 }).toFile(webpOut);

  // EXIF creator/copyright on the JPG. This is the metadata Google reads for
  // image rights, and it reinforces the ImageObject schema the site already
  // emits. Deliberately no GPS — these are portraits of private individuals.
  await resized
    .clone()
    .withMetadata({
      exif: {
        IFD0: {
          Copyright: COPYRIGHT,
          Artist: CREATOR,
          ImageDescription: `${CREATOR} — Sydney photographer`,
        },
      },
    })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(jpgOut);

  if (THUMBS) {
    const reviewDir = path.join(REVIEW_DIR, silo);
    await mkdir(reviewDir, { recursive: true });
    await sharp(srcFile, { failOn: "none" })
      .rotate()
      .resize(480, 480, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 70 })
      .toFile(path.join(reviewDir, `${base}.jpg`));
  }

  const [origKB, webpKB, jpgKB] = await Promise.all([
    stat(srcFile).then((s) => Math.round(s.size / 1024)),
    stat(webpOut).then((s) => Math.round(s.size / 1024)),
    stat(jpgOut).then((s) => Math.round(s.size / 1024)),
  ]);

  return {
    base,
    dims: [outW, outH],
    line: `  ${path.basename(srcFile)}  →  ${base}  (${outW}x${outH}, ${webpKB}KB webp / ${jpgKB}KB jpg)`,
    row: [
      silo,
      path.basename(srcFile).replace(/,/g, " "),
      base,
      `${meta.width}x${meta.height}`,
      `${outW}x${outH}`,
      origKB,
      webpKB,
      jpgKB,
      `/images/${silo}/${base}.webp`,
    ].join(","),
  };
}

/** Rebuild lib/image-dimensions.ts from what is actually on disk. */
async function regenerateDimensions() {
  const silos = (await readdir(OUT_ROOT, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const dims = [];
  const counts = {};

  for (const silo of silos) {
    const dir = path.join(OUT_ROOT, silo);
    const files = (await readdir(dir))
      .filter((f) => /\.webp$/i.test(f))
      .map((f) => f.replace(/\.webp$/i, ""))
      .filter((b) => !RATIO_SUFFIX.test(b))
      .sort();

    let n = 0;
    for (const base of files) {
      const meta = await sharp(path.join(dir, `${base}.webp`)).metadata();
      dims.push([`/images/${silo}/${base}`, [meta.width, meta.height]]);
      if (/-\d+$/.test(base)) n++;
    }
    counts[silo] = n;
  }

  const body = `/**
 * GENERATED FILE — do not edit by hand.
 * Run \`npm run ingest\` to regenerate after adding or replacing images.
 *
 * Holds two things read from the actual contents of /public/images:
 *   - intrinsic pixel dimensions, so next/image renders every photo at its true
 *     aspect ratio (no cropping, no layout shift);
 *   - how many numbered images each silo contains, so lib/images.ts never has a
 *     hand-maintained \`count:\` that can drift from reality.
 */

export const imageDimensions: Record<string, [number, number]> = {
${dims.map(([k, [w, h]]) => `  "${k}": [${w}, ${h}],`).join("\n")}
};

/** Number of sequentially-numbered images present in each silo. */
export const siloCounts: Record<string, number> = {
${Object.entries(counts)
  .map(([k, v]) => `  "${k}": ${v},`)
  .join("\n")}
};

/** Look up intrinsic [width, height] for an image path (no extension). */
export function getDimensions(pathNoExt: string): [number, number] {
  return imageDimensions[pathNoExt] ?? [2000, 2000];
}

/** How many images a silo actually has on disk. */
export function getSiloCount(silo: string): number {
  return siloCounts[silo] ?? 0;
}
`;

  if (DRY) {
    console.log(
      `\nWould regenerate lib/image-dimensions.ts (${dims.length} images across ${silos.length} silos)`,
    );
    console.log(
      "  counts: " +
        Object.entries(counts)
          .map(([k, v]) => `${k}=${v}`)
          .join(", "),
    );
    return;
  }
  await writeFile(DIMENSIONS_FILE, body, "utf8");
  console.log(
    `\nRegenerated lib/image-dimensions.ts — ${dims.length} images across ${silos.length} silos.`,
  );
  console.log(
    "  counts: " +
      Object.entries(counts)
        .map(([k, v]) => `${k}=${v}`)
        .join(", "),
  );
}

async function run() {
  if (!(await exists(SRC_ROOT))) {
    console.error(`No source-images/ folder at ${SRC_ROOT}`);
    process.exit(1);
  }

  const manifest = await readManifest();
  // Already-ingested originals, keyed "<silo>|<original filename>".
  const already = new Set(
    manifest.rows.map((r) => {
      const c = r.split(",");
      return `${c[0]}|${c[1]}`;
    }),
  );

  const categories = Object.keys(CATEGORIES).filter(
    (c) => !catArg || c.toLowerCase() === catArg.toLowerCase(),
  );
  if (!categories.length) {
    console.error(
      `Unknown category "${catArg}". Known: ${Object.keys(CATEGORIES).join(", ")}`,
    );
    process.exit(1);
  }

  console.log(DRY ? "DRY RUN — nothing will be written\n" : "Ingesting images…\n");

  const newRows = [];
  let total = 0;

  for (const cat of categories) {
    const { silo, slug } = CATEGORIES[cat];
    const dir = path.join(SRC_ROOT, cat);
    if (!(await exists(dir))) continue;

    const files = (await readdir(dir))
      .filter((f) => IMAGE_RE.test(f) && !f.startsWith("."))
      .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

    const pending = files.filter((f) => !already.has(`${silo}|${f}`));
    if (!pending.length) {
      if (files.length) console.log(`${cat}/ → ${silo}: nothing new (${files.length} already ingested)`);
      continue;
    }

    let index = await highestIndex(silo, slug);
    console.log(`${cat}/ → ${silo}/  (continuing from ${String(index).padStart(2, "0")})`);

    for (const file of pending) {
      index++;
      const res = await processOne(path.join(dir, file), silo, slug, index);
      console.log(res.line);
      if (res.row) newRows.push(res.row);
      total++;
    }
    console.log("");
  }

  if (!total) {
    console.log("No new images found.\n");
  } else if (!DRY) {
    await writeFile(
      MANIFEST,
      [manifest.header, ...manifest.rows, ...newRows].join("\n") + "\n",
      "utf8",
    );
    console.log(`Added ${total} image(s) to the manifest.`);
  } else {
    console.log(`Would add ${total} image(s).`);
  }

  await regenerateDimensions();

  if (total && !DRY) {
    console.log(
      "\nNEXT: add alt text for the new images in lib/image-alts.ts, then run `npm run build`.",
    );
    if (THUMBS) {
      console.log(`Contact sheets for writing alt text: ${REVIEW_DIR}`);
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

/**
 * Per-image alt text, keyed by public path without extension.
 *
 * WHY THIS FILE EXISTS
 * Alt text used to live hardcoded inside lib/galleries.ts, next to each curated
 * pick. That works, but it means alt text only exists for images someone has
 * hand-placed in a gallery — and it made adding a batch of new photos a manual
 * job in two files. Keying it by path instead lets any image carry a real
 * description wherever it appears.
 *
 * HOW ALT TEXT IS RESOLVED (see lib/images.ts)
 *   1. an explicit `alt` on a GalleryPick, if given
 *   2. this map
 *   3. the silo's generic fallback (e.g. "Corporate headshot photographed in
 *      Sydney by Nick Brand Photography")
 *
 * HOW TO WRITE IT
 * Describe what is actually in the frame, plainly, as you would to someone on
 * the phone. Include Sydney or a real location only when it is genuinely true
 * of that photograph — the site previously carried alt text describing "guests
 * in formal dress at a Sydney corporate function" on files that were studio
 * headshots, which is the exact mistake to avoid.
 *
 * Do NOT keyword-stuff. "Corporate headshot Sydney corporate headshots Sydney
 * photographer" is worse than useless: it reads as spam to Google and it is
 * useless to a screen-reader user, who is the person alt text is actually for.
 *
 * Good:  "Corporate headshot of a woman in a black blazer on a white background"
 * Good:  "Photographer setting up a mobile studio in an office meeting room"
 * Bad:   "Sydney corporate headshots professional business photography Sydney"
 * Bad:   "Image 14"
 *
 * Generate contact sheets to write from with:  npm run ingest -- --thumbs
 */

export const imageAlts: Record<string, string> = {
  // Populated as new photography is ingested. Existing curated gallery picks
  // still carry their own alt text inline in lib/galleries.ts.
};

/** Alt text for an image path (no extension), or undefined to fall back. */
export function getAlt(pathNoExt: string): string | undefined {
  return imageAlts[pathNoExt];
}

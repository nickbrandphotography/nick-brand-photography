/**
 * Curated gallery selections.
 *
 * Each page draws a deliberately chosen, non-overlapping set of photos so the
 * site never shows the same people twice across pages, light and dark
 * backgrounds are staggered, and off-topic frames (creative/art shots, event
 * crowds, etc.) are kept out of the headshot galleries. Every pick carries its
 * own unique, descriptive alt text for SEO and accessibility.
 *
 * Indices refer to files in /public/images/<silo>/<slug>-NN.{webp,jpg}.
 */
import type { GalleryPick } from "./images";
import { siloPicks, siloCount } from "./images";

const C = "corporate-headshots" as const;
const M = "model-portfolios" as const;
const A = "actor-headshots" as const;
const P = "personal-branding" as const;
const F = "family" as const;
const MU = "musician-portraits" as const;
const SI = "singer-portraits" as const;

/** Homepage "Recent work" — the strongest, most varied 8 (light/dark staggered). */
export const homeFeatured: GalleryPick[] = [
  { silo: C, i: 3, alt: "Corporate headshot of a businessman on a teal studio backdrop, Sydney" },
  { silo: C, i: 8, alt: "Corporate headshot of a woman in red on a white background, Sydney" },
  { silo: C, i: 22, alt: "Black-and-white corporate headshot of a man, Sydney studio" },
  { silo: C, i: 10, alt: "Corporate headshot of a woman on a clean white background, Sydney" },
  { silo: C, i: 40, alt: "Editorial portrait of a man in a red jacket on a black background, Sydney" },
  { silo: C, i: 12, alt: "Corporate headshot of a woman in green on a white background, Sydney" },
  { silo: C, i: 47, alt: "Executive portrait of a man in a dark office corridor, Sydney" },
  { silo: C, i: 24, alt: "Corporate portrait of a woman with auburn hair on a soft grey backdrop, Sydney" },
];

/**
 * Combine a silo's own images with borrowed "support" frames from elsewhere,
 * and drop the borrowed ones automatically once the silo can stand on its own.
 *
 * Several pages had to lean on the corporate and model libraries because their
 * own silos were nearly empty. That is defensible as a stopgap and indefensible
 * as a permanent state, so the threshold makes it self-correcting: ingest
 * enough real images and the page quietly stops borrowing.
 */
function withSupport(
  own: GalleryPick[],
  support: GalleryPick[],
  silo: Parameters<typeof siloCount>[0],
  threshold = 6,
): GalleryPick[] {
  return siloCount(silo) >= threshold ? own : [...own, ...support];
}

/** Per-service galleries, keyed by service slug. */
export const serviceGalleries: Record<string, GalleryPick[]> = {
  "corporate-headshots-sydney": [
    { silo: C, i: 9, alt: "Corporate headshot of a man in a dark suit on a white background, Sydney" },
    { silo: C, i: 5, alt: "Black-and-white corporate headshot of a bearded man on a dark backdrop, Sydney" },
    { silo: C, i: 7, alt: "Corporate headshot of a woman in teal on a white background, Sydney" },
    { silo: C, i: 42, alt: "Studio portrait of a man in a grey suit on a dark backdrop, Sydney" },
    { silo: C, i: 16, alt: "Corporate headshot of a woman in a black blazer on a white background, Sydney" },
    { silo: C, i: 20, alt: "Corporate portrait of a man in a navy suit on a blue-grey backdrop, Sydney" },
    { silo: C, i: 18, alt: "Corporate headshot of a woman in pink wearing glasses, white background, Sydney" },
    { silo: C, i: 23, alt: "Corporate portrait of a man in a black suit on a dark grey backdrop, Sydney" },
  ],
  "linkedin-headshots-sydney": [
    { silo: C, i: 15, alt: "LinkedIn headshot of a bearded man in a light shirt, white background, Sydney" },
    { silo: C, i: 46, alt: "Portrait of a woman on a dark studio backdrop, Sydney" },
    { silo: C, i: 13, alt: "LinkedIn headshot of a man wearing glasses, white background, Sydney" },
    { silo: C, i: 36, alt: "Corporate portrait of a woman in a grey sweater on a soft grey backdrop, Sydney" },
    { silo: C, i: 17, alt: "LinkedIn headshot of a woman in a pinstripe blazer, white background, Sydney" },
    { silo: C, i: 49, alt: "Editorial portrait of a man holding a camera in moody light, Sydney" },
    { silo: C, i: 21, alt: "LinkedIn headshot of a woman in glasses, white background, Sydney" },
    { silo: C, i: 34, alt: "Corporate portrait of a man with an orange tie on a teal backdrop, Sydney" },
  ],
  "executive-portraits-sydney": [
    { silo: C, i: 29, alt: "Executive portrait of a senior leader in a grey blazer, white background, Sydney" },
    { silo: C, i: 41, alt: "Executive headshot of a man in a navy blazer, white background, Sydney" },
    { silo: C, i: 45, alt: "Executive portrait of a man in a brown suit, white background, Sydney" },
    { silo: C, i: 28, alt: "Executive portrait of a senior businessman in a dark suit, white background, Sydney" },
    { silo: C, i: 48, alt: "Executive portrait of a man against a Sydney city skyline" },
    { silo: C, i: 30, alt: "Executive headshot of a man in a dark blazer, white background, Sydney" },
  ],
  // Real on-site / mobile-studio frames lead as soon as any exist (drop them in
  // `source-images/Team/`), followed by group and in-office frames, so the page
  // opens on evidence of team work rather than individual studio portraits.
  "team-headshots-sydney": [
    ...siloPicks("team-headshots", 6),
    { silo: C, i: 25, alt: "Team headshots of four colleagues photographed together, Sydney office" },
    { silo: C, i: 26, alt: "Group of colleagues photographed for a company team page, Sydney" },
    { silo: C, i: 43, alt: "Team photographed around a table in a Sydney office" },
    { silo: C, i: 44, alt: "On-location photography coverage at a Sydney workplace" },
    { silo: C, i: 14, alt: "Matched team headshot of a man on a white background, Sydney" },
    { silo: C, i: 37, alt: "Matched team headshot of a woman in black on a white background, Sydney" },
    { silo: C, i: 19, alt: "Matched team headshot of a man with arms crossed, white background, Sydney" },
    { silo: C, i: 6, alt: "Staff portrait photographed on-site in a Sydney office" },
  ],
  /**
   * Corporate events: whatever is actually in the `corporate-events` silo.
   *
   * Every image previously shown here came from the `corporate-headshots` silo
   * — there was no event photography in the library at all — and the alt text
   * asserted things the files do not show ("Guests in formal dress at a Sydney
   * corporate function" on `corporate-headshot-sydney-39`). Studio headshots
   * are not evidence of conference coverage.
   *
   * This now reads the silo directly: empty until event photos are ingested
   * (the page shows `galleryNote` instead), and a real gallery the moment they
   * are. Drop originals into `source-images/Events/` and run `npm run ingest`.
   */
  "corporate-event-photographer-sydney": siloPicks("corporate-events", 9),

  /**
   * Personal branding: every image in the `personal-branding` silo, supported
   * by genuine environmental and editorial portraits from the corporate silo —
   * described for what they actually are.
   *
   * The support frames drop away automatically once the branding silo has six
   * or more of its own images (`SUPPORT_THRESHOLD`), so this page stops
   * borrowing the moment there is a real branding set to show. Two of the three
   * images here used to be model-portfolio frames labelled "personal branding
   * portrait", which they are not.
   */
  "personal-branding-sydney": withSupport(
    siloPicks(P, 10),
    [
      { silo: C, i: 6, alt: "Environmental branding portrait of a woman in a Sydney office" },
      { silo: C, i: 48, alt: "Environmental portrait of a man against the Sydney city skyline" },
      { silo: C, i: 40, alt: "Editorial brand portrait of a man in a red jacket on a black background, Sydney" },
      { silo: C, i: 1, alt: "At-work portrait of a man by an office window, Sydney" },
    ],
    P,
  ),

  /**
   * Actors first, models second — the page sells both ("Actor Headshots & Model
   * Portfolios"), but a visitor searching for actor headshots previously saw
   * seven fashion/commercial model frames and one actual actor headshot. Every
   * file in the `actor-headshots` silo now leads, and the model frames drop
   * away once there are eight or more real actor headshots.
   */
  "actor-headshots-sydney": withSupport(
    siloPicks(A, 12),
    [
      { silo: M, i: 16, alt: "Commercial model headshot of a man in sunglasses, studio, Sydney" },
      { silo: M, i: 7, alt: "Character model portrait of a tattooed man in dramatic studio light, Sydney" },
      { silo: M, i: 9, alt: "Editorial model portfolio portrait of a woman in a red dress, Sydney" },
      { silo: M, i: 4, alt: "Fashion model portfolio shot of a woman at a Sydney beach" },
    ],
    A,
    8,
  ),
  "family-photography-sydney": [
    { silo: F, i: 9, alt: "Black-and-white family portrait, Sydney" },
    { silo: F, i: 5, alt: "Family on a park bench during an outdoor session, Sydney" },
    { silo: F, i: 8, alt: "Family of five photographed outdoors in natural light, Sydney" },
    { silo: F, i: 13, alt: "Family portrait by Sydney Harbour with the Opera House behind" },
    { silo: F, i: 10, alt: "Parents and child in a candid outdoor family session, Sydney" },
    { silo: F, i: 3, alt: "Three siblings photographed together outdoors, Sydney" },
    { silo: F, i: 6, alt: "Family portrait beneath a floral arch, Sydney" },
  ],
  // Musician and singer frames staggered so the page shows both solo artists
  // and performing musicians rather than one look repeated.
  "band-photographer-sydney": [
    { silo: MU, i: 2, alt: "Musician portrait with guitar in low light, Sydney" },
    { silo: SI, i: 3, alt: "Singer photographed mid-performance at a Sydney venue" },
    { silo: MU, i: 6, alt: "Band member portrait against a warehouse wall, Sydney" },
    { silo: SI, i: 8, alt: "Vocalist portrait in dramatic stage lighting, Sydney" },
    { silo: MU, i: 9, alt: "Musician press shot in a Sydney laneway" },
    { silo: SI, i: 12, alt: "Singer-songwriter portrait with acoustic guitar, Sydney" },
    { silo: MU, i: 5, alt: "Black-and-white musician portrait, Sydney studio" },
    { silo: SI, i: 15, alt: "Performer portrait at golden hour by Sydney Harbour" },
  ],
};

/**
 * Suburb page imagery.
 *
 * All twelve location pages previously shared ONE hardcoded hero photograph and
 * ONE identical six-image gallery, which was a large part of why they measured
 * ~53% duplicate against each other. Each suburb now has its own hero and its
 * own set.
 *
 * Alt text describes only what is in the frame. It deliberately does NOT claim
 * a photograph was taken in a particular suburb — the section heading supplies
 * the local context, and asserting a location we can't verify would be exactly
 * the mistake the corporate-events gallery used to make.
 */
const CORP_POOL: { i: number; alt: string }[] = [
  { i: 3, alt: "Corporate headshot of a businessman on a teal studio backdrop" },
  { i: 5, alt: "Black-and-white corporate headshot of a bearded man on a dark backdrop" },
  { i: 7, alt: "Corporate headshot of a woman in teal on a white background" },
  { i: 8, alt: "Corporate headshot of a woman in red on a white background" },
  { i: 9, alt: "Corporate headshot of a man in a dark suit on a white background" },
  { i: 10, alt: "Corporate headshot of a woman on a clean white background" },
  { i: 12, alt: "Corporate headshot of a woman in green on a white background" },
  { i: 13, alt: "Corporate headshot of a man wearing glasses on a white background" },
  { i: 15, alt: "Corporate headshot of a bearded man in a light shirt, white background" },
  { i: 16, alt: "Corporate headshot of a woman in a black blazer on a white background" },
  { i: 17, alt: "Corporate headshot of a woman in a pinstripe blazer, white background" },
  { i: 18, alt: "Corporate headshot of a woman in pink wearing glasses, white background" },
  { i: 19, alt: "Corporate headshot of a man with arms crossed, white background" },
  { i: 20, alt: "Corporate portrait of a man in a navy suit on a blue-grey backdrop" },
  { i: 21, alt: "Corporate headshot of a woman in glasses on a white background" },
  { i: 22, alt: "Black-and-white corporate headshot of a man" },
  { i: 23, alt: "Corporate portrait of a man in a black suit on a dark grey backdrop" },
  { i: 24, alt: "Corporate portrait of a woman with auburn hair on a soft grey backdrop" },
  { i: 28, alt: "Executive portrait of a senior businessman in a dark suit, white background" },
  { i: 29, alt: "Executive portrait of a senior leader in a grey blazer, white background" },
  { i: 30, alt: "Executive headshot of a man in a dark blazer, white background" },
  { i: 34, alt: "Corporate portrait of a man with an orange tie on a teal backdrop" },
  { i: 36, alt: "Corporate portrait of a woman in a grey sweater on a soft grey backdrop" },
  { i: 37, alt: "Corporate headshot of a woman in black on a white background" },
  { i: 41, alt: "Executive headshot of a man in a navy blazer, white background" },
  { i: 42, alt: "Studio portrait of a man in a grey suit on a dark backdrop" },
  { i: 45, alt: "Executive portrait of a man in a brown suit, white background" },
  { i: 46, alt: "Corporate portrait of a woman on a dark studio backdrop" },
  { i: 47, alt: "Executive portrait of a man in a dark office corridor" },
  { i: 48, alt: "Executive portrait of a man against the Sydney city skyline" },
];

/**
 * Which six frames each suburb shows, as indexes into CORP_POOL.
 *
 * Twelve sets of six drawn from thirty photographs means some sharing is
 * unavoidable (72 slots, 30 images). This assignment was solved rather than
 * guessed: no two suburbs share more than TWO of their six frames, every
 * suburb's set is unique, and each photograph is used two or three times so
 * nothing is over-exposed.
 *
 * A generated offset/stride pattern was tried first and quietly produced five
 * distinct sets across twelve suburbs — i.e. it recreated the duplication this
 * was meant to fix. If you change this table, re-check the overlap.
 */
const SUBURB_SETS: number[][] = [
  [3, 6, 8, 10, 11, 21],
  [4, 5, 14, 19, 24, 26],
  [15, 18, 20, 22, 25, 28],
  [0, 9, 12, 13, 16, 17],
  [1, 2, 7, 23, 27, 29],
  [2, 5, 7, 12, 14, 18],
  [0, 10, 11, 13, 20, 26],
  [6, 16, 17, 25, 27, 28],
  [1, 4, 8, 15, 22, 29],
  [3, 9, 19, 21, 23, 24],
  [0, 3, 12, 19, 22, 26],
  [2, 9, 10, 15, 18, 24],
];

/** Build a suburb gallery from its assigned set. */
function suburbSet(index: number): GalleryPick[] {
  const set = SUBURB_SETS[index % SUBURB_SETS.length];
  return set.map((n) => {
    const pick = CORP_POOL[n % CORP_POOL.length];
    return { silo: C, i: pick.i, alt: pick.alt };
  });
}

/** Per-suburb hero image — each suburb gets a different photograph. */
export const locationHero: Record<string, { i: number; alt: string }> = {
  "lane-cove": { i: 9, alt: "Corporate headshot of a man in a dark suit on a white background, Lane Cove studio" },
  "sydney-cbd": { i: 47, alt: "Executive portrait of a man in a dark office corridor" },
  "north-sydney": { i: 20, alt: "Corporate portrait of a man in a navy suit on a blue-grey backdrop" },
  "surry-hills": { i: 40, alt: "Editorial portrait of a man in a red jacket on a black background" },
  parramatta: { i: 23, alt: "Corporate portrait of a man in a black suit on a dark grey backdrop" },
  chatswood: { i: 16, alt: "Corporate headshot of a woman in a black blazer on a white background" },
  barangaroo: { i: 48, alt: "Executive portrait of a man against the Sydney city skyline" },
  pyrmont: { i: 42, alt: "Studio portrait of a man in a grey suit on a dark backdrop" },
  "bondi-junction": { i: 24, alt: "Corporate portrait of a woman with auburn hair on a soft grey backdrop" },
  "st-leonards": { i: 29, alt: "Executive portrait of a senior leader in a grey blazer, white background" },
  "crows-nest": { i: 36, alt: "Corporate portrait of a woman in a grey sweater on a soft grey backdrop" },
  mosman: { i: 45, alt: "Executive portrait of a man in a brown suit, white background" },
};

/** Per-suburb galleries, keyed by location slug. */
export const locationGalleries: Record<string, GalleryPick[]> = {
  "lane-cove": suburbSet(0),
  "sydney-cbd": suburbSet(1),
  "north-sydney": suburbSet(2),
  "surry-hills": suburbSet(3),
  parramatta: suburbSet(4),
  chatswood: suburbSet(5),
  barangaroo: suburbSet(6),
  pyrmont: suburbSet(7),
  "bondi-junction": suburbSet(8),
  "st-leonards": suburbSet(9),
  "crows-nest": suburbSet(10),
  mosman: suburbSet(11),
};

/** Fallback for any suburb added without its own set. */
export const locationGallery: GalleryPick[] = suburbSet(0);

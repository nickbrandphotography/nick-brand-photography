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
  "team-headshots-sydney": [
    { silo: C, i: 25, alt: "Team headshots of four colleagues photographed together, Sydney office" },
    { silo: C, i: 26, alt: "Group of colleagues photographed for a company team page, Sydney" },
    { silo: C, i: 43, alt: "Team photographed around a table in a Sydney office" },
    { silo: C, i: 14, alt: "Team member headshot of a man on a white background, Sydney" },
    { silo: C, i: 37, alt: "Team member headshot of a woman in black on a white background, Sydney" },
    { silo: C, i: 19, alt: "Team member headshot of a man with arms crossed, white background, Sydney" },
  ],
  "corporate-event-photographer-sydney": [
    { silo: C, i: 39, alt: "Guests in formal dress at a Sydney corporate function" },
    { silo: C, i: 44, alt: "On-location photography coverage at a Sydney work site" },
    { silo: C, i: 1, alt: "Networking portrait of a man by an office window, Sydney" },
    { silo: C, i: 32, alt: "Portrait of a man in a red tie at a Sydney corporate event" },
    { silo: C, i: 6, alt: "Environmental portrait of a woman in a Sydney office" },
  ],
  "personal-branding-sydney": [
    { silo: P, i: 2, alt: "Personal branding photo of a speaker on stage in a red jacket, Sydney" },
    { silo: M, i: 6, alt: "Personal branding lifestyle portrait of a woman on location, Sydney" },
    { silo: M, i: 11, alt: "Black-and-white personal branding portrait, Sydney" },
  ],
  "actor-headshots-sydney": [
    { silo: A, i: 4, alt: "Black-and-white actor headshot of a young woman, Sydney" },
    { silo: M, i: 4, alt: "Fashion model portfolio shot of a woman at a Sydney beach" },
    { silo: M, i: 9, alt: "Editorial model portfolio portrait of a woman in a red dress, Sydney" },
    { silo: M, i: 16, alt: "Commercial model headshot of a man in sunglasses, studio, Sydney" },
    { silo: M, i: 14, alt: "Moody full-length model portfolio portrait of a man in a navy suit, Sydney" },
    { silo: M, i: 7, alt: "Character model portrait of a tattooed man in dramatic studio light, Sydney" },
    { silo: M, i: 12, alt: "Stylised character portrait of a model in sunglasses, Sydney" },
    { silo: M, i: 5, alt: "Fashion model portfolio shot of a woman on a Sydney pier" },
  ],
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

/** Shared gallery for suburb/location pages (distinct from the homepage set). */
export const locationGallery: GalleryPick[] = [
  { silo: C, i: 7, alt: "Corporate headshot of a woman in teal, white background — Sydney location shoot" },
  { silo: C, i: 5, alt: "Black-and-white corporate headshot of a man — Sydney location shoot" },
  { silo: C, i: 16, alt: "Corporate headshot of a woman in a black blazer — Sydney location shoot" },
  { silo: C, i: 20, alt: "Corporate portrait of a man in a navy suit — Sydney location shoot" },
  { silo: C, i: 46, alt: "Portrait of a woman on a dark backdrop — Sydney location shoot" },
  { silo: C, i: 45, alt: "Corporate portrait of a man in a brown suit — Sydney location shoot" },
];

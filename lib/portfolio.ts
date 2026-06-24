/**
 * Portfolio page data.
 *
 * The /portfolio route groups Nick's work into categories, each with a curated,
 * non-repeating set of photos and unique, descriptive alt text (subject + setup
 * + "Sydney"). Most categories link through to the matching service page so the
 * portfolio feeds Nick's commercial pages rather than being a dead end.
 *
 * Indices refer to files in /public/images/<silo>/<slug>-NN.{webp,jpg}.
 */
import type { GalleryPick, SiloKey } from "./images";

export type PortfolioCategory = {
  key: string;
  title: string;
  blurb: string;
  /** Matching service page, when one exists. */
  serviceSlug?: string;
  serviceLabel?: string;
  picks: GalleryPick[];
};

const C: SiloKey = "corporate-headshots";
const M: SiloKey = "model-portfolios";
const A: SiloKey = "actor-headshots";
const P: SiloKey = "personal-branding";
const F: SiloKey = "family";
const MU: SiloKey = "musician-portraits";
const SI: SiloKey = "singer-portraits";
const SP: SiloKey = "sports-portraits";

export const portfolioCategories: PortfolioCategory[] = [
  {
    key: "corporate-headshots",
    title: "Corporate Headshots",
    blurb:
      "Clean, consistent headshots for Sydney professionals and teams — built to look credible on a company website, a tender or LinkedIn.",
    serviceSlug: "corporate-headshots-sydney",
    serviceLabel: "Corporate Headshots",
    picks: [
      { silo: C, i: 3, alt: "Corporate headshot of a businessman on a teal studio backdrop, Sydney" },
      { silo: C, i: 8, alt: "Corporate headshot of a woman in red on a white background, Sydney" },
      { silo: C, i: 9, alt: "Corporate headshot of a man in a dark suit on a white background, Sydney" },
      { silo: C, i: 10, alt: "Corporate headshot of a woman on a clean white background, Sydney" },
      { silo: C, i: 7, alt: "Corporate headshot of a woman in teal on a white background, Sydney" },
      { silo: C, i: 22, alt: "Black-and-white corporate headshot of a man, Sydney studio" },
      { silo: C, i: 16, alt: "Corporate headshot of a woman in a black blazer on a white background, Sydney" },
      { silo: C, i: 24, alt: "Corporate portrait of a woman with auburn hair on a soft grey backdrop, Sydney" },
    ],
  },
  {
    key: "executive-portraits",
    title: "Executive Portraits",
    blurb:
      "Considered, authoritative portraits for senior leaders, partners and boards — for annual reports, leadership pages and press.",
    serviceSlug: "executive-portraits-sydney",
    serviceLabel: "Executive Portraits",
    picks: [
      { silo: C, i: 29, alt: "Executive portrait of a senior leader in a grey blazer, white background, Sydney" },
      { silo: C, i: 41, alt: "Executive headshot of a man in a navy blazer, white background, Sydney" },
      { silo: C, i: 48, alt: "Executive portrait of a man against a Sydney city skyline" },
      { silo: C, i: 45, alt: "Executive portrait of a man in a brown suit, white background, Sydney" },
      { silo: C, i: 47, alt: "Executive portrait of a man in a dark office corridor, Sydney" },
      { silo: C, i: 28, alt: "Executive portrait of a senior businessman in a dark suit, white background, Sydney" },
    ],
  },
  {
    key: "team-headshots",
    title: "Team Headshots",
    blurb:
      "On-site headshot days for Sydney teams — matched lighting and background so a team of five or fifty looks like it belongs together.",
    serviceSlug: "team-headshots-sydney",
    serviceLabel: "Team Headshots",
    picks: [
      { silo: C, i: 25, alt: "Team headshots of four colleagues photographed together, Sydney office" },
      { silo: C, i: 26, alt: "Group of colleagues photographed for a company team page, Sydney" },
      { silo: C, i: 43, alt: "Team photographed around a table in a Sydney office" },
      { silo: C, i: 14, alt: "Team member headshot of a man on a white background, Sydney" },
      { silo: C, i: 37, alt: "Team member headshot of a woman in black on a white background, Sydney" },
      { silo: C, i: 19, alt: "Team member headshot of a man with arms crossed, white background, Sydney" },
    ],
  },
  {
    key: "personal-branding",
    title: "Personal Branding",
    blurb:
      "Image libraries for founders and consultants who are the face of the business — headshots, lifestyle and at-work frames sized for every platform.",
    serviceSlug: "personal-branding-sydney",
    serviceLabel: "Personal Branding",
    picks: [
      { silo: P, i: 2, alt: "Personal branding photo of a speaker on stage in a red jacket, Sydney" },
      { silo: M, i: 6, alt: "Personal branding lifestyle portrait of a woman on location, Sydney" },
      { silo: M, i: 11, alt: "Black-and-white personal branding portrait, Sydney" },
      { silo: M, i: 5, alt: "Personal branding portrait of a woman on a Sydney pier" },
      { silo: P, i: 1, alt: "Personal branding portrait of a professional on location, Sydney" },
    ],
  },
  {
    key: "actors-models",
    title: "Actor & Model Portfolios",
    blurb:
      "Headshots and portfolio frames for actors and models — clean casting headshots through to editorial and character work.",
    serviceSlug: "actor-headshots-sydney",
    serviceLabel: "Actor Headshots",
    picks: [
      { silo: A, i: 4, alt: "Black-and-white actor headshot of a young woman, Sydney" },
      { silo: M, i: 9, alt: "Editorial model portfolio portrait of a woman in a red dress, Sydney" },
      { silo: M, i: 16, alt: "Commercial model headshot of a man in sunglasses, studio, Sydney" },
      { silo: M, i: 14, alt: "Moody full-length model portfolio portrait of a man in a navy suit, Sydney" },
      { silo: M, i: 7, alt: "Character model portrait of a tattooed man in dramatic studio light, Sydney" },
      { silo: M, i: 4, alt: "Fashion model portfolio shot of a woman at a Sydney beach" },
    ],
  },
  {
    key: "musicians-singers",
    title: "Musicians & Singers",
    blurb:
      "Artist portraits for musicians and singers — press shots, cover art and promotional images shot in the studio and on location around Sydney.",
    picks: [
      { silo: MU, i: 1, alt: "Studio portrait of a musician with a guitar, Sydney" },
      { silo: SI, i: 2, alt: "Singer photographed in dramatic stage lighting, Sydney" },
      { silo: MU, i: 3, alt: "Promotional portrait of a musician in low studio light, Sydney" },
      { silo: SI, i: 5, alt: "Editorial artist portrait of a singer on location, Sydney" },
      { silo: MU, i: 7, alt: "Band member portrait against a dark backdrop, Sydney studio" },
      { silo: SI, i: 9, alt: "Cover-art style portrait of a singer, Sydney" },
    ],
  },
  {
    key: "sports",
    title: "Sports Portraits",
    blurb:
      "Athlete and sports portraits with controlled studio lighting — strong, clean images for profiles, sponsors and press.",
    picks: [
      { silo: SP, i: 1, alt: "Studio sports portrait of an athlete on a dark backdrop, Sydney" },
      { silo: SP, i: 3, alt: "Dramatic low-key portrait of a sportsperson, Sydney studio" },
      { silo: SP, i: 5, alt: "Athlete portrait with hard directional studio lighting, Sydney" },
      { silo: SP, i: 7, alt: "Sports portrait of a competitor on a black background, Sydney" },
    ],
  },
  {
    key: "family",
    title: "Family Portraits",
    blurb:
      "Relaxed outdoor family sessions across Sydney — natural light, real expressions and prints worth putting on the wall.",
    serviceSlug: "family-photography-sydney",
    serviceLabel: "Family Sessions",
    picks: [
      { silo: F, i: 13, alt: "Family portrait by Sydney Harbour with the Opera House behind" },
      { silo: F, i: 5, alt: "Family on a park bench during an outdoor session, Sydney" },
      { silo: F, i: 8, alt: "Family of five photographed outdoors in natural light, Sydney" },
      { silo: F, i: 9, alt: "Black-and-white family portrait, Sydney" },
      { silo: F, i: 10, alt: "Parents and child in a candid outdoor family session, Sydney" },
      { silo: F, i: 6, alt: "Family portrait beneath a floral arch, Sydney" },
    ],
  },
];

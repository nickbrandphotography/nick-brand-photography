/**
 * Central site configuration for Nick Brand Photography.
 * Single source of truth for business identity, contact details and navigation.
 */

export const site = {
  name: "Nick Brand Photography",
  legalName: "Nick Brand Photography",
  shortName: "Nick Brand",
  founder: "Nick Brand",
  // Canonical domain — used for metadataBase, sitemap, canonical URLs and schema.
  url: "https://www.nickbrandphotography.com",
  domain: "www.nickbrandphotography.com",

  tagline: "Sydney Corporate Headshot & Personal Branding Photographer",
  description:
    "Nick Brand Photography produces corporate headshots, personal branding and executive portraits for Sydney professionals and teams. Studio in Lane Cove, on-site across Sydney.",

  // Contact
  phone: "0403 835 467",
  phoneIntl: "+61403835467",
  email: "info@nickbrandphotography.com",
  // The custom booking system on /book. Every "Book a Session" button on the
  // site links here. (Previously an external Calendly URL.)
  bookingUrl: "/book",

  // Contact form delivery — Web3Forms (https://web3forms.com).
  // SETUP: go to web3forms.com, enter info@nickbrandphotography.com, and the
  // free access key is emailed to you. Paste it between the quotes below.
  // This key is safe to keep in code — Web3Forms keys are designed to be public.
  // Until it is filled in, the contact form shows the phone/email fallback.
  web3formsKey: "4d67606b-b793-496d-bcca-261e85487957",

  // Location
  address: {
    street: "84 Centennial Avenue",
    suburb: "Lane Cove",
    state: "NSW",
    postcode: "2066",
    country: "AU",
  },
  geo: { lat: -33.8146, lng: 151.1696 },
  serviceArea: "Greater Sydney",
  hours: "07:00–19:00, 7 days",

  // Trust signals
  stats: {
    years: "20+",
    sessions: "500+",
    rating: "5.0",
    insured: "$20M",
  },

  // Social — used in footer and schema sameAs
  social: {
    instagram: "https://www.instagram.com/nickbrandphotography",
    linkedin:
      "https://www.linkedin.com/in/nick-brand-photography-334995181",
    // Google Business Profile — see HOW TO below. Once filled in, this URL
    // automatically powers schema sameAs, the footer link and the
    // "reviews on Google" call-to-action on testimonial sections.
    //
    // HOW TO FIND IT:
    //   1. Search "Nick Brand Photography" on Google.
    //   2. On your business panel, click "Share" (or the reviews count).
    //   3. Copy the share link, or use your Google Maps listing URL.
    //   It looks like: https://maps.app.goo.gl/XXXXXXXX  or a
    //   https://www.google.com/maps/place/... URL. Paste it between the quotes.
    google: "https://share.google/N8cRsktKVu02sWjRY",
  },
} as const;

/** Primary navigation — drives the header and footer. */
export const mainNav: { label: string; href: string }[] = [
  { label: "Corporate Headshots", href: "/corporate-headshots-sydney" },
  { label: "LinkedIn Headshots", href: "/linkedin-headshots-sydney" },
  { label: "Personal Branding", href: "/personal-branding-sydney" },
  { label: "Team Headshots", href: "/team-headshots-sydney" },
  { label: "Actor Headshots", href: "/actor-headshots-sydney" },
  { label: "Corporate Events", href: "/corporate-event-photographer-sydney" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

/** Helper to build absolute URLs for canonicals and schema. */
export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${site.url}${path === "/" ? "" : path}`;
}

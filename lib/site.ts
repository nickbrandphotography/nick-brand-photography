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
  email: "studio@nickbrandphotography.com",
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
  hours: "07:00–19:00, Monday to Saturday",

  // Trust signals
  stats: {
    years: "20+",
    sessions: "500+",
    rating: "5.0",
    insured: "$20M",
  },

  /**
   * GST. Nick Brand Photography is not registered for GST, so every published
   * price is the final price — nothing is added at invoice. This matters for
   * business buyers, who otherwise assume a quoted price is ex-GST (both
   * GrayNoise and Gavin Jowitt quote "+ GST"), and it is a genuine advantage
   * worth stating plainly rather than leaving ambiguous.
   */
  gstRegistered: false,
  priceNote:
    "All prices are in AUD and are the final price — Nick Brand Photography is not registered for GST, so no GST is added.",

  /**
   * ABN. Australian business buyers and procurement teams look for this, and
   * publishing it is a real legitimacy signal (competitors do). Paste the
   * 11-digit number between the quotes — formatted or unformatted, both work.
   * While it is empty the ABN row simply doesn't render on /terms.
   */
  abn: "",

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

/**
 * Primary navigation — the non-service top-level links in the header.
 * The 8 service pages (Corporate Headshots, LinkedIn Headshots, etc.) live
 * in lib/services.ts and are rendered from there as the header's "Services"
 * dropdown and the footer's Services column, instead of being duplicated
 * here. Keeping them out of this flat list is what stops the desktop nav
 * from overflowing the header — 11 top-level links plus a Book Now button
 * don't fit in the header at any normal screen width; a dropdown does.
 */
export const mainNav: { label: string; href: string }[] = [
  // Portfolio and Pricing were previously reachable only from the footer. On a
  // photography site "see the work" and "what does it cost" are the two things
  // a visitor looks for first, and neither was in the header.
  { label: "Portfolio", href: "/portfolio" },
  { label: "Pricing", href: "/corporate-headshot-pricing-sydney" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/** Helper to build absolute URLs for canonicals and schema. */
export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${site.url}${path === "/" ? "" : path}`;
}

/**
 * Pricing tiers for Nick Brand Photography.
 * Grouped by service line; consumed by service pages and the schema builder.
 */

export type PricingTier = {
  name: string;
  price: string; // display price, e.g. "$695"
  priceValue: number; // numeric, for Offer schema
  unit: string; // e.g. "per person — 90 min session"
  badge?: string; // e.g. "Most Popular"
  features: string[];
  ctaLabel: string;
  highlight?: boolean;
  /**
   * Matching `id` in the `sessionTypes` array in lib/booking.ts. When set, this
   * tier's CTA deep-links to /book?session=<id> and the booking flow opens with
   * that session already chosen. Leave undefined only if there is deliberately
   * no bookable session for the tier — the CTA then falls back to the generic
   * /book picker.
   */
  sessionTypeId?: string;
};

export type PricingGroup = {
  id: string;
  label: string;
  tiers: PricingTier[];
};

/**
 * Look up a single tier by the session type it books.
 *
 * Service pages choose their own tiers by session id (see pricingSessionIds in
 * lib/services.ts) rather than rendering a whole group — showing a group meant
 * the family page listed actor and band tiers, and the actor page listed family.
 */
export function getTierBySessionId(
  sessionTypeId: string,
): PricingTier | undefined {
  for (const group of Object.values(pricingGroups)) {
    const found = group.tiers.find((t) => t.sessionTypeId === sessionTypeId);
    if (found) return found;
  }
  return undefined;
}

/**
 * Tiers for the given session ids, in the order given. Unknown ids are skipped
 * rather than rendering an empty card, so a typo degrades to a shorter list.
 */
export function getTiers(sessionTypeIds: string[]): PricingTier[] {
  return sessionTypeIds
    .map((id) => getTierBySessionId(id))
    .filter((t): t is PricingTier => Boolean(t));
}

export const pricingGroups: Record<string, PricingGroup> = {
  corporate: {
    id: "corporate",
    label: "Corporate Headshot Pricing",
    tiers: [
      {
        name: "Essential",
        price: "$395",
        priceValue: 395,
        unit: "Per person — 45 min session",
        features: [
          "Studio or outdoor location",
          "1–2 outfit changes",
          "5 fully edited images",
          "High-res digital delivery",
          "Private online gallery",
          "48hr express available (+$80)",
        ],
        ctaLabel: "Book Essential",
        sessionTypeId: "headshot-essential",
      },
      {
        name: "Professional",
        price: "$695",
        priceValue: 695,
        unit: "Per person — 90 min session",
        badge: "Most Popular",
        highlight: true,
        features: [
          "Studio + outdoor combo",
          "3–4 outfit changes",
          "15 fully edited images",
          "LinkedIn-optimised crop",
          "High-res digital delivery",
          "Priority turnaround (3 days)",
        ],
        ctaLabel: "Book Professional",
        sessionTypeId: "headshot-professional",
      },
      {
        name: "Team Package",
        price: "$285",
        priceValue: 285,
        unit: "Per person — teams of 5+",
        features: [
          "On-site at your Sydney office",
          "Mobile studio setup",
          "5 edited images per person",
          "Consistent team aesthetic",
          "Delivered within 5 business days",
          "Invoice billing available",
        ],
        ctaLabel: "Enquire for Teams",
        sessionTypeId: "team-quote",
      },
    ],
  },

  branding: {
    id: "branding",
    label: "Personal Branding Pricing",
    tiers: [
      {
        name: "Brand Starter",
        price: "$895",
        priceValue: 895,
        unit: "Half day — 3 hours",
        features: [
          "1 location",
          "2–3 outfit changes",
          "20 fully edited images",
          "Headshots + lifestyle mix",
          "Creative direction included",
          "Social media sizing included",
        ],
        ctaLabel: "Book Starter",
        sessionTypeId: "brand-starter",
      },
      {
        name: "Brand Full Day",
        price: "$1,695",
        priceValue: 1695,
        unit: "Full day — 6 hours",
        badge: "Best Value",
        highlight: true,
        features: [
          "2–3 locations across Sydney",
          "5+ outfit / look changes",
          "50 fully edited images",
          "Headshots + lifestyle + action",
          "Pre-shoot strategy session",
          "Usage rights — all platforms",
        ],
        ctaLabel: "Book Full Day",
        sessionTypeId: "brand-full-day",
      },
      {
        name: "Brand Premium",
        price: "$2,800",
        priceValue: 2800,
        unit: "Full day + extras",
        features: [
          "Everything in Full Day",
          "Hair & makeup artist included",
          "75+ edited images",
          "Wardrobe direction included",
          "30-day image refresh option",
          "Priority ongoing rate locked in",
        ],
        ctaLabel: "Book Premium",
        sessionTypeId: "brand-premium",
      },
    ],
  },

  portrait: {
    id: "portrait",
    label: "Portrait & Creative Pricing",
    tiers: [
      {
        name: "Family Basic",
        price: "$550",
        priceValue: 550,
        unit: "90 minutes — up to 6 people",
        features: [
          "Outdoor Sydney location",
          "20 fully edited images",
          "Natural, relaxed style",
          "Online gallery delivery",
          "Print release included",
          "Pets welcome",
        ],
        ctaLabel: "Book Family Basic",
        sessionTypeId: "family",
      },
      {
        name: "Family Extended",
        price: "$850",
        priceValue: 850,
        unit: "2 hours — up to 10 people",
        badge: "Extended Family",
        highlight: true,
        features: [
          "Up to 10 people",
          "Two locations, or golden hour",
          "40 fully edited images",
          "Grandparents and pets welcome",
          "Group + individual portraits",
          "Print release included",
        ],
        ctaLabel: "Book Family Extended",
        sessionTypeId: "family-extended",
      },
      {
        name: "Actor Starter",
        price: "$450",
        priceValue: 450,
        unit: "1 hour — studio",
        features: [
          "Two looks",
          "10 fully edited images",
          "Casting-standard crops",
          "Industry-standard sizing",
          "Online gallery delivery",
          "Ideal for a first submission",
        ],
        ctaLabel: "Book Actor Starter",
        sessionTypeId: "actor-starter",
      },
      {
        name: "Portfolio Build",
        price: "$750",
        priceValue: 750,
        unit: "2 hours — studio or location",
        badge: "Actors & Models",
        highlight: true,
        features: [
          "Dramatic + natural light setups",
          "3–4 look changes",
          "25 fully edited images",
          "Industry-standard sizing",
          "Casting director guidance",
          "Rush 24hr available",
        ],
        ctaLabel: "Book Portfolio",
        sessionTypeId: "portfolio",
      },
      {
        name: "Solo Artist",
        price: "$595",
        priceValue: 595,
        unit: "2 hours — one location",
        features: [
          "Solo musicians and singer-songwriters",
          "2–3 looks",
          "20 fully edited images",
          "Press kit + social formats",
          "Cover art crops included",
          "Creative direction included",
        ],
        ctaLabel: "Book Solo Artist",
        sessionTypeId: "solo-artist",
      },
      {
        name: "Band & Artist",
        price: "$995",
        priceValue: 995,
        unit: "3 hours — location shoot",
        badge: "Full Band",
        highlight: true,
        features: [
          "Up to 6 band members",
          "2 Sydney locations",
          "30 fully edited images",
          "Press kit + social formats",
          "Group + individual shots",
          "Creative direction included",
        ],
        ctaLabel: "Book Band Session",
        sessionTypeId: "band-artist",
      },
    ],
  },
};

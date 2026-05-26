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
};

export type PricingGroup = {
  id: string;
  label: string;
  tiers: PricingTier[];
};

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
      },
    ],
  },

  portrait: {
    id: "portrait",
    label: "Portrait & Creative Pricing",
    tiers: [
      {
        name: "Family Session",
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
        ctaLabel: "Book Family",
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
      },
      {
        name: "Band & Artist",
        price: "$995",
        priceValue: 995,
        unit: "3 hours — location shoot",
        features: [
          "Up to 6 band members",
          "2 Sydney locations",
          "30 fully edited images",
          "Press kit + social formats",
          "Group + individual shots",
          "Creative direction included",
        ],
        ctaLabel: "Book Band Session",
      },
    ],
  },
};

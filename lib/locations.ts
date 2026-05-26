/**
 * Suburb landing pages for local SEO.
 * Each location targets a distinct "corporate headshots + suburb" search
 * intent with unique local copy — no duplicated content across pages.
 */

import type { FAQ } from "./services";

export type Location = {
  slug: string;
  suburb: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  /** opening local-context paragraphs */
  intro: string[];
  /** local signals — landmarks, precincts, who works there */
  localSignals: string[];
  /** travel / logistics note */
  logistics: string;
  faqs: FAQ[];
};

export const locations: Location[] = [
  {
    slug: "sydney-cbd",
    suburb: "Sydney CBD",
    metaTitle:
      "Corporate Headshots Sydney CBD | Nick Brand Photography",
    metaDescription:
      "Corporate headshots for Sydney CBD businesses. On-site headshot days in the city or studio sessions in nearby Lane Cove. Consistent, fast, professional.",
    h1: "Corporate Headshots in Sydney CBD",
    intro: [
      "The Sydney CBD is the centre of the city's professional life — law firms, banks, advisory practices and head offices clustered through the financial core. For these businesses, headshots need to match the standard their brand sets everywhere else.",
      "Nick Brand Photography photographs corporate headshots for CBD businesses either on-site in the city or at the Lane Cove studio a short drive north. On-site headshot days are set up in your own office so staff are photographed without leaving the building.",
    ],
    localSignals: [
      "Law and barristers' chambers around Phillip and Martin Place",
      "Banking and finance offices through the financial core",
      "Advisory and consulting firms near Wynyard and Barangaroo",
      "Head offices along George and Pitt Streets",
    ],
    logistics:
      "On-site headshot days come to your CBD office with a mobile studio. For individual sessions, the Lane Cove studio is roughly 15 minutes from the city by car and easily reached from the lower North Shore.",
    faqs: [
      {
        q: "Do you come to offices in the Sydney CBD?",
        a: "Yes. On-site headshot days are set up directly in your CBD office with a mobile studio, so staff are photographed without travelling. Individual sessions can also be booked at the Lane Cove studio nearby.",
      },
      {
        q: "Can you photograph a large CBD team in one day?",
        a: "Yes. A rolling schedule moves a large team through quickly — roughly ten minutes per person — with consistent lighting and background throughout.",
      },
      {
        q: "How much do corporate headshots cost for CBD businesses?",
        a: "Team headshots are $285 per person for groups of five or more. Individual sessions start at $395.",
      },
    ],
  },

  {
    slug: "north-sydney",
    suburb: "North Sydney",
    metaTitle:
      "Corporate Headshots North Sydney | Nick Brand Photography",
    metaDescription:
      "Corporate headshots for North Sydney businesses. On-site team headshot days or studio sessions minutes away in Lane Cove. Professional, consistent, fast turnaround.",
    h1: "Corporate Headshots in North Sydney",
    intro: [
      "North Sydney is a major commercial hub in its own right — a dense cluster of corporate offices, technology companies and professional services just across the Harbour Bridge from the city.",
      "Nick Brand Photography works with North Sydney businesses regularly, with the Lane Cove studio only a short drive away. On-site headshot days are straightforward to arrange, and individual sessions are easy to fit around a working day.",
    ],
    localSignals: [
      "Corporate offices around Miller and Pacific Highway",
      "Technology and media companies in the North Sydney core",
      "Professional services and consulting practices",
      "Businesses along the Pacific Highway corridor",
    ],
    logistics:
      "The Lane Cove studio is a short drive from North Sydney, making individual sessions quick to attend. On-site team days bring the mobile studio to your office.",
    faqs: [
      {
        q: "Is the studio close to North Sydney?",
        a: "Yes. The Lane Cove studio is a short drive from North Sydney, so individual sessions are easy to attend without losing much of the working day.",
      },
      {
        q: "Can you run an on-site headshot day in North Sydney?",
        a: "Yes. A mobile studio is set up in your North Sydney office and staff rotate through on a schedule, with consistent lighting and background for everyone.",
      },
      {
        q: "How quickly are headshots delivered?",
        a: "Standard delivery is within five business days, with a 48-hour express option available when needed.",
      },
    ],
  },

  {
    slug: "surry-hills",
    suburb: "Surry Hills",
    metaTitle:
      "Personal Branding & Headshots Surry Hills | Nick Brand Photography",
    metaDescription:
      "Headshots and personal branding photography for Surry Hills creatives, agencies and studios. On-location sessions or the Lane Cove studio. Book with Nick Brand.",
    h1: "Headshots & Personal Branding in Surry Hills",
    intro: [
      "Surry Hills is Sydney's creative quarter — design studios, agencies, tech startups and independent businesses packed into its terraces and warehouses. The professional image here tends to be less corporate and more personal.",
      "Nick Brand Photography photographs headshots and personal branding sessions for Surry Hills businesses, whether that means a relaxed founder headshot, a full personal branding library or a consistent set of team photos for an agency.",
    ],
    localSignals: [
      "Creative agencies and design studios",
      "Technology startups and co-working spaces",
      "Independent consultants and founders",
      "Hospitality and small-business owners",
    ],
    logistics:
      "Personal branding and headshot sessions can be photographed on-location around Surry Hills or at the Lane Cove studio, with on-site team days available for agencies.",
    faqs: [
      {
        q: "Do you photograph creative teams and agencies in Surry Hills?",
        a: "Yes. Agency and studio teams are regularly photographed in Surry Hills, either on-site or at the Lane Cove studio, with a look that suits a creative business rather than a strictly corporate one.",
      },
      {
        q: "Can you do personal branding shoots around Surry Hills?",
        a: "Yes. Personal branding sessions can be photographed on-location in Surry Hills, using the area's terraces, cafes and studios as backdrops for a varied image library.",
      },
      {
        q: "What does a personal branding session cost?",
        a: "Personal branding sessions start at $895 for a half day and $1,695 for a full day across multiple locations.",
      },
    ],
  },

  {
    slug: "parramatta",
    suburb: "Parramatta",
    metaTitle:
      "Corporate Headshots Parramatta | Nick Brand Photography",
    metaDescription:
      "Corporate headshots for Parramatta and Greater Western Sydney businesses. On-site team headshot days with a mobile studio. Consistent, professional, fast.",
    h1: "Corporate Headshots in Parramatta",
    intro: [
      "Parramatta is Sydney's second CBD — a fast-growing commercial centre with government departments, corporate offices and professional firms serving Greater Western Sydney.",
      "Nick Brand Photography travels to Parramatta for corporate and team headshots, setting up an on-site mobile studio so businesses in the western Sydney commercial district get the same consistent, professional result without sending staff across the city.",
    ],
    localSignals: [
      "Government and public-sector offices",
      "Corporate offices in the Parramatta CBD",
      "Professional services firms serving Western Sydney",
      "Health, education and finance organisations",
    ],
    logistics:
      "On-site headshot days bring the full mobile studio to your Parramatta office, so a team is photographed in one visit without travelling into the Sydney CBD.",
    faqs: [
      {
        q: "Do you travel to Parramatta for headshots?",
        a: "Yes. On-site headshot days are run in Parramatta with a mobile studio set up in your office, so the whole team is photographed in one visit.",
      },
      {
        q: "Can you photograph large teams in Parramatta?",
        a: "Yes. A rolling schedule handles large teams efficiently, with matched lighting and background so every staff member looks consistent.",
      },
      {
        q: "How much do team headshots cost in Parramatta?",
        a: "Team headshots are $285 per person for groups of five or more, including the on-site mobile studio setup and invoice billing.",
      },
    ],
  },

  {
    slug: "chatswood",
    suburb: "Chatswood",
    metaTitle:
      "Corporate Headshots Chatswood | Nick Brand Photography",
    metaDescription:
      "Corporate headshots for Chatswood and North Shore businesses. Studio sessions minutes away in Lane Cove or on-site team headshot days. Professional and consistent.",
    h1: "Corporate Headshots in Chatswood",
    intro: [
      "Chatswood is the commercial heart of Sydney's North Shore — a busy mix of corporate offices, professional services and technology businesses with excellent transport links.",
      "Nick Brand Photography works with Chatswood businesses from the nearby Lane Cove studio, only a short drive away. Individual sessions are quick to attend and on-site team headshot days are simple to arrange.",
    ],
    localSignals: [
      "Corporate offices around the Chatswood transport interchange",
      "Professional services on the North Shore",
      "Technology and finance businesses",
      "Medical and allied health practices",
    ],
    logistics:
      "The Lane Cove studio is a short drive from Chatswood, so individual sessions are easy to attend. On-site headshot days bring the mobile studio to your office.",
    faqs: [
      {
        q: "Is the studio near Chatswood?",
        a: "Yes. The Lane Cove studio is a short drive from Chatswood, so North Shore professionals can attend an individual session quickly.",
      },
      {
        q: "Can you run a team headshot day in Chatswood?",
        a: "Yes. A mobile studio is set up in your Chatswood office and the team rotates through on a schedule, with consistent results for everyone.",
      },
      {
        q: "How fast is delivery?",
        a: "Headshots are delivered within five business days as standard, with a 48-hour express option available.",
      },
    ],
  },

  {
    slug: "barangaroo",
    suburb: "Barangaroo",
    metaTitle:
      "Corporate Headshots Barangaroo | Nick Brand Photography",
    metaDescription:
      "Corporate headshots and executive portraits for Barangaroo businesses. On-site headshot days at the International Towers, or studio sessions in Lane Cove.",
    h1: "Corporate Headshots in Barangaroo",
    intro: [
      "Barangaroo is Sydney's newest financial precinct — a waterfront cluster of banks, global consultancies and law firms headquartered in the International Towers. The standard of brand presentation here is high, and headshots are expected to match it.",
      "Nick Brand Photography photographs corporate headshots and executive portraits for Barangaroo businesses, either on-site in your tower or at the Lane Cove studio a short drive north. On-site headshot days are set up in your own floor space so staff are photographed without leaving the building.",
    ],
    localSignals: [
      "Banking and financial services teams in the International Towers",
      "Global consulting and professional services firms",
      "Law firms and corporate advisory practices",
      "Headquarters along the Barangaroo waterfront",
    ],
    logistics:
      "On-site headshot days come to your Barangaroo office with a mobile studio. The Lane Cove studio is around 15 minutes away by car for individual sessions, with easy access from the lower North Shore.",
    faqs: [
      {
        q: "Do you photograph headshots at the International Towers?",
        a: "Yes. On-site headshot days are set up directly in your Barangaroo office, including the International Towers, with a mobile studio so staff are photographed without leaving the floor.",
      },
      {
        q: "Can you match headshots across a large Barangaroo team?",
        a: "Yes. Every staff member is photographed with identical lighting and background, so a large finance or consulting team looks consistent across the website and pitch documents.",
      },
      {
        q: "How much do corporate headshots cost for Barangaroo businesses?",
        a: "Team headshots are $285 per person for groups of five or more. Individual sessions start at $395, and executive portraits for senior leaders are $695.",
      },
    ],
  },

  {
    slug: "pyrmont",
    suburb: "Pyrmont",
    metaTitle:
      "Headshots & Personal Branding Pyrmont | Nick Brand Photography",
    metaDescription:
      "Headshots and personal branding photography for Pyrmont's technology, media and creative businesses. On-location sessions or the Lane Cove studio.",
    h1: "Headshots & Personal Branding in Pyrmont",
    intro: [
      "Pyrmont packs a lot into a small harbourside peninsula — technology companies, media and digital agencies, gaming studios and startups, all minutes from the CBD. The professional image here leans modern and approachable rather than strictly corporate.",
      "Nick Brand Photography photographs headshots and personal branding sessions for Pyrmont businesses, whether that's a polished founder headshot, a full personal branding library or a consistent set of team photos for a growing technology or media company.",
    ],
    localSignals: [
      "Technology and digital companies around Darling Island",
      "Media, gaming and creative agencies",
      "Startups and co-working spaces",
      "Harbourside corporate offices near The Star",
    ],
    logistics:
      "Headshot and personal branding sessions can be photographed on-location around Pyrmont and the harbourside, or at the Lane Cove studio. On-site team headshot days are simple to arrange for larger offices.",
    faqs: [
      {
        q: "Do you photograph technology and media teams in Pyrmont?",
        a: "Yes. Tech, media and agency teams are regularly photographed in Pyrmont, either on-site or at the Lane Cove studio, with a look that suits a modern business rather than a strictly corporate one.",
      },
      {
        q: "Can you run a personal branding shoot around Pyrmont?",
        a: "Yes. Personal branding sessions can use Pyrmont's harbourside, laneways and modern interiors as backdrops for a varied image library for founders and creators.",
      },
      {
        q: "What does a headshot session cost in Pyrmont?",
        a: "Individual headshots start at $395 and team rates are $285 per person for groups of five or more. Personal branding sessions start at $895.",
      },
    ],
  },

  {
    slug: "bondi-junction",
    suburb: "Bondi Junction",
    metaTitle:
      "Corporate Headshots Bondi Junction | Nick Brand Photography",
    metaDescription:
      "Corporate headshots for Bondi Junction and Eastern Suburbs businesses. On-site team headshot days or studio sessions. Professional, consistent, fast turnaround.",
    h1: "Corporate Headshots in Bondi Junction",
    intro: [
      "Bondi Junction is the commercial centre of Sydney's Eastern Suburbs — a busy hub of professional services, finance, legal and medical practices clustered around the transport interchange and the office towers above it.",
      "Nick Brand Photography photographs corporate headshots for Bondi Junction businesses, either on-site in your office or at the Lane Cove studio. On-site headshot days bring a mobile studio to you, so staff are photographed without travelling across the city.",
    ],
    localSignals: [
      "Professional services and finance firms above the interchange",
      "Legal and accounting practices serving the Eastern Suburbs",
      "Medical and allied health specialists",
      "Corporate and retail head offices around Oxford Street",
    ],
    logistics:
      "On-site headshot days bring the full mobile studio to your Bondi Junction office. For individual sessions, the Lane Cove studio is reachable across the harbour, with parking close by.",
    faqs: [
      {
        q: "Do you travel to Bondi Junction for headshots?",
        a: "Yes. On-site headshot days are run in Bondi Junction with a mobile studio set up in your office, so the whole team is photographed in one visit.",
      },
      {
        q: "Can you photograph a whole Eastern Suburbs team in a day?",
        a: "Yes. A rolling schedule moves a large team through quickly — around ten minutes per person — with consistent lighting and background for everyone.",
      },
      {
        q: "How much do corporate headshots cost in Bondi Junction?",
        a: "Team headshots are $285 per person for groups of five or more. Individual sessions start at $395.",
      },
    ],
  },

  {
    slug: "st-leonards",
    suburb: "St Leonards",
    metaTitle:
      "Corporate Headshots St Leonards | Nick Brand Photography",
    metaDescription:
      "Corporate headshots for St Leonards businesses, minutes from the Lane Cove studio. On-site team headshot days or quick individual sessions. Professional and consistent.",
    h1: "Corporate Headshots in St Leonards",
    intro: [
      "St Leonards is a dense commercial and health precinct on the Lower North Shore, built around the Pacific Highway and the surrounding hospital and medical district. It is also one of the closest business hubs to Nick's studio.",
      "Nick Brand Photography works with St Leonards businesses constantly — the Lane Cove studio is only a few minutes away. Individual sessions are quick to attend on a lunch break, and on-site team headshot days are simple to arrange.",
    ],
    localSignals: [
      "Medical specialists and health practices around the hospital precinct",
      "Corporate offices along the Pacific Highway",
      "Technology and professional services firms",
      "Businesses near the St Leonards and Crows Nest metro stations",
    ],
    logistics:
      "The Lane Cove studio is only a few minutes from St Leonards, so individual sessions barely interrupt the working day. On-site headshot days bring the mobile studio directly to your office.",
    faqs: [
      {
        q: "How close is the studio to St Leonards?",
        a: "Very close — the Lane Cove studio is only a few minutes' drive from St Leonards, so an individual headshot session can easily be fitted into a lunch break.",
      },
      {
        q: "Do you photograph medical and health practices in St Leonards?",
        a: "Yes. Headshots for medical specialists, practices and health businesses are regularly photographed in St Leonards, either on-site or at the nearby studio.",
      },
      {
        q: "How quickly are headshots delivered?",
        a: "Standard delivery is within five business days, with a 48-hour express option available when needed.",
      },
    ],
  },

  {
    slug: "crows-nest",
    suburb: "Crows Nest",
    metaTitle:
      "Headshots & Personal Branding Crows Nest | Nick Brand Photography",
    metaDescription:
      "Headshots and personal branding photography for Crows Nest businesses, minutes from the Lane Cove studio. On-location sessions or studio shoots.",
    h1: "Headshots & Personal Branding in Crows Nest",
    intro: [
      "Crows Nest is the Lower North Shore's creative and small-business village — design studios, consultancies, hospitality and independent founders packed along Willoughby Road, now with its own metro station.",
      "Nick Brand Photography photographs headshots and personal branding sessions for Crows Nest businesses, with the Lane Cove studio just minutes away. The approach suits a personal, founder-led business as easily as a corporate one.",
    ],
    localSignals: [
      "Creative agencies and design studios around Willoughby Road",
      "Independent consultants, founders and small businesses",
      "Hospitality and retail owners",
      "Professional services near the new Crows Nest metro station",
    ],
    logistics:
      "The Lane Cove studio is only minutes from Crows Nest. Personal branding and headshot sessions can also be photographed on-location around the Willoughby Road precinct, with on-site team days available.",
    faqs: [
      {
        q: "Is the studio near Crows Nest?",
        a: "Yes. The Lane Cove studio is only a few minutes from Crows Nest, so individual headshot and branding sessions are quick and easy to attend.",
      },
      {
        q: "Can you do a personal branding shoot around Crows Nest?",
        a: "Yes. Personal branding sessions can use the Crows Nest precinct — its cafes, studios and streetscapes — as backdrops for a varied image library for founders and consultants.",
      },
      {
        q: "What does a session cost in Crows Nest?",
        a: "Individual headshots start at $395 and team rates are $285 per person for groups of five or more. Personal branding sessions start at $895.",
      },
    ],
  },

  {
    slug: "macquarie-park",
    suburb: "Macquarie Park",
    metaTitle:
      "Corporate Headshots Macquarie Park | Nick Brand Photography",
    metaDescription:
      "Corporate headshots for Macquarie Park businesses. On-site team headshot days at the technology and pharmaceutical campuses, or studio sessions in Lane Cove.",
    h1: "Corporate Headshots in Macquarie Park",
    intro: [
      "Macquarie Park is one of Sydney's largest business districts — a corporate campus precinct home to technology, pharmaceutical and telecommunications headquarters, alongside Macquarie University and a steady flow of large professional teams.",
      "Nick Brand Photography travels to Macquarie Park for corporate and team headshots, setting up an on-site mobile studio so large teams are photographed in a single visit. The Lane Cove studio is a short drive away for individual sessions.",
    ],
    localSignals: [
      "Technology and telecommunications headquarters",
      "Pharmaceutical and life sciences companies",
      "Large corporate campuses around the metro stations",
      "Professional and research teams near Macquarie University",
    ],
    logistics:
      "On-site headshot days bring the full mobile studio to your Macquarie Park campus, so a large team is photographed without travelling. The Lane Cove studio is a short drive away for individual sessions.",
    faqs: [
      {
        q: "Do you run on-site headshot days in Macquarie Park?",
        a: "Yes. On-site headshot days are run at Macquarie Park campuses with a mobile studio set up in your office, so a large team is photographed in a single visit.",
      },
      {
        q: "Can you handle a very large corporate team?",
        a: "Yes. A rolling schedule moves large teams through efficiently — around ten minutes per person — with matched lighting and background so everyone looks consistent.",
      },
      {
        q: "How much do team headshots cost in Macquarie Park?",
        a: "Team headshots are $285 per person for groups of five or more, including the on-site mobile studio setup and invoice billing.",
      },
    ],
  },

  {
    slug: "mosman",
    suburb: "Mosman",
    metaTitle:
      "Headshots & Personal Branding Mosman | Nick Brand Photography",
    metaDescription:
      "Headshots and personal branding photography for Mosman professionals and small businesses. Studio sessions in nearby Lane Cove or on-location.",
    h1: "Headshots & Personal Branding in Mosman",
    intro: [
      "Mosman is a professional Lower North Shore community — home to consultants, finance and legal professionals, business owners and a strong cluster of independent small businesses, many run by people who live locally.",
      "Nick Brand Photography photographs headshots and personal branding sessions for Mosman professionals, with the Lane Cove studio a short drive away. Sessions suit an individual professional refreshing a profile as much as a small local team.",
    ],
    localSignals: [
      "Consultants, advisors and finance professionals",
      "Legal and professional services practices",
      "Independent small businesses around Military Road",
      "Business owners and founders based on the Lower North Shore",
    ],
    logistics:
      "The Lane Cove studio is a short drive from Mosman, making individual sessions easy to attend. On-location sessions can also be arranged around Mosman for branding shoots and small teams.",
    faqs: [
      {
        q: "Is the studio close to Mosman?",
        a: "Yes. The Lane Cove studio is a short drive from Mosman, so Lower North Shore professionals can attend an individual headshot or branding session quickly.",
      },
      {
        q: "Do you photograph individual professionals, not just teams?",
        a: "Yes. Many Mosman clients are individual consultants, advisors and business owners updating a headshot or building a personal branding library.",
      },
      {
        q: "What does a session cost in Mosman?",
        a: "Individual headshots start at $395. Personal branding sessions start at $895, and team rates are $285 per person for groups of five or more.",
      },
    ],
  },
];

export function getLocation(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}

export const locationSlugs = locations.map((l) => l.slug);

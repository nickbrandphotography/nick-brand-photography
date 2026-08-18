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
  /**
   * How the suburb is actually reached, and what that means for a session.
   * Added because all twelve pages measured ~53% duplicate against each other —
   * the shared pricing, gallery, testimonials and CTA left only ~250–330 words
   * of genuinely unique copy per page. Travel and access genuinely differ by
   * precinct, so this is real local detail rather than padding.
   */
  gettingThere?: string;
  /** What an on-site mobile studio needs in this kind of building. */
  onSiteNote?: string;
  faqs: FAQ[];
};

/**
 * Neighbouring suburbs, for contextual internal links. Each location page
 * previously linked out to exactly one other page on the whole site.
 */
const NEARBY: Record<string, string[]> = {
  "lane-cove": ["st-leonards", "crows-nest", "chatswood"],
  "sydney-cbd": ["barangaroo", "pyrmont", "north-sydney"],
  "north-sydney": ["st-leonards", "crows-nest", "mosman"],
  "surry-hills": ["sydney-cbd", "pyrmont", "bondi-junction"],
  parramatta: ["macquarie-park", "chatswood", "sydney-cbd"],
  chatswood: ["st-leonards", "macquarie-park", "lane-cove"],
  barangaroo: ["sydney-cbd", "pyrmont", "north-sydney"],
  pyrmont: ["sydney-cbd", "barangaroo", "surry-hills"],
  "bondi-junction": ["sydney-cbd", "surry-hills", "mosman"],
  "st-leonards": ["crows-nest", "lane-cove", "north-sydney"],
  "crows-nest": ["st-leonards", "north-sydney", "lane-cove"],
  mosman: ["north-sydney", "crows-nest", "chatswood"],
};

/** The two or three nearest suburbs that also have a landing page. */
export function nearbyLocations(slug: string): Location[] {
  return (NEARBY[slug] ?? [])
    .map((s) => locations.find((l) => l.slug === s))
    .filter((l): l is Location => Boolean(l))
    .slice(0, 3);
}

export const locations: Location[] = [
  {
    slug: "lane-cove",
    suburb: "Lane Cove",
    metaTitle:
      "Corporate Headshots & Personal Branding Lane Cove | Nick Brand Photography",
    metaDescription:
      "Corporate headshots, personal branding and executive portraits photographed at the Nick Brand Photography studio in Lane Cove. Quick sessions for North Shore professionals.",
    h1: "Headshots & Personal Branding in Lane Cove",
    intro: [
      "Lane Cove is the home of Nick Brand Photography — the studio is on Centennial Avenue, around the corner from the Lane Cove village centre. For professionals and small businesses based in Lane Cove or the surrounding Lower North Shore, it is the closest dedicated headshot and branding studio in the area.",
      "Sessions at the studio cover corporate headshots, LinkedIn portraits, personal branding libraries and executive portraits, with consistent studio lighting and a choice of backgrounds. On-site work for Lane Cove businesses is straightforward to arrange — the mobile studio sets up directly in your office.",
    ],
    localSignals: [
      "Professional services and small businesses around Lane Cove village",
      "Consultants, advisors and founders based on the Lower North Shore",
      "Local medical, legal and accounting practices",
      "Businesses along Longueville and Centennial Avenue",
    ],
    logistics:
      "The studio is at 84 Centennial Avenue, Lane Cove — five minutes from the village centre with parking on site. On-site headshot days bring the mobile studio to Lane Cove offices.",
    gettingThere:
      "Because this is the home studio, Lane Cove sessions carry no travel time at all. Centennial Avenue sits just off Epping Road, with on-site parking at the door and buses along Longueville Road a short walk away. A single headshot session usually takes less time out of the day than the drive to a city studio would.",
    onSiteNote:
      "Lane Cove businesses are mostly street-level offices and small suites, which suits a mobile studio well — a meeting room or a cleared corner of roughly three metres by three metres is enough, and gear comes straight in from the car rather than through a loading dock.",
    faqs: [
      {
        q: "Where is the studio in Lane Cove?",
        a: "The studio is at 84 Centennial Avenue, a short walk from the Lane Cove village centre, with on-site parking. Sessions are private and run by Nick directly.",
      },
      {
        q: "Do you photograph Lane Cove businesses on-site as well?",
        a: "Yes. On-site headshot days are easy to arrange for Lane Cove offices — the mobile studio sets up in your space so the team is photographed without leaving the building.",
      },
      {
        q: "What does a Lane Cove headshot session cost?",
        a: "Individual headshots start at $395 and team rates are $285 per person for groups of five or more. Personal branding sessions start at $895.",
      },
    ],
  },

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
    gettingThere:
      "Lane Cove to the CBD is a straight run over the Harbour Bridge or through the tunnel — around 15 minutes outside peak, longer in it. For staff already in the city, the studio is also reachable by bus down Epping Road. Most CBD clients find it simpler to have the studio come to them, which is why the majority of city work is run on-site.",
    onSiteNote:
      "CBD towers need a little more planning than a street-level office: building access for a visitor, a booked lift or loading dock for the gear, and a bookable meeting room for the two-hour-plus window a team day needs. Give the building manager notice and the setup itself takes about thirty minutes.",
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
    gettingThere:
      "North Sydney sits about ten minutes from the Lane Cove studio along Epping Road and the Pacific Highway — close enough that an individual session fits comfortably inside a long lunch break, without crossing the bridge or paying for city parking.",
    onSiteNote:
      "The North Sydney core is dense with mid-rise towers around Miller and Berry Streets. As with the CBD, the practical requirements are visitor access, a lift that will take equipment cases, and one meeting room held for the duration. Street parking is scarce, so loading-dock access is worth arranging in advance.",
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
    gettingThere:
      "Surry Hills is a twenty-minute drive from Lane Cove outside peak, or a short walk from Central for anyone travelling by train. Because so much of the work here is on-location, the practical question is usually less about travel and more about which streets and interiors suit the brand.",
    onSiteNote:
      "Agency spaces in Surry Hills are often converted terraces and warehouses — high ceilings and character, but narrow stairs and limited floor space. A backdrop setup needs about three metres by three metres of clear floor; where that isn't available, the area's brick walls, laneways and studio interiors work as natural backgrounds instead, which usually suits a creative business better anyway.",
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
    gettingThere:
      "Parramatta is around 35 minutes from the Lane Cove studio via the M2, so for anything beyond a single portrait it makes far more sense for the studio to travel than for staff to. A whole team's worth of travel time — thirty people each losing an hour to the trip into the city — dwarfs the cost of an on-site day.",
    onSiteNote:
      "The Parramatta CBD mixes newer towers with government and institutional buildings, several of which need visitor passes arranged ahead of time. Confirm building access and a bookable room when the date is set, and allow thirty minutes for setup before the first person is due.",
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
    gettingThere:
      "Chatswood is roughly ten minutes from the Lane Cove studio by car. It is also one of the best-connected suburbs on the North Shore — train, metro and bus all meet at the interchange — so staff travelling from further up the line can reach a session easily either way.",
    onSiteNote:
      "Most Chatswood offices sit in towers above or beside the interchange, with commercial parking underneath. Book a bay or a dock slot for unloading, arrange a visitor pass, and hold one meeting room for the session. Medical and allied health practices in the area often prefer an early-morning slot before consulting starts.",
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
    gettingThere:
      "Barangaroo is about fifteen minutes from Lane Cove via the Harbour Tunnel, or a short walk from Wynyard for anyone already in the city. The Barangaroo metro station has made the precinct easier to reach from the North Shore than it once was.",
    onSiteNote:
      "The International Towers are tightly managed buildings: expect to arrange a visitor pass, a goods-lift booking and a nominated contact on the floor before the day. Once inside, the floors themselves are ideal — large, well-proportioned meeting rooms with plenty of clear space, and in several cases harbour light that works beautifully for executive portraits without any backdrop at all.",
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
    gettingThere:
      "Pyrmont is about twenty minutes from Lane Cove via the Anzac Bridge, and walkable from the western edge of the CBD. Parking on the peninsula is tight, so on-site days are planned around a loading bay or a booked commercial space rather than street parking.",
    onSiteNote:
      "Converted wharf and warehouse offices around Darling Island tend to have the two things a mobile studio wants most: floor space and ceiling height. Open-plan layouts mean it is worth picking a corner away from foot traffic so the queue doesn't run through someone's stand-up. The harbourside and the older sandstone streets nearby give branding sessions a genuinely different backdrop from a studio wall.",
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
    gettingThere:
      "Bondi Junction is around half an hour from Lane Cove through the tunnel and out along the Eastern Distributor. For Eastern Suburbs teams that usually makes an on-site day the obvious choice — the alternative is every staff member making the same trip individually.",
    onSiteNote:
      "The office towers above the interchange have commercial parking and lift access, which makes load-in straightforward, but meeting rooms can be in short supply — book one for the full window rather than hoping to find one on the day. Medical and specialist practices in the area often prefer a session scheduled around consulting hours.",
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
    gettingThere:
      "St Leonards is about five minutes from the Lane Cove studio — close enough that individual sessions are genuinely a lunch-break errand rather than an afternoon off. There is on-site parking at the studio, which matters here, because parking around the hospital precinct rarely is.",
    onSiteNote:
      "The health precinct has its own constraints: clinical spaces are not always available, corridors are busy, and consulting rooms are usually too small for a backdrop. Where a practice can't clear three metres by three metres, a boardroom in a neighbouring Pacific Highway office or a short walk to the studio is normally the simpler answer.",
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
    gettingThere:
      "Crows Nest is five to ten minutes from the Lane Cove studio, and the new metro station has put it within a short ride of both the CBD and Chatswood. For a founder or consultant, that usually means a session can be slotted into a morning without rearranging the day around it.",
    onSiteNote:
      "Willoughby Road businesses tend to be shopfronts, studios and small first-floor suites — characterful, but rarely with a spare three-by-three metre room. In practice most Crows Nest work is either shot at the nearby studio or on-location using the precinct itself, which suits a founder-led brand better than a plain backdrop.",
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
    gettingThere:
      "Macquarie Park is around fifteen to twenty minutes from the Lane Cove studio up Epping Road and the M2, with metro stations serving the precinct. Campuses here are spread out, so it is worth naming the specific building rather than just the address when a date is booked.",
    onSiteNote:
      "Corporate campuses are the easiest kind of on-site day to run well: dedicated visitor parking, large bookable rooms and, usually, a facilities contact who has done this before. The variable is scale — a headcount in the hundreds needs a schedule built in advance and often more than one day, so give as much notice as you can.",
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
    gettingThere:
      "Mosman is fifteen to twenty minutes from the Lane Cove studio across the Spit or via Military Road, depending on traffic. Studio parking is on site, which is worth knowing if you have ever tried to park near Bridgepoint at midday.",
    onSiteNote:
      "Mosman work skews towards individuals and small practices rather than large on-site days — a consultant refreshing a profile, a two-partner firm, a local business owner. Those are usually simplest at the studio, where lighting and background are already set, though on-location sessions around the harbour foreshore work well for branding libraries.",
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

/**
 * Service silo definitions for Nick Brand Photography.
 * Each entry produces one fully-structured, SEO-optimised service page.
 * Copy is written for search intent + AI retrieval: outcomes, industries and
 * process — not generic "capture your story" language.
 */

export type FAQ = { q: string; a: string };

export type Service = {
  slug: string;
  navLabel: string;
  /** <title> tag */
  metaTitle: string;
  metaDescription: string;
  /** H1 */
  h1: string;
  eyebrow: string;
  /** one-line summary used in cards and schema */
  summary: string;
  /** hero image silo + index */
  heroSilo: ImageSilo;
  heroIndex: number;
  /** opening body paragraphs */
  intro: string[];
  /** outcome-led value blocks */
  outcomes: { title: string; text: string }[];
  /** numbered process steps */
  process: { title: string; text: string }[];
  /** who the service is for — industries / use cases */
  whoFor: string[];
  /** gallery silo + how many images to show */
  gallerySilo: ImageSilo;
  galleryCount: number;
  /** key into pricingGroups (lib/pricing.ts), optional */
  pricingGroupKey?: "corporate" | "branding" | "portrait";
  faqs: FAQ[];
  /** related service slugs for internal linking */
  related: string[];
};

type ImageSilo =
  | "corporate-headshots"
  | "actor-headshots"
  | "model-portfolios"
  | "personal-branding"
  | "musician-portraits"
  | "singer-portraits"
  | "sports-portraits"
  | "creative-portraits"
  | "family";

export const services: Service[] = [
  /* ----------------------------------------------------------------------- */
  {
    slug: "corporate-headshots-sydney",
    navLabel: "Corporate Headshots",
    metaTitle: "Corporate Headshots Sydney | Nick Brand Photography",
    metaDescription:
      "Professional corporate headshots in Sydney. Studio in Lane Cove or on-site at your office. Consistent, polished headshots delivered fast. From $285 per person.",
    h1: "Corporate Headshots in Sydney",
    eyebrow: "Corporate Headshots",
    summary:
      "Polished, consistent corporate headshots for Sydney professionals and teams — studio or on-site.",
    heroSilo: "corporate-headshots",
    heroIndex: 4,
    intro: [
      "A corporate headshot is the first impression most clients, candidates and colleagues form of you. Nick Brand Photography produces clean, confident corporate headshots for Sydney professionals — images that look credible on a company website, a tender document, a conference bio or LinkedIn.",
      "Shoots run from the Lane Cove studio or on-site at your Sydney office. Every headshot is consistently lit and edited, so a team of five or a team of fifty looks like it belongs together.",
    ],
    outcomes: [
      {
        title: "Consistent across your whole team",
        text: "Matched lighting, framing and background mean new starters slot straight into an existing team page without looking out of place.",
      },
      {
        title: "Built for every platform",
        text: "Delivered in web, print and LinkedIn-ready crops so the same headshot works on your site, in a proposal and on social.",
      },
      {
        title: "Fast turnaround",
        text: "Standard delivery in five business days, with 48-hour express available when a deadline is tight.",
      },
      {
        title: "Comfortable direction",
        text: "Most people dislike being photographed. Clear, relaxed direction gets a natural, confident result in minutes — not an ordeal.",
      },
    ],
    process: [
      {
        title: "Brief",
        text: "We confirm the look, background and crop you need, and whether the shoot runs in-studio or at your office.",
      },
      {
        title: "Shoot",
        text: "A 45–90 minute session per person or a streamlined schedule for teams, with on-the-spot direction.",
      },
      {
        title: "Select",
        text: "You review a private online gallery and choose your favourite frames.",
      },
      {
        title: "Deliver",
        text: "Fully edited, high-resolution images in every crop you need, ready to publish.",
      },
    ],
    whoFor: [
      "Law firms and barristers' chambers",
      "Finance, accounting and advisory teams",
      "Technology companies and startups",
      "Real estate and property groups",
      "Consultants and professional services",
      "Executives refreshing a company bio",
    ],
    gallerySilo: "corporate-headshots",
    galleryCount: 12,
    pricingGroupKey: "corporate",
    faqs: [
      {
        q: "Where do corporate headshot sessions take place?",
        a: "Sessions run either at the Lane Cove studio or on-site at your Sydney office. For teams, an on-site mobile studio is set up so staff can be photographed with minimal disruption to the working day.",
      },
      {
        q: "How long does a corporate headshot session take?",
        a: "Individual sessions take 45 to 90 minutes depending on the package. For teams, allow roughly 10–15 minutes per person on a rolling schedule.",
      },
      {
        q: "How quickly are the headshots delivered?",
        a: "Standard delivery is within five business days. A 48-hour express option is available for an additional fee when you are working to a deadline.",
      },
      {
        q: "What should I wear for a corporate headshot?",
        a: "Solid, mid-to-dark colours photograph best. Bring one or two outfit options in the style your industry expects. You will receive wardrobe guidance before the shoot.",
      },
      {
        q: "How much do corporate headshots cost in Sydney?",
        a: "Individual corporate headshots start at $395, the most popular Professional package is $695, and team rates are $285 per person for groups of five or more.",
      },
    ],
    related: [
      "linkedin-headshots-sydney",
      "executive-portraits-sydney",
      "team-headshots-sydney",
    ],
  },

  /* ----------------------------------------------------------------------- */
  {
    slug: "linkedin-headshots-sydney",
    navLabel: "LinkedIn Headshots",
    metaTitle: "LinkedIn Headshots Sydney | Nick Brand Photography",
    metaDescription:
      "LinkedIn headshots in Sydney optimised for the platform. Approachable, professional profile photos that lift engagement and credibility. Book a session in Lane Cove.",
    h1: "LinkedIn Headshots in Sydney",
    eyebrow: "LinkedIn Headshots",
    summary:
      "Profile photos optimised for LinkedIn — approachable, credible and correctly cropped.",
    heroSilo: "corporate-headshots",
    heroIndex: 19,
    intro: [
      "Your LinkedIn photo is working whether you think about it or not — it appears next to every comment, message, application and search result. A sharp, approachable headshot makes people more likely to accept a connection, open a message or shortlist your profile.",
      "Nick Brand Photography shoots LinkedIn headshots in Sydney that are framed and cropped specifically for the platform: a tight, well-lit portrait that stays clear even at the small size LinkedIn displays.",
    ],
    outcomes: [
      {
        title: "Correctly cropped for the circle",
        text: "LinkedIn crops profile photos into a circle. Your headshot is composed so nothing important is lost and your face reads clearly at thumbnail size.",
      },
      {
        title: "Approachable, not stiff",
        text: "The aim is a portrait that looks like you on a good day — open and confident — so connections and recruiters engage rather than scroll past.",
      },
      {
        title: "Consistent personal brand",
        text: "Use the same headshot across LinkedIn, your email signature, conference bios and your company page for a recognisable professional identity.",
      },
      {
        title: "Background that works anywhere",
        text: "Clean, neutral backgrounds keep the focus on you and sit well against LinkedIn's interface.",
      },
    ],
    process: [
      {
        title: "Choose your look",
        text: "We discuss the tone you want — corporate, creative or founder — and the background that suits it.",
      },
      {
        title: "Quick, relaxed shoot",
        text: "A focused session with direction on angle, posture and expression so you get a confident frame fast.",
      },
      {
        title: "Review",
        text: "You pick your favourites from a private gallery.",
      },
      {
        title: "Platform-ready files",
        text: "Delivered in a LinkedIn-optimised crop plus standard sizes for other uses.",
      },
    ],
    whoFor: [
      "Job seekers and career changers",
      "Sales and business development professionals",
      "Recruiters and consultants",
      "Founders and company directors",
      "Anyone whose profile is regularly searched",
    ],
    gallerySilo: "corporate-headshots",
    galleryCount: 9,
    pricingGroupKey: "corporate",
    faqs: [
      {
        q: "What makes a LinkedIn headshot different from a normal headshot?",
        a: "A LinkedIn headshot is framed tighter and composed for a circular crop so it stays clear at small sizes. The expression is deliberately approachable, because LinkedIn is a networking platform rather than a formal directory.",
      },
      {
        q: "Do professional LinkedIn headshots actually make a difference?",
        a: "A clear, professional profile photo increases the likelihood that connection requests are accepted and messages are opened. Profiles with quality photos are consistently viewed and engaged with more often than those without.",
      },
      {
        q: "Can I use my LinkedIn headshot elsewhere?",
        a: "Yes. Every session is delivered in multiple crops so the same image works for LinkedIn, your email signature, speaker bios and company website.",
      },
      {
        q: "How much does a LinkedIn headshot cost in Sydney?",
        a: "LinkedIn headshots use the corporate headshot packages, starting at $395 for the Essential session, which includes a LinkedIn-ready crop.",
      },
    ],
    related: [
      "corporate-headshots-sydney",
      "personal-branding-sydney",
      "executive-portraits-sydney",
    ],
  },

  /* ----------------------------------------------------------------------- */
  {
    slug: "executive-portraits-sydney",
    navLabel: "Executive Portraits",
    metaTitle: "Executive Portraits Sydney | Nick Brand Photography",
    metaDescription:
      "Executive portrait photography in Sydney for leaders, partners and board members. Considered, authoritative portraits for annual reports, press and company profiles.",
    h1: "Executive Portraits in Sydney",
    eyebrow: "Executive Portraits",
    summary:
      "Considered, authoritative portraits for senior leaders, partners and boards.",
    heroSilo: "corporate-headshots",
    heroIndex: 33,
    intro: [
      "An executive portrait carries more weight than a standard headshot. It appears in annual reports, investor decks, press coverage, award submissions and the leadership page of your website — contexts where the image needs to convey authority and judgement, not just identification.",
      "Nick Brand Photography produces executive portraits in Sydney with a more deliberate approach to lighting, posing and environment, photographed in-studio or in your own boardroom or office.",
    ],
    outcomes: [
      {
        title: "Authority that reads instantly",
        text: "Considered lighting and posture communicate seniority and composure — the qualities stakeholders look for in a leader.",
      },
      {
        title: "Editorial and report ready",
        text: "Composed for annual reports, media use and award submissions, with crops and resolution suited to print and digital.",
      },
      {
        title: "On-location options",
        text: "Photographed in your boardroom, office or a Sydney location that reinforces your company's context and scale.",
      },
      {
        title: "A coherent leadership page",
        text: "Where a full leadership team is photographed, portraits are matched so the executive page looks unified and intentional.",
      },
    ],
    process: [
      {
        title: "Consultation",
        text: "We discuss where the portrait will be used and the impression it needs to make.",
      },
      {
        title: "Set the scene",
        text: "Studio or on-location, with lighting and environment chosen to suit the brief.",
      },
      {
        title: "Directed session",
        text: "Careful direction on posture and expression to achieve a confident, considered result.",
      },
      {
        title: "Refined delivery",
        text: "Carefully edited final images supplied in print and digital formats.",
      },
    ],
    whoFor: [
      "CEOs, managing directors and founders",
      "Law firm and accounting partners",
      "Board members and non-executive directors",
      "Annual report and investor relations teams",
      "Executives featured in press or speaking",
    ],
    gallerySilo: "corporate-headshots",
    galleryCount: 9,
    pricingGroupKey: "corporate",
    faqs: [
      {
        q: "What is the difference between an executive portrait and a corporate headshot?",
        a: "A corporate headshot is a clean, consistent identification photo. An executive portrait is more considered — the lighting, environment and posing are designed to communicate seniority and are suited to annual reports, press and leadership pages.",
      },
      {
        q: "Can executive portraits be taken at our office?",
        a: "Yes. Executive portraits are regularly photographed on-location in boardrooms and offices across Sydney, which adds context and saves senior leaders time.",
      },
      {
        q: "Can you photograph our whole leadership team?",
        a: "Yes. Leadership teams are photographed with matched lighting and framing so the executive page of your website or report looks unified.",
      },
      {
        q: "How much do executive portraits cost in Sydney?",
        a: "Executive portraits use the corporate packages, with the Professional session at $695 the most common choice for individual leaders. Team and leadership-group rates are available on enquiry.",
      },
    ],
    related: [
      "corporate-headshots-sydney",
      "team-headshots-sydney",
      "linkedin-headshots-sydney",
    ],
  },

  /* ----------------------------------------------------------------------- */
  {
    slug: "team-headshots-sydney",
    navLabel: "Team Headshots",
    metaTitle: "Team & Office Headshots Sydney | Nick Brand Photography",
    metaDescription:
      "On-site team headshots across Sydney. A mobile studio set up at your office for consistent staff headshots with minimal disruption. Team rate from $285 per person.",
    h1: "Team & Office Headshots in Sydney",
    eyebrow: "Team Headshots",
    summary:
      "On-site headshot days for Sydney teams — consistent results, minimal disruption.",
    heroSilo: "corporate-headshots",
    heroIndex: 41,
    intro: [
      "When a whole team needs headshots, consistency and logistics matter as much as the photography. Mismatched staff photos make a website or proposal look disjointed; a coordinated headshot day fixes that in a single visit.",
      "Nick Brand Photography runs on-site team headshot days across Sydney. A mobile studio is set up at your office, staff rotate through on a schedule, and everyone is photographed against the same background with the same lighting.",
    ],
    outcomes: [
      {
        title: "One consistent team look",
        text: "Every staff member is photographed identically, so your website team page and proposals look unified and professional.",
      },
      {
        title: "Minimal disruption",
        text: "A rolling schedule means each person is away from their desk for around ten minutes. The business keeps running.",
      },
      {
        title: "Easy to scale and maintain",
        text: "New starters can be added later in a matching style, so the team page stays current without a full reshoot.",
      },
      {
        title: "Simple billing",
        text: "Per-person team pricing and invoice billing make it straightforward to approve and expense.",
      },
    ],
    process: [
      {
        title: "Plan the day",
        text: "We agree a date, a running schedule and a suitable room for the mobile studio.",
      },
      {
        title: "Set up on-site",
        text: "The mobile studio is installed at your office before staff arrive.",
      },
      {
        title: "Photograph the team",
        text: "Staff rotate through quickly, each with the same lighting and background.",
      },
      {
        title: "Deliver",
        text: "Edited headshots delivered within five business days, organised per staff member.",
      },
    ],
    whoFor: [
      "Professional services firms",
      "Corporate and head offices",
      "Growing startups standardising their team page",
      "Real estate agencies",
      "Companies refreshing their website",
    ],
    gallerySilo: "corporate-headshots",
    galleryCount: 12,
    pricingGroupKey: "corporate",
    faqs: [
      {
        q: "How does an on-site team headshot day work?",
        a: "A mobile studio is set up in a room at your office. Staff come through on a pre-agreed schedule, each photographed with identical lighting and background, then return to work. A typical visit handles a large team in a few hours.",
      },
      {
        q: "How much space is needed for the mobile studio?",
        a: "A meeting room or a clear area roughly three metres by three metres is enough. Requirements are confirmed when the day is planned.",
      },
      {
        q: "Can new staff be photographed later to match?",
        a: "Yes. The setup is repeatable, so new starters can be photographed in the same style and added to your team page without reshooting everyone.",
      },
      {
        q: "How much do team headshots cost in Sydney?",
        a: "Team headshots are $285 per person for groups of five or more, including an on-site mobile studio setup, five edited images per person and invoice billing.",
      },
    ],
    related: [
      "corporate-headshots-sydney",
      "executive-portraits-sydney",
      "corporate-event-photographer-sydney",
    ],
  },

  /* ----------------------------------------------------------------------- */
  {
    slug: "personal-branding-sydney",
    navLabel: "Personal Branding",
    metaTitle:
      "Personal Branding Photographer Sydney | Nick Brand Photography",
    metaDescription:
      "Personal branding photography in Sydney for founders, consultants and creators. A library of headshots, lifestyle and at-work images for your website and socials.",
    h1: "Personal Branding Photographer in Sydney",
    eyebrow: "Personal Branding",
    summary:
      "A full library of branded images for founders, consultants and creators.",
    heroSilo: "personal-branding",
    heroIndex: 1,
    intro: [
      "If your name is your business, you need more than one headshot. A personal branding shoot produces a library of images — headshots, lifestyle frames, at-work moments and detail shots — that you can draw on for months across your website, social media, talks and press.",
      "Nick Brand Photography runs personal branding sessions in Sydney for founders, consultants, coaches and creators, planned around the platforms and content you actually publish.",
    ],
    outcomes: [
      {
        title: "Months of content from one day",
        text: "A planned shoot gives you a deep, varied image library so you are not reusing the same photo every week.",
      },
      {
        title: "A consistent visual identity",
        text: "Coherent styling, colour and tone across every image make your brand instantly recognisable.",
      },
      {
        title: "More than headshots",
        text: "Lifestyle, at-work and environmental frames show what you do and how you work — not just what you look like.",
      },
      {
        title: "Sized for every platform",
        text: "Images delivered in crops for websites, Instagram, LinkedIn and speaking profiles.",
      },
    ],
    process: [
      {
        title: "Strategy session",
        text: "We map the shots you need against where you publish and the story you want to tell.",
      },
      {
        title: "Plan looks and locations",
        text: "Outfits, locations and props are planned so the day runs smoothly and covers everything.",
      },
      {
        title: "The shoot",
        text: "A relaxed half or full day moving through looks and locations across Sydney.",
      },
      {
        title: "Deliver the library",
        text: "A large set of edited images, organised and sized for each platform.",
      },
    ],
    whoFor: [
      "Founders and solo business owners",
      "Consultants, coaches and advisors",
      "Speakers and content creators",
      "Real estate and finance professionals",
      "Anyone building a personal brand online",
    ],
    gallerySilo: "personal-branding",
    galleryCount: 2,
    pricingGroupKey: "branding",
    faqs: [
      {
        q: "What is personal branding photography?",
        a: "Personal branding photography is a planned shoot that produces a varied library of images — headshots, lifestyle and at-work frames — built around your business and the platforms you publish on, rather than a single headshot.",
      },
      {
        q: "How many images do I get from a personal branding session?",
        a: "The Brand Starter half day delivers 20 edited images, the Brand Full Day delivers 50, and Brand Premium delivers 75 or more, all sized for multiple platforms.",
      },
      {
        q: "Do you help plan the shoot?",
        a: "Yes. Every package includes creative direction, and the Full Day and Premium packages include a pre-shoot strategy session to plan looks, locations and the specific shots you need.",
      },
      {
        q: "How much does personal branding photography cost in Sydney?",
        a: "Personal branding sessions start at $895 for the Brand Starter half day, $1,695 for the Brand Full Day, and $2,800 for Brand Premium including hair and makeup.",
      },
    ],
    related: [
      "corporate-headshots-sydney",
      "linkedin-headshots-sydney",
      "actor-headshots-sydney",
    ],
  },

  /* ----------------------------------------------------------------------- */
  {
    slug: "actor-headshots-sydney",
    navLabel: "Actor Headshots",
    metaTitle: "Actor Headshots Sydney | Nick Brand Photography",
    metaDescription:
      "Actor headshots and model portfolios in Sydney. Industry-standard images with casting director guidance, multiple looks and fast turnaround. Portfolio build from $750.",
    h1: "Actor Headshots & Model Portfolios in Sydney",
    eyebrow: "Actor Headshots",
    summary:
      "Industry-standard actor headshots and model portfolios with casting-ready framing.",
    heroSilo: "actor-headshots",
    heroIndex: 1,
    intro: [
      "An actor headshot has one job: get you in the room. Casting directors scan hundreds of submissions, so your headshot needs to look like you on your best day, framed to the standard the industry expects.",
      "Nick Brand Photography shoots actor headshots and model portfolios in Sydney with multiple looks, honest direction and guidance on what casting directors and agencies are looking for.",
    ],
    outcomes: [
      {
        title: "Casting-standard framing",
        text: "Images composed and cropped to the format Australian agents and casting directors expect.",
      },
      {
        title: "A range of looks",
        text: "Multiple setups and look changes in one session so you have options for different roles and submissions.",
      },
      {
        title: "It still looks like you",
        text: "Natural, accurate images — because a headshot that oversells leads to a wasted audition for everyone.",
      },
      {
        title: "Fast when you need it",
        text: "A 24-hour rush option is available when a submission deadline is close.",
      },
    ],
    process: [
      {
        title: "Talk it through",
        text: "We discuss the roles you are submitting for and the looks that will serve you best.",
      },
      {
        title: "Shoot multiple looks",
        text: "Dramatic and natural light setups with three to four look changes.",
      },
      {
        title: "Choose with guidance",
        text: "Review the gallery with input on which frames work hardest for casting.",
      },
      {
        title: "Deliver",
        text: "Industry-standard sizing, retouched and ready to submit.",
      },
    ],
    whoFor: [
      "Actors building or refreshing a headshot",
      "Models developing a portfolio",
      "Performers preparing agency submissions",
      "Drama school graduates",
      "Presenters and on-camera talent",
    ],
    gallerySilo: "actor-headshots",
    galleryCount: 6,
    pricingGroupKey: "portrait",
    faqs: [
      {
        q: "What do actors get in a portfolio session?",
        a: "The Portfolio Build is a two-hour session with dramatic and natural light setups, three to four look changes, 25 fully edited images at industry-standard sizing, and casting director guidance on selection.",
      },
      {
        q: "Do you photograph models as well as actors?",
        a: "Yes. The Portfolio Build session suits both actors and models. The shoot is planned around the work you are submitting for.",
      },
      {
        q: "How quickly can I get my headshots?",
        a: "Standard delivery applies to every session, and a 24-hour rush option is available when you have a submission deadline.",
      },
      {
        q: "How much do actor headshots cost in Sydney?",
        a: "The actor and model Portfolio Build is $750 for a two-hour session in studio or on location.",
      },
    ],
    related: [
      "personal-branding-sydney",
      "corporate-headshots-sydney",
      "corporate-event-photographer-sydney",
    ],
  },

  /* ----------------------------------------------------------------------- */
  {
    slug: "corporate-event-photographer-sydney",
    navLabel: "Corporate Events",
    metaTitle:
      "Corporate Event Photographer Sydney | Nick Brand Photography",
    metaDescription:
      "Corporate event photography in Sydney — conferences, awards, launches and functions. Discreet coverage and fast delivery for marketing, PR and recap content.",
    h1: "Corporate Event Photographer in Sydney",
    eyebrow: "Corporate Events",
    summary:
      "Discreet, usable coverage of Sydney conferences, awards nights and launches.",
    heroSilo: "corporate-headshots",
    heroIndex: 27,
    intro: [
      "A corporate event is an investment, and the photography is what lets you use it again — for marketing, PR, sponsor reporting, internal communications and next year's promotion.",
      "Nick Brand Photography covers conferences, award nights, product launches and corporate functions across Sydney with a discreet approach that captures the moments that matter without interrupting the event.",
    ],
    outcomes: [
      {
        title: "Coverage you can actually use",
        text: "Speakers, candid networking, branding, sponsor signage and the room — the images marketing and PR teams need.",
      },
      {
        title: "Discreet on the floor",
        text: "Experienced, unobtrusive shooting so guests stay relaxed and the event runs as planned.",
      },
      {
        title: "Fast delivery",
        text: "A same-day or next-day selection is available for social and press, with the full gallery to follow.",
      },
      {
        title: "Briefed to your priorities",
        text: "We confirm the must-have shots in advance — keynote, award moments, VIPs and sponsors.",
      },
    ],
    process: [
      {
        title: "Pre-event brief",
        text: "We agree the run sheet, key moments, VIPs and the shots you must come away with.",
      },
      {
        title: "Cover the event",
        text: "Discreet coverage across the agreed timeline, from arrivals to close.",
      },
      {
        title: "Edit and select",
        text: "Images are culled and edited, with a priority set for immediate use.",
      },
      {
        title: "Deliver the gallery",
        text: "A complete, organised gallery ready for marketing, PR and reporting.",
      },
    ],
    whoFor: [
      "Conferences and summits",
      "Award nights and gala dinners",
      "Product and brand launches",
      "Corporate functions and parties",
      "Marketing, PR and events teams",
    ],
    gallerySilo: "corporate-headshots",
    galleryCount: 9,
    faqs: [
      {
        q: "What corporate events do you photograph?",
        a: "Conferences, summits, award nights, gala dinners, product launches and corporate functions across Sydney. Coverage is scoped to your run sheet and the moments that matter most.",
      },
      {
        q: "How quickly are event photos delivered?",
        a: "A priority selection can be delivered same-day or next-day for social media and press, with the full edited gallery following shortly after.",
      },
      {
        q: "How is event coverage priced?",
        a: "Corporate event coverage is quoted per event based on hours, the run sheet and delivery requirements. Contact Nick with your event details for a quote.",
      },
      {
        q: "Can you photograph headshots at our event?",
        a: "Yes. A headshot station can be added to a conference or function so attendees can update their professional photo on the day. This pairs well with a team headshot day.",
      },
    ],
    related: [
      "team-headshots-sydney",
      "corporate-headshots-sydney",
      "executive-portraits-sydney",
    ],
  },

  /* ----------------------------------------------------------------------- */
  {
    slug: "family-photography-sydney",
    navLabel: "Family Sessions",
    metaTitle: "Family Photographer Sydney | Nick Brand Photography",
    metaDescription:
      "Relaxed family photography in Sydney. Natural outdoor sessions at beaches and parks, with a print release and online gallery. Family sessions from $550.",
    h1: "Family Photography in Sydney",
    eyebrow: "Family Sessions",
    summary:
      "Relaxed, natural family sessions at Sydney's beaches and parks.",
    heroSilo: "family",
    heroIndex: 1,
    intro: [
      "Family photography should feel like a good afternoon out, not a stiff studio appointment. The best family images come from a relaxed session where everyone — including the kids and the dog — is comfortable enough to be themselves.",
      "Nick Brand Photography runs natural, outdoor family sessions at Sydney beaches, parks and golden-hour locations, with honest direction that keeps the day easy and the photos genuine.",
    ],
    outcomes: [
      {
        title: "Relaxed and natural",
        text: "An unhurried session at a Sydney location, directed gently so the images feel like your family rather than a pose.",
      },
      {
        title: "Beautiful Sydney locations",
        text: "Beaches, parks and harbourside spots, timed for the best light of the day.",
      },
      {
        title: "Prints and gallery included",
        text: "Every session includes a print release and an online gallery, so you can print and share freely.",
      },
      {
        title: "Everyone welcome",
        text: "Up to six people per session — and pets are welcome too.",
      },
    ],
    process: [
      {
        title: "Pick a location",
        text: "We choose a Sydney location and a time that suits the light and your family.",
      },
      {
        title: "The session",
        text: "Around 90 relaxed minutes with light, natural direction.",
      },
      {
        title: "Choose your favourites",
        text: "Review your images in a private online gallery.",
      },
      {
        title: "Deliver",
        text: "20 fully edited images with a print release included.",
      },
    ],
    whoFor: [
      "Families wanting up-to-date photos together",
      "Extended-family gatherings",
      "Newborn and milestone celebrations",
      "Families with pets",
      "Anyone wanting natural outdoor portraits",
    ],
    gallerySilo: "family",
    galleryCount: 9,
    pricingGroupKey: "portrait",
    faqs: [
      {
        q: "Where do family sessions take place?",
        a: "Family sessions are photographed outdoors at Sydney beaches, parks and harbourside locations, chosen with you and timed for the best natural light.",
      },
      {
        q: "How many people can be in a family session?",
        a: "A standard family session covers up to six people, and pets are welcome. For larger extended-family groups, get in touch to plan the session.",
      },
      {
        q: "Do I get a print release?",
        a: "Yes. Every family session includes a print release and an online gallery, so you are free to print and share your images.",
      },
      {
        q: "How much does a family photography session cost in Sydney?",
        a: "A family session is $550 for 90 minutes, up to six people, and includes 20 fully edited images, an online gallery and a print release.",
      },
    ],
    related: ["personal-branding-sydney", "corporate-headshots-sydney"],
  },
];

/** Look up a service by slug. */
export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** All service slugs — used for static generation and the sitemap. */
export const serviceSlugs = services.map((s) => s.slug);

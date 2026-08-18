/**
 * Service silo definitions for Nick Brand Photography.
 * Each entry produces one fully-structured, SEO-optimised service page.
 * Copy is written for search intent + AI retrieval: outcomes, industries and
 * process — not generic "capture your story" language.
 */

import type { SiloKey } from "./images";

export type FAQ = { q: string; a: string };

/**
 * An objection is an FAQ that answers a reason someone doesn't book.
 *
 * `hideWhenGalleryAtLeast` exists for the handful of objections that
 * acknowledge a thin portfolio ("there aren't many actor headshots here").
 * Those answers are true today and must not survive as a lie once the
 * photography is ingested, so the page drops them automatically once the
 * gallery reaches that many images.
 */
export type Objection = FAQ & { hideWhenGalleryAtLeast?: number };

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
  /**
   * Preferred hero silo, used instead of `heroSilo` as soon as it contains
   * images. Lets the events and team pages switch to their own photography the
   * moment it is ingested, without another code change.
   */
  heroSiloWhenAvailable?: ImageSilo;
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
  /**
   * The pricing tiers this page shows, named by the session type each one
   * books, in display order. THIS SERVICE'S OWN SESSIONS ONLY — a family page
   * must not list actor or band tiers, which is exactly what happened when
   * pages rendered a whole pricing group.
   *
   * Ids must exist in `sessionTypes` (lib/booking.ts) and be carried by a tier
   * in `pricingGroups` (lib/pricing.ts). Omit for a page with no pricing.
   */
  pricingSessionIds?: string[];
  /** Heading for the pricing section. Defaults to "Pricing" if unset. */
  pricingTitle?: string;
  /**
   * The session this page's own CTAs should open — an `id` from `sessionTypes`
   * in lib/booking.ts. Without it, "Check Availability" lands on the generic
   * picker, which leads with corporate headshots: a family or branding visitor
   * appears to be bounced back to a service they weren't looking at.
   * Clients can still switch via "← Change session" in the flow.
   */
  bookingSessionId?: string;
  faqs: FAQ[];
  /** related service slugs for internal linking */
  related: string[];

  /* ----------------------------------------------------------------------- *
   * Everything below was added after the August 2026 audit, which found the
   * service pages carrying 388–532 words of unique copy against competitor
   * pages running 2,500–4,500, with no objection handling anywhere on the site
   * and no contextual internal links out of the money pages.
   * ----------------------------------------------------------------------- */

  /**
   * Objection handling — the reasons people don't book. Rendered as a normal,
   * always-visible section, NOT inside the FAQ accordion, because these are the
   * arguments a hesitant buyer needs to read without clicking.
   */
  objections?: Objection[];
  /** What the price covers and what moves it. Feeds the pricing section. */
  costNotes?: string[];
  /** What is deliberately not included. Stating it plainly reads as honesty. */
  notIncluded?: string[];
  /** Industry-specific guidance — where a specialist beats a generalist. */
  industryNotes?: { title: string; text: string }[];
  /** What tends to go wrong, and how it is prevented. */
  commonMistakes?: { title: string; text: string }[];
  /**
   * Which option the inline enquiry form should preselect. Must match one of
   * SESSION_OPTIONS in components/ContactForm.tsx.
   */
  formInterest?: string;
  /** Blog post slugs to link contextually from the body. */
  relatedPosts?: string[];
  /** Suburb slugs to link contextually from the body. */
  relatedLocations?: string[];
  /**
   * Primary CTA override. "Check Availability" opens a booking calendar, which
   * is right for one person choosing a time and wrong for an office manager
   * arranging thirty staff and an invoice.
   */
  ctaLabel?: string;
  ctaHref?: string;
  /**
   * Shown in place of the gallery when there is no honest portfolio for this
   * service yet. Better an empty section with a truthful note than a gallery of
   * studio headshots captioned as conference coverage.
   */
  galleryNote?: string;
};

/**
 * Silo names come from lib/images.ts rather than being duplicated here — the
 * local copy of this union drifted out of date the moment a new silo was added.
 */
type ImageSilo = SiloKey;

export const services: Service[] = [
  /* ----------------------------------------------------------------------- */
  {
    slug: "corporate-headshots-sydney",
    formInterest: "Corporate headshots",
    bookingSessionId: "headshot-professional",
    pricingSessionIds: [
      "headshot-essential",
      "headshot-professional",
      "team-quote",
    ],
    pricingTitle: "Corporate Headshot Pricing",
    navLabel: "Corporate Headshots",
    metaTitle: "Corporate Headshots Sydney | Nick Brand Photography",
    metaDescription:
      "Professional corporate headshots in Sydney. Studio in Lane Cove or on-site at your office. Consistent, polished, delivered fast. From $395; team rate $285.",
    h1: "Corporate Headshots in Sydney",
    relatedPosts: [
      "what-to-wear-for-corporate-headshots",
      "corporate-photography-tips-for-law-firms",
    ],
    relatedLocations: ["sydney-cbd", "north-sydney", "barangaroo"],
    costNotes: [
      "Every price on this page is the final price. Nick Brand Photography is not registered for GST, so nothing is added at invoice — worth checking when you compare quotes, because most Sydney studios advertise ex-GST figures that are 10% higher than they look.",
      "What moves the price is time and output, not mystery. A 45-minute Essential session produces five edited images; a 90-minute Professional session produces fifteen, across more outfit changes and both studio and outdoor setups.",
      "Team rates drop to $285 per person from five people up, because the setup cost is spread across the group rather than carried by one session.",
      "The two genuine extras are express turnaround (+$80 for 48 hours) and additional edited images beyond the package. Neither is compulsory and neither is quoted after the fact.",
      "Travel within Greater Sydney is included for on-site days. There is no separate mileage line, no studio hire fee and no image-licensing surcharge for ordinary business use.",
    ],
    notIncluded: [
      "Hair and makeup. It is available on request through an artist Nick works with, billed at cost — it is not padded into the session fee for the majority of clients who don't want it.",
      "Heavy retouching. Editing covers colour, contrast, skin tone, stray hairs and blemishes. Reshaping faces or bodies is not done, because a headshot that doesn't look like you fails at the one job it has.",
      "Unlimited images. Packages deliver a defined number of finished frames; extras are available, but the aim is a handful you will actually use rather than a hundred you will never sort through.",
      "Exclusive or resale image rights. You get full rights to use your headshots for business and personal promotion; Nick retains copyright in the photographs, as is standard.",
    ],
    industryNotes: [
      {
        title: "Law firms and chambers",
        text: "Partners are usually photographed with a slightly more considered setup than associates, but on the same background so the people page still reads as one firm. The practical constraint is billable time — a rolling ten-minute schedule, run in the firm's own boardroom, costs a partner less than the trip to a studio does.",
      },
      {
        title: "Finance, accounting and advisory",
        text: "Conservative styling, mid-to-dark suiting and a clean background. These headshots end up in pitch documents and regulatory filings as often as on the website, so they are delivered in print resolution as well as web crops.",
      },
      {
        title: "Technology companies and startups",
        text: "A softer, more approachable read usually suits better than formal corporate lighting — but consistency still matters, because a team page where half the photos were taken at a desk with a phone undermines the half that weren't.",
      },
      {
        title: "Real estate and property",
        text: "Agents need a headshot that survives being printed at postcard size on a letterbox drop and shown at thumbnail size on a portal listing. Framing is tighter, and contrast is set so the face still reads after a third-party platform re-compresses it.",
      },
      {
        title: "Medical and allied health",
        text: "Approachability does most of the work here — a patient choosing a specialist is looking for someone they would feel comfortable with. Sessions are usually scheduled around consulting hours, early morning or late afternoon.",
      },
    ],
    commonMistakes: [
      {
        title: "Booking a different photographer each time",
        text: "The single most common reason a team page looks disjointed. Different lighting, different crop, different background — and it shows immediately. If the last set was shot by someone else, matching the existing look is usually possible; ask before you book.",
      },
      {
        title: "Leaving it until the week of the deadline",
        text: "Express turnaround exists for exactly this, but the tightest constraint is usually the diary rather than the editing. Two to three weeks' notice for a team day means you get the date you want.",
      },
      {
        title: "Photographing only the people who are in that day",
        text: "Half a team page in one style and half in another is worse than a consistent old set. Plan for the absentees — the setup is repeatable, so latecomers can be matched afterwards.",
      },
      {
        title: "Choosing the photo you like instead of the one that works",
        text: "People tend to pick the frame where they think they look best. That is not always the one that reads clearly at 200 pixels next to a comment thread. You get honest input on which frame does the job.",
      },
    ],
    objections: [
      {
        q: "$395 seems like a lot for one photograph.",
        a: "It is not one photograph — it is a 45-minute session, five finished images, and a result you will use across a website, a LinkedIn profile, an email signature and every proposal you send for the next two or three years. Spread across that, it is one of the cheaper pieces of professional presentation you will buy. If the budget genuinely isn't there, say so when you enquire; it is better to be told what is possible than to be sold something that isn't right.",
      },
      {
        q: "Can't we just use phone photos? The cameras are very good now.",
        a: "Phone cameras are excellent, and for a casual profile they are often fine. What they cannot do is produce thirty portraits that match each other — same light, same distance, same background — because the variable isn't the sensor, it's the lighting and the consistency. For an individual, the difference shows mostly in how a short lens distorts a face at close range. For a team, it shows immediately.",
      },
      {
        q: "What about AI headshots? They're a fraction of the price.",
        a: "AI headshot generators are fast and cheap, and for a personal profile some people are perfectly happy with the result. The problems are that the output drifts from your actual likeness, that it is increasingly recognisable as AI to the people you are trying to impress, and that most tools give you no usable rights position for commercial use. If your photo is doing a job in a professional context — pitching, hiring, being trusted with money or health — a real photograph is still the safer choice.",
      },
      {
        q: "What if I hate the results?",
        a: "You see the images in a private gallery before anything is finished, and you choose which frames get edited. If the session genuinely hasn't produced something you are happy with, Nick will reshoot it. That has been rare, mostly because the direction happens during the shoot rather than being discovered afterwards.",
      },
      {
        q: "I photograph terribly. I always look awkward.",
        a: "Almost everyone says this, and it is the most predictable part of the job. The awkwardness is usually the first five minutes and it is planned for — you are told what to do with your hands, your jaw and your eyes rather than being asked to relax and be yourself in front of a stranger with a camera. Most people are surprised by how quickly it stops feeling strange.",
      },
      {
        q: "Do you have insurance? Our building will ask.",
        a: "Yes — $20 million public liability. A certificate of currency is supplied on request, which building managers and procurement teams usually want before an on-site day is approved. Ask for it when you book and it will not hold up the date.",
      },
    ],
    eyebrow: "Corporate Headshots",
    summary:
      "Polished, consistent corporate headshots for Sydney professionals and teams — studio or on-site.",
    heroSilo: "corporate-headshots",
    heroIndex: 32,
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
    formInterest: "Corporate headshots",
    bookingSessionId: "headshot-essential",
    pricingSessionIds: ["headshot-essential", "headshot-professional"],
    pricingTitle: "LinkedIn Headshot Pricing",
    navLabel: "LinkedIn Headshots",
    metaTitle: "LinkedIn Headshots Sydney | Nick Brand Photography",
    metaDescription:
      "LinkedIn headshots in Sydney, optimised for the platform. Approachable, professional profile photos that lift engagement and credibility.",
    h1: "LinkedIn Headshots in Sydney",
    relatedPosts: [
      "why-professional-headshots-increase-linkedin-engagement",
      "what-to-wear-for-corporate-headshots",
    ],
    relatedLocations: ["sydney-cbd", "north-sydney", "crows-nest"],
    costNotes: [
      "$395 for the Essential session, which includes a LinkedIn-ready crop. No GST is added — the advertised price is the invoice price.",
      "The $695 Professional session exists for people who want more than one look: studio and outdoor, three to four outfit changes, fifteen finished images rather than five.",
      "You are not charged separately for platform crops. Every session is delivered in the square and circular-safe framing LinkedIn needs, plus standard sizes for a website and an email signature.",
    ],
    notIncluded: [
      "Profile writing or LinkedIn strategy. The photograph is the deliverable.",
      "Heavy retouching. Your connections are going to meet you.",
    ],
    objections: [
      {
        q: "Does a professional photo actually change anything on LinkedIn?",
        a: "LinkedIn's own guidance is that profiles with a photo are viewed and contacted substantially more often than profiles without one, and it is not hard to see why — a blank avatar reads as an inactive account. What a professional photo adds beyond simply having one is harder to measure honestly, and anyone quoting you a precise percentage is guessing. The defensible claim is narrower: a clear, well-lit, correctly-cropped face reads better at thumbnail size than a cropped wedding photo, and that is the size LinkedIn actually shows it at.",
      },
      {
        q: "Can't I just crop a photo I already have?",
        a: "Often, yes — and if you have a good one, use it. The usual problems are that the light is behind you, the crop is too wide so your face is tiny in the circle, or there is a stranger's shoulder in frame. If none of those apply, you do not need to book anything.",
      },
      {
        q: "What about an AI-generated headshot?",
        a: "For a personal profile some people are happy with them. The three practical issues are likeness drift, the fact that people are getting better at spotting them, and the murky rights position for commercial use. If you are job-hunting or business-developing — where the photo is doing real work — a photograph of you is still the safer bet.",
      },
      {
        q: "How often should I update it?",
        a: "Every two to three years, or sooner if your appearance, role or industry has changed noticeably. The test is simple: if someone met you off the back of your profile, would they recognise you?",
      },
    ],
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
    formInterest: "Corporate headshots",
    bookingSessionId: "headshot-professional",
    pricingSessionIds: ["headshot-professional", "team-quote"],
    pricingTitle: "Executive Portrait Pricing",
    navLabel: "Executive Portraits",
    metaTitle: "Executive Portraits Sydney | Nick Brand Photography",
    metaDescription:
      "Executive portrait photography in Sydney for leaders, partners and board members — authoritative portraits for annual reports, press and company profiles.",
    h1: "Executive Portraits in Sydney",
    ctaLabel: "Request a Quote",
    ctaHref: "/contact?service=executive-portraits-sydney",
    relatedPosts: [
      "best-backgrounds-for-executive-portraits",
      "corporate-photography-tips-for-law-firms",
    ],
    relatedLocations: ["barangaroo", "sydney-cbd", "north-sydney"],
    costNotes: [
      "$695 for an individual executive session. No GST is added.",
      "Leadership groups are quoted rather than priced per head, because the variable is how many locations and setups the group needs, not how many faces there are.",
      "Delivered at print resolution as well as web crops, because these images end up in annual reports and press as often as on a website.",
    ],
    notIncluded: [
      "Compositing separate portraits into a fake group photograph. If the board needs to appear together, they need to be in the same room.",
      "Reshaping or de-aging. Lighting and posing do the work.",
    ],
    objections: [
      {
        q: "Why is this more than a corporate headshot?",
        a: "Because it is a different job. A headshot identifies you clearly and consistently. An executive portrait is built to carry authority in contexts where the reader is forming a judgement about your competence — an annual report, an investor deck, a press profile. That means more time on lighting, more attention to posture and environment, and usually a location that says something about the organisation.",
      },
      {
        q: "Our leadership team can't all be free on the same day.",
        a: "That is normal, and it is the main reason leadership sets look mismatched. The setup is documented and repeatable, so directors can be photographed across two or three visits and still match. What does not work is photographing half now and the other half in a year with a different photographer.",
      },
      {
        q: "Do we have to come to a studio?",
        a: "No. A large share of executive work is shot in the client's own boardroom or office, which saves senior people time and gives the portrait context that a plain backdrop cannot. Where a clean, formal look is wanted, the Lane Cove studio is available.",
      },
    ],
    eyebrow: "Executive Portraits",
    summary:
      "Considered, authoritative portraits for senior leaders, partners and boards.",
    heroSilo: "corporate-headshots",
    heroIndex: 35,
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
    formInterest: "Team / office headshots",
    bookingSessionId: "team-quote",
    pricingSessionIds: ["team-quote", "headshot-professional"],
    pricingTitle: "Team Headshot Pricing",
    navLabel: "Team Headshots",
    metaTitle: "Team & Office Headshots Sydney | Nick Brand Photography",
    metaDescription:
      "On-site team headshots across Sydney. A mobile studio set up at your office for consistent staff headshots with minimal disruption. From $285 per person.",
    h1: "Team & Office Headshots in Sydney",
    ctaLabel: "Get a Team Quote",
    ctaHref: "/contact?service=team-headshots-sydney",
    relatedPosts: [
      "corporate-photography-tips-for-law-firms",
      "what-to-wear-for-corporate-headshots",
    ],
    relatedLocations: ["sydney-cbd", "north-sydney", "parramatta"],
    costNotes: [
      "$285 per person from five people up. There is no separate call-out fee, no mobile studio hire charge and no travel surcharge within Greater Sydney — the per-person rate is the whole cost.",
      "No GST is added. Nick Brand Photography is not registered for GST, so a quote for thirty people is $8,550 and the invoice is $8,550. Most Sydney studios quote ex-GST, so compare carefully.",
      "A rough guide to a day: 10 people ≈ 2 hours on site, 20 people ≈ 3.5 hours, 30 people ≈ 5 hours, 50 people ≈ a full day. Setup adds about 30 minutes before the first person.",
      "Each person gets five edited images. Additional edits are available per image if someone needs more options for a specific use.",
      "Invoice billing with standard terms, so it goes through accounts payable like any other supplier rather than needing a card on the day.",
    ],
    notIncluded: [
      "Group or 'whole team in one frame' photographs. These are a different setup and are quoted separately — say so up front if you want them, because they change the room and the schedule.",
      "Hair and makeup. Available on request through an artist Nick works with, billed at cost. On most team days nobody wants it, so it is not built into the rate.",
      "Photography of the office, the space or the day itself. If you want workplace and culture images for careers pages alongside the headshots, that is a separate half day.",
      "Individual retouching requests beyond standard editing. Colour, contrast, skin tone and blemishes are included; reshaping is not.",
    ],
    industryNotes: [
      {
        title: "Professional services firms",
        text: "The pattern that works is partners and senior staff photographed with the same setup as everyone else, then given a second, more considered frame for the leadership page. One visit, two levels of output, one consistent look.",
      },
      {
        title: "Growing startups",
        text: "The reason to standardise now rather than later is that the cost of re-doing forty mismatched photos is much higher than the cost of doing forty consistent ones. The setup is documented so new starters can be matched in six months' time.",
      },
      {
        title: "Companies with staff across multiple floors or sites",
        text: "A rolling schedule assumes people can reach the room in about a minute. Where a team is spread across floors or offices, the schedule is built in blocks by location instead — it works, it just needs planning rather than a signup sheet.",
      },
      {
        title: "Organisations with privacy or consent requirements",
        text: "Government, health and education clients often need a documented consent position for staff images. Written consent forms and a clear usage statement can be provided ahead of the day so the approval is done before anyone stands in front of the camera.",
      },
    ],
    commonMistakes: [
      {
        title: "Not booking the room for long enough",
        text: "The most common day-of problem. A meeting room booked for exactly the shooting window leaves no time for setup or pack-down, and someone else's stand-up is waiting outside. Book it for the session plus an hour.",
      },
      {
        title: "Emailing a signup sheet and hoping",
        text: "Self-scheduling produces clumps and gaps. A named ten-minute slot per person, sent by the office manager, gets a much higher turnout and finishes the day faster.",
      },
      {
        title: "Choosing a room with a window behind the backdrop",
        text: "Strong daylight behind the setup fights the lighting all day. A room with a plain wall, controllable blinds and about three metres by three metres of clear floor is ideal — it does not need to be the nice boardroom.",
      },
      {
        title: "Telling staff nothing beforehand",
        text: "People who arrive unprepared photograph worse and take longer. A short wardrobe note sent a week ahead — solid mid-to-dark colours, bring a second option, avoid busy patterns — measurably improves the whole set. A template is supplied.",
      },
    ],
    objections: [
      {
        q: "How much disruption is this actually going to cause?",
        a: "Roughly ten minutes per person, on a schedule they are given in advance. The mobile studio is set up before the first slot and packed down after the last, so the only time anyone is away from their desk is their own ten minutes. For a thirty-person team that is five hours of photography and about five person-hours of lost work — considerably less than sending thirty people to a studio.",
      },
      {
        q: "We don't have a big meeting room.",
        a: "Three metres by three metres of clear floor is enough, and that is a fairly ordinary meeting room with the table pushed aside. Ceiling height matters more than floor area. If genuinely nothing suitable exists, tell Nick when you enquire — there are setups that work in tighter spaces, and it is better to know before the day.",
      },
      {
        q: "What happens when we hire someone next month?",
        a: "The setup is documented — lighting positions, background, distance, lens — so a new starter can be photographed in the same style and dropped straight into the team page. That is the whole point of running it as a system rather than a one-off. Individual sessions for new staff are booked at the standard rate.",
      },
      {
        q: "Our procurement team will need paperwork.",
        a: "$20 million public liability, certificate of currency on request, an ABN, written terms and invoice billing with standard payment terms. Everything a supplier onboarding form asks for is available before the date is confirmed — ask when you enquire and it will not delay anything.",
      },
      {
        q: "What if someone is sick or away on the day?",
        a: "It happens on almost every team day. Absentees are photographed at a later session in the same style, either at a follow-up visit or at the Lane Cove studio, so the team page stays consistent. There is no penalty for it.",
      },
      {
        q: "Can we see what a whole finished team set looks like?",
        a: "Ask, and Nick will walk you through a complete delivered set on a call. Full team sets are not published on the website because they belong to the client and are not shared without permission — which is also the reason you will not see a wall of client logos here.",
      },
    ],
    eyebrow: "Team Headshots",
    summary:
      "On-site headshot days for Sydney teams — consistent results, minimal disruption.",
    heroSilo: "corporate-headshots",
    heroIndex: 41,
    heroSiloWhenAvailable: "team-headshots",
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
    formInterest: "Personal branding",
    bookingSessionId: "brand-starter",
    pricingSessionIds: ["brand-starter", "brand-full-day", "brand-premium"],
    pricingTitle: "Personal Branding Pricing",
    navLabel: "Personal Branding",
    metaTitle:
      "Personal Branding Photographer Sydney | Nick Brand Photography",
    metaDescription:
      "Personal branding photography in Sydney for founders, consultants and creators. Headshots, lifestyle and at-work images for your website and socials.",
    h1: "Personal Branding Photographer in Sydney",
    relatedPosts: [
      "personal-branding-photography-for-entrepreneurs",
      "sydney-locations-for-branding-photography",
    ],
    relatedLocations: ["surry-hills", "pyrmont", "crows-nest"],
    costNotes: [
      "$895 for a half day, $1,695 for a full day, $2,800 for the premium day with hair and makeup included. No GST is added — Nick Brand Photography is not registered for it, so the advertised figure is the invoice figure.",
      "The variable that actually drives the price is coverage: 20 finished images from one location, 50 from two or three, or 75+ with a stylist and a wardrobe plan. You are buying breadth of usable content, not hours.",
      "Divide it by the months of content it produces. A full day that yields 50 images is a year of posts, a website refresh, a speaker profile and a press kit — usually cheaper per image than commissioning a single headshot four times.",
      "Locations across Sydney are included. Any venue hire, permit or stylist fee is passed through at cost and agreed before the day, never added afterwards.",
      "Ongoing clients can lock in a repeat rate — brand libraries date, and a refresh every twelve to eighteen months is usually cheaper than starting again.",
    ],
    notIncluded: [
      "Video. Stills only. If you need video content from the same day, say so early — it changes the plan and needs a second person.",
      "Copywriting, strategy or brand identity work. You get creative direction on the shoot itself, not a brand strategy engagement.",
      "Hair and makeup on the Starter and Full Day packages. It is included on Premium and available at cost on the others.",
      "Unlimited revisions of the edit. You choose the frames; the edit is done once, properly.",
    ],
    industryNotes: [
      {
        title: "Founders and business owners",
        text: "The images that get used most are rarely the polished headshots — they are the at-work frames, the mid-conversation ones and the environmental shots that give a website and a pitch deck something to breathe around. Plan for those, not just the profile photo.",
      },
      {
        title: "Consultants, coaches and advisors",
        text: "Your face is the product. The set needs to cover credibility (clean, direct, professional) and warmth (approachable, in conversation, working with someone), because different pages on your site are doing different jobs.",
      },
      {
        title: "Speakers and content creators",
        text: "Conference organisers ask for a high-resolution headshot on a plain background and a landscape action or stage frame, in that order, every time. Build both into the day and you stop scrambling for them.",
      },
      {
        title: "Professionals building an audience online",
        text: "Vertical crops matter more than most people expect. A library shot only in landscape is half unusable on the platforms where it will actually be published.",
      },
    ],
    commonMistakes: [
      {
        title: "Booking a branding shoot with no plan",
        text: "The difference between 50 usable images and 50 similar images is deciding beforehand where each one will be published. The strategy session on the Full Day and Premium packages exists for this reason.",
      },
      {
        title: "Bringing one outfit",
        text: "A single look produces a single-looking library. Two to three changes across a half day, five or more across a full day, is what makes it look like months of content rather than one afternoon.",
      },
      {
        title: "Shooting only headshots",
        text: "The most common regret. People book a branding session and then spend the whole time on portraits, then have nothing to put behind a headline or beside a testimonial three months later.",
      },
      {
        title: "Waiting until the website launch to book",
        text: "Photography is the long-lead item in a rebrand, not the quick one. Book it before the design is finished, not after the developer is waiting.",
      },
    ],
    objections: [
      {
        q: "Why would I pay $895 when a headshot is $395?",
        a: "Because they solve different problems. A headshot is one image of your face. A branding session produces a library — portraits, at-work frames, environmental shots, detail images — that keeps a website, a newsletter and a social presence supplied for months. If all you need is a profile photo, book the headshot; it is the honest answer and it is on this site for a reason.",
      },
      {
        hideWhenGalleryAtLeast: 6,
        q: "There are only a few branding photographs on this page.",
        a: "That is a fair observation and worth being straight about: the published personal branding portfolio here is small, because most branding work is commissioned by clients who would rather it lived on their own site than in someone else's gallery, and Nick does not publish client work without permission. If you want to see more before committing, ask — a fuller set can be walked through privately on a call.",
      },
      {
        q: "Do I have to be good in front of a camera for this?",
        a: "No, and most people booking a branding day are considerably less comfortable than they expect to be at the start. A half or full day helps rather than hurts here — the first hour absorbs the awkwardness, and the frames that end up being used are almost always from later in the day.",
      },
      {
        q: "How long will the images stay current?",
        a: "Twelve to eighteen months for most people, longer if your look and your business are stable. What dates a library fastest is not your face — it is a change of role, a rebrand, or a wardrobe that stops matching how you now present. Plan a refresh rather than a replacement.",
      },
      {
        q: "Can I use these images for advertising?",
        a: "Yes. Full usage rights for your own business and personal promotion are included on every package, across every platform, with no time limit and no per-use fee. Nick retains copyright in the photographs, which is standard, and the images are not licensed to anyone else.",
      },
    ],
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
    formInterest: "Actor / model portfolio",
    bookingSessionId: "portfolio",
    pricingSessionIds: ["actor-starter", "portfolio"],
    pricingTitle: "Actor & Model Pricing",
    navLabel: "Actor Headshots",
    metaTitle: "Actor Headshots Sydney | Nick Brand Photography",
    metaDescription:
      "Actor headshots and model portfolios in Sydney. Industry-standard images with casting director guidance, multiple looks and fast turnaround.",
    h1: "Actor Headshots & Model Portfolios in Sydney",
    relatedLocations: ["surry-hills", "sydney-cbd", "crows-nest"],
    costNotes: [
      "$450 for the Actor Starter — one hour, two looks, 10 finished images. $750 for the Portfolio Build — two hours, three to four looks, 25 finished images.",
      "No GST is added.",
      "A 24-hour rush is available when a submission closes before standard turnaround would deliver.",
      "Industry-standard sizing is included, not an extra — the files arrive ready to upload to casting platforms.",
    ],
    notIncluded: [
      "Retouching that changes how you look. A headshot that oversells gets you into a room you then walk out of, which wastes your time and the casting director's.",
      "Hair and makeup, on either package. Available at cost on request.",
      "Representation advice. Nick will give you an honest opinion on which frames work hardest; he is not an agent.",
    ],
    objections: [
      {
        hideWhenGalleryAtLeast: 8,
        q: "There aren't many actor headshots in the gallery.",
        a: "Correct, and worth stating plainly rather than padding the page: the published actor set here is small, and several of the images below are model portfolio work, which is why the page is titled for both. If actor headshots are your priority and you want to see more before booking, ask — and it is entirely reasonable to compare against photographers who shoot nothing but actors.",
      },
      {
        q: "Will my agent accept these?",
        a: "The files are delivered in the framing and sizing Australian agents and casting platforms expect. Agents do have individual preferences, though, so if yours has a brief — specific crop, background, number of looks — send it before the session and the shoot will be built around it.",
      },
      {
        q: "How many looks do I actually need?",
        a: "Two well-chosen looks beat four rushed ones. Most actors need one neutral, castable frame and one that leans towards the kind of role they are actually being submitted for. The Portfolio Build exists for people who need genuine range.",
      },
      {
        q: "How often should I reshoot?",
        a: "When you no longer look like the photo — a significant change in hair, weight, age or the roles you are going for. Every two years is a common rhythm; annually is usually unnecessary.",
      },
    ],
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
    faqs: [
      {
        q: "What do actors get in a portfolio session?",
        a: "The Portfolio Build is a two-hour session with dramatic and natural light setups, three to four look changes, 25 fully edited images at industry-standard sizing, and casting director guidance on selection.",
      },
      {
        q: "Do you photograph models as well as actors?",
        a: "Yes. Both the Actor Starter and the Portfolio Build suit actors and models. The shoot is planned around the work you are submitting for.",
      },
      {
        q: "How quickly can I get my headshots?",
        a: "Standard delivery applies to every session, and a 24-hour rush option is available when you have a submission deadline.",
      },
      {
        q: "How much do actor headshots cost in Sydney?",
        a: "The Actor Starter session is $450 for one hour in studio, with two looks and 10 fully edited images — enough for a first agency submission. The Portfolio Build is $750 for two hours in studio or on location, with three to four looks and 25 fully edited images.",
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
    formInterest: "Corporate event",
    bookingSessionId: "team-quote",
    navLabel: "Corporate Events",
    metaTitle:
      "Corporate Event Photographer Sydney | Nick Brand Photography",
    metaDescription:
      "Corporate event photography in Sydney — conferences, awards, launches and functions. Discreet coverage and fast delivery for marketing, PR and recap content.",
    h1: "Corporate Event Photographer in Sydney",
    ctaLabel: "Request an Event Quote",
    ctaHref: "/contact?service=corporate-event-photographer-sydney",
    relatedLocations: ["sydney-cbd", "barangaroo", "pyrmont"],
    /**
     * No gallery. Every image previously shown on this page came from the
     * corporate headshots library, with alt text describing event scenes those
     * files do not contain. An honest note beats fabricated evidence.
     */
    galleryNote:
      "There is no event gallery published here yet. Event coverage is commissioned by marketing and communications teams who use the images internally and in their own campaigns, and Nick does not publish client event work without written permission — so rather than filling this section with studio portraits, it is left empty. If you are considering event coverage and want to see relevant work first, get in touch and a set can be walked through privately.",
    costNotes: [
      "Event coverage is quoted per event rather than listed as a package, because a two-hour launch and a two-day conference have almost nothing in common except the word 'event'.",
      "The quote is driven by hours on the ground, how many key moments have to be covered simultaneously, and how fast you need the first images back.",
      "No GST is added to the quote.",
      "A priority selection for social and press can be delivered same-day or next-day; the full gallery follows.",
    ],
    objections: [
      {
        q: "How do we know what we're getting if there's no gallery here?",
        a: "Ask, and relevant work will be walked through with you directly. It is a reasonable thing to want before committing, and the alternative — showing studio headshots and calling them event coverage — would tell you nothing useful about what you would actually receive.",
      },
      {
        q: "Will a photographer be intrusive during the speeches?",
        a: "The brief agreed beforehand includes where the photographer will and will not be during key moments. Quiet lenses, available light wherever possible, and no flash during speeches unless you specifically want it.",
      },
      {
        q: "We need images for a post the same night.",
        a: "Say so in the brief and a priority selection is edited and delivered on the night or first thing the next morning, with the full gallery to follow. This is planned for rather than requested afterwards.",
      },
      {
        q: "Can we add headshots to the day?",
        a: "Yes, and it is one of the better-value things you can do with a conference. A headshot station set up beside registration lets attendees or staff update a professional photo while they are already in the room. It is quoted alongside the event coverage.",
      },
    ],
    eyebrow: "Corporate Events",
    summary:
      "Discreet, usable coverage of Sydney conferences, awards nights and launches.",
    heroSilo: "corporate-headshots",
    heroIndex: 27,
    heroSiloWhenAvailable: "corporate-events",
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
    formInterest: "Family session",
    bookingSessionId: "family",
    pricingSessionIds: ["family", "family-extended"],
    pricingTitle: "Family Session Pricing",
    navLabel: "Family Sessions",
    metaTitle: "Family Photographer Sydney | Nick Brand Photography",
    metaDescription:
      "Relaxed family photography in Sydney. Natural outdoor sessions at beaches and parks, with a print release and online gallery. Family sessions from $550.",
    h1: "Family Photography in Sydney",
    costNotes: [
      "$550 for Family Basic (90 minutes, up to six people, 20 finished images) and $850 for Family Extended (two hours, up to ten people, two locations, 40 finished images). No GST is added.",
      "A print release is included in both, so you can print wherever you like without paying per image.",
    ],
    objections: [
      {
        q: "Our kids will not sit still.",
        a: "They are not expected to. Sessions are outdoors, unhurried and directed loosely — the best frames from a family session are almost never the ones where everyone is looking at the camera on command.",
      },
      {
        q: "What if the weather turns?",
        a: "Outdoor sessions are rescheduled rather than pushed through in bad light or rain, at no cost. Overcast is fine, and often better than harsh sun.",
      },
    ],
    eyebrow: "Family Sessions",
    summary:
      "Relaxed, natural family sessions at Sydney's beaches and parks.",
    heroSilo: "family",
    heroIndex: 4,
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
    faqs: [
      {
        q: "Where do family sessions take place?",
        a: "Family sessions are photographed outdoors at Sydney beaches, parks and harbourside locations, chosen with you and timed for the best natural light.",
      },
      {
        q: "How many people can be in a family session?",
        a: "The Family Basic session covers up to six people, and pets are welcome. For grandparents, cousins and larger extended-family groups, the Family Extended session covers up to ten people across two hours.",
      },
      {
        q: "Do I get a print release?",
        a: "Yes. Every family session includes a print release and an online gallery, so you are free to print and share your images.",
      },
      {
        q: "How much does a family photography session cost in Sydney?",
        a: "Family Basic is $550 for 90 minutes with up to six people and 20 fully edited images. Family Extended is $850 for two hours with up to ten people, two locations and 40 fully edited images. Both include an online gallery and a print release.",
      },
    ],
    related: ["personal-branding-sydney", "corporate-headshots-sydney"],
  },

  /* ----------------------------------------------------------------------- */
  {
    slug: "band-photographer-sydney",
    formInterest: "General enquiry",
    bookingSessionId: "solo-artist",
    pricingSessionIds: ["solo-artist", "band-artist"],
    pricingTitle: "Music Photography Pricing",
    navLabel: "Band & Musician",
    metaTitle: "Band & Musician Photographer Sydney | Nick Brand Photography",
    metaDescription:
      "Band and musician photography in Sydney. Press shots, cover art and social content for solo artists and full bands, shot on location. Solo sessions from $595.",
    h1: "Band & Musician Photography in Sydney",
    relatedPosts: ["sydney-locations-for-branding-photography"],
    relatedLocations: ["surry-hills", "pyrmont", "sydney-cbd"],
    costNotes: [
      "$595 for a Solo Artist session (two hours, one location, 20 finished images) and $995 for a Band & Artist session (three hours, two locations, up to six members, 30 finished images). No GST is added.",
      "Press kit, square cover-art and vertical social crops are all delivered from the same session rather than charged as separate deliverables.",
    ],
    objections: [
      {
        q: "We don't have a budget like a label does.",
        a: "Most of the artists booking these sessions are self-releasing. The packages are built around what an independent release actually needs — a press shot, a cover crop and enough social content to carry a campaign — rather than a full-day production.",
      },
      {
        q: "Half the band is uncomfortable being photographed.",
        a: "That is normal, and it is why the session is directed rather than left to everyone to work out. Musicians are used to performing, not modelling; being told what to do with hands and eyes fixes most of it inside twenty minutes.",
      },
    ],
    eyebrow: "Band & Musician",
    summary:
      "Press shots, cover art and social content for Sydney musicians and bands.",
    heroSilo: "musician-portraits",
    heroIndex: 4,
    intro: [
      "A press shot has to work everywhere at once — a festival lineup, a Spotify profile, a venue poster and a journalist's article, often cropped differently in each. That takes a session planned around where the images will actually be used, not just a few frames in a rehearsal room.",
      "Nick Brand Photography shoots solo artists and full bands on location across Sydney, delivering press kit, cover art and social formats from the same session.",
    ],
    outcomes: [
      {
        title: "Built for press and streaming",
        text: "Delivered in the crops promoters, venues and streaming platforms ask for, so the same shoot covers a poster, a profile and a feature.",
      },
      {
        title: "Locations with character",
        text: "Laneways, warehouses, stages and the harbour at dusk — backdrops that suit the sound rather than a blank studio wall.",
      },
      {
        title: "Group and individual frames",
        text: "Full band shots plus individual portraits of every member, so the band and its players are covered in one session.",
      },
      {
        title: "Nobody has to pose",
        text: "Musicians are used to performing, not modelling. Clear direction gets natural images from people who feel awkward standing still.",
      },
    ],
    process: [
      {
        title: "Talk about the release",
        text: "We cover what's coming — single, album, tour — and where the images need to work.",
      },
      {
        title: "Choose locations",
        text: "One or two Sydney locations picked to match the look of the project.",
      },
      {
        title: "The shoot",
        text: "Group and individual setups with a few look changes, timed for the light.",
      },
      {
        title: "Deliver",
        text: "Fully edited images in press, cover art and social formats, ready to send to press and platforms.",
      },
    ],
    whoFor: [
      "Solo musicians and singer-songwriters",
      "Bands releasing a single or album",
      "Artists refreshing press and streaming profiles",
      "Performers building an EPK",
      "Managers and labels commissioning press shots",
    ],
    gallerySilo: "musician-portraits",
    galleryCount: 8,
    faqs: [
      {
        q: "How much does a band photoshoot cost in Sydney?",
        a: "The Solo Artist session is $595 for two hours at one Sydney location, with 20 fully edited images. The Band & Artist session is $995 for three hours across two locations, covering up to six members with 30 fully edited images.",
      },
      {
        q: "Do you photograph solo musicians as well as full bands?",
        a: "Yes. The Solo Artist session is built for singer-songwriters and solo performers, and the Band & Artist session covers groups of up to six members with both group and individual frames.",
      },
      {
        q: "Where are band photos taken in Sydney?",
        a: "On location — laneways, warehouses, rehearsal spaces, stages and harbourside spots across Sydney, chosen to match the project. The Lane Cove studio is available when a clean backdrop suits the release better.",
      },
      {
        q: "What formats do I get for press and streaming?",
        a: "Every session is delivered in press kit sizing, square cover art crops and vertical social formats, so the same images work for media, streaming platforms and social posts without recropping.",
      },
      {
        q: "Can we shoot at a gig or rehearsal?",
        a: "Yes. Live and rehearsal coverage can be added to either session, or arranged as its own shoot — get in touch with the dates and venue.",
      },
    ],
    related: ["actor-headshots-sydney", "personal-branding-sydney"],
  },
];

/** Look up a service by slug. */
export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** All service slugs — used for static generation and the sitemap. */
export const serviceSlugs = services.map((s) => s.slug);

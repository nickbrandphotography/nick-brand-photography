/**
 * Blog / resource articles — topical authority content.
 * Each post supports a service silo and is structured for featured snippets
 * and AI retrieval (clear headings, concise answers, FAQs).
 */

import type { FAQ } from "./services";

export type PostSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
};

export type Post = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  date: string; // ISO — original publish date
  updated?: string; // ISO — set when the post is meaningfully revised
  readingTime: string;
  heroSilo:
    | "corporate-headshots"
    | "actor-headshots"
    | "personal-branding"
    | "family";
  heroIndex: number;
  intro: string[];
  sections: PostSection[];
  faqs?: FAQ[];
  relatedService: string;
};

export const posts: Post[] = [
  {
    slug: "what-to-wear-for-corporate-headshots",
    title: "What to Wear for Corporate Headshots",
    metaTitle:
      "What to Wear for Corporate Headshots | Nick Brand Photography",
    metaDescription:
      "A practical guide to what to wear for a corporate headshot in Sydney — colours, necklines, patterns and grooming — so your photo looks polished and professional.",
    excerpt:
      "Colours, styling and the common mistakes to avoid, so you turn up to your corporate headshot prepared.",
    category: "Corporate Headshots",
    date: "2026-04-22",
    updated: "2026-06-24",
    readingTime: "6 min read",
    heroSilo: "corporate-headshots",
    heroIndex: 6,
    intro: [
      "What you wear is the single thing you control most on a headshot day. Get it right and the photo looks effortless. Get it wrong and even perfect lighting cannot fully fix it — a busy pattern, a bad neckline or a creased collar pulls attention straight off your face.",
      "After 20 years photographing Sydney professionals, the same wardrobe decisions come up on almost every shoot. This guide covers what works, what to avoid, and how to prepare, so you arrive ready and leave with a headshot you will actually use.",
    ],
    sections: [
      {
        heading: "Start with solid, mid-to-dark colours",
        paragraphs: [
          "Solid colours keep attention on your face, which is the entire point of a headshot. Mid-to-dark tones — navy, charcoal, deep green, burgundy, slate grey — photograph cleanly and read as professional across almost every industry.",
          "Darker clothing also separates you from a light or white background, so your shoulders and outline stay defined rather than washing out. If your company headshots sit on a white background, a mid-to-dark top is the safest single choice you can make.",
        ],
      },
      {
        heading: "Dress one notch above your day-to-day",
        paragraphs: [
          "A headshot should look like you on a good day, not in costume. The reliable rule is to dress one notch above what you wear to the office on a normal Tuesday.",
          "If your workplace is business casual, a blazer lifts the image without looking stiff. If your industry is formal — law, finance, advisory — a suit with a considered tie or a clean blouse is the expected standard. If you work somewhere creative, a sharp knit or a well-cut shirt keeps it polished without overdressing.",
        ],
      },
      {
        heading: "What to avoid",
        list: [
          "Bright white directly against the skin — it can glow and pull exposure off your face",
          "Busy patterns, tight stripes and small checks, which can shimmer or distort in a sharp photo",
          "Large logos or slogans that date the image and distract from you",
          "Fluorescent or neon colours that cast coloured light back onto your skin",
          "Anything ill-fitting — clothes that bunch at the shoulder or gape at the collar read instantly in a close crop",
        ],
      },
      {
        heading: "Mind necklines, fit and layers",
        paragraphs: [
          "A headshot is usually framed from the chest up, so necklines do a lot of work. Crew necks, collared shirts, blazers and structured tops all sit cleanly. Very low or very busy necklines compete with your face.",
          "Fit matters more than the garment. A modest jacket that fits at the shoulder beats an expensive one that does not. If you are buying something for the shoot, prioritise the fit across the shoulders and the collar, because that is what the camera sees.",
          "Layers give the photographer options. A jacket over a shirt or knit can be worn done up, open, or removed entirely, which means several distinct looks from a single outfit.",
        ],
      },
      {
        heading: "Grooming and the small details",
        list: [
          "Iron or steam everything — creases are obvious in a high-resolution photo",
          "Make sure collars sit flat and jackets fall straight at the shoulder",
          "Keep jewellery simple so it does not pull focus from your face",
          "If you colour your hair or get a haircut, do it about a week before — not the day before",
          "Bring a lint roller and a small mirror; final checks happen on the day, not in the edit",
        ],
      },
      {
        heading: "Bring options and decide on the day",
        paragraphs: [
          "Most sessions allow more than one outfit. The Essential session at $395 includes one to two changes, and the Professional session at $695 allows three to four — so use them.",
          "Bring a couple of tops in different tones, a jacket, and a backup in case something photographs differently than you expect. It is far easier to compare two looks side by side on the screen during the shoot than to commit in advance and wish you had tried the other one.",
        ],
      },
      {
        heading: "A note on industry expectations",
        paragraphs: [
          "Different sectors carry different defaults. Law firms and finance lean conservative — suits, neutral backgrounds, a serious-but-approachable expression. Technology and startups can dress down a notch, with a smart shirt or knit and a more relaxed feel. Real estate and personal-brand professionals often want a warmer, more individual look that still reads as credible.",
          "If your headshot needs to sit alongside colleagues on a team page, check what everyone else is wearing first. Consistency across a team page matters more than any one person's outfit, which is exactly why a coordinated headshot day produces a stronger result than people booking separately.",
        ],
      },
    ],
    faqs: [
      {
        q: "What colour should I wear for a corporate headshot?",
        a: "Solid mid-to-dark colours such as navy, charcoal, deep green or burgundy photograph best. They keep attention on your face, separate you cleanly from a light background, and read as professional across most industries.",
      },
      {
        q: "Should I wear a jacket for a corporate headshot?",
        a: "A blazer or jacket adds structure and lifts the image, even in a business-casual workplace. In formal industries like law and finance it is the expected choice. Layering a jacket over a shirt also gives you several looks from one outfit.",
      },
      {
        q: "Can I wear a white shirt for a headshot?",
        a: "Yes, but be careful with bright white directly against the skin, which can glow and pull exposure off your face. A white shirt under a darker jacket works well; a white top alone against a white background is the riskier choice.",
      },
      {
        q: "Should I keep my glasses on for the photo?",
        a: "If you wear glasses every day, keep them on so the photo looks like you. Anti-reflective lenses photograph best. Mention it before the shoot so the lighting can be set to avoid glare.",
      },
    ],
    relatedService: "corporate-headshots-sydney",
  },

  {
    slug: "why-professional-headshots-increase-linkedin-engagement",
    title: "Why Professional Headshots Increase LinkedIn Engagement",
    metaTitle:
      "Why Professional Headshots Increase LinkedIn Engagement | Nick Brand",
    metaDescription:
      "How a professional LinkedIn headshot increases profile views, connection acceptance and message response — and exactly what makes a headshot work on the platform.",
    excerpt:
      "Your profile photo appears beside everything you do on LinkedIn. Here is why a professional one pays off.",
    category: "LinkedIn Headshots",
    date: "2026-04-08",
    updated: "2026-06-24",
    readingTime: "6 min read",
    heroSilo: "corporate-headshots",
    heroIndex: 19,
    intro: [
      "On LinkedIn your photo is never just on your profile. It sits next to every comment you post, every message you send, every search result you appear in and every job you apply for. That makes it one of the highest-leverage images you own.",
      "A professional headshot is not vanity on LinkedIn — it is infrastructure. It shapes the first judgement people make about you before they read a single word, and that judgement decides whether they engage with you at all.",
    ],
    sections: [
      {
        heading: "First impressions happen in milliseconds",
        paragraphs: [
          "People form a judgement about a face almost instantly — competence, trustworthiness and approachability are read in a fraction of a second. On LinkedIn that judgement happens before anyone reads your headline or your experience.",
          "A clear, well-lit, professionally shot headshot signals that you take your professional presence seriously. A dark selfie, a cropped wedding photo or an empty grey avatar signals the opposite, and it does so every single time your name appears.",
        ],
      },
      {
        heading: "It affects real, measurable outcomes",
        list: [
          "Connection requests are more likely to be accepted when the profile looks complete and professional",
          "Direct messages are more likely to be opened when they come from a credible-looking sender",
          "Recruiters are more likely to shortlist a profile that reads as established and current",
          "Your comments carry more weight in a feed when the photo beside them looks professional",
          "Speaking, podcast and partnership invitations often start with someone scanning your profile photo first",
        ],
      },
      {
        heading: "What actually makes a headshot work on LinkedIn",
        paragraphs: [
          "LinkedIn displays your photo small and in a circle, often at thumbnail size in a feed. A headshot that works on the platform is framed tightly on the face — head and shoulders, not a full-length shot where your face becomes a dot.",
          "It is well lit, with even light on the face and no harsh shadows. It uses a clean, uncluttered background so nothing competes with you at small sizes. And the expression is approachable rather than stern, because LinkedIn is a networking platform, not a passport office.",
          "Colour helps too. A mid-to-dark outfit against a lighter background keeps your outline defined inside that small circle, so you still read clearly at the size most people actually see you.",
        ],
      },
      {
        heading: "The common mistakes",
        list: [
          "Using a cropped group photo — the lighting, angle and stray arm always show",
          "A phone selfie shot from below, which distorts proportions and reads as casual",
          "A photo more than a few years out of date, so you do not match in person",
          "A busy background — a bookshelf, a bar, a holiday view — that clutters the thumbnail",
          "Sunglasses, heavy filters or extreme crops that hide the face people are trying to recognise",
        ],
      },
      {
        heading: "How often to update it",
        paragraphs: [
          "Update your headshot when you change roles, when your appearance changes meaningfully, or every two to three years regardless. People should recognise you from your photo when they meet you, and an out-of-date image quietly undercuts the trust the photo is meant to build.",
          "If your role involves business development, hiring or any kind of public profile, treat the headshot as a working asset and keep it current. A LinkedIn-optimised crop is included in the Professional headshot session, so you can update the platform and your website in one sitting.",
        ],
      },
      {
        heading: "Pair the headshot with the rest of your profile",
        paragraphs: [
          "A strong headshot does more when the profile around it matches. A simple banner image, a clear headline and a consistent look across your headshot, website and email signature compound the same impression of credibility.",
          "If you are the face of your business rather than just an employee, this is where a personal branding session earns its place — a headshot covers the profile photo, but a small library of images keeps every post, banner and bio looking like it belongs to the same person.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does a professional LinkedIn photo really make a difference?",
        a: "Yes. A clear, professional profile photo increases the likelihood that connection requests are accepted and messages opened, and it helps recruiters and clients take a profile seriously. Because the photo appears next to everything you do on LinkedIn, the effect repeats constantly.",
      },
      {
        q: "How should a LinkedIn headshot be framed?",
        a: "Tightly on the face — head and shoulders — well lit, against a clean background, so it stays clear at the small circular size LinkedIn displays. Avoid full-length shots and cropped group photos.",
      },
      {
        q: "Should I smile in my LinkedIn headshot?",
        a: "An approachable expression works best, because LinkedIn is a networking platform. That does not have to be a wide smile — a relaxed, confident look reads as both credible and easy to deal with.",
      },
      {
        q: "How often should I update my LinkedIn headshot?",
        a: "Update it when you change roles, when your appearance changes, or every two to three years. People should recognise you from the photo when they meet you in person.",
      },
    ],
    relatedService: "linkedin-headshots-sydney",
  },

  {
    slug: "best-backgrounds-for-executive-portraits",
    title: "Best Backgrounds for Executive Portraits",
    metaTitle:
      "Best Backgrounds for Executive Portraits | Nick Brand Photography",
    metaDescription:
      "Which backgrounds work best for executive portraits — studio, office and on-location — how colour affects authority, and how to keep a leadership team consistent.",
    excerpt:
      "The background of an executive portrait is a deliberate choice. Here is how to make it.",
    category: "Executive Portraits",
    date: "2026-03-19",
    updated: "2026-06-24",
    readingTime: "5 min read",
    heroSilo: "corporate-headshots",
    heroIndex: 33,
    intro: [
      "An executive portrait appears in annual reports, board pages, press and conference programs — contexts where the background quietly shapes how a leader is perceived. It is one of the few elements of a portrait you decide before anyone steps in front of the camera, so it is worth choosing deliberately.",
      "The background sets the tone: authority, approachability, context or neutrality. Here is how the main options compare, and how to keep a leadership team looking like one team.",
    ],
    sections: [
      {
        heading: "Clean studio backgrounds",
        paragraphs: [
          "A controlled studio background — deep grey, charcoal or a soft graduated tone — keeps all attention on the subject and is the most flexible choice. It matches easily across a leadership team, it is simple to keep consistent over time, and it works in every context from a website bio to a printed report.",
          "It also future-proofs the image. Because there is no specific room or location tying the portrait to a moment, a clean studio background still looks current years later, and new executives can be added in the same style without a visible seam.",
        ],
      },
      {
        heading: "The office environment",
        paragraphs: [
          "Photographing an executive in their boardroom, office or workspace adds context and scale. A softly blurred background of glass, timber or a city outlook signals the working environment without competing with the subject.",
          "This approach suits leaders whose authority is tied to their organisation — a managing partner in chambers, a CEO in a head office. The trade-off is consistency: office backgrounds are harder to match exactly across a team and across future sessions, so they work best when the whole leadership group is shot in one visit.",
        ],
      },
      {
        heading: "On-location and architectural",
        paragraphs: [
          "An architectural Sydney backdrop — a striking building, a considered interior, a city outlook — can suit a founder or a brand with a strong identity. It gives a portrait energy and a sense of place.",
          "It works best when the location genuinely relates to the business rather than being decorative. A random feature wall adds nothing; a setting that says something about the work adds a layer of story the viewer reads without noticing.",
        ],
      },
      {
        heading: "How colour and tone affect the read",
        paragraphs: [
          "Darker backgrounds — charcoal, deep grey, black — read as serious, premium and authoritative. They suit senior leaders, partners and board portraits where gravity is the goal.",
          "Lighter backgrounds — soft grey, white, pale tones — read as open, modern and approachable. They suit founders, advisors and client-facing leaders who want to look credible without looking distant. Neither is better; the right choice depends on the impression the role needs to make.",
        ],
      },
      {
        heading: "Keep a leadership team consistent",
        paragraphs: [
          "Whatever the choice, a leadership page looks strongest when every portrait shares the same background approach, lighting and crop. Mixed backgrounds make a team page look assembled from different sources and different eras — the opposite of the controlled, credible impression a leadership page is meant to give.",
          "The practical fix is to photograph the whole team in one coordinated session with a single setup. It is faster, cheaper per person, and it guarantees the set matches. For new starters later, agreeing a repeatable setup means each new executive can be added in the same style without an awkward mismatch.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the best background for an executive portrait?",
        a: "A clean studio background in charcoal or grey is the most flexible and consistent choice, and it stays current for years. An office or on-location background works well when it adds genuine context to the leader's role and the whole team is photographed in one visit.",
      },
      {
        q: "Should an executive portrait use a dark or light background?",
        a: "Darker backgrounds read as serious, premium and authoritative; lighter backgrounds read as open, modern and approachable. Choose based on the impression the role needs to make rather than a fixed rule.",
      },
      {
        q: "How do you keep a leadership team's portraits consistent?",
        a: "Photograph the whole team in one session with the same background, lighting and crop, and agree a repeatable setup so new starters can be added later in the same style. Consistency across the page matters more than any single portrait.",
      },
    ],
    relatedService: "executive-portraits-sydney",
  },

  {
    slug: "corporate-photography-tips-for-law-firms",
    title: "Corporate Photography Tips for Law Firms",
    metaTitle:
      "Corporate Photography Tips for Law Firms | Nick Brand Photography",
    metaDescription:
      "How Sydney law firms can plan corporate headshots and team photography — consistency, partner portraits, onboarding new starters and running an efficient on-site day.",
    excerpt:
      "Law firms live or die on credibility. Here is how to make sure the photography reflects it.",
    category: "Corporate Headshots",
    date: "2026-03-04",
    updated: "2026-06-24",
    readingTime: "6 min read",
    heroSilo: "corporate-headshots",
    heroIndex: 41,
    intro: [
      "For a law firm, the website and tender documents are often the first contact a prospective client has with the practice. Inconsistent, dated or mismatched headshots quietly undercut the credibility that everything else — the brand, the copy, the track record — is built on.",
      "Photography is one of the easier credibility problems to fix, but only if it is planned. These are the points that matter most when a Sydney firm organises headshots and team photography.",
    ],
    sections: [
      {
        heading: "Treat consistency as non-negotiable",
        paragraphs: [
          "A firm's people page should look like one firm. When partners and associates are photographed in different styles, lighting and backgrounds — some at a previous firm, some on a phone, some years apart — the page reads as disorganised, and disorganised is the last thing a law firm wants to project.",
          "A single coordinated headshot day fixes this. Everyone is photographed with the same lighting, background and crop, so the whole directory matches. It is the difference between a page that looks deliberate and one that looks accumulated.",
        ],
      },
      {
        heading: "Plan partner portraits separately",
        paragraphs: [
          "Partners and senior counsel often need a more considered executive portrait for bios, legal directories, press and award submissions — something with a little more presence than a standard staff headshot.",
          "Schedule these alongside the firm-wide headshot day rather than as a separate shoot. That way the senior portraits still share the same lighting and background as the rest of the team, so the set matches even though the partners get a more refined treatment.",
        ],
      },
      {
        heading: "Have a plan for new starters",
        paragraphs: [
          "Firms hire continuously — lateral partners, new associates, graduate intakes. Without a plan, every new starter is photographed in a slightly different style, and within a year the consistency you paid for has eroded.",
          "Agree a repeatable setup at the first session: the same background, lighting recipe and crop, documented so it can be matched later. New lawyers can then be added to the website in the same style with a short individual session, and the directory stays uniform.",
        ],
      },
      {
        heading: "Run it on-site to protect billable time",
        paragraphs: [
          "Billable time is the firm's core asset, so the goal is to photograph the team with the least possible disruption. An on-site headshot day brings a mobile studio to your office — the same lighting and background as a studio, set up in a boardroom or spare office.",
          "On a rolling schedule, each lawyer steps away from their desk for around ten minutes rather than losing half a day travelling to a studio. For a team of any size, that is the difference between a shoot that happens and one that keeps getting postponed. Team headshots are $285 per person for groups of five or more, including the on-site setup and invoice billing.",
        ],
      },
      {
        heading: "Choose backgrounds that suit the firm",
        paragraphs: [
          "Law firms generally suit conservative, neutral backgrounds — clean greys and whites, or a softly blurred office setting for senior portraits. The look should be credible and understated rather than fashionable, because a headshot that looks trendy this year will look dated next year.",
          "Keep the styling brief simple and send it to staff in advance: business attire, mid-to-dark solid colours, ironed and well-fitted. A short note prevents the one person who turns up in a busy pattern from standing out on an otherwise consistent page.",
        ],
      },
      {
        heading: "Think about where the images will be used",
        paragraphs: [
          "Plan the crops before the shoot. A firm typically needs a website crop, a square crop for legal directories and LinkedIn, and sometimes a wider format for tender documents and pitch decks. Capturing with those uses in mind means one session covers every requirement.",
          "Delivery is within five business days as standard, with a 48-hour express option when a tender deadline is tight. Every lawyer's images arrive fully edited and in each crop the firm needs, ready to publish.",
        ],
      },
    ],
    faqs: [
      {
        q: "How should a law firm organise headshots?",
        a: "Run a single coordinated on-site headshot day so every lawyer is photographed consistently, schedule considered partner portraits alongside it, and agree a repeatable setup so new starters can be matched later. Consistency across the people page is what protects the firm's credibility.",
      },
      {
        q: "How long does each lawyer need for a headshot?",
        a: "On a rolling on-site schedule, around ten minutes per person. Staff step away from their desk briefly rather than losing half a day, which keeps disruption to billable time low.",
      },
      {
        q: "How much do team headshots cost for a law firm?",
        a: "Team headshots are $285 per person for groups of five or more, including the on-site mobile studio setup and invoice billing. Individual partner sessions and executive portraits can be added to the same day.",
      },
      {
        q: "How do you keep new lawyers' headshots consistent with the rest?",
        a: "By documenting the background, lighting and crop from the first session and repeating it. New starters are photographed in a short individual session using the same setup, so they match the existing directory.",
      },
    ],
    relatedService: "team-headshots-sydney",
  },

  {
    slug: "personal-branding-photography-for-entrepreneurs",
    title: "Personal Branding Photography for Entrepreneurs",
    metaTitle:
      "Personal Branding Photography for Entrepreneurs | Nick Brand",
    metaDescription:
      "How Sydney entrepreneurs and founders use personal branding photography to build a recognisable identity and a content library across web, social and press.",
    excerpt:
      "When you are the face of the business, one headshot is not enough. Here is what to shoot instead.",
    category: "Personal Branding",
    date: "2026-02-18",
    updated: "2026-06-24",
    readingTime: "6 min read",
    heroSilo: "personal-branding",
    heroIndex: 1,
    intro: [
      "When you are the business, your image is a business asset. Founders and solo professionals who invest in a proper personal branding shoot stop scrambling for a usable photo every time they need one — for a feature, a speaker bio, a landing page or a week of social posts.",
      "A single headshot covers a profile photo and little else. Personal branding photography produces a library you draw on for months, all in one consistent look. Here is how to make a session work.",
    ],
    sections: [
      {
        heading: "Think library, not headshot",
        paragraphs: [
          "A headshot answers one question: what do you look like. A personal branding shoot answers many — what do you do, how do you work, what is it like to deal with you — across a set of images you can reach for whenever you publish.",
          "A useful library mixes clean headshots, lifestyle frames, at-work moments and detail shots. That range is what turns a single session into months of content, instead of one photo you reuse until it goes stale.",
        ],
      },
      {
        heading: "Shoot for where you actually publish",
        list: [
          "Vertical frames for Instagram, stories and reels covers",
          "Wider frames for website banners, LinkedIn headers and email headers",
          "Clean, tightly cropped headshots for profiles, podcasts and speaker bios",
          "At-work images that show what you actually do — with clients, on stage, at the desk, making the product",
          "A few neutral frames with simple backgrounds for quotes, ads and press",
        ],
      },
      {
        heading: "Plan before you shoot",
        paragraphs: [
          "The strongest personal branding sessions start with a short strategy conversation: what you are launching, where you publish, who you are speaking to, and the story the images need to tell. Thirty minutes of planning is the difference between a shoot that produces usable content and one that produces nice photos you never quite use.",
          "Come with a shortlist of the specific things you keep needing — a banner, a headshot, a 'speaking' shot, a behind-the-scenes set — and build the shoot around them. That keeps the session focused on assets you will actually deploy.",
        ],
      },
      {
        heading: "Wardrobe and locations carry the brand",
        paragraphs: [
          "Bring a few outfits that reflect how your audience sees you, in a coherent palette so the images sit together as a set. Mixing two or three looks gives variety without making the library look scattered.",
          "Location does a lot of the storytelling. A half-day branding session ($895) can move through a couple of nearby settings; a full day ($1,695) covers multiple locations for a wider range. The right backdrop reinforces what you do — a workshop, an office, a harbourside walk-and-talk — and gives each image a clear context.",
        ],
      },
      {
        heading: "Get a year of content from one session",
        paragraphs: [
          "Treat the delivered gallery as a content bank. Tag the images by use — headshots here, banners there, behind-the-scenes here — and schedule them out rather than posting the best three and forgetting the rest.",
          "Because the whole set shares one look, every post, page and profile reinforces the same recognisable identity. That consistency is what makes a personal brand feel established rather than improvised, and it is far cheaper than commissioning photography every time you need an image.",
        ],
      },
      {
        heading: "How it differs from a corporate headshot",
        paragraphs: [
          "A corporate headshot is built for one job: a credible, consistent photo for a company website or a team page. Personal branding is built for breadth — a varied, ongoing library for someone whose face is part of the product.",
          "If you work for a company, a headshot is usually enough. If you are the company, the library pays for itself the first time you need a banner, a press image and three posts in the same week and already have them.",
        ],
      },
    ],
    faqs: [
      {
        q: "How is personal branding photography different for entrepreneurs?",
        a: "Entrepreneurs need a varied image library — headshots, lifestyle and at-work frames sized for each platform — rather than a single headshot, because their image is used continuously across web, social and press. The shoot is planned around the specific assets they keep needing.",
      },
      {
        q: "How many images do I need from a personal branding shoot?",
        a: "Enough to cover your recurring needs and keep posting for months — typically a spread of headshots, banners, lifestyle and at-work frames. A half-day session covers a focused set; a full day produces a broader library across multiple locations.",
      },
      {
        q: "What does a personal branding session cost in Sydney?",
        a: "Personal branding sessions start at $895 for a half day and $1,695 for a full day across multiple locations. Every session includes professional editing and a private online gallery.",
      },
      {
        q: "How often should I redo a personal branding shoot?",
        a: "Most founders refresh every 12 to 18 months, or sooner if the brand, the offer or their appearance changes. Booking a fuller session less often usually beats scrambling for one-off photos throughout the year.",
      },
    ],
    relatedService: "personal-branding-sydney",
  },

  {
    slug: "sydney-locations-for-branding-photography",
    title: "Sydney Locations for Branding Photography",
    metaTitle:
      "Best Sydney Locations for Branding Photography | Nick Brand",
    metaDescription:
      "A guide to Sydney locations for personal branding photography — CBD, Surry Hills, harbourside and coastal — how to match a location to your brand, and practical planning tips.",
    excerpt:
      "Where you shoot shapes the story. A look at Sydney locations that work for branding photography.",
    category: "Personal Branding",
    date: "2026-01-28",
    updated: "2026-06-24",
    readingTime: "5 min read",
    heroSilo: "personal-branding",
    heroIndex: 2,
    intro: [
      "Location is part of the message in a personal branding shoot. The right backdrop reinforces what you do; the wrong one distracts from it. Sydney offers an unusually wide range within a short drive, from corporate towers to harbour and coastline.",
      "Here is how the main options break down, how to match a setting to your brand, and the practical points worth sorting before the day.",
    ],
    sections: [
      {
        heading: "Corporate and CBD",
        paragraphs: [
          "Glass, architecture and city streets suit consultants, finance professionals, lawyers and anyone whose brand is built on corporate credibility. The CBD and Barangaroo give a polished, professional backdrop that signals you operate at that level.",
          "These settings read as serious and established. They work best for people selling expertise to corporate buyers, where the location quietly confirms you belong in that world.",
        ],
      },
      {
        heading: "Creative and urban",
        paragraphs: [
          "Surry Hills, Chippendale and the inner west bring texture — brick, laneways, cafes, studios and street art. These settings suit founders, creatives, coaches and consultants who want an approachable, modern feel rather than a corporate one.",
          "The energy here is less formal and more human. It pairs well with a personal brand that trades on personality and accessibility, where looking too corporate would actually work against you.",
        ],
      },
      {
        heading: "Harbourside and coastal",
        paragraphs: [
          "Sydney's harbour and coastline give a lighter, lifestyle-led look that suits coaches, wellness brands, hospitality and personalities whose work is warm and people-focused. Think open light, water and space rather than walls.",
          "These locations carry a sense of ease and optimism. They are ideal when your brand is about lifestyle, wellbeing or a personal, human kind of expertise, and less suited to a brand that needs to project formal authority.",
        ],
      },
      {
        heading: "Your own workplace",
        paragraphs: [
          "Sometimes the strongest location is where you actually work. A studio, office, clinic, kitchen or workshop shows your craft directly and is impossible to fake. For a maker or a hands-on professional, this is often the most convincing backdrop available.",
          "It also makes for genuine at-work images — the kind of behind-the-scenes content that performs well on social and gives a personal brand depth beyond a headshot.",
        ],
      },
      {
        heading: "Match the location to the brand, not the other way round",
        paragraphs: [
          "Start from the impression you need to make and choose the setting that supports it, rather than picking a pretty spot and hoping it fits. A wellness coach shot in a glass tower sends a mixed signal; a corporate advisor shot at the beach can undercut their authority.",
          "If your brand spans more than one note — credible and approachable, say — a full-day session can move through two or three complementary settings so the library covers the range without looking inconsistent.",
        ],
      },
      {
        heading: "Practical planning",
        list: [
          "Time of day matters: early morning and late afternoon give softer, more flattering light than harsh midday sun",
          "Have a weather backup — an indoor or covered option keeps an outdoor shoot on track",
          "Check access and permits for some public and indoor spaces before the day",
          "Keep travel between locations short so the session stays productive rather than spent in the car",
          "Bring outfit changes that suit each setting, in a consistent palette so the set still hangs together",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I choose a location for a branding shoot?",
        a: "Start from the impression your brand needs to make and choose a location that supports it. Corporate settings suit professional, expertise-led brands; urban and creative areas suit founders and creatives; harbourside and coastal suit lifestyle and wellness brands; and your own workplace works when it shows your craft.",
      },
      {
        q: "Can a branding shoot cover more than one location?",
        a: "Yes. A full-day session can move through two or three complementary Sydney settings, which gives a wider library while keeping a consistent look. A half-day session usually focuses on one or two nearby locations.",
      },
      {
        q: "What time of day is best for outdoor branding photos?",
        a: "Early morning and late afternoon give softer, more flattering light than harsh midday sun. Planning the shoot around those windows, with a weather backup, produces the most usable images.",
      },
    ],
    relatedService: "personal-branding-sydney",
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export const postSlugs = posts.map((p) => p.slug);

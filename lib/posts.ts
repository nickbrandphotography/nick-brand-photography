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
  date: string; // ISO
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
      "A practical guide to what to wear for a corporate headshot in Sydney — colours, styling and what to avoid — so your photo looks polished and professional.",
    excerpt:
      "Colours, styling and the common mistakes to avoid, so you turn up to your corporate headshot prepared.",
    category: "Corporate Headshots",
    date: "2026-04-22",
    readingTime: "5 min read",
    heroSilo: "corporate-headshots",
    heroIndex: 6,
    intro: [
      "What you wear is the single thing you control most on a headshot day. Get it right and the photo looks effortless; get it wrong and even great lighting cannot fully fix it. This guide covers what works, what to avoid, and how to prepare.",
    ],
    sections: [
      {
        heading: "Choose solid, mid-to-dark colours",
        paragraphs: [
          "Solid colours keep attention on your face. Mid-to-dark tones — navy, charcoal, deep green, burgundy — photograph cleanly and read as professional across almost every industry.",
          "Avoid bright white directly against the skin and very busy patterns. Tight stripes and small checks can create a distracting shimmer in photographs.",
        ],
      },
      {
        heading: "Dress one notch above your day-to-day",
        paragraphs: [
          "A headshot should look like you on a good day. If your workplace is business casual, a blazer lifts the image without looking costumed. If your industry is formal, a suit and a considered tie or blouse is the safe choice.",
        ],
      },
      {
        heading: "Bring options",
        paragraphs: [
          "Most packages allow more than one outfit change. Bring a couple of options in different tones so you can compare results on the day rather than committing in advance.",
        ],
      },
      {
        heading: "Mind the details",
        list: [
          "Iron or steam your clothes — creases are obvious in a sharp photo",
          "Make sure collars sit flat and jackets fit at the shoulder",
          "Keep jewellery simple so it does not pull focus",
          "Get a haircut about a week before, not the day before",
        ],
      },
    ],
    faqs: [
      {
        q: "What colour should I wear for a corporate headshot?",
        a: "Solid mid-to-dark colours such as navy, charcoal, deep green or burgundy photograph best. They keep attention on your face and read as professional across most industries.",
      },
      {
        q: "Should I wear a jacket for a corporate headshot?",
        a: "A blazer or jacket adds structure and lifts the image, even in a business-casual workplace. In formal industries it is the expected choice.",
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
      "How a professional LinkedIn headshot increases profile views, connection acceptance and message response — and what makes a headshot work on the platform.",
    excerpt:
      "Your profile photo appears beside everything you do on LinkedIn. Here is why a professional one pays off.",
    category: "LinkedIn Headshots",
    date: "2026-04-08",
    readingTime: "4 min read",
    heroSilo: "corporate-headshots",
    heroIndex: 19,
    intro: [
      "On LinkedIn your photo is never just on your profile. It sits next to every comment, message, search result and application you make. That makes it one of the highest-leverage images you own.",
    ],
    sections: [
      {
        heading: "First impressions happen in milliseconds",
        paragraphs: [
          "People form a judgement about a face almost instantly. A clear, well-lit, approachable headshot signals competence and trustworthiness before a single word is read — and that judgement influences whether someone engages with you at all.",
        ],
      },
      {
        heading: "It affects real outcomes",
        list: [
          "Connection requests are more likely to be accepted",
          "Direct messages are more likely to be opened",
          "Recruiters are more likely to shortlist a complete, professional profile",
          "Your profile looks credible next to your comments in feeds",
        ],
      },
      {
        heading: "What makes a headshot work on LinkedIn",
        paragraphs: [
          "LinkedIn displays your photo small and in a circle. A headshot that works is framed tightly on the face, well lit, and shot against a clean background so it stays clear at thumbnail size. The expression should be approachable rather than stern — LinkedIn is a networking platform.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does a professional LinkedIn photo really make a difference?",
        a: "Yes. A clear, professional profile photo increases the likelihood that connection requests are accepted and messages opened, and helps recruiters take a profile seriously.",
      },
      {
        q: "How should a LinkedIn headshot be framed?",
        a: "Tightly on the face, well lit, against a clean background, so it stays clear at the small circular size LinkedIn displays.",
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
      "Which backgrounds work best for executive portraits — studio, office and on-location — and how the right choice reinforces authority and brand.",
    excerpt:
      "The background of an executive portrait is a deliberate choice. Here is how to make it.",
    category: "Executive Portraits",
    date: "2026-03-19",
    readingTime: "5 min read",
    heroSilo: "corporate-headshots",
    heroIndex: 33,
    intro: [
      "An executive portrait appears in annual reports, press and leadership pages — contexts where the background quietly shapes how a leader is perceived. It is worth choosing deliberately.",
    ],
    sections: [
      {
        heading: "Clean studio backgrounds",
        paragraphs: [
          "A controlled studio background — deep grey, charcoal or a soft graduated tone — keeps all attention on the subject and matches easily across a leadership team. It is the most flexible choice and the easiest to keep consistent over time.",
        ],
      },
      {
        heading: "The office environment",
        paragraphs: [
          "Photographing an executive in their boardroom or office adds context and scale. A softly blurred background of glass, timber or city outlook signals the working environment without competing with the subject.",
        ],
      },
      {
        heading: "On-location and architectural",
        paragraphs: [
          "An architectural Sydney backdrop can suit a founder or a brand with a strong identity. It works best when the location genuinely relates to the business rather than being decorative.",
        ],
      },
      {
        heading: "Keep a leadership team consistent",
        paragraphs: [
          "Whatever the choice, a leadership page looks strongest when every portrait shares the same background approach. Mixed backgrounds make a team page look assembled from different sources.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the best background for an executive portrait?",
        a: "A clean studio background in charcoal or grey is the most flexible and consistent choice. An office or on-location background works well when it adds genuine context to the leader's role.",
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
      "How law firms can plan corporate headshots and team photography — consistency, partner portraits and onboarding new starters — for a polished firm image.",
    excerpt:
      "Law firms live or die on credibility. Here is how to make sure the photography reflects it.",
    category: "Corporate Headshots",
    date: "2026-03-04",
    readingTime: "5 min read",
    heroSilo: "corporate-headshots",
    heroIndex: 41,
    intro: [
      "For a law firm, the website and tender documents are often the first contact a client has with the practice. Inconsistent or dated headshots undercut the credibility everything else is built on.",
    ],
    sections: [
      {
        heading: "Treat consistency as non-negotiable",
        paragraphs: [
          "A firm's people page should look like one firm. When partners and associates are photographed in different styles, lighting and backgrounds, the page reads as disorganised. A single coordinated headshot day fixes this.",
        ],
      },
      {
        heading: "Plan partner portraits separately",
        paragraphs: [
          "Partners and senior counsel often need a more considered executive portrait for bios, directories and press. It is worth scheduling these alongside the firm-wide headshot day so the whole set still matches.",
        ],
      },
      {
        heading: "Have a plan for new starters",
        paragraphs: [
          "Firms hire continuously. Agree a repeatable setup so every new lawyer can be photographed in the same style and added to the website without an awkward mismatch.",
        ],
      },
      {
        heading: "Run it on-site",
        paragraphs: [
          "Billable time is valuable. An on-site headshot day with a mobile studio means lawyers step away from their desk for around ten minutes rather than losing half a day.",
        ],
      },
    ],
    faqs: [
      {
        q: "How should a law firm organise headshots?",
        a: "Run a single coordinated on-site headshot day so every lawyer is photographed consistently, schedule considered partner portraits alongside it, and agree a repeatable setup so new starters can be matched later.",
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
      "How entrepreneurs and founders can use personal branding photography to build a recognisable identity and a content library across web and social.",
    excerpt:
      "When you are the face of the business, one headshot is not enough. Here is what to shoot instead.",
    category: "Personal Branding",
    date: "2026-02-18",
    readingTime: "5 min read",
    heroSilo: "personal-branding",
    heroIndex: 1,
    intro: [
      "When you are the business, your image is a business asset. Entrepreneurs who invest in a proper personal branding shoot stop scrambling for a usable photo every time they need one.",
    ],
    sections: [
      {
        heading: "Think library, not headshot",
        paragraphs: [
          "A single headshot covers a profile photo and little else. A personal branding shoot produces a library — headshots, lifestyle frames, at-work moments and detail shots — so you always have a fitting image for a post, a feature or a pitch.",
        ],
      },
      {
        heading: "Shoot for where you publish",
        list: [
          "Vertical frames for Instagram and stories",
          "Wider frames for website banners and LinkedIn headers",
          "Clean headshots for profiles and speaker bios",
          "At-work images that show what you actually do",
        ],
      },
      {
        heading: "Plan before you shoot",
        paragraphs: [
          "The best personal branding sessions start with a short strategy conversation: what you are launching, where you publish, and the story the images need to tell. That planning is what turns a shoot into months of usable content.",
        ],
      },
    ],
    faqs: [
      {
        q: "How is personal branding photography different for entrepreneurs?",
        a: "Entrepreneurs need a varied image library — headshots, lifestyle and at-work frames sized for each platform — rather than a single headshot, because their image is used continuously across web, social and press.",
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
      "A guide to Sydney locations for personal branding photography — from the CBD and Surry Hills to harbourside and coastal spots — and how to choose.",
    excerpt:
      "Where you shoot shapes the story. A look at Sydney locations that work for branding photography.",
    category: "Personal Branding",
    date: "2026-01-28",
    readingTime: "4 min read",
    heroSilo: "personal-branding",
    heroIndex: 2,
    intro: [
      "Location is part of the message in a personal branding shoot. The right backdrop reinforces what you do; the wrong one distracts from it. Here is how Sydney's options break down.",
    ],
    sections: [
      {
        heading: "Corporate and CBD",
        paragraphs: [
          "Glass, architecture and city streets suit consultants, finance professionals and anyone whose brand is built on corporate credibility. The CBD and Barangaroo give a polished, professional backdrop.",
        ],
      },
      {
        heading: "Creative and urban",
        paragraphs: [
          "Surry Hills, Chippendale and the inner west bring texture — brick, laneways, cafes and studios. These suit founders, creatives and consultants who want an approachable, modern feel.",
        ],
      },
      {
        heading: "Harbourside and coastal",
        paragraphs: [
          "Sydney's harbour and coastline give a lighter, lifestyle-led look that suits coaches, wellness brands and personalities whose work is warm and people-focused.",
        ],
      },
      {
        heading: "Your own workplace",
        paragraphs: [
          "Sometimes the strongest location is where you actually work. A studio, office or workshop shows your craft directly and is hard to fake.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I choose a location for a branding shoot?",
        a: "Choose a location that genuinely reflects your work. Corporate settings suit professional brands, urban and creative areas suit founders and creatives, and your own workplace works when it shows your craft.",
      },
    ],
    relatedService: "personal-branding-sydney",
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export const postSlugs = posts.map((p) => p.slug);

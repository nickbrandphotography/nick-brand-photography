# Nick Brand Photography — Remediation Plan

> **VERSION:** 1.0 · **CREATED:** 2026-05-28 · **STATUS:** Active
> **CONTEXT:** Site went live on www.nickbrandphotography.com today (2026-05-28). Live-site SEO audit returned 74/100 (C — strong build, thin content). This plan closes the gaps identified in that audit and the existing priority list in [`BUSINESS_INTELLIGENCE_SYSTEM.md`](./BUSINESS_INTELLIGENCE_SYSTEM.md).
>
> **HOW TO USE:** Phases are sequenced for compounding impact, not just urgency. Phase 0 items are pure wins (small effort, real SEO signal) and should be done in one focused session. Phase 1+ require either content production or off-site work that compounds slowly.

---

## Audit summary (2026-05-28)

| Category | Score | Note |
|---|---:|---|
| Technical SEO | 87 | Meta, canonical, robots, sitemap, llms.txt all clean. One OG title bug on /blog. |
| On-page SEO | 80 | Keyword-rich titles + URLs. Image alt text reads "image 1, image 2" — wasteful. |
| Content depth | **50** | Only 6 blog posts. No industry verticals. No case studies. |
| AI search readiness | 90 | llms.txt is exemplary. |
| Conversion architecture | 78 | Pricing transparent, CTAs prominent. Only 3 testimonials cycling. |
| **E-E-A-T** | **58** | No author bylines. 5 reviews against a "thousands of clients" claim. |
| Local SEO | 75 | 12 suburbs. Lane Cove (own studio's suburb) missing. |
| Domain trust | ~0 | Fresh deploy. No earned backlinks yet. |
| **Overall** | **74** | C — strong build, thin content |

---

## PHASE 0 — Quick wins (this week)

Small code changes with real SEO upside. Estimated total: one focused session.

### 0.1 — Block `/admin` and `/manage/[token]` in robots
**Why:** Security + crawl budget. These are private routes that shouldn't be in Google's index. Currently `robots.ts` allows all paths.
**File:** `app/robots.ts`
**Effort:** 5 minutes.

### 0.2 — Add `/locations/lane-cove` suburb page
**Why:** Nick's home studio is in Lane Cove. Not having a page targeting his own suburb is the most visible local-SEO miss on the site. Competitors will rank for "Lane Cove headshot photographer" if we don't.
**File:** Add `lane-cove` entry to `lib/locations.ts` using the existing template — no new route file needed.
**Effort:** 20 minutes including local copy.

### 0.3 — Add author byline + Article schema to blog posts
**Why:** Google's E-E-A-T framework rewards content with a real, identifiable author. A personal-brand business with anonymous blog posts is a contradiction that costs ranking. Schema separately makes the article eligible for richer search results.
**Files:** Blog post template (`app/blog/[slug]/page.tsx`); add `Article` JSON-LD with `author: { @type: Person, name: "Nick Brand", url: "/about" }`. Add visible "By Nick Brand" + portrait thumbnail at top of each post.
**Effort:** 45 minutes (one template change applies to all 6 existing + future posts).

### 0.4 — Fix generic image alt text
**Why:** Every gallery image has alt text like "Sydney corporate and branding photography — image 1". That's six wasted ranking signals per page. Search engines and screen readers both want descriptive alt text.
**Approach:** Update `lib/images.ts` or wherever alt text is generated to use the image filename's descriptive component, not the index. Manual review of the top 50 images to add specific subject descriptors.
**Effort:** 1–2 hours. Stop the bleeding now (template fix), refine over time.

### 0.5 — Fix blog index OG title inheritance bug
**Why:** Audit found that `https://www.nickbrandphotography.com/blog` has `og:title` set to the homepage title ("Sydney Corporate Headshot & Personal Branding Photographer | Nick Brand Photography") rather than its own ("Photography Tips & Guides"). When the blog index is shared on social, the wrong title appears.
**File:** `app/blog/page.tsx` — add explicit `openGraph.title` to the metadata export.
**Effort:** 10 minutes.

### 0.6 — Add LinkedIn Headshots to main nav
**Why:** It's a Tier 1 service (per BUSINESS_INTELLIGENCE_SYSTEM.md 1.3) and a high-conversion query. Currently buried — visitors who land on the home page can't navigate directly to it.
**File:** `lib/site.ts` — add to the `nav.primary` array.
**Effort:** 5 minutes.

### 0.7 — Block all email/admin subdomains from indexing (verify)
**Why:** Quick check that `webmail.nickbrandphotography.com`, `webdisk.*`, `cpanel.*` etc. are not being indexed (they're HostMonster admin tools, no SEO value).
**Action:** Verify via Google search `site:nickbrandphotography.com -inurl:www`. If admin subdomains appear, add appropriate `noindex`.
**Effort:** 10 minutes.

**Phase 0 estimated impact:** Audit score moves from 74 → ~80.

---

## PHASE 1 — Foundation gaps (next 2–3 weeks)

Larger pieces that the site needs structurally before content production scales.

### 1.1 — Build `/faq` hub page
**Why:** AI search engines (ChatGPT, Perplexity, Gemini) retrieve FAQ-structured content disproportionately. A consolidated FAQ hub catches "people also ask" traffic that scattered page-level FAQs miss. Currently flagged in BIS 13.2.
**Content:** Pull every FAQ from every service page into one route. Add 10–15 more covering pricing, logistics, delivery, post-shoot, retake policy, group size, dress code, etc.
**Schema:** `FAQPage` JSON-LD with full Q+A.
**Effort:** 4–5 hours including content.

### 1.2 — Build 3 industry vertical pages
**Why:** "Corporate headshots Sydney" is broad and competitive. "Corporate headshots for Sydney law firms" is narrower, less competitive, higher intent, and matches Nick's actual client base. Each vertical page targets a distinct buyer segment.
**Pages to build:**
- `/corporate-headshots-law-firms` — formal, conservative, trust-led copy
- `/corporate-headshots-finance` — credibility, advisory tone, executive feel
- `/corporate-headshots-real-estate` — agent-focused, individual portraits, fast turnaround
**Schema:** Each gets `Service` schema with industry-specific area-served.
**Effort:** 1.5–2 days (vertical pages need unique copy — not just template variants — per BIS 13.5).

### 1.3 — Create dedicated OG share image (1200×630)
**Why:** Open Graph image is currently a portrait photo. When the home page is shared on LinkedIn or Slack, the preview looks like a single headshot rather than a brand identity. A purpose-built share card with logo + tagline + portrait reads better.
**File:** Generate as `public/og-default.png` and `public/og-default.webp`. Update `lib/site.ts` to reference it.
**Effort:** Nick — design tool (Canva, Figma). 30 minutes.

### 1.4 — Add proper logo file
**Why:** Header is currently a text wordmark. A real wordmark/logomark builds brand recognition and is what users screenshot to share. Currently flagged in BIS 13.2.
**Format:** SVG primary + PNG fallback for OG.
**Effort:** Nick — design tool or commissioned. 1–2 hours.

### 1.5 — Add 5 more suburb pages (target 18+ total)
**Why:** Hit the long-tail of Sydney corporate-headshot queries. Current 12 are good, but each additional well-written suburb page catches another stream of "[suburb] headshot photographer" searches with very low competition.
**Recommended additions:** Pyrmont, Manly, Newtown, Bondi, Double Bay. (Already have Barangaroo, North Sydney, CBD, Surry Hills, Parramatta, Chatswood, Mosman, St Leonards, Crows Nest, Macquarie Park, Bondi Junction.)
**Effort:** 2–3 hours total.

**Phase 1 estimated impact:** Score moves to ~84. Indexable surface area roughly doubles. AI retrieval improves materially.

---

## PHASE 2 — Content production (next 4–8 weeks)

Sustained content publishing to build topical authority. This is what moves rankings month-over-month.

### 2.1 — Write 10 new blog posts on commercial-intent topics
**Why:** 6 blog posts is not enough to be considered an authority on corporate headshots. Need 20+ posts spread across the keyword clusters defined in BIS section 6.
**Suggested first 10 (high commercial intent + low competition):**
1. How much should you pay for corporate headshots in Sydney
2. Headshot photographer vs LinkedIn photographer — which do you actually need
3. Team headshot day — checklist for HR managers
4. Should every executive in a law firm have the same headshot background
5. The 5-minute prep guide for an executive portrait
6. How fast can a Sydney corporate headshot be delivered
7. Headshot retake policies — what's reasonable to expect
8. Booking a team of 20 — what to know before you confirm
9. Personal branding photoshoot vs corporate headshot — what's the actual difference
10. How to brief your photographer when you book online

**Rules per post:** 800–1,200 words, 1 hero image with descriptive alt, FAQ block with 3 questions, internal link to most-relevant service page, schema `Article` with author = Nick Brand. Follow [BIS section 5](./BUSINESS_INTELLIGENCE_SYSTEM.md#5-brand-voice-system) for tone and prohibited phrases.
**Effort:** ~3 hours per post. AI-drafted, Nick-reviewed.

### 2.2 — Add before/after headshot reveals
**Why:** The single most engaging proof-of-value content on a photography site. Builds trust faster than any caption. Currently flagged in BIS 13.3.
**Approach:** Create a `/before-after` gallery page. Each item: pre-session selfie OR poor headshot (with subject permission) next to Nick's version.
**Constraint:** Per project rule, no named clients — frame as "Sydney executive (anonymous on request)".
**Effort:** Nick to source 5–10 willing subjects. Page itself ~2 hours.

### 2.3 — Add anonymous case studies (industry-coded, not client-named)
**Why:** Per the project's content rule, named clients are off-limits. But "Sydney law firm of 30 — 3-hour on-site team headshot day" tells a story without breaking the rule, and creates content that competitors can't replicate.
**Approach:** 4–6 case studies, one per industry vertical. Each is a short page (~300 words) with: brief, logistics, output, timeline.
**Effort:** ~30 minutes per case study.

### 2.4 — Add FAQ schema to `/contact` and `/book`
**Why:** These are bottom-of-funnel pages with highest commercial intent. Adding FAQ schema with 3–5 questions about booking, payment, cancellation makes them eligible for rich results. Currently flagged in BIS 13.3.
**Effort:** 30 minutes per page.

### 2.5 — Connect booking backend (Supabase + Google Calendar + Stripe)
**Why:** Currently the /book page is a frontend without a backend. Until the booking flow actually books people, every visit is a missed conversion. Per BOOKING-SETUP.md and BIS 13.1.
**Effort:** Larger effort (1–2 days of dev). Cross-reference [`BOOKING-SETUP.md`](./BOOKING-SETUP.md) — separate workstream from SEO.

**Phase 2 estimated impact:** Score moves to ~88. Topical authority becomes real. Long-tail traffic compounds.

---

## PHASE 3 — Off-site growth (ongoing, 3–6 months)

These are not code changes — they're business activities that Nick owns. They produce the biggest gains in domain trust and rankings over time, but they don't happen in a single session.

### 3.1 — Get to 25+ Google reviews
**Why:** Currently 5–7 reviews against a "20+ years, 500+ sessions" claim is a credibility chasm. 25 reviews is the threshold where Google Maps starts treating the listing as established.
**Approach:** For every session over the next 3 months, send a one-tap review link by SMS at delivery: "If the photos worked for you, would you mind leaving a quick Google review? [share.google/N8cRsktKVu02sWjRY]"
**Target:** 6–8 new reviews per month.

### 3.2 — Google Business Profile content cadence
**Why:** GBP posts and Q&A seeding are direct Maps ranking signals. Currently no posting cadence is running. Flagged in BIS 13.3.
**Approach:** 1 GBP post per week (service highlight, before/after, FAQ answer). Pre-populate the GBP Q&A with 8–10 of the FAQ questions, answered.
**Effort:** 30 minutes per week.

### 3.3 — Sydney backlink outreach
**Why:** Domain trust is at zero on the rebuilt site. Backlinks from authoritative Sydney business sources are the most reliable way to move it.
**Targets to pursue:**
- Sydney business directories (Lane Cove Council business listing, North Sydney Business Awards, etc.)
- Guest posts on Sydney HR / marketing blogs about team headshot logistics
- Photographer association directories (AIPP, ACMP)
- Local chamber of commerce
- Partnerships with Sydney coworking spaces (offer team-headshot days)
**Target:** 5 quality backlinks per month.

### 3.4 — LinkedIn content cadence
**Why:** Nick's primary buyer is on LinkedIn. Personal posting from his profile (2–3 posts a week, each linking to a relevant service or blog post) drives both direct conversion and referral traffic that Google notices.
**Approach:** Use the content engine in BIS section 9. Each post: hook + insight + soft CTA. Repurpose blog posts as carousels.
**Effort:** ~30 minutes per post.

### 3.5 — Branded search reinforcement
**Why:** People searching "Nick Brand Photography" or "Nick Brand Sydney photographer" are gold — they've already decided. Make sure those queries return a clean SERP (knowledge panel, GBP, social profiles aligned).
**Action:** Audit branded SERP quarterly. Claim or update any auto-created profiles (Yelp, Yellow Pages, etc.) so the NAP info matches the canonical.

**Phase 3 estimated impact:** Score moves to ~92 over 6 months. Rankings start showing up in unique-keyword positions (positions 4–10 → 1–3).

---

## Tracking & cadence

- **Weekly review:** Check Google Search Console (impressions, click-through, top queries) and Google Business Profile insights. Note what's moving.
- **Monthly review:** Re-run the audit against this plan. Update score. Adjust priorities if competitor moves change the landscape.
- **Quarterly review:** Read BUSINESS_INTELLIGENCE_SYSTEM.md end-to-end. Update positioning, pricing, trust signals as the business evolves.

---

## Decision log

| Date | Decision | Reason |
|---|---|---|
| 2026-05-28 | Phase 0 is the immediate priority before any content work | Foundation gaps are cheaper to fix than to live with. Content built on weak technical SEO doesn't compound. |
| 2026-05-28 | Industry vertical pages prioritised over more blog posts | Vertical pages convert better than blog posts and have less competition. Blog posts are a longer-payoff investment. |
| 2026-05-28 | Review acquisition is the single most important Phase 3 activity | Local SEO and AI retrieval both index review count and recency. Five reviews is the credibility ceiling for the business. |

---

**Next action:** Decide whether to execute Phase 0 in the next working session. Most of it is small enough that one focused hour gets all seven items done.

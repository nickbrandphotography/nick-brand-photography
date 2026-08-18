# THE MASTER FIX FILE — Nick Brand Photography

**Generated:** 18 August 2026
**Repo:** `C:\Projects\nick-brand-photography` (Next.js 16.2.6, Vercel)
**Purpose:** hand this file to Claude Code. Every item is actionable. Nothing here was implemented during the audit.
**Order:** P0 → P1 → P2 → P3. Within a priority, cheapest-first.
**Before starting:** read `AGENTS.md` — this is Next.js 16 with breaking changes; check `node_modules/next/dist/docs/` before writing page code. Never run bulk text-replacement scripts across the repo without committing first and verifying the diff.

---

## P0 — CRITICAL

### 1. FAQ answers are not rendered into the HTML
**Problem:** Only the currently-open FAQ answer exists in the DOM. Every other answer is absent from the server-rendered HTML entirely — not CSS-hidden, not present.
**Evidence:** `components/FAQ.tsx:44` — `{isOpen ? (<p …>{f.a}</p>) : null}`. Verified in the compiled build: `.next/server/app/locations/sydney-cbd.html` contains all 3 FAQ *questions* and all 3 answers in JSON-LD, but only **1 of 3** answers in the visible HTML. Live fetch of `/team-headshots-sydney` returned all 4 questions and **0 of 4** answer texts.
**Fix:** Render every answer into the DOM on every request; control visibility with CSS or the `hidden` attribute. Preferred implementation: native `<details>`/`<summary>`, which is crawlable, accessible and needs no JavaScript.
**Priority:** P0
**Expected impact:** Very high. Recovers roughly 150–250 words per page of the highest-value AEO copy across ~30 pages (all 9 service pages, 12 suburb pages, 6 blog posts, `/`, `/book`), including every "How much does X cost in Sydney?" answer. Also removes a structured-data policy risk, since Google requires FAQPage content to be visible on the page.
**Implementation instructions:**
1. Rewrite `components/FAQ.tsx` so each item is `<details>` + `<summary>` (or keep the button but always render `<p>{f.a}</p>` and toggle with a `hidden` attribute / `max-height` CSS).
2. Keep the first item open by default to preserve current visual behaviour (`<details open={i===0}>`).
3. Preserve the existing styling (`divide-y divide-border`, gold `+` indicator — a CSS-rotated marker works with `<details>`).
4. Keep `aria-expanded` semantics or rely on native `<details>` semantics; do not ship both.
5. Verify: run `npm run build`, then `grep -c "Team headshots are \$285" .next/server/app/locations/sydney-cbd.html` — it must be ≥1. Repeat for two more answers.
6. **Reference implementation already in this repo:** `components/Testimonials.tsx:124` renders every review into a `<ul className="sr-only">` precisely so the full text is always in the DOM for crawlers. Apply the same principle here — except the FAQ answers should be genuinely visible, not screen-reader-only, because FAQPage schema requires user-visible content.

### 2. All ten commercial pages bypass the CDN (`force-dynamic`)
**Problem:** The homepage and all nine service pages are server-rendered on every single request. No static generation, no ISR, no edge cache.
**Evidence:** `export const dynamic = "force-dynamic"` in `app/page.tsx:40`, `app/corporate-headshots-sydney/page.tsx:20`, `app/linkedin-headshots-sydney/page.tsx:20`, `app/executive-portraits-sydney/page.tsx:20`, `app/team-headshots-sydney/page.tsx:20`, `app/personal-branding-sydney/page.tsx:20`, `app/actor-headshots-sydney/page.tsx:20`, `app/corporate-event-photographer-sydney/page.tsx:20`, `app/family-photography-sydney/page.tsx:20`, `app/band-photographer-sydney/page.tsx:18`. Corroborated: none of these routes appear in `.next/prerender-manifest.json`, while `/about`, `/contact`, `/portfolio`, `/blog/*` and `/locations/*` all do.
**Fix:** Solve the original Vercel version-skew problem at its source, then remove all ten directives.
**Priority:** P0
**Expected impact:** High — TTFB and LCP on every revenue page, crawl efficiency, and serverless cost. (Note: Core Web Vitals were not measured during the audit; this is an architectural conclusion.)
**Implementation instructions:**
1. Enable **Skew Protection** in Vercel: Project → Settings → Advanced → Skew Protection. This is the purpose-built fix for the stale-RSC-payload bug the code comments describe.
2. Alternatively/additionally set `deploymentId` in `next.config.js` to pin client and server builds together.
3. Remove `export const dynamic = "force-dynamic";` and its comment block from all ten page files. **Do not touch the five `app/api/**/route.ts` files — those legitimately need it.**
4. If any residual staleness concern remains, add `export const revalidate = 3600;` to the service pages instead — pages become static and self-correct hourly.
5. Verify: `npm run build`, then confirm `/`, `/corporate-headshots-sydney` and the other eight now appear in `.next/prerender-manifest.json` under `routes`.

### 3. No analytics or conversion tracking exists
**Problem:** There is no GA4, no GTM, no privacy-friendly alternative, no Search Console verification tag and no conversion tracking anywhere in the codebase.
**Evidence:** Repo-wide grep across `app/`, `components/`, `lib/` for `gtag|googletagmanager|google-analytics|plausible|umami|fathom|clarity|google-site-verification` returned **zero matches**.
**Fix:** Install GA4 (or Plausible) plus Google Search Console, with events on every conversion action.
**Priority:** P0
**Expected impact:** High — it is the precondition for every prioritisation decision that follows.
**Implementation instructions:**
1. Add GA4 via `next/script` with `strategy="afterInteractive"` in `app/layout.tsx`. Put the measurement ID in an env var (`NEXT_PUBLIC_GA_ID`) and no-op when unset.
2. Verify the property in Google Search Console and submit `https://www.nickbrandphotography.com/sitemap.xml`.
3. Fire events on: `Book Now` / `Check Availability` clicks (`components/Button.tsx` or the CTA components), booking-flow completion (`components/BookingFlow.tsx` success state), contact-form submit (`components/ContactForm.tsx`), `tel:` clicks, `mailto:` clicks.
4. Mark booking completion and contact submit as GA4 key events.
5. Verify with GA4 DebugView before closing the ticket.

### 4. A second website publishes the same business entity
**Problem:** `nickbrandphotography.art` is a live, indexed, self-canonicalising site using the same business name and an overlapping (wider) service list, with no NAP data. It competes with `.com` on the brand query and splits entity signals.
**Evidence:** Search for `"Nick Brand Photography" Sydney` returns `nickbrandphotography.art/about`, `/photography-blog` and `/corporate-headshots-1` alongside the `.com` pages. Fetching `/about` confirms `<link rel="canonical" href="https://nickbrandphotography.art/about">`, H1 "Nick Brand Photography – Portrait Photographer in Sydney.", services including corporate headshots and event photography, and **no phone, email or address**. `.com` is referenced only in a footer copyright line.
**Fix:** Consolidate to one entity.
**Priority:** P0
**Expected impact:** High — brand consolidation, link equity, and unambiguous entity resolution for Google and AI engines.
**Implementation instructions (decision required from Nick before implementing):**
- **Option A (preferred):** 301 the entire `.art` domain to the matching `.com` URLs at the DNS/host level.
- **Option B:** If `.art` must survive as a separate art practice (the bodyscape practice and fashion label mentioned on `/about`), rebrand it away from "Nick Brand Photography", remove every commercial photography service page from it, and link prominently to `.com` for photography services.
- **Option C (minimum acceptable):** `noindex` every service page on `.art`.
- This is a hosting/DNS change, not a repo change. Note the lead time and start it early.

### 5. Four services have no supporting photography
**Problem:** Corporate events, team headshots, personal branding and actor headshots are all sold on the site with galleries that do not depict the service being sold.
**Evidence:**
- `lib/galleries.ts:72–78` — all 5 gallery picks for `corporate-event-photographer-sydney` come from the `corporate-headshots` silo; `lib/services.ts` sets its hero to `heroSilo: "corporate-headshots", heroIndex: 27`. There is no event silo on disk.
- `lib/images.ts:48–52` — the `personal-branding` silo has `count: 2`. Filesystem confirms **2 WebP + 2 JPG**. `galleries.ts:79–83` shows 3 images on that page, 2 of which come from `model-portfolios`.
- `galleries.ts:84–93` — the actor page shows 8 images, **1** from `actor-headshots` and 7 from `model-portfolios`.
- `galleries.ts:64–71` — the team page does include three group/office frames (four colleagues together, a company team-page group, a team around an office table), but there is no photograph anywhere of a mobile studio, an on-site setup, or a headshot day in progress. The logistics proposition — the actual thing being sold — is undepicted.
**Fix:** Shoot the missing work. In the interim, stop showing images that misrepresent the service.
**Priority:** P0 (interim honesty fix is P0; the shoots are scheduled work)
**Expected impact:** High — conversion, E-E-A-T, and accuracy of image alt text.
**Implementation instructions:**
1. **Immediately:** manually inspect `corporate-headshot-sydney-39/44/32/06/01.{webp,jpg}`. If any genuinely are event frames, move them into a new `public/images/corporate-events/` silo with correct filenames and register the silo in `lib/images.ts`. If they are not, **remove the event gallery** and replace it with a short line ("Event portfolio available on request") plus a contact link.
2. Do the same audit for the personal branding and actor galleries; where an image is not the advertised service, either remove it or relabel the alt text honestly.
3. Schedule three shoots: (a) a mobile studio set up in an office + a team day in progress, (b) a real personal branding session, (c) an event, if events are to remain a service.
4. Once shot, add silos and update `lib/images.ts` counts and `lib/galleries.ts` picks.

---

## P1 — HIGH

### 6. Service pages are at ~40% of competitive depth
**Problem:** Each service page carries only 388–532 words of unique copy.
**Evidence:** Measured from `lib/services.ts` (string content excluding identifiers): corporate 482, band 532, LinkedIn 455, personal branding 445, team 438, executive 424, actor 421, family 410, events 388. Competitor page extraction reported: Gavin Jowitt ~4,500 words, Adrian Harrison ~3,500, GrayNoise ~2,500–3,000. (These are extraction-tool estimates, not exact counts — but the order of magnitude is unambiguous.)
**Fix:** Rebuild the top three money pages to ~1,500–2,000 words of genuinely useful content. Do not pad.
**Priority:** P1
**Expected impact:** High
**Implementation instructions:** Extend the `Service` type in `lib/services.ts` with optional blocks, and render them in `components/ServicePageTemplate.tsx`:
- `costBreakdown` — what drives the price, inc/ex GST, individual vs team economics
- `notIncluded` — what is not in the package and why (reads as honesty)
- `objections: {q, a}[]` — price, phone photos, AI headshots, cheaper photographers, reshoots, insurance, camera-shyness
- `industryNotes` — law / finance / tech / property / medical specifics
- `caseStudySlug` — link to the matching case study
- `commonMistakes` — what goes wrong and how you prevent it
Start with `corporate-headshots-sydney`, `team-headshots-sydney`, `personal-branding-sydney`. Leave family and band alone.

### 7. No pricing / cost page exists
**Problem:** "How much do corporate headshots cost in Sydney" is the highest-intent query in the market and no URL owns it. Prices are scattered across nine service pages.
**Evidence:** No `/pricing` route in `app/` or `sitemap.xml`. Verified competitor cost pages ranking for this: `adrianharrison.com.au/how-much-are-corporate-headshots-sydney/`, `gavinjowitt.com/blog/corporate-headshots-cost-sydney/`, `orlandosydney.com/headshot-pricing/`, `sydney-headshots.com/articles/headshot-costs-sydney/`.
**Fix:** Build `/corporate-headshot-pricing-sydney`.
**Priority:** P1
**Expected impact:** High — likely the single highest-ROI new page on the site.
**Implementation instructions:**
1. New route `app/corporate-headshot-pricing-sydney/page.tsx`.
2. Content: honest Sydney market ranges (including competitor ranges), what drives price, individual vs team economics, a headcount table (1/5/10/20/30/50 people) with GST stated, what's included and not included, what "cheap" costs you, how to brief a photographer, then your own table sourced from `lib/pricing.ts`.
3. Schema: `WebPage` + `FAQPage` + `Offer` nodes sourced from `getTiers()` so markup and screen cannot drift (follow the existing pattern in `lib/schema.ts:104`).
4. Add to `app/sitemap.ts`, to `mainNav` in `lib/site.ts`, and link from every service page's pricing section.

### 8. Zero case studies
**Problem:** Nothing on the site describes a real job, its constraints, or its outcome. All three verified competitors publish case studies.
**Evidence:** No case-study route exists. `docs/BUSINESS_INTELLIGENCE_SYSTEM.md` and the site content rule confirm client names cannot be published without permission — but case studies do not require names.
**Fix:** Build `/case-studies` plus four anonymised case studies.
**Priority:** P1
**Expected impact:** High — the strongest single lever for both E-E-A-T and conversion, and fully compatible with the no-named-clients rule.
**Implementation instructions:**
1. New `lib/case-studies.ts` following the shape of `lib/posts.ts`.
2. Structure each: the brief → the constraint (billable hours, a 3m×3m meeting room, a partner who hates cameras) → what was done → the numbers (34 people, 6.5 hours, ~10 min each, delivered day 5) → the outcome.
3. Suggested four: a Sydney CBD law firm, 34 headshots in one day; a North Sydney tech company's team-page refresh; a founder's personal branding day; an executive leadership refresh.
4. Routes `app/case-studies/page.tsx` and `app/case-studies/[slug]/page.tsx`, with `Article` schema, `generateStaticParams`, canonicals and OG images.
5. Link each from the matching service page and from `/about`.
6. **Do not invent details.** Get the real numbers from Nick before writing.

### 9. Only 7 Google reviews
**Problem:** Seven reviews is the weakest local signal on the site and it contradicts the "20+ years / 500+ sessions" positioning.
**Evidence:** `lib/testimonials.ts:59–63` — `reviewCount: 7`, commented "as of May 2026". Five testimonials displayed, four of them one or two generic sentences.
**Fix:** Systematic review generation. Not a code change.
**Priority:** P1
**Expected impact:** High — map pack rankings, click-through, conversion and AI trust, simultaneously.
**Implementation instructions:**
1. Add a review request with the direct Google review link to the delivery email template in `lib/email.ts`.
2. Email every client from the last 24 months with the same link.
3. When asking, prompt for substance: *"What were you worried about before the shoot, and what happened?"* — this produces citable testimony instead of "thanks Nick".
4. Update `lib/testimonials.ts` (`reviewCount` and the displayed set) as the count grows. Target 40+.

### 10. `LocalBusiness` schema exists on the homepage only
**Problem:** Every service page emits `provider: {"@id": "https://www.nickbrandphotography.com/#business"}` and every `ImageObject` emits `copyrightHolder: {"@id": "…/#business"}`, but that node is defined only on `/`. A crawler fetching a single service page gets a dangling reference and no business identity.
**Evidence:** `app/page.tsx:74–82` is the only call site for `localBusinessSchema()` and `webSiteSchema()`. Confirmed in compiled HTML: `/about` emits only `Person` + `BreadcrumbList`; `/locations/sydney-cbd` emits only `FAQPage`, `BreadcrumbList`, `ImageObject`, `Person`.
**Fix:** Emit the business and website nodes from the root layout.
**Priority:** P1
**Expected impact:** Medium-high — entity resolution from any entry point, and directly improves AI extraction on single-page fetches.
**Implementation instructions:**
1. In `app/layout.tsx`, render `<JsonLd data={[localBusinessSchema(), webSiteSchema()]} />` inside `<body>`.
2. Remove those two from `app/page.tsx:76–78` to avoid duplication (keep `personSchema()`, `faqSchema()` and `imageObjectSchema()` there).
3. Validate three page types in Google's Rich Results Test.

### 11. `/contact` has no LocalBusiness schema
**Problem:** The page entirely about the physical business emits only a breadcrumb.
**Evidence:** `app/contact/page.tsx:75` — `<JsonLd data={breadcrumbSchema(crumbs)} />`. Confirmed in `.next/server/app/contact.html`.
**Fix:** Resolved automatically by #10. Verify afterwards.
**Priority:** P1
**Expected impact:** Medium-high
**Implementation instructions:** After #10, confirm `.next/server/app/contact.html` contains `"@type":["ProfessionalService","LocalBusiness"]`.

### 12. Suburb pages are 52.6% duplicate and share one hero image
**Problem:** Twelve suburb pages average 52.6% five-gram similarity. All twelve use the identical hero photograph, the identical six-image gallery, the identical pricing block and the identical testimonials.
**Evidence:** Measured word-5-gram Jaccard across all 66 pairs of the compiled suburb HTML: average **52.6%**; worst pairs Bondi Junction↔Parramatta 58.4%, Macquarie Park↔Parramatta 58.2%, Chatswood↔North Sydney 57.9%. Cause: `components/LocationPageTemplate.tsx:24` hardcodes `getImage("corporate-headshots", 9, …)` and line 25 uses the shared `locationGallery` from `lib/galleries.ts:118`. Each page renders ~790 words, of which ~250–330 are unique. Additionally, 7 of the 12 have exactly **1** inbound internal link (`components/Footer.tsx:71` — `locations.slice(0, 6)`).
**Fix:** Consolidate 12 → 6 and make the survivors genuinely distinct.
**Priority:** P1
**Expected impact:** Medium-high
**Implementation instructions:**
1. Keep: `sydney-cbd`, `north-sydney`, `lane-cove`, `parramatta`, `chatswood`, and a merged `inner-sydney` (Surry Hills + Bondi Junction).
2. Merge and 301: `barangaroo`+`pyrmont` → `sydney-cbd`; `st-leonards`+`crows-nest` → `north-sydney`; `macquarie-park` → `parramatta`; `mosman` → `chatswood`. Add a `redirects()` block to `next.config.js`.
3. Add `heroSilo`/`heroIndex` and a `gallery: GalleryPick[]` field to the `Location` type so each survivor gets a **different** hero and a **different** gallery.
4. Expand unique copy to 400+ words per page.
5. Add per-suburb `Service` schema with `areaServed: {"@type":"Place","name":"<Suburb>, NSW"}` and `provider: {"@id": ORG_ID}`.
6. Remove `.slice(0, 6)` from `Footer.tsx` once there are six.
7. Update `app/sitemap.ts`.

### 13. Internal linking is footer boilerplate only
**Problem:** All internal links come from a 27-link sitewide footer. There are effectively no contextual, in-body links. Thirteen pages have exactly one inbound link.
**Evidence:** Programmatic link-graph extraction across all 26 compiled pages: every footer-linked URL has 26 inbound links (i.e. every page); the 7 non-footer suburbs and all 6 blog posts have **1** each. No service page links to any blog post, any suburb page, or `/about`.
**Fix:** Implement the internal-linking blueprint (Part 18 of the audit).
**Priority:** P1
**Expected impact:** Medium-high
**Implementation instructions:** Add optional fields to the `Service` type and render them in `ServicePageTemplate.tsx`: `relatedPosts: string[]`, `relatedLocations: string[]`, `caseStudySlug?: string`. Add contextual in-body links with descriptive anchor text (not "click here", not bare nav labels). Add reciprocal links from blog posts and suburb pages. Full anchor-text mapping is in Part 18 of the audit document.

### 14. Service links are absent from the server-rendered navigation
**Problem:** The header Services dropdown renders only when client state is open, so none of the nine service links exist in the HTML. The crawled header contains four links: About, Blog, Contact, Book Now.
**Evidence:** `components/Header.tsx:52` — `{servicesOpen && (…)}`; mobile menu at line 112 — `{open ? … : null}`. Confirmed by link extraction on compiled pages: all service links originate from the footer.
**Fix:** Always render the dropdown markup; hide it with CSS.
**Priority:** P1
**Expected impact:** Medium — nav links carry more weight than footer links, and this restores a real navigational signal.
**Implementation instructions:** Replace the conditional render with an always-rendered container toggled via a class (`hidden`/`block`, or `opacity`/`pointer-events`). Do the same for the mobile menu. Keep `aria-expanded` accurate. Verify with `grep -c 'href="/corporate-headshots-sydney"' .next/server/app/about.html` — should increase.

### 15. No objection handling on any page
**Problem:** No page addresses price justification, AI headshots, phone photos, reshoot policy, insurance/COC, or camera-shyness. All three verified competitors do.
**Evidence:** Full read of `lib/services.ts` — `outcomes`, `process`, `whoFor` and `faqs` are all descriptive; none is an objection. Adrian Harrison uses H2s "Do You Have Any of These Problems?" and "Painless Headshots, Even if You're Camera-Shy".
**Fix:** Add an objections block to every money page, and publish an AI-headshots comparison article.
**Priority:** P1
**Expected impact:** Medium-high — conversion, and it creates highly extractable AEO content.
**Implementation instructions:** Add `objections: {q,a}[]` to the `Service` type and render as a distinct section (not inside the FAQ accordion — this content should always be visible). Separately, write `app/blog/ai-headshots-vs-professional-photographer-sydney`. Be genuinely balanced: acknowledge what AI headshots do well. Defensive content does not get cited; honest comparison does.

### 16. Portfolio and Pricing are missing from the header nav
**Problem:** On a photography site, "see the work" is the primary trust action and it is footer-only. There is no pricing link because there is no pricing page.
**Evidence:** `lib/site.ts:82` — `mainNav = [About, Blog, Contact]`.
**Fix:** Add Portfolio and Pricing.
**Priority:** P1
**Expected impact:** Medium — conversion
**Implementation instructions:** After #7 ships, set `mainNav = [Portfolio, Pricing, About, Blog, Contact]`. Verify the header does not overflow at 1024–1280px — the Services dropdown was introduced specifically to solve header crowding, so re-check before shipping.

### 17. Wrong call-to-action for team, event and executive buyers
**Problem:** Every service page CTA is "Check Availability", which opens a booking calendar. A buyer arranging headshots for 34 staff needs a quote and an invoice, not a time slot.
**Evidence:** `components/ServicePageTemplate.tsx:66–68` and `components/CTASection.tsx:32`.
**Fix:** Make the CTA label and destination service-dependent.
**Priority:** P1
**Expected impact:** Medium-high — this leak sits on the highest-value lead type.
**Implementation instructions:** Add `ctaLabel?: string` and `ctaHref?: string` to the `Service` type. For `team-headshots-sydney`, `corporate-event-photographer-sydney` and `executive-portraits-sydney`, set "Get a Team Quote" → `/contact?service=<slug>` (or a dedicated quote route). Keep "Check Availability" for individual sessions. Prefill the contact form from the `service` param in `components/ContactForm.tsx`.

---

## P2 — MEDIUM

### 18. GST is not stated on any price
**Problem:** Every price is published without an inc/ex GST statement. Business buyers cannot quote from it. GrayNoise and Gavin Jowitt both state "+ GST" explicitly.
**Evidence:** `lib/pricing.ts` — no occurrence of "GST" anywhere in the file.
**Fix:** State it on every price.
**Priority:** P2 · **Impact:** Medium (B2B) · **Instructions:** Add a `gstNote` to `PricingGroup` or a global line in `components/PricingCards.tsx` ("All prices in AUD, inclusive of GST" or "+ GST" — whichever is true). Mirror it in `Offer` schema and in `public/llms.txt`.

### 19. Blog posts are orphaned
**Problem:** Each of the six posts has exactly one inbound internal link, from `/blog`.
**Evidence:** Link-graph extraction across all compiled pages.
**Fix:** Link every service page to its two most relevant posts, and cross-link posts to each other.
**Priority:** P2 · **Impact:** Medium · **Instructions:** Covered by the `relatedPosts` field in #13. Mapping is in Part 18.3 of the audit.

### 20. Contradictory experience claims
**Problem:** `TrustStats` says "500+ Sessions Delivered". `/about` says Nick has photographed "thousands of people". Both appear on the same page.
**Evidence:** `lib/site.ts:49` (`sessions: "500+"`) vs `app/about/page.tsx:119` ("photographed thousands of people").
**Fix:** Establish the true figure and use it everywhere.
**Priority:** P2 · **Impact:** Medium (E-E-A-T) · **Instructions:** Ask Nick. Update `lib/site.ts`, the About copy and `public/llms.txt` together. If it is thousands, say thousands.

### 21. Sitemap `lastModified` frozen at 2026-06-25
**Problem:** All 30 non-blog URLs claim they have not changed since 25 June.
**Evidence:** `app/sitemap.ts:19` — `const CONTENT_UPDATED = new Date("2026-06-25")`.
**Fix:** Bump on every substantive content change.
**Priority:** P2 · **Impact:** Medium · **Instructions:** Update the constant now, and add a note to the release checklist. Optionally derive it from the newest `mtime` across `lib/services.ts`, `lib/locations.ts` and `lib/pricing.ts` at build time.

### 22. Blog posts marked `changeFrequency: "yearly"`
**Evidence:** `app/sitemap.ts:68`.
**Fix:** Change to `"monthly"`.
**Priority:** P2 · **Impact:** Low-medium (AEO freshness) · **Instructions:** One-line change.

### 23. `reviewCount: 7` is a stale hardcode
**Problem:** Commented "as of May 2026"; it is now August. It drives schema, the testimonial lead text and the "Read all N reviews" CTA simultaneously.
**Evidence:** `lib/testimonials.ts:59–63`; consumed by `lib/schema.ts:70` and `components/Testimonials.tsx:77,140`.
**Fix:** Update with the true current count; recheck monthly.
**Priority:** P2 · **Impact:** Medium · **Instructions:** One-line change plus a recurring reminder. Never inflate it.

### 24. Event-page alt text may describe images that don't exist
**Problem:** Alt text asserts event scenes on files drawn from the corporate-headshots silo.
**Evidence:** `lib/galleries.ts:73–77` — e.g. `{ silo: "corporate-headshots", i: 39, alt: "Guests in formal dress at a Sydney corporate function" }`. No event silo exists on disk.
**Fix:** Visually verify each file; re-file or rewrite the alt text.
**Priority:** P2 · **Impact:** Medium (accuracy, Google Images, accessibility) · **Instructions:** Open `corporate-headshot-sydney-39/44/32/06/01` and check. Covered by #5.

### 25. `ImageObject` schema only on hero images
**Problem:** Gallery images — the actual portfolio — carry no schema, so the Licensable-badge eligibility you built applies to ~30 images instead of 132.
**Evidence:** `imageObjectSchema()` is called once per page, on the hero, in `ServicePageTemplate.tsx:48`, `LocationPageTemplate.tsx:39` and `app/page.tsx:80`.
**Fix:** Emit `ImageObject` for gallery images too.
**Priority:** P2 · **Impact:** Medium (Google Images) · **Instructions:** Have `components/Gallery.tsx` accept an optional `emitSchema` prop and render one `<JsonLd>` block containing an array of `ImageObject`s built from `images`. Watch payload size — cap at ~12 per page.

### 26. No image sitemap
**Evidence:** `app/sitemap.ts` emits no `<image:image>` entries; 132 photographs on disk.
**Fix:** Add image entries.
**Priority:** P2 · **Impact:** Medium · **Instructions:** Next's `MetadataRoute.Sitemap` supports an `images` array per entry. Populate from `lib/galleries.ts` per route.

### 27. No `/faq` hub
**Fix:** Build one aggregating every FAQ on the site (services, locations, booking, blog).
**Priority:** P2 · **Impact:** Medium (AEO) · **Instructions:** New route `app/faq/page.tsx`, grouped by topic, with `FAQPage` schema. Only ship it **after** #1, otherwise it will have the same invisible-answer problem. Link from header, footer and every service page.

### 28. No inline enquiry form on service pages
**Evidence:** `components/ContactForm.tsx` is imported only by `app/contact/page.tsx:149`.
**Fix:** Add a short inline form to each money page.
**Priority:** P2 · **Impact:** Medium · **Instructions:** Add a compact variant (name, email, service, message) to `ServicePageTemplate`, prefilled with the current service. Include the response-time promise ("usually within a business day"), which currently appears only on `/contact`.

### 29. No ABN, terms, or cancellation policy
**Problem:** B2B buyers and procurement look for these. GrayNoise publishes ABN, T&Cs and a cancellation policy.
**Fix:** Add `/terms`.
**Priority:** P2 · **Impact:** Medium (B2B trust) · **Instructions:** New route covering ABN, payment/invoice terms, cancellation and rescheduling, image usage and consent, and a $20M public liability statement with "certificate of currency supplied on request". Link from the footer.

### 30. `priceRange: "$$$"`
**Evidence:** `lib/schema.ts:32`.
**Fix:** `priceRange: "$285-$2800"`.
**Priority:** P2 · **Impact:** Low-medium · **Instructions:** One-line change; derive from `pricingGroups` if you want it self-maintaining.

### 31. `areaServed` is a single City node
**Evidence:** `lib/schema.ts:48` — `areaServed: { "@type": "City", name: "Sydney" }`.
**Fix:** Use a `GeoCircle` around the studio, or an explicit array of served suburbs.
**Priority:** P2 · **Impact:** Low-medium · **Instructions:** Build the array from `lib/locations.ts` so it stays in sync with the suburb pages.

### 32. `BlogPosting.publisher` has no logo
**Evidence:** `app/blog/[slug]/page.tsx:94–98` — inline `Organization` with `name` and `url` only.
**Fix:** Reference the `#business` node instead.
**Priority:** P2 · **Impact:** Low-medium · **Instructions:** Replace with `publisher: { "@id": "https://www.nickbrandphotography.com/#business" }` — valid once #10 puts that node on every page.

### 33. Blog posts and `/about` inherit the homepage Twitter card
**Problem:** Next.js does not deep-merge `twitter` metadata across segments, so pages that set `openGraph` but not `twitter` inherit the root values.
**Evidence:** `.next/server/app/about.html` — `og:title` is "About Nick Brand — Sydney Photographer" while `twitter:title` is "Sydney Corporate Headshot & Personal Branding Photographer | Nick Brand Photography". `app/blog/[slug]/page.tsx:51–63` sets no `twitter` block at all.
**Fix:** Set `twitter` explicitly wherever `openGraph` is set.
**Priority:** P2 · **Impact:** Low-medium · **Instructions:** Add matching `twitter` blocks to `app/about/page.tsx` and `app/blog/[slug]/page.tsx`. Consider a shared `buildMetadata()` helper in `lib/site.ts` so this cannot recur.

### 34. `/blog`, `/portfolio` and `/locations` have no OG image
**Evidence:** Their `openGraph` blocks omit `images`.
**Fix:** Add `/images/og/og-default.jpg` (1200×630, already exists).
**Priority:** P2 · **Impact:** Low-medium · **Instructions:** Three small edits.

### 35. Live `llms.txt` is stale, and thin on what AI needs
**Problem:** The live file omits band/musician and family services that `HEAD:public/llms.txt` contains. It also omits FAQs, turnaround times, on-site capability, insurance and differentiators, and states "5.0 Google rating" without the count.
**Evidence:** Live fetch vs `git show HEAD:public/llms.txt`. Latest commit `8397be3` is dated 2026-08-18 16:35 +1000 — likely a pending deploy or a CDN-cached static asset.
**Fix:** Verify the deploy, purge the asset, then expand the file.
**Priority:** P2 · **Impact:** Medium (AEO stopgap) · **Instructions:** Confirm the latest Vercel deploy succeeded and that `https://www.nickbrandphotography.com/llms.txt` matches `HEAD`. Then add: full FAQ Q&A (this is a cheap patch while #1 is in flight), turnaround times, on-site/mobile studio capability, $20M insurance, differentiators, and "5.0 from N Google reviews". **`llms.txt` is not honoured by any major engine as a standard — never treat it as a substitute for fixing the HTML.**

---

## P3 — LOW

### 36. `/portfolio` is 398 words with breadcrumb schema only
**Evidence:** Measured from `.next/server/app/portfolio.html`; `app/portfolio/page.tsx:42`.
**Fix:** Add per-category context paragraphs and `ImageGallery` schema.
**Priority:** P3 · **Impact:** Low-medium

### 37. Root canonical is a latent trap
**Problem:** `app/layout.tsx:28` sets `alternates: { canonical: site.url }`. Every page currently overrides it; the first page that forgets will silently canonicalise to the homepage.
**Fix:** Remove the root canonical, or add a build-time assertion that every route sets its own.
**Priority:** P3 · **Impact:** Low (prevents a future high-severity bug)

### 38. `/admin` is prerendered and publicly reachable
**Evidence:** `.next/server/app/admin.html` exists (306 words). `robots.txt` disallows it, which prevents crawling but not URL-level indexing if linked.
**Fix:** Add `export const metadata = { robots: { index: false, follow: false } }` to `app/admin/page.tsx`.
**Priority:** P3 · **Impact:** Low

### 39. Nine unused images ship with every deploy
**Evidence:** `public/images/sports-portraits/` (8) and `public/images/creative-portraits/` (1) are registered in `lib/images.ts` but referenced by no page or gallery.
**Fix:** Use them (a sports/creative portfolio category) or delete them.
**Priority:** P3 · **Impact:** Low

### 40. No security or cache headers
**Evidence:** `next.config.js` contains only `images.formats`. No `headers()`, no `redirects()`.
**Fix:** Add a `headers()` block with `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, and a basic CSP.
**Priority:** P3 · **Impact:** Nil for SEO; good hygiene

### 41. Testimonials auto-rotate every 6 seconds
**Evidence:** `components/Testimonials.tsx:53` with `intervalMs = 6000`.
**Fix:** Increase to 10–12s, or make rotation manual.
**Priority:** P3 · **Impact:** Low (usability — it moves content a visitor is mid-sentence on)

### 42. No IPTC metadata on image files
**Problem:** No embedded creator/copyright/credit fields, which is the format Google reads for image rights and which would reinforce the existing `ImageObject` markup.
**Fix:** Batch-embed IPTC creator, copyright notice and credit across all 132 files.
**Priority:** P3 · **Impact:** Low-medium · **Instructions:** Add a script alongside `scripts/recrop-images.mjs` using `exiftool` or `sharp` + `piexifjs`. **Do not add GPS coordinates to studio portraits of private individuals.**

### 43. `NEXT_PUBLIC_GOOGLE_BUSINESS_URL` vs a hardcoded value
**Evidence:** `.env.local.example` defines it; `lib/site.ts:69` hardcodes `https://share.google/N8cRsktKVu02sWjRY`.
**Fix:** Pick one source of truth.
**Priority:** P3 · **Impact:** Nil

### 44. Verify apex → www redirect
**Problem:** `https://nickbrandphotography.com/` returned page content rather than a reported cross-host redirect. It is unclear whether the apex 301s or serves 200.
**Evidence:** Fetch behaviour was inconclusive; the tool used does not expose status codes.
**Fix:** Verify manually.
**Priority:** P3 (P0 if it turns out to serve 200) · **Instructions:** Run `curl -I https://nickbrandphotography.com/`. Expect `308` or `301` with `Location: https://www.nickbrandphotography.com/`. If it returns `200`, configure the redirect in Vercel's domain settings immediately.

---

## DO NOT DO

| # | Item | Why |
|---|---|---|
| 45 | Build more suburb pages | The existing 12 already average 52.6% mutual similarity. More actively hurts. |
| 46 | Optimise `AggregateRating`/`Review` for SERP stars | Self-serving reviews have been rich-result-ineligible since 2019. Keep the markup honest for entity understanding; expect nothing from it. |
| 47 | Adjust sitemap `priority` values | Google has ignored them for years. |
| 48 | "Fix" the `Host:` directive in `robots.txt` | Yandex-only; Google ignores it. Harmless. |
| 49 | Add keyword-density or LSI optimisation | Titles and meta descriptions are already good. |
| 50 | Target "photographer sydney" | Too broad, aggregator-dominated, no buying intent. |
| 51 | Publish more blog posts before fixing internal linking | Six good posts already sit on one inbound link each. |
| 52 | Invest in ranking the family or band pages | Off-strategy for corporate lead generation. Keep them; don't optimise them. |
| 53 | Keyword-stuff alt text | The current curated alt text is genuinely good. Don't touch it except where it is inaccurate (#24). |
| 54 | Add fake reviews, unearned awards, or unsupported schema | Non-negotiable. |

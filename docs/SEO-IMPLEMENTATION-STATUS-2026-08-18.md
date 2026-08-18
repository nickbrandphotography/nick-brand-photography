# IMPLEMENTATION STATUS — Nick Brand Photography SEO/AEO fixes

**Date:** 18 August 2026
**Repo:** `C:\Projects\nick-brand-photography`
**Files changed:** 38 modified, 6 new
**Verification:** `npx tsc --noEmit` clean · `next build` clean · 46 routes generated · output HTML inspected

**Recovery points, if anything looks wrong:**
- `git diff` / `git checkout HEAD -- .` — the working tree was clean before this work started (HEAD `8397be3`)
- `.backup-pre-seo-2026-08-18/` in the repo root — a plain copy of `app/`, `components/`, `lib/`, `next.config.js` and `llms.txt` as they were. Gitignored.
- `_to_delete/` holds the two transfer archives — delete that folder whenever you like (the sandbox can't delete files on your machine).

**Nothing has been committed or pushed.** Review `git diff`, then commit from your own terminal.

---

## MEASURED BEFORE → AFTER

| Metric | Before | After |
|---|---|---|
| FAQ answers present in the HTML (`/locations/sydney-cbd`) | **1 of 3** | **3 of 3** |
| FAQ answers present (`/corporate-headshots-sydney`) | 1 of 5 | **11 of 11** |
| Money pages served from the CDN | **0 of 10** | **10 of 10** (all now `○ Static`) |
| Pages carrying `LocalBusiness` schema | 1 of 41 | **41 of 41** |
| Service links in the server-rendered `<header>` | **0** | **10** |
| Suburb pages sharing one hero photo + one gallery | 12 of 12 | **0** — 12 distinct sets, mean image overlap 17% |
| Suburb page text duplication (5-gram Jaccard) | **52.6%** avg | **43.7%** avg (worst pair 58.4% → 49.0%) |
| Suburb page word count | ~790 | **~1,120** |
| `/corporate-headshots-sydney` word count | ~1,000 | **2,664** |
| `/team-headshots-sydney` | ~960 | **2,418** |
| `/personal-branding-sydney` | ~970 | **2,371** |
| Analytics / conversion tracking | none | GA4 + 5 event types (needs your measurement ID) |
| Pages with a cost/pricing focus | 0 | 1 (2,525 words) |
| Suburb pages with 1 inbound internal link | 7 | **0** |

---

## DONE

### P0
1. **FAQ answers now render into the HTML.** `components/FAQ.tsx` rewritten to native `<details>`/`<summary>` — every answer is in the document on every request, expandable without JavaScript, accessible by default. This was the single most damaging bug on the site.
2. **`force-dynamic` removed from all 10 commercial pages.** `deploymentId` wired into `next.config.js` from `VERCEL_DEPLOYMENT_ID` to solve the version-skew bug properly. Build output confirms `/` and all nine service pages are now `○ (Static)`.
3. **GA4 + conversion tracking installed.** `app/layout.tsx` loads GA4 when `NEXT_PUBLIC_GA_ID` is set (no-op until then). `lib/analytics.ts` + `components/AnalyticsEvents.tsx` capture `call_click`, `email_click`, `booking_start`, `maps_click` via one delegated listener, and `enquiry_submit` from the form.
5. **Misleading galleries fixed.** Corporate events now shows **no gallery at all** plus an honest note explaining why and a "ask to see relevant work" CTA — every image there was a studio headshot with event alt text. Personal branding now leads with both real branding frames plus accurately-described environmental portraits. Actor page leads with all six real actor headshots before the model portfolios. Team page leads with its group/office frames.

### P1
6. **Top three money pages rebuilt.** New `costNotes`, `notIncluded`, `industryNotes`, `commonMistakes` and `objections` blocks on corporate, team and personal branding — cost breakdowns, what isn't included, industry-specific guidance, what goes wrong, and honest answers to "$395 seems like a lot", "why not AI headshots", "what if I hate them", "do you have insurance". Lighter objection blocks added to the other six services.
7. **`/corporate-headshot-pricing-sydney` built** — 2,525 words. Sydney market ranges (checked Aug 2026), your published prices, a team headcount table (5/10/20/30/50 with totals and time on site), what drives price, when a team day is cheaper than individual sessions, eight questions to ask any photographer, when cheap gets expensive, and 8 FAQs. Linked from the header, footer, every service page and the sitemap.
10. **`LocalBusiness` + `WebSite` schema now emitted sitewide** from the root layout. Every `provider: {"@id": ".../#business"}` reference now resolves on the page it appears on.
11. **`/contact` now carries `LocalBusiness`** (via the above).
12. **All 12 suburb pages differentiated** — unique hero photograph and unique six-image gallery each (a solved assignment: no two suburbs share more than two of six frames), plus new `gettingThere` and `onSiteNote` sections with genuine per-precinct detail (tower access vs street-level, loading docks, parking, what a mobile studio needs in that kind of building).
13. **Internal linking rebuilt.** Service pages now link contextually to their two relevant guides, three suburb pages, `/about` and the pricing guide. Suburb pages link to three services, the pricing guide and their neighbouring suburbs. Footer now lists all 12 suburbs (was 6) plus Pricing, FAQs and Terms.
14. **Header dropdown renders into the HTML** (CSS-hidden rather than conditionally rendered). Phone number added to the desktop header at `xl`.
15. **Objection handling** added across all nine services as always-visible prose, plus a new blog post on AI headshots.
16. **Portfolio and Pricing added to the header nav.**
17. **CTAs fixed for the wrong-buyer problem** — team, executive and event pages now say "Get a Team Quote" / "Request a Quote" and go to a prefilled enquiry form instead of a booking calendar.

### P2 / P3
18. **GST stated everywhere.** Since you're not registered, this is now framed as the advantage it is: "the price you're quoted is the price you're invoiced", with an explicit note that most Sydney studios quote ex-GST.
19. Blog posts linked from service pages (were 1 inbound link each).
20. "500+ sessions" vs "thousands of people" reconciled honestly on `/about` — *"thousands of people across more than 500 sessions"*.
21. Sitemap `lastModified` bumped to 2026-08-18. 22. Blog `changeFrequency` yearly → monthly. 26. **Image entries added to the sitemap** (hero + gallery per route).
25. **`ImageObject` extended to gallery images** via a new `ImageGallery` schema block — Licensable-badge eligibility now covers the galleries, not just heroes.
27. **`/faq` hub built** — every question on the site in one place, 4,680 words, full `FAQPage` schema.
28. **Inline enquiry form on every service page**, prefilled with that service, with the response-time promise.
29. **`/terms` built** — booking, cancellation, payment and invoicing, insurance, image usage and copyright, privacy and staff consent, delivery and reshoots, plus a business-details table.
30. `priceRange` now `$285-$2800` (computed). 31. `areaServed` now a `GeoCircle` + all 12 suburbs. Added `knowsAbout` and `hasOfferCatalog`.
32. `BlogPosting.publisher` now references the real business node (with logo). Added `isPartOf`, `wordCount`, `modifiedTime`, author `@id`.
33. **Page-level Twitter cards** on `/about` and every blog post (they were inheriting the homepage's).
34. **`og:image` added** to `/blog`, `/portfolio`, `/locations`, `/faq`, `/terms`, `/pricing`.
35. **`llms.txt` rewritten** — differentiators, insurance, GST position, turnaround, and 11 full Q&A pairs.
37. Root canonical removed from the layout (it was a latent trap that would silently canonicalise any future page to the homepage).
40. Security and cache headers added to `next.config.js`.
41. Testimonial rotation slowed 6s → 11s.

**Also done, not in the original list:** homepage now states a positioning claim ("one photographer, every frame") and shows pricing — it previously had neither; `lib/faqs.ts` extracted so the homepage, booking page and FAQ hub share one source; second new blog post, *How to Run a Team Headshot Day*.

---

## NOT DONE — needs you

| # | What | Why it's blocked |
|---|---|---|
| P0-3 | **Paste your GA4 measurement ID** into Vercel as `NEXT_PUBLIC_GA_ID` (`G-XXXXXXXXXX`), and verify the property in Google Search Console. | The code is in and inert until the ID exists. **Do this first** — everything after this should be prioritised from your own data. |
| P0-2 | **Switch on Skew Protection** in Vercel → Project → Settings → Advanced. | Dashboard setting; `deploymentId` is already wired to it in code. |
| P0-4 | **Decide what happens to `nickbrandphotography.art`** — 301 the whole domain to `.com`, or rebrand it off the photography entity. | DNS/hosting decision, and yours to make. It's still competing with you on your own brand. |
| P0-5 | **Three shoots:** your mobile studio set up in an office + a team day in progress; a real personal branding session; event coverage. | Can't be written. The events gallery is empty until then, by design. |
| P1-8 | **Case studies** — I've asked for the numbers on 3–4 real jobs. | I won't invent them. Send the details and I'll write and build them. |
| P1-9 | **Reviews 7 → 40+.** You said you have some in the pipeline. | Yours. Highest-leverage non-code item on the list. When the count changes, update `reviewCount` in `lib/testimonials.ts` — it drives the schema, the "Rated 5 stars" line and the "Read all N reviews" link together. |
| P2-20 | **Confirm "thousands of people across more than 500 sessions" is true.** | I reconciled the contradiction in the most plausible honest way. If the real numbers differ, tell me. |
| P2-23 | **Current Google review count** (hardcoded at 7, "as of May 2026"). | Needs the real number. |
| P2-29 | **Your ABN** → paste into `site.abn` in `lib/site.ts`. | The row on `/terms` stays hidden until it's set. |
| P3-42 | IPTC creator/copyright metadata embedded into the 132 image files. | Straightforward script, not written yet. Say the word. |
| P3-44 | **Verify the apex redirects:** run `curl -I https://nickbrandphotography.com/` and confirm a 301/308 to `www`. | Couldn't be tested from here. If it returns 200, that's a duplicate-host problem to fix in Vercel. |
| — | **Outreach:** get onto 3–5 "best Sydney headshot photographer" round-ups. Verified you're not on the Parramatta Actors Centre Top 12. | This is the only thing that gets you into "who are the best…" AI answers, and no on-site change can do it. |

### Correction to the audit
Item **38** (`/admin` should be noindexed) was already done — `app/admin/page.tsx` has carried `robots: { index: false, follow: false }` all along. My audit was wrong on that detail.

### Judgement calls worth knowing about
- **Corporate events has no gallery now.** Given the choice between fabricated evidence and an empty section, I chose the empty section plus an explanation. It will look sparse until you shoot events. That's the honest state of things.
- **The actor and branding pages say so out loud.** Both now contain a paragraph acknowledging the published portfolio is thin and inviting people to ask. That costs a little confidence and buys a lot of credibility — and it's true.
- **Suburb duplication is down but not solved** (52.6% → 43.7%). The remaining overlap is shared chrome — pricing cards, testimonials, CTA, and a footer that now carries more links. Consolidating to six pages would fix it properly; you chose to keep twelve, which is a defensible call now that each has its own imagery and ~600 words of unique local copy.

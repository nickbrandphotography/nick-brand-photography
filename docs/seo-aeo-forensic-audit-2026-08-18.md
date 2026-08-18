# NICK BRAND PHOTOGRAPHY — BRUTAL SEO + AEO FORENSIC AUDIT

**Site:** https://www.nickbrandphotography.com
**Codebase:** `C:\Projects\nick-brand-photography` (Next.js 16.2.6 / React 19.2.4 / Tailwind v4, deployed on Vercel)
**Audit date:** 18 August 2026
**Auditor stance:** hostile. Nothing below is padded to make you feel good.

---

## 0. METHOD, EVIDENCE BASE AND WHAT WAS *NOT* TESTED

Read this first, because it tells you which findings are facts and which are judgements.

### What was actually inspected (verified)

| # | What | How |
|---|---|---|
| 1 | Full application source — every page, template, component and data file | Read directly from `C:\Projects\nick-brand-photography` |
| 2 | The **compiled build output** in `.next/server/app/` (26 prerendered HTML files, build ID `TTrK-td0IkZMhYmcILOPj`, built 2026-08-18) | Parsed the actual server-rendered HTML — headings, `<img>` tags, `alt` attributes, `loading` attributes, canonical/OG/Twitter tags, and every JSON-LD block |
| 3 | Live `robots.txt`, `sitemap.xml`, `llms.txt` | Fetched |
| 4 | Live homepage, `/corporate-headshots-sydney`, `/team-headshots-sydney` | Fetched and compared against source |
| 5 | Live 404 behaviour | Fetched a non-existent URL — returns a genuine HTTP 404 ✅ |
| 6 | Internal link graph across all 26 prerendered pages | Programmatic extraction of every `href="/..."`, inbound/outbound counts |
| 7 | Near-duplicate analysis of the 12 suburb pages | Word 5-gram Jaccard similarity, pairwise |
| 8 | Image inventory — every silo, file count, byte size, largest files | Filesystem scan of `public/images/` |
| 9 | Competitor pages (Gavin Jowitt, Adrian Harrison, GrayNoise) | Fetched and structurally compared |
| 10 | Git state and deploy drift | `git log`, HEAD file comparison vs live |

### NOT TESTED — and why

| Item | Reason |
|---|---|
| **Core Web Vitals / real PageSpeed scores / CrUX field data** | No Lighthouse, PSI API or CrUX access in this environment. Performance findings below are derived from architecture (render mode, image weight, JS payload), not measured. **Do not treat the performance section as measured data.** |
| **Australian SERP positions** | The search tool available is **US-locale**. Nick's site did **not** appear in US results for `corporate headshots Sydney`, `personal branding photographer Sydney packages` or `actor headshots Sydney`, but it *did* appear for the branded query. That is suggestive, not conclusive. Get real data from Google Search Console. |
| **Google Search Console data** (impressions, positions, coverage, Core Web Vitals report) | No access. This is the single biggest blind spot in this audit. |
| **Google Business Profile internals** (categories, photos, posts, Q&A, review velocity, service areas) | No access. GBP is likely **more important than the whole website** for map-pack rankings. |
| **Backlink profile / referring domains / citations** | No backlink tool available. All backlink statements below are inference. |
| **Actual AI answer-engine output** (ChatGPT / Perplexity / AI Overviews / Copilot) | Cannot query them from here. Part 7 is a **simulation based on what is and is not extractable from the HTML**, not a record of real answers. |
| **HTTP status codes and redirect chains** (301/308 maps, non-www → www, http → https) | The fetch tool does not expose status codes or redirect headers. 404 was confirmed by an error response. **Non-www and trailing-slash behaviour is INCONCLUSIVE** — see §2.1. |
| **Rendered mobile viewport / touch behaviour** | No browser session was run. Mobile findings are code-derived. |
| **The 9 service pages' rendered HTML** | They are **not prerendered** (see §2.4), so they do not exist in the build output. Their markup was verified from the shared template plus two live fetches. |

---

# PART 1 — CURRENT STATE INVENTORY

36 URLs are in `sitemap.xml`. Two further routes exist and are `Disallow`ed (`/admin`, `/manage/[token]`).

**Word counts** for the 26 statically-built pages are measured from the compiled HTML (body text, scripts/styles stripped). Service-page counts are **estimated** (unique copy measured from `lib/services.ts`; total = unique + the ~520-word shared chrome measured on comparable pages).

## 1.1 Master page inventory

| URL | Status | Canonical | Indexable | Title | H1 | Words (total / unique) | Target intent | Schema present | CTA | Key weakness |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | 200 | self ✅ | Yes | Sydney Corporate Headshot & Personal Branding Photographer \| Nick Brand Photography | Corporate Headshot & Personal Branding Photographer in Sydney | ~900 (est.) | brand + generic "sydney photographer" | ProfessionalService+LocalBusiness, Person, WebSite, FAQPage, ImageObject | Book a Session / View Services | No pricing anywhere; no "who it's for"; 3 of 4 FAQ answers absent from HTML |
| `/corporate-headshots-sydney` | 200 | self ✅ | Yes | Corporate Headshots Sydney \| Nick Brand Photography | Corporate Headshots in Sydney | ~1,000 / **482** | corporate headshots sydney (commercial) | Service+Offer, FAQPage, BreadcrumbList, ImageObject | Check Availability / Ask a Question | **482 unique words vs a 4,500-word competitor.** 4 of 5 FAQ answers not in HTML. No org schema node on page. |
| `/linkedin-headshots-sydney` | 200 | self ✅ | Yes | LinkedIn Headshots Sydney \| Nick Brand Photography | LinkedIn Headshots in Sydney | ~980 / **455** | linkedin headshots sydney | same | same | Gallery is 8 corporate-headshot files relabelled "LinkedIn headshot" |
| `/executive-portraits-sydney` | 200 | self ✅ | Yes | Executive Portraits Sydney \| Nick Brand Photography | Executive Portraits in Sydney | ~950 / **424** | executive portraits sydney | same | same | Only 6 gallery images, all from the corporate silo; nothing that looks "executive/environmental" |
| `/team-headshots-sydney` | 200 | self ✅ | Yes | Team & Office Headshots Sydney \| Nick Brand Photography | Team & Office Headshots in Sydney | ~960 / **438** | team headshots sydney (highest value per lead) | same | same | Three group/office frames, but **no photograph of a mobile studio or an on-site headshot day in progress** — the logistics proposition is unevidenced |
| `/personal-branding-sydney` | 200 | self ✅ | Yes | Personal Branding Photographer Sydney \| Nick Brand Photography | Personal Branding Photographer in Sydney | ~970 / **445** | personal branding photographer sydney | same | same | **The silo contains 2 images.** The page shows 3, two of which are model-portfolio frames. Selling a $2,800 package on 3 photos. |
| `/actor-headshots-sydney` | 200 | self ✅ | Yes | Actor Headshots Sydney \| Nick Brand Photography | Actor Headshots & Model Portfolios in Sydney | ~940 / **421** | actor headshots sydney | same | same | 1 of 8 gallery images is an actual actor headshot; 7 are model portfolios |
| `/corporate-event-photographer-sydney` | 200 | self ✅ | Yes | Corporate Event Photographer Sydney \| Nick Brand Photography | Corporate Event Photographer in Sydney | ~900 / **388** | corporate event photographer sydney | Service (no offers), FAQPage, Breadcrumb, ImageObject | same | **All 5 gallery images and the hero are files from `corporate-headshots/`.** No conference, no stage, no crowd. Alt text asserts "Guests in formal dress at a Sydney corporate function" on a file named `corporate-headshot-sydney-39`. |
| `/family-photography-sydney` | 200 | self ✅ | Yes | Family Photographer Sydney \| Nick Brand Photography | Family Photography in Sydney | ~930 / **410** | family photographer sydney | same | same | Off-strategy: dilutes the corporate entity (see §14) |
| `/band-photographer-sydney` | 200 | self ✅ | Yes | Band & Musician Photographer Sydney \| Nick Brand Photography | Band & Musician Photography in Sydney | ~1,050 / **532** | band photographer sydney | same | same | Off-strategy; also the best-written page on the site, which tells you something |
| `/locations` | 200 | self ✅ | Yes | Photographer Service Areas Across Sydney \| Nick Brand Photography | Photography across Greater Sydney | **796** | navigational hub | ItemList, BreadcrumbList | Book a session | No OG image. Only real purpose is de-orphaning suburb pages. |
| `/locations/lane-cove` | 200 | self ✅ | Yes | Corporate Headshots & Personal Branding Lane Cove \| … | Headshots & Personal Branding in Lane Cove | **825** (~330 unique) | headshots lane cove | FAQPage, Breadcrumb, ImageObject, Person | Check Availability | See §1.2 — 52.6% average duplication |
| `/locations/sydney-cbd` | 200 | self ✅ | Yes | Corporate Headshots Sydney CBD \| … | Corporate Headshots in Sydney CBD | **826** (~320 unique) | corporate headshots sydney cbd | same | same | **No LocalBusiness / Service / Place schema on any suburb page** |
| `/locations/north-sydney` | 200 | self ✅ | Yes | Corporate Headshots North Sydney \| … | Corporate Headshots in North Sydney | **785** | corporate headshots north sydney | same | same | Identical hero photo, identical gallery, identical pricing, identical testimonials to the other 11 |
| `/locations/surry-hills` | 200 | self ✅ | Yes | Personal Branding & Headshots Surry Hills \| … | Headshots & Personal Branding in Surry Hills | **786** | headshots surry hills | same | same | as above |
| `/locations/parramatta` | 200 | self ✅ | Yes | Corporate Headshots Parramatta \| … | (suburb H1) | **760** | corporate headshots parramatta | same | same | as above |
| `/locations/chatswood` | 200 | self ✅ | Yes | (suburb title) | (suburb H1) | **752** | corporate headshots chatswood | same | same | as above |
| `/locations/barangaroo` | 200 | self ✅ | Yes | (suburb title) | (suburb H1) | **803** | corporate headshots barangaroo | same | same | **1 inbound internal link sitewide** |
| `/locations/pyrmont` | 200 | self ✅ | Yes | (suburb title) | (suburb H1) | **793** | corporate headshots pyrmont | same | same | 1 inbound internal link |
| `/locations/bondi-junction` | 200 | self ✅ | Yes | (suburb title) | (suburb H1) | **800** | corporate headshots bondi junction | same | same | 1 inbound internal link |
| `/locations/st-leonards` | 200 | self ✅ | Yes | (suburb title) | (suburb H1) | **805** | corporate headshots st leonards | same | same | 1 inbound internal link |
| `/locations/crows-nest` | 200 | self ✅ | Yes | (suburb title) | (suburb H1) | **785** | corporate headshots crows nest | same | same | 1 inbound internal link |
| `/locations/macquarie-park` | 200 | self ✅ | Yes | (suburb title) | (suburb H1) | **797** | corporate headshots macquarie park | same | same | 1 inbound internal link |
| `/locations/mosman` | 200 | self ✅ | Yes | (suburb title) | (suburb H1) | **778** | corporate headshots mosman | same | same | 1 inbound internal link |
| `/blog` | 200 | self ✅ | Yes | Photography Tips & Guides \| Nick Brand Photography | Photography advice for Sydney professionals | **376** | navigational | BreadcrumbList | Book | Thin. No OG image. No categories, no author box, 6 posts only. |
| `/blog/what-to-wear-for-corporate-headshots` | 200 | self ✅ | Yes | (post title) | What to Wear for Corporate Headshots | **999** | informational, high AEO value | BlogPosting, FAQPage, Breadcrumb, Organization, Person | Related service | **No page-level Twitter tags** (inherits homepage ones). 3 of 4 FAQ answers not in HTML. 1 inbound link. |
| `/blog/why-professional-headshots-increase-linkedin-engagement` | 200 | self ✅ | Yes | (post title) | (post title) | **900** | informational | same | same | Makes engagement claims with **no cited source** — an E-E-A-T and AI-trust liability |
| `/blog/best-backgrounds-for-executive-portraits` | 200 | self ✅ | Yes | (post title) | (post title) | **786** | informational | same | same | 1 inbound link |
| `/blog/corporate-photography-tips-for-law-firms` | 200 | self ✅ | Yes | (post title) | (post title) | **895** | industry/informational — good angle | same | same | Best commercial post on the site and it is orphaned |
| `/blog/personal-branding-photography-for-entrepreneurs` | 200 | self ✅ | Yes | (post title) | (post title) | **872** | informational | same | same | 1 inbound link |
| `/blog/sydney-locations-for-branding-photography` | 200 | self ✅ | Yes | (post title) | (post title) | **781** | local informational — strong angle | same | same | Doesn't link to a single suburb page |
| `/portfolio` | 200 | self ✅ | Yes | Portfolio \| Nick Brand Photography | Sydney photography by Nick Brand | **398** | navigational / trust | BreadcrumbList only | Book | **398 words.** No OG image. No per-image ImageObject. Not in the header nav. |
| `/about` | 200 | self ✅ | Yes | About Nick Brand — Sydney Photographer \| … | The photographer behind the lens | **921** | brand / E-E-A-T | Person, BreadcrumbList | Book / Get in Touch | Best E-E-A-T asset on the site. Has **no Organization/LocalBusiness node**, and `twitter:title` is the homepage's. |
| `/book` | 200 | self ✅ | Yes | Book a Photography Session in Sydney \| … | Reserve your Sydney photography session | ~700 (est., + client-side calendar) | transactional | FAQPage, BreadcrumbList | The booking flow | Booking calendar is the wrong first step for a corporate team enquiry |
| `/contact` | 200 | self ✅ | Yes | Contact Nick Brand Photography \| Sydney Photographer | Contact Nick Brand Photography | **430** | transactional / local | **BreadcrumbList only** | Call / Email / Book / Form | **No LocalBusiness schema on the one page that is entirely about the physical business.** |
| `/image-licensing` | 200 | self ✅ | Yes | (licensing title) | (licensing H1) | **365** | legal/utility | BreadcrumbList | — | Fine as-is. Correctly low priority (0.3). |
| `/admin` | 200 | — | `Disallow` | — | — | 306 | internal | — | — | Prerendered into the build and publicly reachable; blocked in robots only |

**Every page has exactly one `<h1>`.** Verified programmatically across all 26 built pages — zero H1 errors. That is genuinely correct and one of the few clean bills of health in this document.

**Every `<img>` has an `alt` attribute.** Verified: 0 missing across the built pages. Whether that alt text is *honest* is a different question — see §10.

## 1.2 What is MISSING (this matters more than what is present)

| Missing thing | Why it costs you money |
|---|---|
| **A `/pricing` page** | "How much do corporate headshots cost in Sydney" is one of the highest-intent queries in your market. Gavin Jowitt, Adrian Harrison, orlandosydney and sydney-headshots.com all have dedicated cost pages/articles ranking for it. You have prices scattered across nine service pages and **no page that owns the query**. |
| **A `/faq` hub** | No single URL an answer engine can cite for "everything about Nick Brand's process". |
| **A `/reviews` or social-proof page** | 5 testimonials, all ≤2 sentences, rotating in a client component. Nothing citable. |
| **Case studies** | Zero. Competitors have them. Yours would be the single strongest E-E-A-T and conversion asset you could build, and you can build them **without naming clients** (§5). |
| **Any photograph of an on-site team headshot day, a mobile studio setup, or a corporate event** | You sell three services on this premise and have no visual evidence of any of them. |
| **Analytics of any kind** | See §2.7. There is **no GA4, no GTM, no Plausible, no conversion tracking, no search-console verification tag** anywhere in the codebase. You are flying blind. |
| **An image sitemap / image entries in the XML sitemap** | 132 photographs, zero submitted to Google Images. On a photography site. |
| **`Organization` / `LocalBusiness` schema on any page except the homepage** | Every service page says `provider: {"@id": ".../#business"}` — pointing at a node that only exists on `/`. |
| **`Service` schema on suburb pages** | 12 local landing pages with no service or business entity markup at all. |
| **A canonical resolution for `nickbrandphotography.art`** | You are running two websites for the same business. See §4.1. |

---

# PART 2 — TECHNICAL SEO FORENSICS

## 2.1 Crawlability

**`robots.txt`** (live, verified):

```
User-Agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /manage/
Host: www.nickbrandphotography.com
Sitemap: https://www.nickbrandphotography.com/sitemap.xml
```

- Correct and safe. ✅
- `Host:` is a Yandex directive; **Google ignores it entirely**. Harmless, but it is not doing the canonical-host job you may think it is doing.
- **No AI-crawler rules.** You have `llms.txt` but no explicit `User-agent: GPTBot / ClaudeBot / PerplexityBot / Google-Extended` block. Default `Allow: /` means they can all crawl — which for a lead-gen business is what you want. Leave it. But it is an unstated decision, and if you ever add `Google-Extended: Disallow` you will remove yourself from AI Overviews. **Don't.**

**`sitemap.xml`** — valid, 36 URLs, generated from `app/sitemap.ts`. Problems:

1. **`lastModified` is frozen at `2026-06-25`** for all 30 non-blog URLs (`const CONTENT_UPDATED = new Date("2026-06-25")` in `app/sitemap.ts:19`). It is now 18 August. Every core page claims it hasn't changed in nearly two months. The intent behind the hardcoded date was honest — it stops fake churn — but it has since become a stale signal. Bump it when you ship content.
2. **All 6 blog posts are `changeFrequency: "yearly"`** (`app/sitemap.ts:68`). You are actively telling Google not to bother recrawling your informational content. For AEO, where freshness materially affects citation, this is self-sabotage.
3. **No `<image:image>` entries.** Missed on a photography site.
4. `priority` values are set. Google has publicly ignored `priority` for years. Harmless; not worth touching.

**Orphan / near-orphan pages** — measured across all 26 built pages:

| Page group | Inbound internal links |
|---|---|
| Home, 9 services, `/locations`, 6 footer suburbs, `/about`, `/blog`, `/book`, `/contact`, `/portfolio`, `/image-licensing` | **26** (i.e. every page — they are all in the sitewide footer) |
| **Barangaroo, Pyrmont, Bondi Junction, St Leonards, Crows Nest, Macquarie Park, Mosman** (7 suburbs) | **1** each — only from `/locations` |
| **All 6 blog posts** | **1** each — only from `/blog` |

`components/Footer.tsx:71` — `locations.slice(0, 6)` — means only the first six suburbs get footer links. The other seven, plus every blog post, sit at the very edge of the crawl graph on a single link.

**Broken links:** none found. Every internal `href` in the built HTML maps to a real route in `app-path-routes-manifest.json`. ✅

**Redirect chains / loops:** **NOT TESTED** — the available fetch tool does not surface status codes or `Location` headers.

**www / non-www:** **INCONCLUSIVE.** `https://nickbrandphotography.com/` returned page content rather than a reported cross-host redirect. That means either (a) the apex is 301-ing and the redirect was followed silently, or (b) the apex serves 200 with the content and only a canonical tag protects you. **(b) would be a duplicate-host problem.** Verify with `curl -I https://nickbrandphotography.com/` and confirm a `308`/`301` to `www`.

**Trailing slash:** `/corporate-headshots-sydney/` returned the page with the correct non-slash canonical. Next.js's default `trailingSlash: false` issues a 308. Behaviour looks correct; status not directly observed.

**HTTP → HTTPS:** not directly testable here; Vercel enforces this by default. Low risk.

**404s:** `https://www.nickbrandphotography.com/this-page-does-not-exist-seo-test` returned a genuine **HTTP 404**. ✅ No soft-404 problem.

## 2.2 Indexation

- **No `noindex` anywhere.** `app/layout.tsx:51` sets `robots: { index: true, follow: true }`, confirmed in built HTML as `<meta name="robots" content="index, follow"/>`. ✅
- **Canonicals: all self-referential and correct.** Every page sets its own `alternates.canonical`. Verified in source (12 call sites) and in built HTML. ✅
- **One latent trap:** `app/layout.tsx:28` sets `alternates: { canonical: site.url }` at the root. Today every page overrides it. The day someone adds a page and forgets, it will silently canonicalise to the homepage and vanish. Remove the root canonical or add a build-time assertion.
- **Duplicate content:** the 12 suburb pages. Measured **word 5-gram Jaccard similarity, all 66 pairs**:

  - **Average: 52.6%**
  - Worst: Bondi Junction ↔ Parramatta **58.4%**; Macquarie Park ↔ Parramatta **58.2%**; Chatswood ↔ North Sydney **57.9%**; Pyrmont ↔ Surry Hills **57.7%**; Barangaroo ↔ Sydney CBD **55.9%**

  Each page is ~790 rendered words, of which roughly **250–330 are genuinely unique** (intro, `localSignals`, `logistics`, 3 FAQs). Everything else — hero photograph, gallery, pricing block, testimonials, FAQ chrome, CTA, footer — is byte-identical across all twelve. `components/LocationPageTemplate.tsx:24` hardcodes `getImage("corporate-headshots", 9, …)` as the hero for **every** suburb, and line 25 uses the same shared `locationGallery` for **every** suburb.

  This is not yet "spam". It is squarely in the band where Google picks one page and ignores the rest.

- **JS-dependent content:** yes, and it is serious. See §2.5.

## 2.3 Architecture

URL structure is good: flat, keyword-appropriate, no dates, no IDs, no parameters. `/corporate-headshots-sydney` is exactly right. `/locations/<suburb>` is exactly right. ✅

Click depth from home: everything is ≤2 clicks *via the footer*. That is the problem — see §2.6.

**Can Google confidently understand who → what → where → who-for → why-authoritative?**

| Question | Answer |
|---|---|
| **Who is Nick Brand Photography?** | **Yes, on the homepage only.** `ProfessionalService` + `LocalBusiness` + `Person` + `WebSite` are all on `/` and nowhere else. |
| **What services?** | **Yes** — 9 `Service` nodes with `Offer` pricing. Genuinely well done. |
| **Where?** | **Partially.** Lane Cove address + geo coords on `/`; `areaServed` is a single `{"@type":"City","name":"Sydney"}`. The 12 suburb pages — the actual geographic evidence — carry **no place, service or business schema at all**. |
| **Who for?** | **Weakly.** `whoFor` lists are on-page prose only; nothing in structured data, no `audience`. |
| **Why authoritative?** | **No.** No named clients (a deliberate policy), no case studies, no awards, no memberships, no press, 7 reviews, and a `500+ sessions` stat that the About page contradicts with "thousands of people". |

**Verdict:** Google can identify the entity from the homepage and the services from the service pages. It cannot currently distinguish Nick from any other competent Sydney photographer, and it has almost no reason to believe he is authoritative.

## 2.4 🔴 P0 — Every commercial page is `force-dynamic`

**Evidence** (repo-wide grep, `app/**`):

```
app/page.tsx:40                                   export const dynamic = "force-dynamic";
app/corporate-headshots-sydney/page.tsx:20        export const dynamic = "force-dynamic";
app/linkedin-headshots-sydney/page.tsx:20         export const dynamic = "force-dynamic";
app/executive-portraits-sydney/page.tsx:20        export const dynamic = "force-dynamic";
app/team-headshots-sydney/page.tsx:20             export const dynamic = "force-dynamic";
app/personal-branding-sydney/page.tsx:20          export const dynamic = "force-dynamic";
app/actor-headshots-sydney/page.tsx:20            export const dynamic = "force-dynamic";
app/corporate-event-photographer-sydney/page.tsx:20  export const dynamic = "force-dynamic";
app/family-photography-sydney/page.tsx:20         export const dynamic = "force-dynamic";
app/band-photographer-sydney/page.tsx:18          export const dynamic = "force-dynamic";
```

Corroborated by `.next/prerender-manifest.json`: the homepage and all nine service pages are **absent** from the prerendered route list, while `/about`, `/contact`, `/blog/*`, `/locations/*` and `/portfolio` are present.

**What this means:** your ten most commercially important URLs are **not on the CDN**. Every single request — every human, every Googlebot fetch, every GPTBot fetch — invokes a serverless function that re-renders the React tree from scratch. There is no static HTML, no ISR, no edge cache.

**Why it happened:** the code comments are explicit and honest — it was a fix for a Vercel "version skew" bug where client-side navigation back to `/` served a stale RSC payload and reverted the hero photo. The diagnosis was right. **The cure is wildly disproportionate to the disease.** You traded permanent TTFB regression on 100% of your revenue pages to fix a transient hero-image flicker after deploys.

**The correct fixes, in order of preference:**
1. Enable Vercel **Skew Protection** (Project → Settings → Advanced), which is built precisely for this.
2. Or set `deploymentId` in `next.config.js` so client and server builds stay pinned together.
3. Or `export const revalidate = 3600` — pages become static and ISR-refresh hourly; a stale hero self-corrects within the hour instead of never.

Then delete all ten `force-dynamic` lines.

**Expected impact:** materially better TTFB and LCP on every money page, better crawl efficiency, lower function cost. Since Core Web Vitals were **NOT TESTED**, I will not quote a number — but "no CDN cache on the homepage" is not a defensible architecture for a lead-gen site.

## 2.5 🔴 P0 — FAQ answers are not in the HTML

This is the single most damaging finding in this audit.

`components/FAQ.tsx:44` —

```jsx
{isOpen ? (
  <p className="pb-6 pr-10 …">{f.a}</p>
) : null}
```

The answer paragraph is **conditionally rendered**. Only the currently-open item's answer exists in the DOM. Every other answer is not hidden by CSS — it is **not in the document at all** until React hydrates and a human clicks.

**Proof, from your own compiled build** (`/locations/sydney-cbd`):

| FAQ | In JSON-LD | In visible HTML |
|---|---|---|
| "Do you come to offices in the Sydney CBD?" — answer | ✅ | ✅ |
| "Can you photograph a large CBD team in one day?" — answer | ✅ | ❌ **absent** |
| "How much do corporate headshots cost for CBD businesses?" — answer | ✅ | ❌ **absent** |

All three *questions* are present. Only the first *answer* is.

Live confirmation on `/team-headshots-sydney`: all four questions render; **no answer text was retrievable from the page content**, including "How much do team headshots cost in Sydney?".

**Consequences, in order of severity:**

1. **AEO catastrophe.** GPTBot, ClaudeBot, PerplexityBot, Bingbot and Google's own passage-extraction largely work from rendered text. Your best answer passages — every "How much does X cost in Sydney?" answer on every service page, every suburb page and every blog post — are **invisible to them**. You have written excellent, extractable, directly-quotable AEO copy and then withheld ~80% of it from the machines you wrote it for.
2. **Content/markup mismatch.** Google's structured-data guidelines require FAQPage content to be *visible to the user on the page*. Content that only materialises after a client-side click on a JS-rendered accordion is at best borderline, at worst a rich-result eligibility risk.
3. **Real word-count loss.** Roughly 150–250 words per page of your densest, most useful copy never reaches the index.

**The fix is trivial and should be done today:** render every answer in the DOM always and toggle visibility with CSS/`hidden`, or use native `<details>`/`<summary>` (which is crawlable, accessible and needs no JS at all). Ten lines of code. This is the highest return-per-minute fix on the entire site.

**Note the irony:** `components/Testimonials.tsx:124` gets this exactly right — it renders every review into a `<ul className="sr-only">` with the comment *"Full review text, always in the DOM for search engines."* Someone on this project already understood the problem and solved it in one component and not the other. Apply the same thinking to `FAQ.tsx`.

## 2.6 The header hides every service link from crawlers

`components/Header.tsx:52` — `{servicesOpen && ( … )}`. The Services dropdown, containing all nine service links, is a client-state conditional. It **does not exist in the server-rendered HTML**. Same for the mobile menu (`{open ? … : null}`, line 112).

So the crawled header contains exactly four links: About, Blog, Contact, Book Now.

Every service link on the site therefore comes from the **footer**, sitewide, in an identical 27-link block on every page. Footer links are the weakest, most boilerplate-discounted internal links there are. Your nine money pages currently receive **no contextual, in-body, differentiated internal linking from anywhere**.

Note also: **Portfolio is not in the header nav at all**, and neither is Pricing (which doesn't exist). More on this in §12.

## 2.7 🟠 P1 — There is no analytics on this website

Repo-wide grep for `gtag|googletagmanager|google-analytics|plausible|umami|fathom|clarity|google-site-verification` across `app/`, `components/`, `lib/`: **zero matches.**

There is no GA4, no GTM, no privacy-friendly alternative, no Search Console verification meta tag (it may be DNS-verified — unknown), and **no conversion tracking on the booking flow, the contact form, or the phone/email links.**

You are about to spend months on SEO with no ability to answer: how many people visited, which page they landed on, which query brought them, where they dropped out of the booking flow, or how many enquiries the site produced. Every prioritisation decision after this audit will be a guess.

**Fix before anything else in Week 1.** GA4 + Search Console + events on: `Book` clicks, booking-flow completion, contact-form submit, `tel:` click, `mailto:` click.

## 2.8 Other technical notes

- `next.config.js` contains only `images.formats: ["image/avif","image/webp"]`. **No `redirects()`, no `headers()`**. No custom cache-control, no security headers (CSP, `X-Content-Type-Options`, `Referrer-Policy`). Not an SEO issue; worth a line of code.
- No `vercel.json`.
- **Deploy drift:** live `/llms.txt` is missing the band/musician and family services that `HEAD:public/llms.txt` contains (commit `8397be3`, dated 2026-08-18 16:35 +1000 — today). The live sitemap *does* include those routes, so this is most likely a pending deploy or a CDN-cached static asset. **Verify the latest deploy succeeded** and, if it did, purge/revalidate `llms.txt`.
- `.env.local.example` defines `NEXT_PUBLIC_GOOGLE_BUSINESS_URL`, but `lib/site.ts:69` hardcodes the Google URL instead. Harmless drift; pick one.
- `/admin` is prerendered into the build output and publicly reachable. It is `Disallow`ed, which stops crawling but not URL-level indexing if it is ever linked. Add `robots: { index: false }` to that page's metadata as belt-and-braces.

---

# PART 3 — SEARCH INTENT ANALYSIS

## 3.1 Intent coverage matrix

Legend: 🟢 owned and adequate · 🟡 targeted but under-built · 🔴 no page, or wrong page

| Search intent | Targeted? | Page | Right page? | Content sufficient? | Verdict |
|---|---|---|---|---|---|
| corporate headshots sydney | Yes | `/corporate-headshots-sydney` | ✅ | **No — 482 unique words vs 4,500** | 🟡 |
| corporate headshot photographer sydney | Partly | same | ✅ | H1 is "Corporate Headshots in Sydney", never "photographer" | 🟡 |
| corporate photographer sydney | No | — | — | — | 🔴 |
| business headshots sydney | No | — | — | The phrase appears nowhere | 🔴 |
| professional headshots sydney | No | — | — | Highest-volume generic term; no page owns it | 🔴 |
| headshot photographer sydney | No | — | — | No page uses this as its primary term | 🔴 |
| executive headshots sydney | Partly | `/executive-portraits-sydney` | Debatable | You chose "portraits"; searchers say "headshots" | 🟡 |
| linkedin headshots sydney | Yes | `/linkedin-headshots-sydney` | ✅ | Thin but on-intent | 🟡 |
| personal branding photographer sydney | Yes | `/personal-branding-sydney` | ✅ | **3 photographs.** Content is fine; evidence is absent | 🔴 |
| personal branding photography sydney | Yes | same | ✅ | same | 🔴 |
| actor headshots sydney | Yes | `/actor-headshots-sydney` | ✅ | 1 real actor headshot on display | 🟡 |
| actor photographer sydney | Partly | same | ✅ | Phrase not used | 🟡 |
| team headshots sydney / office headshots sydney | Yes | `/team-headshots-sydney` | ✅ | **No evidence photography of an on-site day** | 🟡 |
| **how much do corporate headshots cost sydney** | **No** | scattered FAQs | ❌ | **And the answers aren't in the HTML** | 🔴 |
| **headshot prices sydney / headshot pricing sydney** | **No** | — | — | No `/pricing` URL exists | 🔴 |
| what to wear for corporate headshots | Yes | blog post | ✅ | 999 words, decent | 🟢 |
| how long does a headshot session take | Partly | FAQ only | ❌ | Answer not in HTML | 🔴 |
| on-site / mobile headshot photographer sydney | Partly | team page | ✅ | Strong differentiator, under-exploited | 🟡 |
| corporate headshots <suburb> | Yes ×12 | `/locations/*` | ✅ | 52.6% duplicate | 🟡 |
| corporate event photographer sydney | Yes | that page | ✅ | **Zero event photographs** | 🔴 |
| annual report photographer sydney | No | — | — | Named in exec copy, no page | 🔴 |
| conference photographer sydney | No | — | — | High-value, adjacent | 🔴 |

## 3.2 Commercially valuable intents you have completely missed

These are not keyword-stuffing suggestions. Each is a distinct buying situation with a distinct answer.

1. **"How much do corporate headshots cost in Sydney"** — pure pre-purchase research. Competitors own it with dedicated pages. You have the prices; you have no page.
2. **"Headshot photographer near me" / precinct-level intent** — partially served by suburb pages, undermined by their duplication and their total absence of local schema.
3. **"Corporate headshots for law firms"** — you already wrote the blog post. It has one inbound link and no service page pointing to it. Industry-vertical intent (law, finance, tech, property, medical) is exactly where a solo photographer beats a generalist.
4. **"Rush / same-day / next-day headshots Sydney"** — you offer 48-hour express (+$80) and 24-hour actor rush. Both are buried in feature bullets. Urgency intent converts at a premium.
5. **"Headshot photographer that comes to your office Sydney"** — your mobile studio is your best commercial differentiator and it has no dedicated entry point.
6. **"AI headshots vs professional headshots"** — 2026's most-searched objection in this category. Competitors are publishing on it. You are silent, which means you are not in the conversation where the objection is being resolved.
7. **"Conference / awards night photographer Sydney"** — the event page exists but targets only the generic term.
8. **"Personal branding photography cost Sydney"** — your $895–$2,800 range is your highest-margin work and has no cost content.

---

# PART 4 — LOCAL SEO

## 4.1 🔴 P0 — You are running two websites for the same business

Searching `"Nick Brand Photography" Sydney` returns, alongside the `.com` site:

- `https://nickbrandphotography.art/about` — title *"Corporate Head shots, Sydney Photographer, Portrait Photographer, Family Portraits, Product Photography, Event Photography, Business Portraits, acting & Modelling, Bands & Singers."*
- `https://nickbrandphotography.art/photography-blog`
- `https://nickbrandphotography.art/corporate-headshots-1`

The `.art` site:
- Uses the **same business name and the same H1 entity** ("Nick Brand Photography – Portrait Photographer in Sydney")
- **Self-canonicalises** (`<link rel="canonical" href="https://nickbrandphotography.art/about">`) — it is not deferring to `.com` in any way
- Lists an overlapping and *wider* service set (corporate headshots, portraits, product, event, landscape, family, talent, pet, bodyscapes, sports)
- Carries **no phone, no email, no address** — so it is an NAP-less duplicate of your entity
- Only acknowledges `.com` in a copyright line in the footer

**Why this is a P0, not a curiosity:** Google is trying to resolve a single business entity called "Nick Brand Photography" in Sydney. You are presenting it with two authoritative-looking, self-canonicalising websites making overlapping claims, one of which has no NAP data. That splits link equity, splits brand signals, competes with you on your own brand query, and gives AI answer engines two conflicting sources for "what does Nick Brand Photography do".

**Options, best first:**
1. **301 the entire `.art` domain to the matching `.com` URLs.** Cleanest. All equity consolidates.
2. If `.art` must survive as a separate *art practice* (the About page mentions the bodyscape art practice and fashion label), then **rebrand it away from "Nick Brand Photography"**, strip all commercial photography-service pages from it, and add a prominent `rel="canonical"`-safe link to `.com` for photography services. It must stop claiming the same entity.
3. Worst acceptable: `noindex` the `.art` service pages.

Do not leave it as-is.

## 4.2 NAP consistency

| Signal | Value | Where | Consistent? |
|---|---|---|---|
| Name | Nick Brand Photography | site.ts, schema, footer, llms.txt | ✅ |
| Address | 84 Centennial Avenue, Lane Cove NSW 2066 | footer (`<address>`), `/contact`, PostalAddress schema, llms.txt | ✅ |
| Phone | 0403 835 467 / +61403835467 | footer, header (mobile only), CTA band, `/contact`, schema `telephone`, llms.txt | ✅ |
| Email | studio@nickbrandphotography.com | footer, `/contact`, schema, llms.txt | ✅ |
| Hours | 07:00–19:00 Mon–Sat | footer, `/contact`, `OpeningHoursSpecification` | ✅ |
| Geo | -33.8146, 151.1696 | `GeoCoordinates` on `/` | ✅ |

On-site NAP is genuinely consistent and well-implemented. **But** — `nickbrandphotography.art` publishes the same business name with **no NAP at all**, and there is a Nextdoor listing in the index. Off-site citation consistency is **NOT TESTED** (no citation tool available) and should be audited manually across: Google Business Profile, Bing Places, Apple Business Connect, True Local, Yellow Pages AU, Hotfrog, Localsearch, Facebook, Instagram bio, LinkedIn company page.

## 4.3 Google Business Profile

`lib/site.ts:69` contains `google: "https://share.google/N8cRsktKVu02sWjRY"`. It is wired into schema `sameAs`, `hasMap`, the footer link and the testimonial CTA. Good — that gap from earlier work is closed.

**NOT TESTED:** the profile itself. And this is the biggest single caveat in this audit — **for "corporate headshots Sydney", the map pack sits above the organic results, and GBP is what wins it.** No amount of on-site work substitutes for it.

Things to verify manually, in priority order:
1. Primary category — should be `Photographer`, with `Portrait studio` and `Commercial photographer` as secondaries.
2. Service area configured for Greater Sydney (you are a hybrid: storefront + service area).
3. Services list populated with your nine services and their prices.
4. Products/pricing populated.
5. **Review count: 7.** This is your weakest local signal by an order of magnitude. Competitors are running dozens to hundreds. See §5.
6. Photos: upload regularly, geotagged where honest, with your actual work.
7. Q&A: seed it with the same questions as your FAQ (this is a free, directly-cited AEO surface).
8. Google Posts: weekly.

## 4.4 Local schema — the biggest structural local gap

**Only `/` carries `LocalBusiness`.** The 12 suburb pages — the pages whose *entire job* is to establish geographic relevance — carry only `FAQPage`, `BreadcrumbList`, `ImageObject` and an incidental `Person` node (dragged in as the `ImageObject.creator`).

There is no `Service`, no `ProfessionalService`, no `Place`, no `areaServed`, no `GeoCircle`, no `containedInPlace` on any of them. Structurally, they are FAQ pages that happen to mention a suburb.

Additionally, on `/`: `areaServed: {"@type":"City","name":"Sydney"}` is the thinnest possible expression of a Greater Sydney service area.

## 4.5 Suburb page strategy — an honest assessment

You have 12. The brief says don't build hundreds of thin suburb pages, and you haven't — but 12 pages at 52.6% mutual similarity, with an identical hero photograph, identical gallery, identical pricing block and identical testimonials, is **already past the point where more pages help**.

**Recommendation: consolidate to 6, and make those 6 genuinely excellent.**

| Keep | Why |
|---|---|
| **Sydney CBD** | Highest commercial density; real search volume |
| **North Sydney** | Genuine second CBD; distinct business population |
| **Lane Cove** | You are physically there. This is the only page that can legitimately be a *storefront* page. |
| **Parramatta** | Genuine third CBD; Western Sydney head offices |
| **Chatswood** | Distinct North Shore commercial precinct |
| **Barangaroo** *or* fold into CBD | Only keep it if you have actually shot there and can say something CBD can't |

| Consider merging/removing | Why |
|---|---|
| Pyrmont, Surry Hills | Fold into a single "Inner Sydney / creative precincts" page — they share an audience and currently share 57.7% of their text |
| St Leonards, Crows Nest, Macquarie Park, Mosman | 1 inbound link each, high duplication, low distinct intent. Merge into North Sydney / Lower North Shore. |
| Bondi Junction | 58.4% similar to Parramatta, which tells you neither page says anything about its suburb |

For the six survivors, each needs: a **different hero photograph**, a **different gallery**, at least **400 words of genuinely local copy**, a suburb-specific `Service` + `areaServed` schema block, a named local landmark or precinct you have actually worked in, and — ideally — one real (anonymised) local job described.

## 4.6 Local authority signals

| Signal | Status |
|---|---|
| Local testimonials | 5 total, none identifying a suburb or an industry |
| Local work examples | The same 6 photographs on all 12 suburb pages |
| Local backlinks | **NOT TESTED.** Almost certainly minimal. |
| Local citations | **NOT TESTED** |
| Chamber of commerce / local business associations | No evidence |
| Local content | One blog post (`sydney-locations-for-branding-photography`) — which **links to zero suburb pages** |

Concrete, achievable local link targets: Lane Cove Chamber of Commerce; the Parramatta Actors Centre "Top 12 Sydney Headshot Photographers" listicle (**verified: you are not on it** — that is one email); NSW/Sydney creative industry directories; the coworking spaces and serviced offices in the precincts you list in `localSignals`; local business award programs.

---

# PART 5 — E-E-A-T / AUTHORITY

## 5.1 What you have

| Signal | Evidence | Strength |
|---|---|---|
| Real named person | Nick Brand, `Person` schema, portrait, bylines on posts, `rel="author"` link | 🟢 Strong |
| Genuine first-person story | `/about` — the childhood competition, self-taught, seven years in the Lane Cove studio, the fashion label and bodyscape practice | 🟢 **This is the single best asset on the website.** It is specific, unfakeable and unmistakably one human being. |
| Physical address | Real street address, geo coords, embedded map | 🟢 Strong |
| Contact | Phone, email, form, live booking calendar | 🟢 Strong |
| Insurance | $20M public liability | 🟢 Strong B2B signal — and it is buried in a 12-pixel stat tile with no explanation |
| Experience claim | 20+ years | 🟡 Asserted, unevidenced |
| Reviews | 5 shown, 7 total, all 5★ | 🔴 Weak |
| Portfolio depth | 132 images — but 49 corporate, **2 personal branding**, 6 actor | 🟡 Wildly uneven |

## 5.2 What makes this site look generic, anonymous or interchangeable

**1. Contradictory numbers.** `TrustStats` says **"500+ Sessions Delivered"**. `/about` says Nick has photographed **"thousands of people"**. Both are on the same page. A reader who notices trusts neither, and an AI extracting facts gets two incompatible answers to "how experienced is Nick Brand".

**2. The reviews are too short to be persuasive.** *"Great experience, professional work — thanks Nick."* — that is the entire testimonial from A Dzananovic. Four of the five are one or two generic sentences with no role, no company type, no problem, no outcome. They prove Nick is pleasant. They do not prove he solves a business problem.

**3. Seven reviews.** Your competitor set is running 25+ years / 10,000 headshots / dozens of reviews / 18 named enterprise logos. Seven five-star reviews reads as *new*, not *established* — which directly contradicts the 20+ years claim.

**4. Zero case studies.** Not one page describes: a client's situation, what you did, how long it took, and what changed. This is the most-cited content type in AI answers for services, and you have none.

**5. Nothing external corroborates the entity.** `sameAs` is Instagram + LinkedIn + Google. No professional body, no directory listings, no press, no award, no speaking, no guest article, no Wikidata. From Google's point of view Nick Brand exists on his own website, his own Instagram, and nowhere else that matters.

**6. Unsourced claims.** The LinkedIn post asserts that professional photos increase engagement, views and connection acceptance — with **no citation**. Competitors citing LinkedIn's own published data will out-rank and out-cite you on the identical claim, and AI engines strongly prefer sourced statements.

**7. The visual evidence contradicts the sales copy.** You sell on-site team headshot days, corporate events and personal branding, and you show corporate studio headshots for all three. See §10.

## 5.3 How to make this unmistakably Nick Brand — within your no-named-clients rule

Your constraint (no client names without permission) is a real constraint and I am not going to recommend breaking it. Everything below works without it.

1. **Anonymised case studies, 4–6 of them.** *"A 34-person Sydney CBD law firm, photographed in one day."* Structure: the brief → the constraint (billable hours, a partner who hated cameras, a 3m×3m meeting room) → what you did → the numbers (34 people, 6.5 hours, 10 min each, delivered day 5) → what changed. **No name required, and it is more persuasive than a logo wall** because it demonstrates competence rather than asserting it.
2. **Ask for permission on your best three.** A single "Photographed for a top-tier Sydney law firm" with permission is worth more than 20 anonymous ones. Ask.
3. **Behind-the-scenes photography of your own process.** A photograph of your mobile studio set up in a boardroom is a *proof asset*. You are a photographer with no photographs of yourself working. Fix this on your next shoot.
4. **Get reviews from 7 to 40+.** A one-line request in your delivery email, with the direct Google review link. This is the highest-leverage non-technical action available to you and it costs nothing.
5. **Longer testimonials.** When you ask, prompt: *"What were you worried about before the shoot, and what happened?"* That produces citable testimony instead of "thanks Nick".
6. **Resolve 500+ vs thousands.** Pick the true number. If it is thousands, say thousands — everywhere.
7. **Explain the $20M insurance.** For an HR manager procuring a supplier, "$20M public liability — certificate of currency supplied on request" is a procurement-clearing statement, not a stat tile.
8. **Add credentials, if they exist:** professional body membership, working-with-children check (relevant for family/school work), ABN displayed (GrayNoise displays theirs — it is a trust signal in Australia).

---

# PART 6 — AEO / GEO / AI SEARCH AUDIT

## 6.1 The headline

You have done more genuine AEO work than most photographers in Sydney — a `llms.txt`, question-shaped FAQs, explicit prices in prose, FAQPage schema, a clear entity definition — **and then you broke the delivery mechanism.**

Three faults, in order of severity:

1. **§2.5 — 80% of your FAQ answers are not in the HTML.** Everything below is downstream of this.
2. **§2.4 — your ten most important pages are `force-dynamic`**, so every AI crawler pays full server-render latency and some will time out or sample less.
3. **Your best AEO content is orphaned** — the 6 blog posts and 7 of 12 suburb pages have one inbound link each.

## 6.2 Question-by-question extraction test

For each, I checked whether a *directly quotable answer* exists **in the rendered HTML** (not just in JSON-LD).

| Question an AI will be asked | Answer exists on site? | Extractable from HTML? | Verdict |
|---|---|---|---|
| Who is the best corporate headshot photographer in Sydney? | No — nothing positions Nick comparatively | n/a | 🔴 You cannot be the answer to a superlative you never claim or evidence |
| Where can I get professional headshots in Sydney? | Yes — Lane Cove studio + on-site | ✅ (footer, contact, homepage prose) | 🟢 |
| How much do corporate headshots cost in Sydney? | Yes — $395 / $695 / $285 team | **Prices ✅ (pricing cards render server-side). The FAQ answer that states them in a quotable sentence ❌** | 🟡 The number is on the page; the sentence an AI wants to quote is not |
| What should I wear for a corporate headshot? | Yes — a 999-word blog post **and** a service-page FAQ | Blog post ✅. Service FAQ answer ❌ | 🟡 |
| How long does a headshot session take? | Yes — 45–90 min, 10–15 min/person | **❌ — it is FAQ answer #2 on the corporate page** | 🔴 |
| Where does Nick Brand Photography photograph clients? | Yes | ✅ — but **not from the FAQ** (it is homepage FAQ #2, which does not render). It is extractable because the Lane Cove address sits in the footer `<address>` on every page and on `/contact`. | 🟢 by accident, not by design |
| Does Nick photograph companies on location? | Yes | Partially — homepage FAQ #4 ❌, but on-site is stated in prose across several pages | 🟡 |
| What is the difference between corporate headshots and personal branding? | Yes — it is FAQ #6 on a blog post and implied on two service pages | ❌ not as a rendered, standalone passage | 🔴 **This is a prime AI-Overview question and you nearly own it** |
| How should actors prepare for headshots? | **No** | — | 🔴 No page covers actor preparation |
| What makes a good LinkedIn headshot? | Yes — outcomes block + a blog post | ✅ (outcomes render as normal prose) | 🟢 The strongest AEO surface you currently have |
| How much does a personal branding photographer cost in Sydney? | Yes — $895 / $1,695 / $2,800 | Prices ✅, quotable sentence ❌ | 🟡 |
| Does anyone in Sydney come to our office to do headshots? | Yes | ✅ prose | 🟢 |
| What's the difference between AI headshots and a real photographer? | **No** | — | 🔴 The defining 2026 objection; you are absent |
| How many photos do I get? | Yes — in pricing card feature bullets | ✅ | 🟢 |
| How fast is turnaround? | Yes — 5 business days, 48hr express | ✅ (outcomes block) | 🟢 |

## 6.3 Semantic and entity assessment

**Entity clarity: 6/10.** `/` defines the entity properly. Every other page references `{"@id": "https://www.nickbrandphotography.com/#business"}` as `provider` — but that node **is not defined on those pages**. Google will usually resolve it across the site; a standalone LLM crawler fetching a single service page gets a dangling pointer and no business identity. **Emit the `LocalBusiness` node in the root layout so it appears on every page.**

**Entity consistency: 5/10.** Undermined by (a) the 500+ vs thousands contradiction, (b) the `.art` domain publishing a different, wider service list under the same name, (c) `llms.txt` on the live site listing a different service set than the site itself.

**Topical authority: 4/10.** Nine services × ~450 unique words each, six blog posts, no cluster interlinking. You have breadth without depth. An AI ranking sources on "corporate headshots Sydney" sees a 4,500-word competitor page with 8 FAQs, a pricing table, case studies and 18 brand logos — versus your 482 words.

**Citation-worthiness: 3/10.** AI engines cite pages that contain a specific, sourced, quotable fact. Your most citable assets are your prices and your process — and both are either behind an accordion or expressed as UI rather than prose.

**First-hand experience: 7/10 on `/about`, 2/10 everywhere else.** The About page is genuinely first-hand. The service pages are competently written third-person marketing that any Sydney photographer could publish verbatim.

## 6.4 `llms.txt` review

Good that it exists — most competitors have nothing. It is well-structured: entity summary, key facts, prices, page list.

Problems:
- **The live version is stale** vs the repo (missing band/musician and family) — see §2.8.
- It states "5.0 Google rating" without the count. State **"5.0 from 7 Google reviews"** — precision builds trust; a bare 5.0 reads like marketing.
- It omits everything an AI actually needs to *recommend* you: turnaround times, on-site capability, insurance, what makes you different, which industries you serve.
- No FAQ block. Since your on-page FAQ answers are missing from the HTML anyway, **putting the full Q&A into `llms.txt` is a cheap, immediate patch** while you fix the accordion.
- `llms.txt` is not a standard any major engine has committed to honouring. Treat it as a bonus, **never as a substitute for fixing the HTML.**

---

# PART 7 — AI CITATION TEST (SIMULATED)

**Method note:** I could not query ChatGPT, Perplexity, Gemini, Copilot or AI Overviews from this environment. What follows is a rigorous simulation: for each query I assessed exactly what a retrieval system could extract from your rendered HTML and structured data, and what your verified competitors provide instead. Treat conclusions as high-confidence inference, not observed output.

### Query 1 — "Who should I hire for corporate headshots in Sydney?"

**Extractable from your site:** business name; Lane Cove studio + on-site across Sydney; corporate headshots from $395, Professional $695, team $285/person 5+; 5-day standard / 48-hour express; 20+ years; 5.0 rating (7 reviews); phone, email, booking URL.

**Missing:** any comparative claim; any client evidence; any specialisation statement; any volume/scale proof; any third-party corroboration.

**What competitors supply that you don't:** Gavin Jowitt — 25+ years, 10,000+ headshots, 18 named enterprise logos (AstraZeneca, ANZ, Telstra, Deloitte, Google, Westpac, Microsoft…), a 1–10 person pricing table, 8 FAQs, case studies, ~4,500 words. Adrian Harrison — 14 years, 20+ detailed testimonials, named brands, ~3,500 words. GrayNoise — since 2003, a case study, published ABN, terms and cancellation policy.

**Likely outcome:** you are not in the answer. An LLM ranking "who should I hire" needs a differentiator, and your site supplies none.

**To become citable:** one sentence, high on the page, that is *specifically true and specifically yours*. Not "20+ years experience". Something like: *"Nick Brand runs on-site headshot days for Sydney teams from a private Lane Cove studio — a single photographer shooting every frame himself, so a team of fifty matches to the pixel."* Then evidence it with a case study.

### Query 2 — "What are the best corporate headshot photographers in Sydney?"

This is a **list query**, and list queries are almost always assembled from **third-party listicles and directories**, not from photographers' own sites.

**Verified:** the Parramatta Actors Centre "Top 12 Headshot Photographers in Sydney" article lists Alex Vaughan, Johnny Diaz Nicolaidis, Kate Williams, Lauren O, Luke Stambouliah, Mansoor Noor, Marnya Rothe, Nick Prokop, Rose-May, Sally Flegg, Victoria Carwin, Kurt Sneddon. **Nick Brand is not on it.**

**Action:** getting into 3–5 third-party "best Sydney headshot photographer" round-ups will do more for this query class than any on-site change. This is outreach, not SEO. It is also cheap.

### Query 3 — "Where can I get professional headshots in Sydney?"

**Your best-performing query.** Address, service area, hours, booking URL, geo coords and `LocalBusiness` schema are all extractable. 🟢

**Weakness:** the schema exists on **one page**. Emit it sitewide and this becomes reliably extractable from any entry point.

### Query 4 — "How much should I expect to pay for corporate headshots in Sydney?"

Your prices are correct, current, specific and marked up as `Offer` with `priceCurrency: AUD`. That is genuinely better than most competitors' "from" pricing.

**But:** you have no page whose *topic* is the cost. Competitors have dedicated cost pages ranking for exactly this. Retrieval favours a page that is *about* the question.

**Highest-ROI new page on the site:** `/corporate-headshot-pricing-sydney` — a real cost guide covering market ranges, what drives price, individual vs team economics, what's included, what "cheap" costs you, and your own transparent table. Answer the question honestly including competitors' ranges, and you become the source that gets cited.

### Query 5 — "Who specialises in actor headshots in Sydney?"

**Extractable:** Actor Starter $450 (1hr, 2 looks, 10 images); Portfolio Build $750 (2hrs, 3–4 looks, 25 images); casting-standard sizing; 24-hour rush.

**Fatal weakness:** the actor silo contains **6 photographs**, and 7 of the 8 gallery images on that page are **model portfolios**, not actor headshots. Meanwhile Sydney has photographers whose entire practice is actor headshots and whose pages carry casting-director endorsements, agency relationships and 50+ examples.

**Verdict:** not citable for "specialises". You do not specialise; you offer it. Either invest in it properly or stop competing for the specialist term and target "actor headshots Sydney from $450" instead.

### Query 6 — "Who offers personal branding photography in Sydney?"

**Extractable:** three packages, $895/$1,695/$2,800, image counts, inclusions, half/full-day structure, HMUA on Premium. Genuinely good, specific data.

**Fatal weakness:** **the personal-branding image silo contains two files.** The page displays three images, two of which come from `model-portfolios/`. You are asking a founder to spend $2,800 based on three photographs, two of which are not personal branding work.

**Verdict:** an AI could name you and quote your prices. A human clicking through will not convert. **This is the widest gap on the entire site between what the copy claims and what the evidence shows.**

## 7.1 Cross-cutting: what all six queries need

1. Fix the FAQ HTML (§2.5).
2. Put `LocalBusiness` schema on every page.
3. Build a cost guide.
4. Build case studies.
5. Get on third-party lists.
6. Photograph the work you claim to do.

---

# PART 8 — CONTENT QUALITY AUDIT

## 8.1 The good — credit where it's due

This is **not** AI slop, and it is not the usual photographer's "capturing your story" mush. Someone thought about search intent and buyer psychology. Specifically strong:

- *"A corporate headshot is the first impression most clients, candidates and colleagues form of you."* — states the stakes before the service.
- *"Most people dislike being photographed. Clear, relaxed direction gets a natural, confident result in minutes — not an ordeal."* — names the real objection.
- *"An actor headshot has one job: get you in the room."* — the best line on the site.
- *"Mismatched staff photos make a website or proposal look disjointed; a coordinated headshot day fixes that in a single visit."* — problem → solution in one sentence.
- *"A rolling schedule means each person is away from their desk for around ten minutes. The business keeps running."* — speaks to the HR manager's actual worry.
- *"Musicians are used to performing, not modelling."* — specific and human.
- The `/about` page. Best asset on the site.

**Structurally**, every service page follows: intro → outcomes → process → gallery → who-it's-for → pricing → testimonials → FAQ → related → CTA. That is a sound commercial template.

## 8.2 The bad — phrases that could appear on 10,000 photography websites

| Current | Problem | Replace with |
|---|---|---|
| "Photography built around outcomes" (H2 on all 9 service pages) | Agency-speak. Says nothing. Identical on every page. | A service-specific outcome: *"What a $695 corporate session actually gets you"* |
| "Simple, from enquiry to delivery" (H2 on all 9) | Every service business claims simple | *"Booked Tuesday, shot Thursday, delivered the following week"* |
| "Is this service right for you?" (H2 on all 9) | Generic | *"Who books team headshot days"* |
| "The approach is simple: a relaxed session, honest direction, and images that actually look like you — just the best version." | "The best version of you" is the single most-used line in portrait photography | Say what you actually do differently |
| "Transparent pricing. Every session includes professional editing and a private online gallery." | Table stakes, framed as a benefit | State what is *not* included, and why — that reads as honesty |
| "Clean, confident corporate headshots" | Every corporate photographer's homepage | Quantify: consistency across N people, matched to the pixel |
| "Considered lighting and posture communicate seniority and composure" | Vague, unfalsifiable | Show two photographs and explain the difference |
| "Comfortable direction" | Adjective, not proof | *"If you've never been photographed properly, the first five minutes are the awkward ones. I plan for them."* |

## 8.3 The structural content failures

**1. Every service page is ~40% shorter than it needs to be.** 388–532 unique words against competitors at 2,500–4,500. You do not need 4,500 words of padding — you need the **missing sections**: cost breakdown, what's *not* included, common mistakes, industry-specific guidance, an anonymised case study, objection handling, comparison against alternatives (AI headshots, phone photos, DIY, a cheaper photographer).

**2. Every service page says the same things in the same order.** The templates make the site look consistent to a human and *repetitive* to a crawler. Two of nine pages could be swapped without a reader noticing.

**3. The copy never handles an objection.** Not one page addresses: "$695 seems like a lot", "can't we just use phone photos", "what about AI headshots", "what if I hate the results", "what if someone's sick on the day", "what if we need a reshoot", "do you have insurance and a COC". These are the actual reasons people don't book.

**4. Blog posts are informational-only.** All six teach; none sells. Each ends with a single "Related service" link. No pricing mention, no CTA in the body, no lead magnet, no internal links to suburbs or other posts.

**5. Nothing is dated or maintained.** All six posts show `updated: 2026-06-24`. Nothing has been published since April 2026. Your newest content is four months old on a site that is trying to establish topical authority.

**6. It communicates "Nick Brand Photography takes great photos", not "Why Nick Brand Photography".** The brief asked for exactly this and it is the honest answer. The one place the site nearly does it — "a single photographer shoots every frame, so a team of fifty matches" — is never stated as a differentiator. **That is your positioning and it isn't on the site.**

---

# PART 9 — COMPETITOR GAP ANALYSIS

**Verified by direct inspection** of three top-ranking Sydney corporate headshot pages.

## 9.1 Head-to-head

| Dimension | **Nick Brand** | **Gavin Jowitt** | **Adrian Harrison** | **GrayNoise (Dan Gray)** |
|---|---|---|---|---|
| Money-page word count | **~482 unique / ~1,000 total** | **~4,500** | **~3,500** | **~2,500–3,000** |
| Pricing on page | ✅ 3 tiers | ✅ **Table, 1→10 people, $360–$1,260 +GST** | ❌ (separate `/pricing`) | ✅ from $599+GST /3 people, +$105 pp |
| GST treatment | ❌ not stated | ✅ explicit | — | ✅ explicit |
| Named clients | ❌ (deliberate policy) | ✅ **18 logos** — AstraZeneca, ANZ, Telstra, Deloitte, Google, Westpac, Microsoft, CBA, Macquarie, Woolworths… | ✅ McDonald's, Dan Murphy's, Big W | 🟡 one (Bendigo & Adelaide Bank case study) |
| Case studies | ❌ **none** | ✅ multiple, linked | ✅ | ✅ |
| FAQs | 4–5, **answers not in HTML** | ✅ 8, in HTML | ✅ 12+, in HTML | ✅ dedicated FAQ page |
| Experience claim | 20+ years, 500+ sessions | **25+ years, 10,000+ headshots** | 14 years | Since 2003 |
| Testimonials | 5, short, generic | Named-organisation testimonials | **20+ detailed** | Google reviews linked |
| Structured pricing schema | ✅ **`Offer` with AUD** — better than all three | 🟡 | 🟡 | 🟡 |
| `llms.txt` | ✅ | ❌ | ❌ | ❌ |
| Render mode | ❌ **force-dynamic, no CDN cache** | static/cached | static/cached | static/cached |
| Analytics | ❌ **none** | assumed yes | assumed yes | assumed yes |
| Suburb pages | 12 (52.6% duplicate) | Service-area section on the money page | "Service Areas" section | — |
| Business legitimacy signals | Address, insurance | Address, coordinates, awards | Address | **ABN published**, T&Cs, cancellation policy |
| Objection handling | ❌ | ✅ | ✅ *"Do You Have Any of These Problems?"*, *"Painless Headshots, Even if You're Camera-Shy"* | ✅ *"What's a 'look'?"*, *"What to expect"* |

## 9.2 Specific things they do better

**Gavin Jowitt**
1. **A pricing table by headcount** — answers "what will this cost my team of 8" without an enquiry. Yours forces a per-person mental calculation.
2. **18 enterprise logos.** Instant, unarguable credibility.
3. **"Trusted by Sydney's leading organisations"** — a claim backed by evidence in the same viewport.
4. **~4,500 words** covering setup, photography, post-production, delivery *and payment* as named process stages.
5. **Case studies linked from the money page** — an internal linking pattern you have no equivalent of.
6. **A specific volume claim** — "over 10,000 headshots". Yours is "500+ sessions", which is smaller *and* contradicted by your own About page.

**Adrian Harrison**
1. **Opens with the buyer's pain** — "Do You Have Any of These Problems?" You open with your service.
2. **Explicitly handles camera-shyness in an H2.** You mention it in body copy on one page.
3. **20+ detailed testimonials** vs your 5 short ones.
4. **A dedicated "How Much Are Corporate Headshots Sydney?" page** — owns the cost query outright.
5. **Named service areas as a section on the money page**, not as 12 separate near-duplicate URLs.

**GrayNoise**
1. **Published ABN, T&Cs, cancellation policy.** Procurement-grade legitimacy for B2B buyers.
2. **"Your photographer"** section with a personal history — the same play as your About page, but *on the money page* where it converts.
3. **"What's a 'look'?"** — educating the buyer's vocabulary, which builds trust and creates extractable AEO content.
4. **Explicit +GST pricing.** B2B buyers need this. **Yours doesn't state GST at all** — which for a business buyer is a genuine quoting ambiguity, not a nitpick.

## 9.3 Gaps by priority

### 🔴 HIGH — will materially affect rankings and conversion
1. Service-page depth: 482 → 1,500+ genuinely useful words on the top 3 money pages
2. No case studies (competitors: all three)
3. No cost/pricing page (competitors: two dedicated pages ranking for it)
4. No objection handling anywhere
5. FAQ answers absent from HTML (competitors: all answers visible)
6. 7 reviews vs their volume
7. No proof for team/event/branding services — the images contradict the claims
8. No third-party listicle presence
9. No analytics — you cannot see any of this happening
10. `force-dynamic` on every money page

### 🟠 MEDIUM
11. GST not stated
12. No headcount pricing table
13. No ABN / T&Cs / cancellation policy
14. Suburb-page duplication
15. Blog posts orphaned; no service→blog links
16. Personal branding portfolio: 2 images
17. `LocalBusiness` schema homepage-only
18. Header hides all service links from crawlers
19. Portfolio and pricing missing from the header nav

### 🟢 LOW
20. `Host:` directive in robots.txt
21. sitemap `priority` values
22. No image sitemap (real, but modest, upside)
23. Missing security headers
24. `NEXT_PUBLIC_GOOGLE_BUSINESS_URL` drift

---

# PART 10 — IMAGE SEO

## 10.1 Inventory (measured)

| Silo | WebP | JPG | Size | Used by |
|---|---|---|---|---|
| `corporate-headshots/` | 49 | 49 | 17 MB | Home, 6 service pages, **all 12 suburb pages**, corporate events |
| `family/` | 18 | 18 | 12 MB | Family page |
| `singer-portraits/` | 17 | 17 | 9 MB | Band page |
| `model-portfolios/` | 20 | 20 | 10 MB | Actor page (7 of 8), personal branding (2 of 3) |
| `musician-portraits/` | 10 | 10 | 5 MB | Band page |
| `sports-portraits/` | 8 | 8 | 5 MB | **Nothing** — 8 unused images |
| `actor-headshots/` | 6 | 6 | 3 MB | Actor page (1 of 8) |
| `personal-branding/` | **2** | **2** | 1 MB | Personal branding page |
| `creative-portraits/` | 1 | 1 | 1 MB | **Nothing** |
| `about/`, `og/` | 2 | 2 | 2 MB | About, OG |
| **Total** | **132** | **132** | **58 MB** | |

## 10.2 What is done well ✅

- **Filenames are excellent.** `corporate-headshot-sydney-32.webp`, `personal-branding-photography-sydney-01.webp` — descriptive, keyword-appropriate, not stuffed.
- **Every image has an `alt` attribute.** Verified: 0 missing across all built pages.
- **Curated alt text is genuinely good.** *"Corporate headshot of a woman in a black blazer on a white background, Sydney"* — describes what is actually in the frame. Not keyword-stuffed. Textbook.
- **Intrinsic width/height on every image** via `lib/image-dimensions.ts` → no layout shift.
- **AVIF → WebP → JPG** via `next.config.js`.
- **Correct lazy loading:** heroes are `priority`, galleries are `loading="lazy"`. Verified in built HTML — 6 lazy, 1 eager on a location page.
- **`sizes` attributes are set** and reasonable.
- **`ImageObject` schema on hero images** with `creator`, `copyrightHolder`, `license` and `acquireLicensePage` pointing at `/image-licensing` — this makes you eligible for the Google Images **"Licensable"** badge. Genuinely sophisticated; almost no competitor does it.

## 10.3 🔴 What is wrong

**1. Alt text that describes photographs you don't appear to have.**

On `/corporate-event-photographer-sydney`, the curated gallery is:

```
{ silo: "corporate-headshots", i: 39, alt: "Guests in formal dress at a Sydney corporate function" }
{ silo: "corporate-headshots", i: 44, alt: "On-location photography coverage at a Sydney work site" }
{ silo: "corporate-headshots", i: 32, alt: "Portrait of a man in a red tie at a Sydney corporate event" }
```

Every file is from `corporate-headshots/`. The hero is `heroSilo: "corporate-headshots", heroIndex: 27`. There is no event photography silo. Either those specific corporate-silo files genuinely are event frames that were mis-filed — in which case **rename and re-file them** — or the alt text is describing something the image doesn't show, which is an accuracy problem for both Google Images and accessibility.

**Verify each of those five files by eye. This is a five-minute job with real consequences.**

**2. The same hero photograph on all 12 suburb pages.** `LocationPageTemplate.tsx:24` hardcodes `getImage("corporate-headshots", 9, …)`. Alt text varies by suburb (*"Corporate headshots in Chatswood by Nick Brand Photography"*), the file does not. Twelve pages, twelve different alt texts, one photograph. That is a duplicate-image signal and it makes the pages feel templated to a human too.

**3. The same six gallery photographs on all 12 suburb pages.** `locationGallery` is shared. 72 image slots, 6 unique files.

**4. Two personal-branding photographs.** For a service you sell at up to $2,800.

**5. `ImageObject` only on the hero.** Gallery images — the actual portfolio — carry no schema, so the "Licensable" badge you correctly engineered applies to about 30 images sitewide instead of 132.

**6. No image sitemap.** 132 photographs, none explicitly submitted.

**7. Nine unused images** (`sports-portraits/` ×8, `creative-portraits/` ×1) sitting in the deploy.

**8. Compression.** Largest files: `singer-portrait-sydney-11.jpg` 683 KB, `model-portfolio-sydney-08.jpg` 614 KB, `family-portrait-sydney-03.jpg` 594 KB. These are *source* files served through `next/image`, which resizes and re-encodes them, so real transfer weight is much lower. Not a live problem — but 58 MB in `public/` bloats every deploy, and `force-dynamic` means the optimiser is doing more work per request than it needs to.

## 10.4 Can Google understand what the photograph is?

| Question | Answer |
|---|---|
| What is it? | ✅ filename + descriptive alt |
| Who does it represent? | 🟡 generic ("a woman in a black blazer") — correct for privacy, weak for entity linking |
| Where was it taken? | 🟡 "Sydney" in alt; **no EXIF/IPTC geolocation, no per-image location metadata** |
| Why is it relevant to the page? | ✅ curated galleries are on-topic — **except** the event, actor and personal-branding pages, where they are not |

**Do not add EXIF GPS to studio portraits of private individuals.** Do add IPTC creator/copyright/credit fields to every file — it is the format Google explicitly reads for image rights, it costs one batch operation, and it reinforces the `ImageObject` markup you already have.

---

# PART 11 — SCHEMA / STRUCTURED DATA

## 11.1 What exists, page by page (verified in compiled HTML)

| Page | Types emitted |
|---|---|
| `/` | `ProfessionalService`+`LocalBusiness`, `Person`, `WebSite`, `FAQPage`, `ImageObject` |
| 9 service pages | `Service` (+`Offer`), `FAQPage`, `BreadcrumbList`, `ImageObject` |
| 12 suburb pages | `FAQPage`, `BreadcrumbList`, `ImageObject`, `Person` (incidental) |
| `/about` | `Person`, `BreadcrumbList` |
| `/blog/*` | `BlogPosting`, `FAQPage`, `BreadcrumbList`, `Organization` (inline), `Person` (inline) |
| `/blog` | `BreadcrumbList` |
| `/locations` | `ItemList`, `BreadcrumbList` |
| `/portfolio` | `BreadcrumbList` |
| **`/contact`** | **`BreadcrumbList` only** |
| `/book` | `FAQPage`, `BreadcrumbList` |
| `/image-licensing` | `BreadcrumbList` |

## 11.2 What is genuinely well done ✅

- `@id`-based entity graph (`#business`, `#nick`) with `founder` / `worksFor` back-references. Correct, and rare.
- `Offer` nodes generated from the *same source of truth* as the visible pricing cards (`lib/pricing.ts` → `getTiers()`), so markup and screen cannot drift. The code comment even documents the bug this fixed. **This is better than any competitor inspected.**
- `ImageObject` with `license` + `acquireLicensePage` — Licensable badge eligibility.
- `OpeningHoursSpecification`, `GeoCoordinates`, `PostalAddress` all correct.
- `JsonLd` component escapes `<` properly.

## 11.3 🔴 Errors, gaps and contradictions

**1. `LocalBusiness` exists on exactly one page.** Every service page's `provider: {"@id": ".../#business"}` and every `ImageObject`'s `copyrightHolder: {"@id": ".../#business"}` point at a node that is undefined on that page. Google usually reconciles this sitewide; a single-page LLM fetch cannot. **Move `localBusinessSchema()` + `webSiteSchema()` into `app/layout.tsx` so every page carries the entity.**

**2. `/contact` has no `LocalBusiness`.** The page that is entirely about the physical business — address, hours, map, directions — emits only a breadcrumb. This is the most obviously wrong single omission in the schema layer.

**3. Suburb pages have no `Service`, no `LocalBusiness`, no `Place`, no `areaServed`.** Twelve local landing pages with zero local structured data. Add per-suburb `Service` with `areaServed: {"@type":"Place","name":"<Suburb>, NSW"}` and an `@id` reference to the business.

**4. `AggregateRating` + `Review` on `LocalBusiness` will not produce rich results.** Google has excluded self-serving reviews — reviews about the entity, published by the entity — from rich-result eligibility since 2019. Your markup is **honest and accurate** (real Google reviews, real count), so leave it in for entity understanding and AI extraction. But **do not expect stars in the SERP from it, and do not spend time optimising it.** See "IGNORE" in Part 15.

**5. `reviewCount: 7` is a stale hardcode.** `lib/testimonials.ts:61`, commented "as of May 2026". It is August. If the real count has moved, your schema, the "Rated 5 stars" lead text and the "Read all 7 reviews on Google" CTA are all wrong simultaneously.

**6. `priceRange: "$$$"` is uselessly vague** when you publish exact prices. Use `"$285-$2800"`.

**7. `areaServed: {"@type":"City","name":"Sydney"}`** — replace with a `GeoCircle` around the studio, or an explicit array of the suburbs you actually serve.

**8. `BlogPosting.publisher` is a bare inline `Organization` with `name` + `url` — no `logo`.** Google's article guidance wants a publisher logo. You have `/images/og/logo.png`. Reference the `#business` node instead of inlining a stub.

**9. No `WebPage` node on any page.** Minor, but it is the standard hook for `speakable`, `primaryImageOfPage` and `lastReviewed` — all useful for AEO.

**10. No `Organization`-level `sameAs` beyond three URLs, and no `knowsAbout`.** `knowsAbout: ["corporate headshot photography", "personal branding photography", "executive portraiture", "on-location team photography"]` is cheap, honest and directly useful for entity/topic association.

**11. No `hasOfferCatalog` on the business.** Nine `Service` nodes exist in isolation; nothing tells Google the business offers all nine as a catalogue.

**12. FAQPage answers that are not visible on the page.** Restated here because it is a *schema policy* issue as well as a rendering bug: FAQ content must be visible to users. See §2.5.

## 11.4 Schema that should exist and doesn't

| Type | Where | Why |
|---|---|---|
| `LocalBusiness` / `ProfessionalService` | **Every page** (via root layout) | Entity resolution from any entry point |
| `LocalBusiness` | `/contact` | Most obvious omission on the site |
| `Service` + `areaServed: Place` | Each suburb page | The entire point of a suburb page |
| `ImageObject` | Every gallery image, not just heroes | Licensable badge across 132 images instead of ~30 |
| `hasOfferCatalog` | Business node | Ties the nine services together |
| `knowsAbout` | Business + Person | Topic association |
| `WebPage` + `primaryImageOfPage` | All pages | Standard hook |
| `Article`/`BlogPosting` publisher `logo` | Blog posts | Article eligibility |
| `VideoObject` | — | Only if you make video. Don't fake it. |

**Not recommended:** fake reviews, unsupported `AggregateRating`, `award` you haven't won, `Course`/`HowTo` markup on pages that aren't those things, or `Rating` markup on services you have no ratings for.

---

# PART 12 — CONVERSION RATE AUDIT

## Journey 1 — HR / Office Manager, needs headshots for 34 staff

| # | Question | Answer |
|---|---|---|
| 1 | Do I understand what this business does? | ✅ Yes, instantly. The H1 is unambiguous. |
| 2 | Is it right for me? | 🟡 Only if I find `/team-headshots-sydney`. **It is not in the header** — the Services dropdown doesn't render server-side and, on desktop, requires a hover. From the homepage the only routes are the services grid mid-page or the footer. |
| 3 | Do I trust it? | 🔴 **No.** Seven reviews. No client names, no logos, no case studies, no ABN, no T&Cs, no certificate of currency. I am about to spend ~$9,690 of company money with a supplier who has shown me no evidence of doing this before. |
| 4 | Can I see relevant examples? | 🔴 **No.** The team page has three group/office frames, which helps — but **not one photograph of a mobile studio set up in an office, or a rolling schedule in progress.** The logistics I am actually buying are not depicted. |
| 5 | Do I understand the process? | ✅ Yes — plan / set up / photograph / deliver, with space requirements and per-person timing. Genuinely good. |
| 6 | Do I understand pricing? | 🟡 $285/person for 5+. But **GST is not stated**, and I have to do the multiplication myself. Gavin Jowitt hands me a table. |
| 7 | Can I enquire easily? | 🟡 Both CTAs are "Check Availability" → a **booking calendar**. I don't want to book a slot; I need a date for 34 people, a quote and an invoice. The `team-quote` session exists but the button doesn't say so. |
| 8 | Compelling reason to choose Nick? | 🔴 **No.** Nothing tells me why him over three other quotes. |
| 9 | Unanswered objections | Insurance certificate? ABN? Invoice/PO terms? What if someone's away? Reshoot policy? Have you done a team this size? References? Privacy/consent for staff images? |
| 10 | What makes me leave? | The calendar CTA, or clicking to the gallery and seeing no team-day photographs. |

**Verdict: 4/10.** This is your highest-value customer and the journey has the most leaks.

## Journey 2 — Professional wanting a LinkedIn / personal branding shoot

| # | Question | Answer |
|---|---|---|
| 1 | What does this business do? | ✅ Clear |
| 2 | Right for me? | ✅ `/linkedin-headshots-sydney` is well-targeted |
| 3 | Trust? | 🟡 Reviews are warm but thin. About page helps a lot — **but it isn't linked from the service page**. |
| 4 | Relevant examples? | ✅ LinkedIn page: 8 varied studio headshots — good. 🔴 Personal branding page: **3 images, 2 of which are model portfolios.** |
| 5 | Process? | ✅ Clear |
| 6 | Pricing? | ✅ Clear and specific. Best-handled part of the site. |
| 7 | Enquire? | ✅ "Check Availability" is exactly right here — an individual *does* want to pick a time |
| 8 | Why Nick? | 🟡 "Relaxed, honest direction, looks like you" — pleasant, unprovable, universal |
| 9 | Objections | What if I hate them? Retouching policy? Do you do hair/makeup (only on the $2,800 tier)? How long until I get them? What do I wear (the blog post exists but the service page doesn't link to it)? |
| 10 | Leave because? | The personal-branding gallery. Three photos will not justify $895–$2,800. |

**Verdict: 6.5/10** for LinkedIn/corporate individual. **3/10** for personal branding, entirely because of the missing portfolio.

## Journey 3 — Actor needing headshots

| # | Question | Answer |
|---|---|---|
| 1 | What does this business do? | 🟡 The homepage is corporate-first. An actor may bounce before finding the actor page. |
| 2 | Right for me? | ✅ The actor page copy is strong — *"get you in the room"*, casting-standard framing, 24hr rush |
| 3 | Trust? | 🔴 **No casting director endorsement, no agency relationship, no actor testimonials.** In this market, that is the entire currency. |
| 4 | Relevant examples? | 🔴 **1 of 8 gallery images is an actual actor headshot.** The rest are fashion/commercial model portfolios — a beach shot, a red dress, sunglasses. A casting-aware actor will immediately see this is not an actor-headshot portfolio. |
| 5 | Process? | ✅ Clear |
| 6 | Pricing? | ✅ $450 / $750, specific and market-appropriate |
| 7 | Enquire? | ✅ Easy |
| 8 | Why Nick? | 🔴 No specialist signal at all |
| 9 | Objections | Do agents accept these? How many looks? Retouching — how much is too much? Do you know what Sydney casting wants? |
| 10 | Leave because? | The gallery, within about four seconds. |

**Verdict: 3.5/10.**

## 12.1 Conversion leaks — consolidated

| # | Leak | Where | Severity |
|---|---|---|---|
| 1 | **Portfolio is not in the header nav** | `lib/site.ts:82` — `mainNav` is About, Blog, Contact only | 🔴 On a photography site, "see the work" is the primary trust action. It is reachable only from the footer and one mid-homepage button — never from the header, and never from a service page. |
| 2 | **No pricing link in the header, and no pricing page** | — | 🔴 Price is the #1 pre-enquiry question |
| 3 | **All service links hidden behind a hover dropdown** that isn't in the HTML | `Header.tsx:52` | 🔴 |
| 4 | **"Check Availability" → calendar for team enquiries** | `ServicePageTemplate.tsx:66`, `CTASection` | 🔴 Wrong first step for the highest-value lead |
| 5 | **No photographic evidence for team, event or branding services** | galleries.ts | 🔴 |
| 6 | **No trust wall** — no logos, no case studies, no ABN, no T&Cs, no insurance explanation | sitewide | 🔴 |
| 7 | **7 reviews, all short and generic** | testimonials.ts | 🔴 |
| 8 | **GST not stated on any price** | pricing.ts | 🟠 B2B ambiguity |
| 9 | **No headcount pricing calculator or table** | team page | 🟠 |
| 10 | **Contact form only exists on `/contact`** | ContactForm.tsx | 🟠 Nine service pages, zero inline forms |
| 11 | **Phone number not visible in the desktop header** | Header.tsx — `tel:` link is in the mobile menu only | 🟠 |
| 12 | **No response-time promise on service pages** | — | 🟠 "usually within a business day" only appears on `/contact` |
| 13 | **Service pages never link to `/about`** | ServicePageTemplate | 🟠 Your best trust asset is disconnected from your money pages |
| 14 | **Service pages never link to the relevant blog post** | — | 🟠 "What to wear" answers a live objection on the corporate page |
| 15 | **Testimonials rotate on a 6s timer** | Testimonials.tsx:53 | 🟡 Moves the thing a visitor is reading |
| 16 | **FAQ answers require a click** *and* aren't in the HTML | FAQ.tsx:44 | 🟠 Costs conversions *and* rankings |
| 17 | **No exit/mid-page secondary CTA** other than the end-of-page band | — | 🟡 |
| 18 | **500+ vs "thousands" contradiction** | TrustStats vs `/about` | 🟠 |
| 19 | **No analytics — you cannot see any of these leaks** | — | 🔴 |

---

# PART 13 — PAGE-BY-PAGE SCORECARD

Scored 0–100. **60 means the page genuinely needs work.** These are not graded on a curve against other photographers — they are graded against what the page needs to be to win its query.

| Page | Tech | Intent | Content | Local | E-E-A-T | AEO | Links | Image | Schema | Convert | **Overall commercial value** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | 55 | 70 | 62 | 72 | 58 | 48 | 60 | 74 | **86** | 52 | **62** |
| `/corporate-headshots-sydney` | 52 | 82 | 58 | 62 | 45 | 44 | 48 | 72 | 74 | 55 | **60** |
| `/team-headshots-sydney` | 52 | 84 | 60 | 60 | 38 | 42 | 46 | **45** | 74 | 44 | **56** |
| `/linkedin-headshots-sydney` | 52 | 80 | 58 | 55 | 42 | 50 | 46 | 68 | 74 | 60 | **59** |
| `/executive-portraits-sydney` | 52 | 66 | 55 | 55 | 40 | 42 | 45 | 52 | 74 | 50 | **53** |
| `/personal-branding-sydney` | 52 | 80 | 58 | 55 | 38 | 44 | 46 | **20** | 74 | **32** | **48** |
| `/actor-headshots-sydney` | 52 | 74 | 60 | 50 | 30 | 42 | 44 | **25** | 74 | **35** | **47** |
| `/corporate-event-photographer-sydney` | 52 | 62 | 52 | 52 | 28 | 38 | 44 | **15** | 68 | 38 | **44** |
| `/family-photography-sydney` | 52 | 68 | 56 | 52 | 40 | 40 | 44 | 65 | 74 | 48 | **52** |
| `/band-photographer-sydney` | 52 | 66 | 66 | 52 | 40 | 44 | 44 | 68 | 74 | 48 | **54** |
| `/about` | 78 | 60 | **82** | 60 | **78** | 58 | 55 | 62 | 48 | 55 | **65** |
| `/portfolio` | 78 | 45 | **32** | 40 | 45 | 28 | 42 | 60 | 30 | 45 | **42** |
| `/contact` | 78 | 72 | 48 | 68 | 60 | 42 | 45 | 40 | **22** | 66 | **56** |
| `/book` | 62 | 78 | 50 | 45 | 50 | 46 | 45 | 40 | 50 | 68 | **56** |
| `/locations` | 78 | 55 | 50 | 62 | 40 | 40 | **72** | 40 | 52 | 42 | **52** |
| Suburb pages (avg of 12) | 78 | 66 | **42** | 58 | 35 | 38 | **28** | **25** | **32** | 44 | **44** |
| Blog posts (avg of 6) | 76 | 72 | 66 | 45 | 52 | 52 | **22** | 55 | 62 | 34 | **52** |
| `/blog` | 78 | 50 | 34 | 35 | 40 | 30 | 60 | 55 | 32 | 35 | **43** |
| `/image-licensing` | 80 | 60 | 55 | 30 | 55 | 40 | 45 | 30 | 32 | 25 | **48** (correctly low-stakes) |

### Score notes — why the numbers are what they are

- **Technical SEO caps at ~55 on the ten `force-dynamic` pages.** Canonicals, H1s, robots and metadata are all correct; the render architecture is not.
- **Schema scores high (74–86)** because the entity graph and `Offer` markup are genuinely better than every competitor inspected. `/contact` scores 22 because it has none.
- **AEO caps in the 40s almost everywhere** because of one bug: the FAQ answers. Fix §2.5 and every AEO score in this table moves up 12–18 points overnight.
- **Image SEO collapses to 15–25** on the four pages whose galleries do not depict the service being sold.
- **Internal linking scores 22–28** for blog posts and orphan suburbs — one inbound link each.
- **`/about` is the highest-scoring page on the site** and it is not linked from a single service page.

### Overall site scores

| Dimension | Score | One-line justification |
|---|---|---|
| **Technical SEO** | **58/100** | Canonicals, robots, sitemap, H1s, alt text and 404s are all correct — then all ten money pages bypass the CDN and the FAQ answers never reach the HTML |
| **On-page / content** | **54/100** | Well-written but ~40% of the required depth; templated; no objection handling; no case studies |
| **Local SEO** | **47/100** | Excellent on-site NAP; no local schema on local pages; 52.6% suburb duplication; 7 reviews; a competing duplicate domain |
| **E-E-A-T** | **44/100** | Real person, real address, real story — and no external corroboration, no case studies, contradictory stats |
| **AEO / AI search** | **41/100** | Strong intent, strong `Offer` schema, `llms.txt` — undermined by hiding 80% of the answers from crawlers |
| **Image SEO** | **62/100** | Best-in-class filenames, alt text, dimensions and licensing schema — applied to galleries that misrepresent four services |
| **Schema** | **68/100** | The single strongest area. Homepage-only `LocalBusiness` and an empty `/contact` are what hold it back |
| **Internal linking** | **38/100** | Footer boilerplate is not internal linking. 13 pages on one link. Zero contextual in-body links. |
| **Conversion** | **45/100** | No portfolio in nav, no pricing page, no trust wall, wrong CTA for the highest-value buyer, no analytics to see it |

---

# PART 14 — THE BRUTAL TRUTH

## What is fundamentally wrong

**You built a technically sophisticated SEO machine and then quietly disconnected three of its most important cables.**

The schema layer is better than every competitor I inspected. The `Offer` markup is generated from the same source of truth as the visible pricing, so it cannot drift. The image licensing markup makes you eligible for a badge almost nobody in your market has. You wrote an `llms.txt`. You wrote question-shaped FAQ copy with explicit prices in it — exactly what AI retrieval wants.

Then:
- The FAQ component **doesn't render the answers**, so 80% of your best AEO copy has never been crawled by anything.
- All ten commercial pages are `force-dynamic`, so none of them is on the CDN.
- The header dropdown means **not one service link exists in your server-rendered navigation**.
- There is **no analytics**, so none of this has been visible to you.

None of these are strategy problems. They are four bugs, and three of them are under twenty lines of code.

## What is holding the site back — ranked

1. **You have no proof.** Seven reviews, zero case studies, zero named clients, zero third-party mentions, and photo galleries that don't show the services you sell. Google and buyers are asking the same question — *why him?* — and the site has no answer.
2. **Your money pages are ~40% of the required depth.** 482 unique words against a verified 4,500-word competitor page. You will not out-rank that with better schema.
3. **The images contradict the copy on four pages.** Corporate events (5 headshots, no event), personal branding (2 images total), actor headshots (1 real actor headshot), team headshots (no team-day photography). You sell four things you can't show.
4. **You are running two websites for the same business.** `nickbrandphotography.art` self-canonicalises, lists overlapping services, has no NAP, and competes with you on your own brand.
5. **Your internal linking is a footer.** 13 pages sit on a single inbound link. No service page links to a blog post, a suburb page or your About page.
6. **You are spread across nine services as a solo photographer.** Corporate, LinkedIn, executive, team, branding, actor, event, family, band. Gavin Jowitt does corporate. That focus is why his page is 4,500 words and yours is 482.

## What you are wasting time on

- **Twelve suburb pages at 52.6% mutual similarity.** Six good ones would outperform twelve templated ones. The seven that receive a single inbound link are doing nothing at all.
- **The family and band pages** — from a pure corporate-lead-gen standpoint. (The band page is genuinely the best-written on the site, which is a separate and interesting problem.)
- **Polishing schema further.** You are already ahead. Stop.
- **`priority` values in the sitemap.** Google has ignored them for years.

## SEO work that is unlikely to matter here

- More `AggregateRating`/`Review` tuning — self-serving reviews have been rich-result-ineligible since 2019. Keep it honest, stop optimising it.
- Keyword density, LSI tooling, meta keywords. Your titles and descriptions are already good.
- More suburb pages. Categorically.
- Chasing "photographer Sydney" — too broad, dominated by aggregators, and it doesn't describe a buyer.
- Blog volume for its own sake. Six orphaned posts prove the point: the constraint is distribution and linking, not publishing.
- Security headers, `Host:` directive, unused image cleanup. Do them in five minutes and never think about them again.

## What you have completely missed

1. **Analytics.** You have run an SEO project for months with no measurement.
2. **A cost page.** Your competitors' highest-converting asset. You have the prices and no page.
3. **Case studies.** Buildable today, without naming a single client.
4. **Reviews.** 7 → 40 is one line in your delivery email.
5. **Third-party listicles.** Verified: you are not in the Parramatta Actors Centre "Top 12". Getting into 3–5 round-ups is how you appear in "best photographer" AI answers — your own site cannot do it.
6. **The AI-headshots objection.** The defining 2026 question in your category and you have not written a word about it.
7. **Photographs of your own process.** A photographer with no photographs of himself working.
8. **GST.** Not stated on a single B2B price.

## What Google probably misunderstands

- **What Nick Brand Photography actually is.** Two websites, nine services, and a suburb structure that repeats itself. Google's most likely read is "generalist Sydney photographer", not "Sydney corporate headshot specialist".
- **Whether the suburb pages are twelve pages or one page twelve times.** At 52.6% similarity with one shared hero image, it will pick one.
- **Whether you serve Sydney or Lane Cove.** `areaServed` is a single City node; your only geographic schema evidence is a Lane Cove postal address.
- **Whether you are established or new.** 20+ years vs 500+ sessions vs "thousands of people" vs 7 reviews.

## What an AI search engine fails to understand

- **Almost all of your FAQ answers**, because they aren't in the HTML.
- **Who the provider is on a service page**, because `#business` is undefined there.
- **Why it should recommend you over Gavin Jowitt**, because nothing on the site makes a comparative claim it can quote.
- **What a session actually costs**, in sentence form — the numbers are in UI cards, not in prose.

## Why someone visits and doesn't enquire

They land on `/corporate-headshots-sydney`. They can't find the portfolio (not in the nav). They scroll to the gallery — good headshots, but they've seen good headshots on four other sites this morning. They look for proof: seven reviews, two of them one sentence, no logos, no case studies. They read the pricing — $695, no GST stated. They click "Check Availability" expecting a quote form and get a calendar. They open a FAQ and it takes a click. They leave and email Gavin Jowitt, whose page opened with eighteen logos including their own bank.

**Nothing about this is a ranking problem. They found you. The site lost them.**

---

# PART 15 — PRIORITISED FIX LIST

| Priority | Problem | Evidence | Recommended fix | Expected impact | Difficulty | What changes |
|---|---|---|---|---|---|---|
| **P0** | FAQ answers absent from HTML | `FAQ.tsx:44` conditional render; built HTML shows 1 of 3 answers on `/locations/sydney-cbd`; live `/team-headshots-sydney` shows 0 of 4 | Always render answers; toggle with CSS or use `<details>` | **Very high** — recovers ~150–250 words of the best AEO copy on ~30 pages, and removes a schema-policy risk | Trivial (~10 lines) | `components/FAQ.tsx` |
| **P0** | All 10 money pages bypass the CDN | `force-dynamic` in 10 files; absent from `.next/prerender-manifest.json` | Enable Vercel Skew Protection (or set `deploymentId`, or `revalidate = 3600`), then delete all 10 lines | **High** — TTFB/LCP on every commercial page | Low | 10 page files + Vercel settings |
| **P0** | No analytics or conversion tracking | Zero matches repo-wide for any analytics library | GA4 + Search Console; events on Book click, booking complete, form submit, `tel:`, `mailto:` | **High** — everything after this becomes measurable | Low | `app/layout.tsx` |
| **P0** | Duplicate business site `nickbrandphotography.art` | Self-canonicalising, same entity name, overlapping services, no NAP | 301 the whole domain to `.com`, or rebrand it off the photography entity | **High** — brand consolidation, link equity, AI entity clarity | Medium (DNS/host) | External |
| **P0** | Four services have no supporting photography | Events: 5/5 gallery images from `corporate-headshots/`. Branding silo: **2 files**. Actor: 1/8 real. Team: no on-site day imagery | Shoot them. Until then, remove the misleading galleries and say "portfolio on request" | **High** — conversion and honesty | High (requires shoots) | `lib/galleries.ts` now; shoots later |
| **P1** | Service pages ~40% of required depth | 388–532 unique words vs verified 4,500 / 3,500 / 2,500 competitors | Rebuild top 3 to 1,500–2,000 useful words: cost breakdown, what's not included, objections, industry guidance, a case study | **High** | High | `lib/services.ts` + template |
| **P1** | No cost/pricing page | No `/pricing` URL; competitors own the query with dedicated pages | Build `/corporate-headshot-pricing-sydney` — honest market guide + your table | **High** | Medium | New route |
| **P1** | Zero case studies | None on any page; all 3 competitors have them | 4–6 anonymised case studies (§5.3) | **High** | Medium | New route + service-page links |
| **P1** | 7 Google reviews | `testimonials.ts:61` | Delivery-email request with direct review link; target 40+ | **High** — map pack + trust | Low | Process, not code |
| **P1** | `LocalBusiness` schema on homepage only | Built HTML confirms; `provider: {"@id":"#business"}` dangles on 21 pages | Emit `localBusinessSchema()` + `webSiteSchema()` from the root layout | **Medium-high** | Trivial | `app/layout.tsx` |
| **P1** | `/contact` has no `LocalBusiness` | Built HTML: `BreadcrumbList` only | Add it (solved by the above) | **Medium-high** | Trivial | — |
| **P1** | Suburb pages 52.6% duplicate | Measured 5-gram Jaccard, 66 pairs | Consolidate 12 → 6; unique hero + gallery + 400 words + `Service`/`areaServed` schema each | **Medium-high** | Medium | `lib/locations.ts`, `LocationPageTemplate.tsx` |
| **P1** | Internal linking is footer-only | 13 pages on 1 inbound link; no in-body contextual links | Implement Part 18 | **Medium-high** | Medium | Templates |
| **P1** | Service links absent from rendered nav | `Header.tsx:52` | Render the dropdown markup always; hide with CSS | **Medium** | Low | `Header.tsx` |
| **P1** | No objection handling anywhere | No page addresses price, AI headshots, reshoots, insurance, camera-shyness | Add an objections block to each money page; write the AI-vs-real article | **Medium-high** | Medium | Content |
| **P1** | Portfolio & pricing missing from header nav | `site.ts:82` — `mainNav` = About, Blog, Contact | Add Portfolio and Pricing | **Medium** — conversion | Trivial | `lib/site.ts` |
| **P1** | Wrong CTA for team buyers | `ServicePageTemplate.tsx:66` "Check Availability" → calendar | On team/event/exec pages: "Get a Team Quote" → quote form | **Medium-high** | Low | Template |
| **P2** | GST not stated | `lib/pricing.ts` — no GST anywhere | State inc/ex GST on every price | Medium (B2B) | Trivial | `pricing.ts` |
| **P2** | Blog posts orphaned | 1 inbound link each | Link every service page to its 2 relevant posts | Medium | Low | Template |
| **P2** | 500+ vs "thousands" contradiction | `TrustStats` vs `/about` | Pick the true number, use it everywhere | Medium (E-E-A-T) | Trivial | `site.ts` |
| **P2** | Sitemap `lastmod` frozen at 2026-06-25 | `sitemap.ts:19` | Bump on content change; add a build check | Medium | Trivial | `sitemap.ts` |
| **P2** | Blog `changefreq: yearly` | `sitemap.ts:68` | `monthly` | Low-medium | Trivial | `sitemap.ts` |
| **P2** | `reviewCount: 7` stale hardcode | `testimonials.ts:61`, "as of May 2026" | Update with real count; add a reminder | Medium | Trivial | `testimonials.ts` |
| **P2** | Event-page alt text may misdescribe images | `galleries.ts:73–77` — all from `corporate-headshots/` | Verify each file by eye; re-file or rewrite alt | Medium (accuracy) | Low | `galleries.ts` |
| **P2** | No ImageObject on gallery images | Only heroes carry it | Extend to gallery images | Medium (Google Images) | Low | `Gallery.tsx` |
| **P2** | No image sitemap | — | Add `<image:image>` entries | Medium | Low | `sitemap.ts` |
| **P2** | No `/faq` hub | — | Build one aggregating every FAQ | Medium (AEO) | Low | New route |
| **P2** | No inline contact form on service pages | `ContactForm` only on `/contact` | Add a short form to each money page | Medium | Low | Template |
| **P2** | No ABN / T&Cs / cancellation policy | Absent; GrayNoise publishes all three | Add them | Medium (B2B trust) | Low | New page |
| **P2** | `priceRange: "$$$"` | `schema.ts:32` | `"$285-$2800"` | Low-medium | Trivial | `schema.ts` |
| **P2** | `areaServed` = City Sydney only | `schema.ts:48` | `GeoCircle` or explicit suburb array | Low-medium | Low | `schema.ts` |
| **P2** | `BlogPosting.publisher` has no logo | `blog/[slug]/page.tsx:94` | Reference the `#business` node | Low-medium | Trivial | that file |
| **P2** | Blog posts have no page-level Twitter tags | Built HTML: `/about` shows the homepage `twitter:title` | Set `twitter` explicitly per page (Next doesn't deep-merge) | Low-medium | Low | metadata blocks |
| **P2** | `/blog`, `/portfolio`, `/locations` have no OG image | metadata blocks | Add `og:image` | Low-medium | Trivial | 3 files |
| **P2** | Live `llms.txt` stale vs HEAD | Live missing band/family | Verify deploy; purge CDN; add full FAQ Q&A to it | Medium (AEO stopgap) | Trivial | `public/llms.txt` |
| **P3** | `/portfolio` 398 words | Measured | Add per-category context + `ImageGallery` schema | Low-medium | Low | `portfolio/page.tsx` |
| **P3** | Root canonical is a latent trap | `layout.tsx:28` | Remove it | Low (prevents future disaster) | Trivial | `layout.tsx` |
| **P3** | `/admin` prerendered & publicly reachable | Build output | Add `robots: { index: false }` | Low | Trivial | `admin/page.tsx` |
| **P3** | 9 unused images shipped | `sports-portraits/` ×8, `creative-portraits/` ×1 | Use them or delete them | Low | Trivial | `public/images/` |
| **P3** | No security headers | `next.config.js` | Add a `headers()` block | Nil for SEO | Low | `next.config.js` |
| **P3** | Testimonials auto-rotate every 6s | `Testimonials.tsx:53` | Slow to 10s or make it manual | Low | Trivial | that file |
| **P3** | No IPTC metadata on images | — | Batch-embed creator/copyright/credit | Low-medium | Low | `scripts/` |
| **P3** | `NEXT_PUBLIC_GOOGLE_BUSINESS_URL` vs hardcoded value | `.env.local.example` vs `site.ts:69` | Pick one | Nil | Trivial | `site.ts` |
| **IGNORE** | `AggregateRating`/`Review` on `LocalBusiness` | Self-serving reviews rich-result-ineligible since 2019 | Keep it honest; **stop optimising it** | Nil | — | — |
| **IGNORE** | Sitemap `priority` values | Google ignores them | Leave | Nil | — | — |
| **IGNORE** | `Host:` in robots.txt | Yandex-only | Leave | Nil | — | — |
| **IGNORE** | More suburb pages | Existing 12 already 52.6% duplicate | **Do not build more** | Negative | — | — |
| **IGNORE** | Keyword density / LSI tooling | Titles and descriptions already good | Don't | Nil | — | — |
| **IGNORE** | Chasing "photographer sydney" | Too broad, aggregator-dominated, no buyer intent | Don't | Nil | — | — |
| **IGNORE** | Pushing the family & band pages | Off-strategy for corporate lead gen | Leave them; don't invest | Nil | — | — |

---

# PART 16 — 30-DAY IMPLEMENTATION PLAN

## WEEK 1 — Stop the bleeding (technical + measurement)

*Goal: make the site crawlable, fast and measurable. Almost all of this is code you can ship in a day.*

| Day | Task |
|---|---|
| 1 | **Fix `FAQ.tsx`** — render every answer, toggle with CSS/`<details>`. Ship. Verify in view-source. |
| 1 | **Add GA4 + Search Console.** Verify the property. Submit the sitemap. |
| 2 | **Enable Vercel Skew Protection**, then delete all 10 `force-dynamic` lines. Redeploy. Confirm the 10 routes now appear in the prerender manifest. |
| 2 | **Move `localBusinessSchema()` + `webSiteSchema()` into `app/layout.tsx`.** Validate 3 pages in Google's Rich Results Test. |
| 3 | **Render the header Services dropdown into HTML** (CSS-hide instead of conditional). Add Portfolio + Pricing to `mainNav`. |
| 3 | Conversion events: Book click, booking complete, contact submit, `tel:`, `mailto:`. |
| 4 | **Start the `nickbrandphotography.art` 301** (or the rebrand decision). This has a lead time — begin now. |
| 4 | Fix `sitemap.ts`: bump `CONTENT_UPDATED`, blog → `monthly`, add image entries. |
| 5 | Quick wins: `priceRange`, `areaServed`, `BlogPosting.publisher` logo, per-page Twitter tags, OG images on `/blog` `/portfolio` `/locations`, `robots: {index:false}` on `/admin`, remove the root canonical, update `reviewCount`, resolve 500+ vs thousands. |
| 5 | **Verify `nickbrandphotography.com` (apex) 301s to `www`** with `curl -I`. |
| 6–7 | **Audit the Google Business Profile properly.** Categories, service area, services + prices, photos, Q&A seeded from your FAQs, first weekly Post. Then: email every past client from the last 24 months asking for a review. |

**Week 1 exit check:** view-source any service page and confirm every FAQ answer is present; confirm the page is served from cache; confirm GA4 is recording; confirm GBP is complete.

## WEEK 2 — Core commercial pages

*Goal: make the three pages that make money actually competitive.*

| Day | Task |
|---|---|
| 8–9 | **Rebuild `/corporate-headshots-sydney`** to ~1,800 words. Add: full cost breakdown incl. GST, what's *not* included, "common mistakes", industry-specific guidance (law/finance/tech/property), objection block (why not phone photos / AI headshots / a cheaper photographer), a case study, and a "what to wear" link. |
| 10 | **Rebuild `/team-headshots-sydney`.** Add a headcount pricing table (5/10/20/30/50 people, inc. GST), space and power requirements, a sample run sheet, new-starter policy, insurance + COC statement, invoice/PO terms. Change the CTA to **"Get a Team Quote"**. |
| 11 | **Rebuild `/personal-branding-sydney`** — and **book the shoot** that will produce a real branding portfolio. Until it exists, be explicit: "further branding work available on request". |
| 12 | **Build `/corporate-headshot-pricing-sydney`** — the honest Sydney cost guide. Market ranges, what drives price, individual vs team economics, what cheap costs you, your table. Link from every service page and the header. |
| 13 | Add an inline enquiry form + response-time promise to every money page. |
| 14 | Add "About Nick" trust blocks to the three rebuilt pages, linking to `/about`. |

## WEEK 3 — Proof, entity and AEO

*Goal: give Google and AI engines a reason to pick you.*

| Day | Task |
|---|---|
| 15–17 | **Write 4 anonymised case studies.** A 34-person CBD law firm; a North Sydney tech company's new team page; a founder's personal branding day; an executive leadership refresh. Each: brief → constraint → what you did → numbers → outcome. Publish at `/case-studies/<slug>` and link from the matching service page. |
| 18 | **Build `/faq`** — every question on the site in one place, `FAQPage` schema, linked from the header footer and every service page. |
| 19 | **Write "AI headshots vs a professional photographer in Sydney"** — the defining 2026 objection. Honest, balanced, cites what AI does well. This is the most citable article you can write. |
| 20 | **Rewrite `llms.txt`**: add the full FAQ Q&A, turnaround times, on-site capability, insurance, differentiators, "5.0 from N Google reviews". |
| 21 | **Outreach day.** Email the Parramatta Actors Centre listicle, 3–5 other "best Sydney headshot photographer" round-ups, Lane Cove Chamber of Commerce, and the coworking/serviced-office operators in your `localSignals` precincts. |

## WEEK 4 — Local, linking and conversion

| Day | Task |
|---|---|
| 22–23 | **Consolidate suburbs 12 → 6.** 301 the retired ones to their merged parent. Give each survivor a unique hero, a unique gallery, 400+ words of real local copy, and `Service` + `areaServed: Place` schema. |
| 24 | **Implement the Part 18 internal-linking blueprint.** Every service → 2 blog posts, 2 suburbs, `/about`, `/pricing`, its case study. Every blog post → 2 services + 1 other post. Every suburb → its service + 2 neighbours. |
| 25 | Extend `ImageObject` to gallery images; embed IPTC creator/copyright metadata across all 132 files. |
| 26 | Add ABN, T&Cs, cancellation policy, insurance statement. Expand `/portfolio` with per-category context. |
| 27 | Rewrite the testimonial section: longer quotes, industry context, a link to all Google reviews. Slow the rotation. |
| 28 | **Shoot day:** photograph your own mobile studio set up in an office, and a team headshot day in progress. These are proof assets. |
| 29 | Objection blocks on the remaining service pages. |
| 30 | **Review GA4 + Search Console.** Baseline impressions, positions, and the first conversion data you have ever had. Re-prioritise from evidence, not from this document. |

---

# PART 17 — FINAL WEBSITE ARCHITECTURE

Every page below has a stated search intent, business purpose and unique value. Pages that fail all three are not included.

```
HOME  /
│   Intent: brand + "sydney corporate headshot photographer"
│   Purpose: entity definition, routing, immediate proof
│   Unique: the positioning claim + trust wall + pricing entry point
│
├── SERVICES
│   ├── /corporate-headshots-sydney            ★ PRIMARY MONEY PAGE
│   │     Intent: corporate headshots sydney (commercial)
│   │     Unique: full cost breakdown, industry guidance, objections, case study
│   │
│   ├── /team-headshots-sydney                 ★ HIGHEST VALUE PER LEAD
│   │     Intent: team/office/staff headshots sydney
│   │     Unique: headcount pricing table, run sheet, logistics, insurance, PO terms
│   │
│   ├── /personal-branding-sydney              ★ HIGHEST MARGIN
│   │     Intent: personal branding photographer sydney
│   │     Unique: the deliverable library explained + a REAL portfolio (must be shot)
│   │
│   ├── /linkedin-headshots-sydney
│   │     Intent: linkedin headshots sydney — distinct, high-volume, individual buyer
│   │
│   ├── /executive-portraits-sydney
│   │     Intent: executive portraits/headshots sydney — annual report, board, press
│   │     NOTE: retitle to lead with "Executive Headshots" — searchers use "headshots"
│   │
│   ├── /actor-headshots-sydney
│   │     KEEP ONLY IF you invest in a real actor portfolio. Otherwise fold into
│   │     /personal-branding-sydney as a section. Currently 1 real example.
│   │
│   ├── /corporate-event-photographer-sydney
│   │     KEEP ONLY IF you can show event work. Currently zero. Otherwise remove
│   │     and 301 to /team-headshots-sydney.
│   │
│   ├── /family-photography-sydney       (off-strategy — keep, don't invest)
│   └── /band-photographer-sydney        (off-strategy — keep, don't invest)
│
├── /corporate-headshot-pricing-sydney         ★ NEW — HIGHEST-ROI NEW PAGE
│       Intent: "how much do corporate headshots cost in sydney" — commercial research
│       Purpose: own the #1 pre-enquiry query; feed AI answers
│       Unique: honest market ranges (incl. competitors), what drives price,
│                team economics, GST, your transparent table
│
├── /case-studies                              ★ NEW — E-E-A-T ENGINE
│   ├── /case-studies/sydney-cbd-law-firm-34-headshots-in-one-day
│   ├── /case-studies/north-sydney-tech-team-page-refresh
│   ├── /case-studies/founder-personal-branding-day
│   └── /case-studies/executive-leadership-portrait-refresh
│       Intent: evaluative ("has he done this before?")
│       Unique: real constraints, real numbers, real outcomes — no client names needed
│
├── /faq                                       ★ NEW — AEO HUB
│       Intent: dozens of long-tail question queries
│       Unique: single citable URL answering every question about working with Nick
│
├── /locations                                 (hub — keep)
│   ├── /locations/sydney-cbd            ← merge Barangaroo, Pyrmont in
│   ├── /locations/north-sydney          ← merge St Leonards, Crows Nest in
│   ├── /locations/lane-cove             (the true storefront page)
│   ├── /locations/parramatta            ← merge Macquarie Park in
│   ├── /locations/chatswood             ← merge Mosman in
│   └── /locations/inner-sydney          ← merge Surry Hills + Bondi Junction
│       Each: unique hero, unique gallery, 400+ local words, Service+areaServed schema
│
├── /portfolio                                 (expand: per-category context, schema)
├── /about                                     (your strongest asset — link it from everywhere)
├── /book                                      (keep — but not the CTA for team enquiries)
├── /contact                                   (+ LocalBusiness schema)
├── /terms                                     ★ NEW — ABN, T&Cs, cancellation, insurance
├── /image-licensing                           (keep as-is)
│
└── /blog
    ├── what-to-wear-for-corporate-headshots               (link from corporate + linkedin)
    ├── why-professional-headshots-increase-linkedin-engagement  (ADD SOURCES)
    ├── best-backgrounds-for-executive-portraits           (link from executive)
    ├── corporate-photography-tips-for-law-firms           (link from corporate + team)
    ├── personal-branding-photography-for-entrepreneurs    (link from branding)
    ├── sydney-locations-for-branding-photography          (link from branding + suburbs)
    ├── ai-headshots-vs-professional-photographer-sydney   ★ NEW
    ├── how-to-run-a-team-headshot-day                     ★ NEW
    └── how-actors-should-prepare-for-headshots            ★ NEW (only if actor stays)
```

**Pages deliberately NOT recommended:** more suburbs; a page per industry (put industries *on* the service pages until one earns its own URL); "photographer near me" pages; a services index page (the footer and header already do that job); separate pages for each pricing tier.

---

# PART 18 — INTERNAL LINKING BLUEPRINT

**Current state:** a 27-link sitewide footer, and essentially nothing else. Thirteen pages have exactly one inbound link. Zero contextual in-body links between services, suburbs and blog posts.

**Principle:** the footer establishes *reachability*. Contextual in-body links establish *relationships*. You have the first and none of the second.

## 18.1 Money-page hub — `/corporate-headshots-sydney`

| Links out to | Anchor text | Where in the page |
|---|---|---|
| `/corporate-headshot-pricing-sydney` | "what corporate headshots cost in Sydney" | In the pricing section intro |
| `/blog/what-to-wear-for-corporate-headshots` | "what to wear for a corporate headshot" | In the wardrobe FAQ answer |
| `/blog/corporate-photography-tips-for-law-firms` | "corporate photography for law firms" | In the `whoFor` block |
| `/team-headshots-sydney` | "on-site team headshot days in Sydney" | In the intro, second paragraph |
| `/case-studies/sydney-cbd-law-firm-34-headshots-in-one-day` | "34 headshots in a single day for a Sydney CBD law firm" | In a new proof block |
| `/locations/sydney-cbd`, `/locations/north-sydney` | "corporate headshots in the Sydney CBD" / "in North Sydney" | New "Where we shoot" block |
| `/about` | "Nick has photographed [N] people over 20 years" | In the outcomes section |

## 18.2 Service ↔ service (replace the generic "Related services" grid with contextual links)

| From | To | Anchor |
|---|---|---|
| Corporate | LinkedIn | "a LinkedIn-optimised crop" |
| Corporate | Team | "photographing a whole team on-site" |
| Corporate | Executive | "executive headshots for annual reports and leadership pages" |
| LinkedIn | Personal branding | "a full personal branding library, not just a headshot" |
| Executive | Team | "matching the whole leadership team" |
| Team | Corporate events | "adding a headshot station to a conference" |
| Personal branding | LinkedIn | "if you only need one profile photo" |

## 18.3 Blog → commercial (currently one link per post)

| Post | Should link to | Anchor |
|---|---|---|
| What to wear | `/corporate-headshots-sydney`, `/corporate-headshot-pricing-sydney` | "book a corporate headshot session in Sydney" / "what a session costs" |
| LinkedIn engagement | `/linkedin-headshots-sydney`, `/personal-branding-sydney` | "LinkedIn headshots in Sydney" |
| Executive backgrounds | `/executive-portraits-sydney`, `/team-headshots-sydney` | "executive portraits in Sydney" |
| Law firms | `/team-headshots-sydney`, `/corporate-headshots-sydney`, `/locations/sydney-cbd` | "on-site headshot days for Sydney firms" |
| Entrepreneurs | `/personal-branding-sydney`, `/corporate-headshot-pricing-sydney` | "personal branding photography in Sydney" |
| Sydney locations | `/personal-branding-sydney` **and every surviving suburb page** | "branding shoots in the Sydney CBD" etc. |

## 18.4 Suburb pages

Each surviving suburb page should link to: its primary service (already does), **two neighbouring suburbs** ("also covering North Sydney and Chatswood"), `/corporate-headshot-pricing-sydney`, and one relevant case study. Currently they link out to `/corporate-headshots-sydney` and nothing else.

## 18.5 Structural changes

1. **Header:** render the Services dropdown into HTML. Add **Portfolio** and **Pricing** to `mainNav`.
2. **Footer:** link all surviving suburbs (drop `locations.slice(0, 6)` once you are at six).
3. **`/blog`:** group posts by category and cross-link to the matching service in each group header.
4. **`/about`:** link each `services.map()` card with the service's own language rather than a bare nav label.
5. **Every money page:** a "Recent work" block linking to case studies.

## 18.6 The topical map you are trying to make obvious

```
        Nick Brand Photography (entity, defined on EVERY page)
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
  CORPORATE          BRANDING           SPECIALIST
  HEADSHOTS          (individual)       (actor / event)
        │                 │
   ┌────┼────┐       ┌────┴────┐
   │    │    │       │         │
 Team  LinkedIn  Exec  Personal  LinkedIn
   │    │    │       branding
   └────┴────┴───────┬─┘
                     │
        ┌────────────┼────────────┐
        │            │            │
    PRICING     CASE STUDIES   GUIDES (blog)
        │            │            │
        └────────────┴────────────┘
                     │
              PLACES (6 suburbs)
```

Every arrow in that diagram should be a real, contextual, in-body link with descriptive anchor text. Today almost none of them are.

---

# PART 19 — CONTENT OPPORTUNITY MAP

## MONEY PAGES (directly generate enquiries)

### 1. `/corporate-headshot-pricing-sydney` — **build this first**
- **Intent:** commercial research — "how much do corporate headshots cost in Sydney"
- **Audience:** HR/office managers and individual professionals pre-enquiry
- **Primary topic:** the real cost of corporate headshots in Sydney in 2026
- **Supporting:** what drives price (time, retouching, on-site vs studio, image count, usage rights); individual vs team economics; GST; what "cheap" actually costs you; how to brief a photographer; your own table
- **Internal links:** all 9 services, team page, case studies, `/faq`, `/book`
- **CTA:** "Get a team quote" + "Book an individual session"
- **Why it ranks:** verified dedicated cost pages from Adrian Harrison, Gavin Jowitt, orlandosydney and sydney-headshots.com already rank for this. It is a proven query with proven page-type intent, and you have real published prices most competitors hedge.
- **Why AI cites it:** specific AUD figures, ranges, and honest comparison. AI engines strongly favour pages that answer a numeric question directly and cite ranges rather than one vendor's price.

### 2. Rebuilt `/corporate-headshots-sydney`, `/team-headshots-sydney`, `/personal-branding-sydney`
As specced in Part 16, Week 2.

## SUPPORTING PAGES

### 3. `/faq`
Every question in one place, `FAQPage` schema, linked sitewide. Purpose: a single citable URL. Why AI cites it: dense, structured, unambiguous Q&A — provided the answers are actually in the HTML.

### 4. `/case-studies` + 4 case studies
Intent: evaluative. Audience: buyers comparing suppliers. Why it ranks: near-zero competition on long-tail evaluative queries. Why AI cites it: concrete numbers ("34 people, 6.5 hours, delivered day 5") are exactly the kind of specific claim retrieval systems prefer over adjectives.

### 5. `/terms` — ABN, T&Cs, cancellation, insurance, image usage/consent
Won't rank. Will convert B2B buyers and is a legitimacy signal for both Google and procurement.

## AEO QUESTIONS (likely to surface in AI answers)

### 6. "AI headshots vs a professional photographer in Sydney: an honest comparison"
- **Intent:** informational/evaluative — the defining 2026 objection in your category
- **Why it ranks:** high and rising query volume, and most photographers write defensive fluff about it
- **Why AI cites it:** if you are genuinely balanced — acknowledging what AI headshots do well (cheap, fast, fine for a personal profile) and where they fail (team consistency, credibility, corporate use, likeness drift) — you become the fair source. Defensive content does not get cited; honest comparison does.
- **CTA:** book a real session; link to pricing

### 7. "How to run a team headshot day (a Sydney office guide)"
- **Intent:** informational, but read almost exclusively by people who are about to buy
- **Audience:** HR/office/EA
- **Supporting:** space and power requirements, scheduling maths, comms to staff, wardrobe email template, handling absentees, new starters
- **Why AI cites it:** procedural, specific, checklist-shaped — ideal for extraction
- **CTA:** get a team quote

### 8. "How long do professional headshots take, and how fast can you get them?"
Turnaround is a real differentiator (5 days standard, 48hr express, 24hr actor rush) and it currently exists only as a feature bullet.

## AUTHORITY CONTENT

### 9. "What Sydney casting directors actually want in an actor headshot in 2026"
**Only build this if you commit to actor work.** With real casting input it is genuinely citable; without it, skip it and remove the actor page.

### 10. "Why a team of fifty should be photographed by one photographer"
This is your positioning argument, written out. It explains the consistency claim, why matched lighting matters for a team page, and why sub-contracted multi-photographer operations struggle with it. It is the "why Nick" the site currently lacks.

## LOCAL CONTENT

### 11. Rebuilt suburb pages (6)
Each with genuinely local material: precinct, building types, parking/access for a mobile studio, which industries cluster there, and one anonymised local job.

### 12. "Where to photograph personal branding in Sydney" (expand the existing post)
It already exists and is good. It currently links to **zero suburb pages**. Add them, add specific locations with access notes and best light times, and it becomes a genuine local-authority asset.

---

# PART 20 — FINAL VERDICT

## CURRENT SEO SCORE: **56 / 100**
Correct fundamentals — canonicals, robots, sitemap, single H1s, alt text on every image, real 404s, clean URLs — combined with two self-inflicted architecture faults (no CDN cache on any money page, service links absent from rendered nav), content at ~40% of competitive depth, and internal linking that is a footer and nothing else.

## CURRENT AEO SCORE: **41 / 100**
The strategy is genuinely ahead of the market — question-shaped copy, explicit prices, `Offer` schema, `llms.txt`. The execution has a single bug that undoes most of it: **the FAQ component does not render its answers into the HTML.** Fix that one file and this score moves to roughly 55 before you write another word.

## CURRENT LOCAL SEO SCORE: **47 / 100**
On-site NAP is genuinely consistent and well-marked-up. Against that: no local schema on any local page, 52.6% duplication across twelve suburb pages that share one hero photograph, seven Google reviews, no local links, and a second website publishing the same business name with no NAP.

## CURRENT CONVERSION SCORE: **45 / 100**
Clear proposition, excellent transparent pricing, a real booking system. But the portfolio isn't in the navigation, there's no pricing page, there's no proof of any kind, the galleries don't depict four of the services, the highest-value buyer is sent to a calendar instead of a quote — and there is no analytics, so none of this has ever been visible.

## OVERALL WEBSITE SCORE: **48 / 100**

A well-built, well-intentioned site with genuinely sophisticated technical SEO — that is losing to competitors who do less, but do it visibly, and who show their work.

---

## If I could only fix 10 things

1. **Render FAQ answers into the HTML.** (`FAQ.tsx`, ~10 lines.) Recovers your best AEO copy across ~30 pages. Nothing else on this list is this cheap.
2. **Install GA4 + Search Console with conversion events.** You cannot manage what you cannot see, and you have been managing blind for months.
3. **Remove `force-dynamic` from all 10 money pages** (enable Skew Protection first). Put your revenue pages back on the CDN.
4. **Get Google reviews from 7 to 40+.** One line in your delivery email. Biggest local-SEO lever available, costs nothing, needs no code.
5. **Build four anonymised case studies.** The single strongest thing you can do for both E-E-A-T and conversion, and it respects your no-named-clients rule completely.
6. **Build `/corporate-headshot-pricing-sydney`.** Own the highest-intent query in your market, which competitors currently own uncontested.
7. **Resolve `nickbrandphotography.art`.** 301 it or rebrand it. Stop competing with yourself on your own brand.
8. **Rebuild `/corporate-headshots-sydney` and `/team-headshots-sydney` to ~1,800 useful words each** — cost breakdown, objections, industry guidance, case study.
9. **Photograph the services you sell.** A mobile studio in an office, a team day in progress, and a real personal branding shoot. Four of your service pages currently show work that isn't the work.
10. **Put `LocalBusiness` schema on every page, add Portfolio + Pricing to the header nav, and implement the contextual internal linking in Part 18.**

## The three changes most likely to produce the biggest commercial improvement

**1. Proof — reviews plus case studies.**
Your rankings are not the binding constraint; your credibility is. Seven reviews, no case studies, no client evidence and galleries that don't show the service is why a qualified visitor who *already found you* emails someone else. Going to 40+ reviews and publishing four case studies changes the map pack, the click-through rate, the conversion rate and the AI answer — simultaneously. It requires no ranking improvement whatsoever to pay off.

**2. Fix the FAQ rendering, then build the pricing page.**
Together these are your entire AEO position. Right now the most valuable sentences on your site — every "How much does X cost in Sydney?" answer — exist in JSON-LD and nowhere a language model will read them. Fix the component, then give the cost question a page of its own. That combination is what gets you into AI Overviews and ChatGPT answers for the query with the highest commercial intent in your market.

**3. Depth and focus on the top three money pages.**
482 unique words will not beat 4,500. But you do not need 4,500 words of filler — you need the sections that are missing: what it costs and why, what isn't included, what goes wrong, what happens with 34 people and one meeting room, and proof you've done it. Do it properly on corporate, team and personal branding, and stop investing in the other six.

## What you should absolutely NOT waste time on

- **More suburb pages.** You already have twelve at 52.6% mutual similarity. Adding more actively hurts.
- **Further schema refinement.** You are already better than every competitor inspected. Add `LocalBusiness` sitewide and `Service` on suburb pages, then stop.
- **Optimising `AggregateRating` / `Review` markup for stars in the SERP.** Self-serving reviews have been rich-result-ineligible since 2019. Keep it honest for entity understanding; expect nothing from it.
- **Sitemap `priority` values, the `Host:` directive, meta keywords, keyword density tooling.**
- **Chasing "photographer Sydney".** Too broad, aggregator-dominated, no buying intent.
- **Blogging for volume.** You have six good posts with one inbound link each. Publishing a seventh before you fix distribution repeats the mistake.
- **Pushing the family and band pages.** They are off-strategy for corporate lead gen. (Keep them — the band page is the best-written on the site — but don't invest in ranking them.)
- **Anything at all before analytics is installed.** Every prioritisation decision after Week 1 should come from your own data, not from this document.
---

# THE MASTER FIX FILE

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

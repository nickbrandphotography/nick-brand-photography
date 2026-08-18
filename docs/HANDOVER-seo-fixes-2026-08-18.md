# SEO/AEO fixes — handover

**Date:** 18 August 2026
**Files changed:** 52 (all written and byte-verified on your machine)
**Build status:** ✅ clean — `tsc --noEmit` passes, `next build` generates 46/46 pages

Full detail: `docs/seo-aeo-forensic-audit-2026-08-18.md` and
`docs/MASTER-FIX-FILE-2026-08-18.md`.

---

## ⚠️ Read this first — two sandbox problems

**1. Don't trust `git status` from a Cowork session on this repo.**
`git hash-object lib/services.ts` returns a hash identical to `HEAD`, while
`git diff --no-index` on the same file shows 1,363 changed lines. The Linux
mount is serving git stale data. The files on your disk are correct — verified
by content checks and byte-for-byte comparison after every write — but git's
view of them through the mount is not.

**Run `git status` and `git diff` in your own Windows terminal** before
committing. This is the same issue noted in June.

**2. The build can't run in the sandbox.** `npm run build` dies with a
`Bus error` there — the mount can't handle the memory-mapped file access Next
needs. Nothing to do with the code; the same build passes cleanly elsewhere.

**Run `npm run build` in your own terminal to confirm before deploying.**

A full backup of everything I touched is at
`.backup-pre-seo-2026-08-18/` (git-ignored). Delete it once you're happy.
The `_to_delete/` folder holds the transfer archives — delete that too.

---

## What changed

### The three P0 bugs

| | Before | After |
|---|---|---|
| **FAQ answers** | Only the open answer existed in the HTML — `/locations/sydney-cbd` had 1 of 3 | All 3 of 3. Rewritten as native `<details>`; no JS needed |
| **Money pages** | Homepage + 9 service pages were `force-dynamic`, off the CDN | All statically generated. Skew handled via `deploymentId` in `next.config.js` |
| **Analytics** | None at all | GA4 + delegated conversion tracking on calls, emails, booking clicks and form submits |

### Everything else

- **`LocalBusiness` schema now on every page** (was homepage-only), so the
  `#business` reference on service pages resolves. `/contact` finally has it.
- **Suburb pages differentiated** — 12 unique heroes, 12 unique galleries,
  per-suburb `Service` + `areaServed` schema, neighbour cross-links.
  Duplication measured **52.6% → 43.7%** (worst pair 58.4% → 49.0%).
- **Service pages rebuilt** — cost breakdowns, what's *not* included, objection
  handling, industry notes, contextual links. ~482 unique words → 2,400–2,700
  rendered words on the top three.
- **New pages:** `/corporate-headshot-pricing-sydney` (owns the "how much do
  corporate headshots cost in Sydney" query), `/faq` (4,680 words, one citable
  URL), `/terms` (ABN, cancellation, insurance — B2B trust).
- **New blog posts:** AI headshots vs a professional photographer; how to run a
  team headshot day.
- **Header** now renders all 9 service links into the HTML (was hidden behind a
  hover dropdown), plus Portfolio, Pricing and your phone number.
- **CTAs fixed** — team/executive/event pages now say "Get a Team Quote" and go
  to a prefilled enquiry form instead of a booking calendar.
- **Internal linking** — every service links to its relevant posts, suburbs,
  pricing and About. Blog posts and suburbs were on 1 inbound link each.
- **Galleries made honest** — the corporate events page showed five studio
  headshots with alt text describing "guests in formal dress at a Sydney
  corporate function". Those are gone.
- **Schema** — real `priceRange` from your actual tiers, `GeoCircle` +
  suburb `areaServed`, `knowsAbout`, `hasOfferCatalog`, `ImageGallery` on
  galleries, publisher logo on articles, per-page Twitter cards.
- **GST** — every price now states that you're not registered, so the published
  price is final. Business buyers otherwise assume ex-GST.
- **Sitemap** — `lastmod` bumped, blog `changefreq` yearly → monthly, image
  entries added, new routes included.
- **Security + cache headers**, `/admin` noindexed, root canonical trap removed.

### New: image pipeline

`scripts/ingest-images.mjs` + `scripts/README-images.md`. Drop originals in
`source-images/<Category>/`, run `npm run ingest`. It resizes, optimises,
SEO-names, embeds your copyright, and regenerates `lib/image-dimensions.ts`
(dimensions **and** silo counts) so nothing has to be hand-edited again.

The `personal-branding` silo only ever had 2 images because it was fed by
`source-images/Presenter/`, which has 2 files. That's now visible in code
rather than buried.

---

## What you need to do

### Before deploying

1. **`npm run build`** in your own terminal.
2. **`git status` / `git diff`** in your own terminal, then commit.
3. **Vercel → Settings → Advanced → enable Skew Protection.** This is what
   makes removing `force-dynamic` safe. Do it before or with the deploy.

### Straight after deploying

4. **Create a GA4 property**, then Vercel → Settings → Environment Variables →
   add `NEXT_PUBLIC_GA_ID` = `G-XXXXXXXXXX`. Nothing loads until it's set.
   Then mark `booking_complete` and `enquiry_submit` as key events in GA4.
5. **Google Search Console** — verify the property, submit the sitemap.
6. **Check the apex redirect:** `curl -I https://nickbrandphotography.com/`
   should return 301/308 to `www`. If it returns 200 you have a duplicate-host
   problem — tell me and I'll fix it.

### The images

7. Drop photos into `source-images/Events/`, `Team/`, `Branding/`, `Actor/`
   and run `npm run ingest`. Then tell me and I'll write the alt text — I'll
   look at each photo via the contact sheets the script generates.

   Several pages fix themselves the moment images land: the events gallery
   replaces its "no gallery yet" note, the team page leads with on-site frames,
   and the "there aren't many photos here yet" paragraphs on the branding and
   actor pages retire automatically once those silos hit 6 and 8 images.

   **For Team, the single most valuable shot is the least glamorous one:** your
   mobile studio set up in an ordinary meeting room. It's the thing an office
   manager can't picture and is actually buying.

### Still open

8. **Case studies** — I've not built these because I won't invent the details.
   Send me 3–4 real jobs (industry + area, headcount, the awkward constraint,
   hours on the day, turnaround, outcome) and I'll write them up anonymised.
   This is the strongest single E-E-A-T fix left.
9. **Reviews** — you said these are in the pipeline. Update `reviewCount` in
   `lib/testimonials.ts` as it moves; it drives the schema, the "Rated 5 stars"
   line and the "Read all N reviews" link together.
10. **`nickbrandphotography.art`** — still needs a decision. It's a live,
    self-canonicalising second site using your business name with no contact
    details on it. Either 301 the whole domain to `.com`, or rebrand it away
    from "Nick Brand Photography" and strip the photography service pages.
    A DNS/host change, not a code one.

---

## Two things I deliberately did not do

- **No invented case studies, client names, awards or memberships.** Your
  no-named-clients rule is intact.
- **`AggregateRating`/`Review` markup left as-is.** It's honest and it helps
  answer engines, but Google has treated self-serving reviews as ineligible for
  star rich results since 2019. Don't spend time on it and don't expect stars.

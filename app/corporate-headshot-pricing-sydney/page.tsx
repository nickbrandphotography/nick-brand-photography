import type { Metadata } from "next";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { pricingGroups, getTiers } from "@/lib/pricing";
import { Container, Eyebrow, SectionHeading } from "@/components/Section";
import Breadcrumbs from "@/components/Breadcrumbs";
import PricingCards from "@/components/PricingCards";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

/**
 * The Sydney headshot cost guide.
 *
 * "How much do corporate headshots cost in Sydney" is the highest commercial
 * intent query in this market, and before this page existed no URL on the site
 * owned it — the prices were scattered across nine service pages, and the FAQ
 * answers that stated them were not even being rendered into the HTML.
 * Competitors have had dedicated cost pages ranking for this for years.
 *
 * The market ranges below were checked against publicly published Sydney
 * pricing in August 2026. They are deliberately given as ranges rather than
 * attributed to named studios: competitors change their prices, and a guide
 * that quietly goes stale is worse than one that is honest about its scope.
 * Re-check them roughly every six months.
 */

const TITLE = "How Much Do Corporate Headshots Cost in Sydney? (2026 Guide)";
const DESCRIPTION =
  "What corporate headshots actually cost in Sydney in 2026: typical market ranges, what drives the price, team rates per person, and Nick Brand Photography's published prices from $395. No GST added.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: absoluteUrl("/corporate-headshot-pricing-sydney"),
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/corporate-headshot-pricing-sydney"),
    type: "article",
    images: [
      {
        url: "/images/og/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Corporate headshot pricing in Sydney — Nick Brand Photography",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/og/og-default.jpg"],
  },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Headshot Pricing", path: "/corporate-headshot-pricing-sydney" },
];

/** Typical Sydney market ranges, checked August 2026. */
const marketRanges = [
  {
    what: "Single corporate headshot, quick session",
    range: "$300 – $550",
    note: "Around 30–45 minutes, one look, a handful of edited images. The entry point for most established Sydney studios.",
  },
  {
    what: "Single headshot, longer session with more looks",
    range: "$550 – $950",
    note: "60–90 minutes, multiple outfits, studio and outdoor options, 10–20 edited images.",
  },
  {
    what: "Executive or environmental portrait",
    range: "$650 – $1,500+",
    note: "More considered lighting, often on location in a boardroom or office. Priced per person, not per head.",
  },
  {
    what: "Team headshots, on-site, per person",
    range: "$100 – $300 per person",
    note: "Usually falls with headcount. Watch for separate call-out, travel and mobile-studio setup fees, which can add several hundred dollars on top.",
  },
  {
    what: "Personal branding half or full day",
    range: "$800 – $3,500",
    note: "Priced on coverage — number of locations, looks and finished images — rather than strictly on hours.",
  },
];

/** What an on-site team day costs and roughly how long it takes. */
const teamTable = [
  { people: "5 people", rate: "$285", total: "$1,425", time: "≈ 1.5 hours on site" },
  { people: "10 people", rate: "$285", total: "$2,850", time: "≈ 2 hours on site" },
  { people: "20 people", rate: "$285", total: "$5,700", time: "≈ 3.5 hours on site" },
  { people: "30 people", rate: "$285", total: "$8,550", time: "≈ 5 hours on site" },
  { people: "50 people", rate: "$285", total: "$14,250", time: "≈ a full day" },
];

const priceDrivers = [
  {
    title: "Time with the photographer",
    text: "The single biggest factor. A 45-minute session and a 90-minute session are not the same product — the longer one buys more outfit changes, more setups and, more usefully, enough time for you to stop being self-conscious.",
  },
  {
    title: "How many finished images you get",
    text: "Editing is slow, skilled work. A package delivering five finished frames and one delivering twenty differ by hours of retouching, not by shutter clicks.",
  },
  {
    title: "Studio versus on-site",
    text: "On-site costs the photographer travel, setup and pack-down. Studios that charge separately for this can add $200–$500 to a quote, so check whether it is included before comparing headline rates.",
  },
  {
    title: "Headcount",
    text: "Per-person rates fall as numbers rise, because the fixed cost of setting up is spread further. This is why five people is usually the threshold where team pricing starts.",
  },
  {
    title: "Turnaround",
    text: "Standard delivery is typically 5–10 business days across Sydney. Express turnaround is a real cost — it means dropping other work — and is normally charged as a supplement rather than built into the base price.",
  },
  {
    title: "Usage rights",
    text: "For ordinary business use this should be included. If a quote restricts where you can publish the images, or charges again for advertising use, that is a genuine cost difference and worth asking about explicitly.",
  },
  {
    title: "GST",
    text: "Most Sydney studios advertise ex-GST prices, so a $600 quote is $660 on the invoice. Nick Brand Photography is not registered for GST, so the published price is the final price — which is worth factoring in when you compare.",
  },
];

const cheapCosts = [
  {
    title: "Inconsistency across a team",
    text: "The cheapest team quote is often the one where a different photographer or a different setup is used across two visits. The result is a team page where half the people are lit one way and half another — which reads as carelessness about detail, on the exact page you built to signal the opposite.",
  },
  {
    title: "Images you cannot use everywhere",
    text: "A headshot cropped only one way fails the moment you need a wide banner, a square social crop or a print-resolution file for a report. Ask what crops and resolutions you get before you compare prices.",
  },
  {
    title: "Retouching that has gone too far",
    text: "Aggressive skin smoothing dates quickly and, worse, means you do not look like your photograph when you walk into the room. It is the most common complaint about cheap high-volume headshot operations.",
  },
  {
    title: "The cost of doing it twice",
    text: "The genuinely expensive outcome is a set nobody wants to use. Redoing forty headshots costs forty times the saving you made the first time, plus the internal effort of organising it again.",
  },
];

const briefChecklist = [
  "How long is the session, and how many finished images do I get?",
  "Is travel to our office included, or charged separately?",
  "Is the price inclusive of GST, or will 10% be added?",
  "What is the standard turnaround, and what does express cost?",
  "What usage rights do we get — website, social, print, advertising?",
  "Can new starters be photographed later in a matching style?",
  "Do you carry public liability insurance, and can you supply a certificate of currency?",
  "Will the person quoting me be the person holding the camera on the day?",
];

const faqs = [
  {
    q: "How much do corporate headshots cost in Sydney?",
    a: "In 2026, a single professional corporate headshot in Sydney typically costs between $300 and $950 depending on session length and how many finished images are included, with executive portraits running from around $650 upwards. On-site team headshots usually fall between $100 and $300 per person. Nick Brand Photography charges $395 for an individual Essential session, $695 for the 90-minute Professional session, and $285 per person for teams of five or more, with no GST added.",
  },
  {
    q: "How much do team headshots cost per person in Sydney?",
    a: "Team rates in Sydney generally fall between $100 and $300 per person, decreasing as headcount rises. Nick Brand Photography charges a flat $285 per person for groups of five or more, which includes the on-site mobile studio setup, five edited images per person, travel within Greater Sydney and invoice billing. A team of 30 is $8,550 in total, and that is the invoiced figure — no GST is added.",
  },
  {
    q: "Why is there such a big price range for headshots in Sydney?",
    a: "The range reflects genuinely different products. A 30-minute session producing three edited images and a 90-minute session producing fifteen across multiple looks and locations are not the same thing, and neither is a studio headshot compared with an executive portrait shot on location. The other reason is that some quotes exclude travel, setup and GST while others include everything, which can make a 20–30% difference once the invoice arrives.",
  },
  {
    q: "Is GST included in Sydney headshot prices?",
    a: "Usually not. Most Sydney photography studios advertise ex-GST prices, so 10% is added at invoice — a $600 quote becomes $660. Nick Brand Photography is not registered for GST, so every published price is the final price and nothing is added. It is worth confirming this with any studio before comparing quotes.",
  },
  {
    q: "How much should a small business budget for staff headshots?",
    a: "For a team of ten at $285 per person, budget $2,850 for a complete on-site day including setup, travel and five edited images each. For a team under five, individual session rates apply — $395 each for the Essential session. Add a small contingency if you expect new starters within the year, since matching sessions are charged at the individual rate.",
  },
  {
    q: "Do photographers charge extra to come to your office in Sydney?",
    a: "Many do — call-out fees, travel charges and mobile studio setup fees are common and can add several hundred dollars to a quote. Nick Brand Photography includes travel within Greater Sydney and the mobile studio setup in the per-person team rate, so the quoted figure covers the whole visit.",
  },
  {
    q: "How much does personal branding photography cost in Sydney?",
    a: "Personal branding sessions in Sydney generally run from around $800 for a half day to $3,500 for a premium full day with styling. Nick Brand Photography charges $895 for the Brand Starter half day (20 finished images), $1,695 for the Brand Full Day (50 images across two or three locations) and $2,800 for Brand Premium, which includes hair and makeup and 75 or more images.",
  },
  {
    q: "Are cheap headshots worth it?",
    a: "Sometimes. If you need one clear profile photo and the photographer is competent, a lower-priced session is perfectly reasonable and this guide is not going to pretend otherwise. Where cheap becomes expensive is at team scale, where inconsistency between people is obvious, and where the images turn out to be unusable in the formats you actually need — because redoing thirty headshots costs far more than the original saving.",
  },
];

export default function PricingPage() {
  const corporateTiers = getTiers([
    "headshot-essential",
    "headshot-professional",
    "team-quote",
  ]);

  const offerSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/corporate-headshot-pricing-sydney"),
    about: {
      "@type": "Service",
      name: "Corporate headshot photography in Sydney",
      provider: { "@id": `${site.url}/#business` },
      areaServed: { "@type": "City", name: "Sydney" },
      offers: corporateTiers.map((t) => ({
        "@type": "Offer",
        name: t.name,
        price: t.priceValue,
        priceCurrency: "AUD",
        availability: "https://schema.org/InStock",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: t.priceValue,
          priceCurrency: "AUD",
          valueAddedTaxIncluded: false,
        },
      })),
    },
  };

  return (
    <>
      <JsonLd
        data={[offerSchema, faqSchema(faqs), breadcrumbSchema(crumbs)]}
      />

      <Breadcrumbs crumbs={crumbs} />

      {/* Hero + the direct answer, high on the page */}
      <section className="border-y border-border bg-ink-2">
        <Container className="py-16 lg:py-20">
          <div className="max-w-3xl">
            <Eyebrow>Pricing Guide</Eyebrow>
            <h1 className="font-display mt-6 text-[2.4rem] leading-[1.08] text-cream sm:text-5xl lg:text-[3.4rem]">
              How much do corporate headshots cost in Sydney?
            </h1>
            <p className="mt-7 text-[1.1rem] leading-relaxed text-cream/90">
              A single professional corporate headshot in Sydney typically costs
              between <strong className="text-gold">$300 and $950</strong> in
              2026, depending on session length and how many finished images you
              get. Executive portraits start around $650. On-site team headshots
              generally run{" "}
              <strong className="text-gold">$100 to $300 per person</strong>,
              falling as headcount rises.
            </p>
            <p className="mt-5 text-[1.02rem] leading-relaxed text-muted">
              Nick Brand Photography charges $395 for an individual Essential
              session, $695 for the 90-minute Professional session, and $285 per
              person for teams of five or more — including travel across Greater
              Sydney and the on-site mobile studio. No GST is added to any of it.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row" data-cta="pricing-hero">
              <Link
                href="/contact?service=team-headshots-sydney"
                className="inline-flex items-center justify-center bg-gold px-7 py-3.5 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold-soft"
              >
                Get a Team Quote
              </Link>
              <Link
                href={site.bookingUrl}
                className="inline-flex items-center justify-center border border-border-strong px-7 py-3.5 text-[0.78rem] uppercase tracking-[0.18em] text-cream transition-colors hover:border-gold hover:text-gold"
              >
                Book an Individual Session
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Market ranges */}
      <section className="section bg-ink">
        <Container>
          <SectionHeading
            eyebrow="The Market"
            title="What Sydney photographers actually charge"
            lead="Ranges below reflect publicly published Sydney pricing as at August 2026, across established studios and independent photographers. They are a guide for budgeting, not a quote."
          />
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border-strong">
                  <th className="py-4 pr-6 text-xs uppercase tracking-[0.16em] text-gold">
                    What you're buying
                  </th>
                  <th className="py-4 pr-6 text-xs uppercase tracking-[0.16em] text-gold">
                    Typical Sydney range
                  </th>
                  <th className="py-4 text-xs uppercase tracking-[0.16em] text-gold">
                    What that gets you
                  </th>
                </tr>
              </thead>
              <tbody>
                {marketRanges.map((r) => (
                  <tr key={r.what} className="border-b border-border align-top">
                    <td className="py-5 pr-6 text-[0.97rem] text-cream">
                      {r.what}
                    </td>
                    <td className="py-5 pr-6 font-display text-lg text-gold">
                      {r.range}
                    </td>
                    <td className="py-5 text-[0.92rem] leading-relaxed text-muted">
                      {r.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-xs text-faint">
            Most Sydney studios advertise these figures excluding GST. Add 10%
            when comparing against the prices on this site, which have no GST to
            add.
          </p>
        </Container>
      </section>

      {/* Nick's own pricing */}
      <PricingCards
        sessionIds={["headshot-essential", "headshot-professional", "team-quote"]}
        eyebrow="Nick Brand Photography"
        title="Published prices"
        lead="These are the actual prices, not a starting point that moves once you enquire."
      />

      {/* Team cost table */}
      <section className="section bg-ink">
        <Container>
          <SectionHeading
            eyebrow="Team Headshots"
            title="What a team headshot day costs"
            lead="At $285 per person for five or more, including the on-site mobile studio, travel across Greater Sydney, five edited images each and invoice billing."
          />
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border-strong">
                  <th className="py-4 pr-6 text-xs uppercase tracking-[0.16em] text-gold">
                    Team size
                  </th>
                  <th className="py-4 pr-6 text-xs uppercase tracking-[0.16em] text-gold">
                    Per person
                  </th>
                  <th className="py-4 pr-6 text-xs uppercase tracking-[0.16em] text-gold">
                    Total
                  </th>
                  <th className="py-4 text-xs uppercase tracking-[0.16em] text-gold">
                    Time on site
                  </th>
                </tr>
              </thead>
              <tbody>
                {teamTable.map((row) => (
                  <tr key={row.people} className="border-b border-border">
                    <td className="py-5 pr-6 text-[0.97rem] text-cream">
                      {row.people}
                    </td>
                    <td className="py-5 pr-6 text-[0.97rem] text-muted">
                      {row.rate}
                    </td>
                    <td className="py-5 pr-6 font-display text-lg text-gold">
                      {row.total}
                    </td>
                    <td className="py-5 text-[0.92rem] text-muted">
                      {row.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-3xl text-[0.92rem] leading-relaxed text-muted">
            Totals shown are the invoiced amounts — no GST, no call-out fee, no
            travel surcharge and no separate mobile studio hire. Setup adds about
            30 minutes before the first person. Teams under five are booked at
            individual session rates.
          </p>
          <div className="mt-8" data-cta="team-table">
            <Link
              href="/team-headshots-sydney"
              className="text-xs uppercase tracking-[0.16em] text-gold transition-colors hover:text-gold-soft"
            >
              How an on-site team headshot day works →
            </Link>
          </div>
        </Container>
      </section>

      {/* What drives the price */}
      <section className="section bg-ink-2">
        <Container>
          <SectionHeading
            eyebrow="What Drives It"
            title="Why one quote is $350 and another is $900"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {priceDrivers.map((d) => (
              <div key={d.title} className="border-l border-gold bg-surface p-7">
                <h3 className="font-display text-lg text-cream">{d.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
                  {d.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Individual vs team economics */}
      <section className="section bg-ink">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="The Maths"
                title="When a team day becomes the cheaper option"
              />
              <div className="mt-8 space-y-5 text-[1.02rem] leading-relaxed text-muted">
                <p>
                  Ten people booking individual $395 sessions costs $3,950 and
                  produces ten headshots that do not match each other. The same
                  ten people photographed on-site in one visit costs $2,850 and
                  produces a set that looks like it belongs to one company.
                </p>
                <p>
                  The saving on the invoice is $1,100. The larger saving is
                  usually invisible: ten people each losing an hour or more to
                  travel is more than a full working day of staff time, and at
                  professional-services charge-out rates that is worth
                  considerably more than the photography.
                </p>
                <p>
                  The threshold sits at five people. Below that, individual
                  sessions are normally the better choice — there is not enough
                  volume to justify a setup, and each person gets a longer,
                  more considered session.
                </p>
              </div>
            </div>
            <div>
              <SectionHeading
                eyebrow="Before You Compare"
                title="Eight questions worth asking any photographer"
              />
              <ul className="mt-8 space-y-3">
                {briefChecklist.map((q) => (
                  <li
                    key={q}
                    className="flex items-start gap-3 border border-border bg-surface px-5 py-4 text-[0.95rem] text-muted"
                  >
                    <span className="text-gold" aria-hidden>
                      ✦
                    </span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* What cheap costs */}
      <section className="section bg-ink-2">
        <Container>
          <SectionHeading
            eyebrow="Being Straight"
            title="When cheap headshots turn out expensive"
            lead="Not always — if you need one clear profile photo and the photographer is competent, a lower-priced session is a perfectly sensible buy. These are the situations where it stops being one."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {cheapCosts.map((c) => (
              <div key={c.title} className="border border-border bg-surface p-7">
                <h3 className="font-display text-lg text-cream">{c.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Other services pricing */}
      <section className="section bg-ink">
        <Container>
          <SectionHeading
            eyebrow="Everything Else"
            title="Pricing for other sessions"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.values(pricingGroups).map((group) => (
              <div key={group.id} className="border border-border bg-surface p-7">
                <h3 className="font-display text-xl text-cream">
                  {group.label}
                </h3>
                <ul className="mt-4 space-y-2">
                  {group.tiers.map((t) => (
                    <li
                      key={t.name}
                      className="flex items-baseline justify-between gap-4 text-sm text-muted"
                    >
                      <span>{t.name}</span>
                      <span className="font-display text-lg text-gold">
                        {t.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-[0.92rem] leading-relaxed text-faint">
            {site.priceNote}
          </p>
        </Container>
      </section>

      <Testimonials limit={3} />

      <FAQ
        faqs={faqs}
        eyebrow="Pricing Questions"
        title="Common questions about headshot pricing in Sydney"
        id="faq"
      />

      {/* Contextual links */}
      <section className="section bg-ink-2">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: "/corporate-headshots-sydney",
                label: "Corporate Headshots",
                note: "The full service, process and what's included",
              },
              {
                href: "/team-headshots-sydney",
                label: "Team Headshot Days",
                note: "On-site logistics, space needed, scheduling",
              },
              {
                href: "/personal-branding-sydney",
                label: "Personal Branding",
                note: "Half and full day sessions from $895",
              },
              {
                href: "/blog/what-to-wear-for-corporate-headshots",
                label: "What to Wear",
                note: "Get more from the session you've paid for",
              },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group border border-border bg-surface p-7 transition-colors hover:border-gold"
              >
                <p className="font-display text-lg text-cream group-hover:text-gold">
                  {l.label} →
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {l.note}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Want a firm number for your team?"
        text="Send the headcount, the suburb and a rough date, and you'll have a written quote — usually within one business day."
        ctaLabel="Get a Team Quote"
        ctaHref="/contact?service=team-headshots-sydney"
      />
    </>
  );
}

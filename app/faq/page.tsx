import type { Metadata } from "next";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { services } from "@/lib/services";
import { businessFaqs, bookingFaqs } from "@/lib/faqs";
import { Container, Eyebrow, SectionHeading } from "@/components/Section";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

/**
 * The FAQ hub.
 *
 * Every question on the site, in one place, with every answer rendered into the
 * HTML. Before this existed there was no single URL an answer engine could cite
 * for "everything about working with Nick Brand Photography" — the questions
 * were scattered across nine service pages, twelve suburb pages and the booking
 * page, and (until the FAQ component was fixed) most of the answers were not in
 * the markup at all.
 */

const TITLE = `Photography FAQs — Sydney Headshots, Pricing & Process | ${site.name}`;
const DESCRIPTION =
  "Every question about working with Nick Brand Photography — pricing and GST, turnaround times, on-site team headshot days, insurance, copyright, studio location and booking.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/faq") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/faq"),
    type: "website",
    images: [
      {
        url: "/images/og/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Frequently asked questions — Nick Brand Photography, Sydney",
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
  { name: "FAQs", path: "/faq" },
];

export default function FaqPage() {
  // Every service page's FAQs and objections, grouped by service.
  const serviceGroups = services.map((s) => ({
    slug: s.slug,
    label: s.navLabel,
    faqs: [...s.faqs, ...(s.objections ?? [])],
  }));

  // The hub is the one page where it's worth emitting the whole set as
  // FAQPage — it exists precisely so an answer engine has a single citable URL
  // covering everything. Service pages keep their own, shorter schema.
  const allFaqs = [
    ...businessFaqs,
    ...bookingFaqs,
    ...serviceGroups.flatMap((g) => g.faqs),
  ];

  return (
    <>
      <JsonLd data={[faqSchema(allFaqs), breadcrumbSchema(crumbs)]} />

      <Breadcrumbs crumbs={crumbs} />

      <section className="border-y border-border bg-ink-2">
        <Container className="py-16 lg:py-20">
          <div className="max-w-3xl">
            <Eyebrow>Questions</Eyebrow>
            <h1 className="font-display mt-6 text-[2.4rem] leading-[1.08] text-cream sm:text-5xl lg:text-[3.4rem]">
              Everything you might want to ask
            </h1>
            <p className="mt-7 text-[1.05rem] leading-relaxed text-muted">
              Pricing, turnaround, insurance, copyright, how an on-site team day
              actually runs, and what happens if you hate your photos. If
              something isn&apos;t answered here,{" "}
              <Link
                href="/contact"
                className="text-gold transition-colors hover:text-gold-soft"
              >
                ask Nick directly
              </Link>{" "}
              — he replies personally, usually within a business day.
            </p>
          </div>
        </Container>
      </section>

      <FAQ
        faqs={businessFaqs}
        eyebrow="The Business"
        title="About Nick Brand Photography"
        id="about-the-business"
      />

      <FAQ
        faqs={bookingFaqs}
        eyebrow="Booking"
        title="Booking and scheduling"
        id="booking"
      />

      {serviceGroups.map((g) =>
        g.faqs.length ? (
          <section key={g.slug} className="section bg-ink-2">
            <Container>
              <SectionHeading eyebrow="By Service" title={g.label} />
              <div className="mt-10 divide-y divide-border border-y border-border">
                {g.faqs.map((f) => (
                  <div key={f.q} className="py-6">
                    <h3 className="text-[1.02rem] text-cream">{f.q}</h3>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
                      {f.a}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href={`/${g.slug}`}
                className="mt-8 inline-block text-xs uppercase tracking-[0.16em] text-gold transition-colors hover:text-gold-soft"
              >
                {g.label} in Sydney →
              </Link>
            </Container>
          </section>
        ) : null,
      )}

      <section className="section bg-ink">
        <Container>
          <SectionHeading
            eyebrow="Still Deciding"
            title="Useful next steps"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: "/corporate-headshot-pricing-sydney",
                label: "What headshots cost in Sydney",
              },
              { href: "/portfolio", label: "See the work" },
              { href: "/about", label: "How Nick works" },
              { href: "/terms", label: "Terms, ABN and insurance" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group border border-border bg-surface p-7 transition-colors hover:border-gold"
              >
                <span className="font-display text-lg text-cream group-hover:text-gold">
                  {l.label} →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}

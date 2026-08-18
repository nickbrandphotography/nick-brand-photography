import type { Metadata } from "next";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { Container, Eyebrow, SectionHeading } from "@/components/Section";
import Breadcrumbs from "@/components/Breadcrumbs";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

/**
 * Business terms.
 *
 * This page will never rank for anything and that is fine — it exists because
 * corporate buyers and procurement teams look for exactly this before approving
 * a supplier, and because publishing it is a legitimacy signal that competitors
 * already carry (published ABN, written terms, a cancellation policy). The
 * audit found none of it anywhere on the site.
 *
 * NOTE: this is a plain-English statement of how Nick works, not legal advice
 * or a drafted contract. Have a solicitor review it before relying on it for a
 * large engagement.
 */

const TITLE = `Terms, Insurance & Business Details | ${site.name}`;
const DESCRIPTION =
  "Business terms for Nick Brand Photography — booking and cancellation, payment and invoicing, $20M public liability insurance, image usage rights and privacy for staff photography.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/terms") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/terms"),
    type: "website",
    images: [
      {
        url: "/images/og/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Terms, insurance and business details — Nick Brand Photography",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/og/og-default.jpg"],
  },
  robots: { index: true, follow: true },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Terms & Business Details", path: "/terms" },
];

const sections = [
  {
    heading: "Booking and confirmation",
    paragraphs: [
      "A session is confirmed when a time is reserved through the booking page or agreed in writing by email. For team days and event coverage, the date is held once the scope — headcount, location and timing — is confirmed in writing.",
      "Individual sessions can often be booked within the same week. Team headshot days and event coverage are best booked two to three weeks ahead so the date can be locked in.",
    ],
  },
  {
    heading: "Rescheduling and cancellation",
    paragraphs: [
      "Plans change and rescheduling is not penalised. Let Nick know as early as you reasonably can and the session will be moved to a new time; individual bookings can be rescheduled directly from the confirmation email.",
      "For team days and event coverage, where a full day has been held and other work turned away, please give as much notice as possible. A cancellation inside 48 hours of a booked team day may attract a fee to cover the reserved time; this will always be discussed rather than applied silently.",
      "Outdoor sessions affected by weather are rescheduled at no cost.",
    ],
  },
  {
    heading: "Pricing, payment and invoicing",
    paragraphs: [
      `${site.priceNote}`,
      "Individual sessions are payable on or before the session. Corporate and team work is invoiced with standard payment terms so it can go through accounts payable like any other supplier. Purchase order numbers can be quoted on the invoice where required.",
      "Quoted prices include travel within Greater Sydney and, for team days, the on-site mobile studio setup. Work outside Greater Sydney is quoted separately to cover travel time. Any third-party cost — venue hire, permits, a hair and makeup artist — is agreed in advance and passed through at cost, never added afterwards.",
    ],
  },
  {
    heading: "Insurance",
    paragraphs: [
      `Nick Brand Photography carries ${site.stats.insured} public liability insurance. A certificate of currency is supplied on request — building managers and corporate procurement teams frequently require it before an on-site shoot is approved, so ask for it at the booking stage rather than the week of the shoot.`,
    ],
  },
  {
    heading: "Image usage and copyright",
    paragraphs: [
      "Copyright in the photographs remains with Nick Brand Photography, which is standard practice for commissioned photography in Australia.",
      "Clients receive full rights to use their images for business and personal promotion — website, social media, email signatures, print, press, proposals and advertising — with no time limit, no per-use fee and no geographic restriction. The images are not licensed to any third party.",
      "What is not included is resale or sub-licensing of the photographs as stock, and editing that materially alters the image beyond cropping and resizing. If you need broader rights, say so and it can be arranged.",
      "Separately, Nick may use a small selection of images as portfolio examples. Client and staff photographs are never published without permission — which is also why you will not find a wall of client logos or named case studies on this site.",
    ],
  },
  {
    heading: "Privacy and staff photography",
    paragraphs: [
      "For team and on-site work, the employer is responsible for obtaining staff consent to be photographed and for how the resulting images are used internally. Written consent forms and a plain-English usage statement can be supplied ahead of the day so approvals are done before anyone stands in front of the camera.",
      "Any staff member who does not wish to be photographed simply is not photographed. Personal information collected through the enquiry form or booking system is used only to arrange and deliver the work, and is not sold or shared.",
    ],
  },
  {
    heading: "Delivery and reshoots",
    paragraphs: [
      "Standard delivery is within five business days for headshot and team sessions. A 48-hour express option is available for an additional fee, and actor sessions have a 24-hour rush option for submission deadlines.",
      "Images are reviewed in a private online gallery before anything is finished, and the client chooses which frames are edited. If a session genuinely has not produced a usable result, it will be reshot.",
      "Finished images are retained for at least twelve months, so a lost file is a request rather than a reshoot. Keep your own backup as well.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <Breadcrumbs crumbs={crumbs} />

      <section className="border-y border-border bg-ink-2">
        <Container className="py-16 lg:py-20">
          <div className="max-w-3xl">
            <Eyebrow>Business Details</Eyebrow>
            <h1 className="font-display mt-6 text-[2.4rem] leading-[1.08] text-cream sm:text-5xl">
              Terms, insurance and how the paperwork works
            </h1>
            <p className="mt-7 text-[1.05rem] leading-relaxed text-muted">
              Everything a procurement team, an office manager or a cautious
              buyer usually asks before approving a supplier — written out
              plainly rather than buried in a PDF.
            </p>
          </div>
        </Container>
      </section>

      {/* Business details */}
      <section className="section bg-ink">
        <Container>
          <SectionHeading eyebrow="At a Glance" title="Business details" />
          <dl className="mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
            {[
              { t: "Trading name", d: site.legalName },
              ...(site.abn ? [{ t: "ABN", d: site.abn }] : []),
              { t: "GST", d: "Not registered — no GST is added to any price" },
              {
                t: "Studio address",
                d: `${site.address.street}, ${site.address.suburb} ${site.address.state} ${site.address.postcode}`,
              },
              { t: "Service area", d: `${site.serviceArea} — on-site anywhere across Sydney` },
              { t: "Hours", d: site.hours },
              { t: "Public liability", d: `${site.stats.insured} — certificate of currency on request` },
              { t: "Phone", d: site.phone },
              { t: "Email", d: site.email },
            ].map((row) => (
              <div key={row.t} className="border-t border-border pt-4">
                <dt className="text-xs uppercase tracking-[0.18em] text-gold">
                  {row.t}
                </dt>
                <dd className="mt-1.5 text-[1.02rem] text-cream">{row.d}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Terms */}
      <section className="section bg-ink-2">
        <Container>
          <div className="mx-auto max-w-3xl">
            {sections.map((s) => (
              <div key={s.heading} className="mt-12 first:mt-0">
                <h2 className="font-display text-2xl text-cream sm:text-3xl">
                  {s.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {s.paragraphs.map((p) => (
                    <p
                      key={p.slice(0, 32)}
                      className="text-[1.02rem] leading-relaxed text-muted"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-14 border border-border bg-surface p-7">
              <p className="text-[0.95rem] leading-relaxed text-muted">
                These terms are a plain-English summary of how Nick works, not a
                drafted contract. For a large engagement, a formal agreement can
                be provided — just ask.{" "}
                <Link
                  href="/image-licensing"
                  className="text-gold transition-colors hover:text-gold-soft"
                >
                  Image licensing details are here
                </Link>
                , and anything else can be answered on the{" "}
                <Link
                  href="/faq"
                  className="text-gold transition-colors hover:text-gold-soft"
                >
                  FAQ page
                </Link>{" "}
                or by{" "}
                <Link
                  href="/contact"
                  className="text-gold transition-colors hover:text-gold-soft"
                >
                  getting in touch
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>

      <CTASection
        title="Need paperwork before you can book?"
        text="Certificate of currency, written terms, a formal quote or a supplier onboarding form — ask and it will be with you the same day."
        ctaLabel="Request Documents"
        ctaHref="/contact"
      />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/site";
import { pickImages } from "@/lib/images";
import { portfolioCategories } from "@/lib/portfolio";
import { Container, SectionHeading } from "@/components/Section";
import Breadcrumbs from "@/components/Breadcrumbs";
import Gallery from "@/components/Gallery";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

const TITLE = "Portfolio | Nick Brand Photography";
const DESCRIPTION =
  "Selected work from Nick Brand Photography — corporate headshots, executive portraits, personal branding, actor and model portfolios, music, sport and family photography across Sydney.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/portfolio") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/portfolio"),
    type: "website",
    images: [
      {
        url: "/images/og/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Portfolio — Nick Brand Photography, Sydney",
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
  { name: "Portfolio", path: "/portfolio" },
];

export default function PortfolioPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <Breadcrumbs crumbs={crumbs} />

      {/* Hero */}
      <section className="border-y border-border bg-ink-2">
        <Container className="py-16 text-center lg:py-20">
          <div className="flex justify-center">
            <span className="eyebrow">Portfolio</span>
          </div>
          <h1 className="font-display mx-auto mt-6 max-w-3xl text-[2.5rem] leading-[1.08] text-cream sm:text-5xl lg:text-[3.4rem]">
            Sydney photography by Nick Brand
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-muted">
            Twenty years of work across headshots, portraits and personal
            branding — shot from the Lane Cove studio and on location across
            Sydney. Browse by category below, or go straight to the service you
            need.
          </p>
        </Container>
      </section>

      {/* Categories */}
      {portfolioCategories.map((cat, i) => (
        <section
          key={cat.key}
          className={`section ${i % 2 === 0 ? "bg-ink" : "bg-ink-2"}`}
        >
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow={cat.title} title={cat.title} lead={cat.blurb} />
              {cat.serviceSlug ? (
                <Link
                  href={`/${cat.serviceSlug}`}
                  className="shrink-0 text-xs uppercase tracking-[0.16em] text-gold transition-colors hover:text-gold-soft"
                >
                  View {cat.serviceLabel} →
                </Link>
              ) : null}
            </div>
            <div className="mt-10">
              <Gallery
                images={pickImages(cat.picks)}
                schemaName={`${cat.title} — Sydney photography by Nick Brand`}
              />
            </div>
          </Container>
        </section>
      ))}

      <CTASection
        title="Like what you see?"
        text="Book a session with Nick — studio in Lane Cove or on-site anywhere across Sydney."
      />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { locations } from "@/lib/locations";
import { services } from "@/lib/services";
import { Container, Eyebrow, SectionHeading } from "@/components/Section";
import Breadcrumbs from "@/components/Breadcrumbs";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Locations", path: "/locations" },
];

export const metadata: Metadata = {
  title: `Photographer Service Areas Across Sydney | ${site.name}`,
  description:
    "Nick Brand Photography works across Greater Sydney — corporate headshots, personal branding and team photography in the CBD, North Sydney, Chatswood, Surry Hills and Parramatta. Studio in Lane Cove.",
  alternates: { canonical: absoluteUrl("/locations") },
  openGraph: {
    title: `Photographer Service Areas Across Sydney`,
    description:
      "Corporate headshots, personal branding and team photography across Greater Sydney — on-site at your office or at the Lane Cove studio.",
    url: absoluteUrl("/locations"),
    type: "website",
  },
};

/** ItemList structured data so the suburb set is discoverable as a collection. */
const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Nick Brand Photography service areas in Sydney",
  itemListElement: locations.map((l, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: l.suburb,
    url: absoluteUrl(`/locations/${l.slug}`),
  })),
};

export default function LocationsPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), itemListSchema]} />

      <Breadcrumbs crumbs={crumbs} />

      {/* Hero */}
      <section className="border-b border-border bg-ink-2">
        <Container className="py-16 text-center lg:py-20">
          <div className="flex justify-center">
            <Eyebrow>Service Areas</Eyebrow>
          </div>
          <h1 className="font-display mx-auto mt-6 max-w-3xl text-[2.5rem] leading-[1.08] text-cream sm:text-5xl lg:text-[3.4rem]">
            Photography across Greater Sydney
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-muted">
            Nick Brand Photography is based at a private studio in Lane Cove and
            works on-site at offices right across Sydney. Choose your area below
            for local detail, or get in touch about anywhere else in the city.
          </p>
        </Container>
      </section>

      {/* Suburb grid */}
      <section className="section bg-ink">
        <Container>
          <SectionHeading
            eyebrow="Where Nick Works"
            title="Corporate headshots, suburb by suburb"
            lead="On-site headshot days come to your office with a full mobile studio; individual sessions run from the Lane Cove studio."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((l) => (
              <Link
                key={l.slug}
                href={`/locations/${l.slug}`}
                className="group flex flex-col border border-border bg-surface p-7 transition-colors hover:border-gold"
              >
                <h2 className="font-display text-xl text-cream group-hover:text-gold">
                  {l.suburb}
                </h2>
                <p className="mt-2 grow text-sm leading-relaxed text-muted">
                  {l.intro[0]}
                </p>
                <span className="mt-4 text-xs uppercase tracking-[0.16em] text-gold">
                  {l.suburb} headshots →
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-10 max-w-2xl text-[0.97rem] leading-relaxed text-muted">
            Don&apos;t see your suburb? Nick photographs teams and individuals
            anywhere across Greater Sydney, from the Eastern Suburbs to the Inner
            West and the Hills District.{" "}
            <Link
              href="/contact"
              className="text-gold transition-colors hover:text-gold-soft"
            >
              Get in touch
            </Link>{" "}
            with your location.
          </p>
        </Container>
      </section>

      {/* Services cross-link */}
      <section className="section bg-ink-2">
        <Container>
          <SectionHeading
            eyebrow="Explore Services"
            title="What Nick photographs in Sydney"
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className="group flex items-center justify-between gap-4 border border-border bg-surface px-6 py-5 transition-colors hover:border-gold"
              >
                <span className="font-display text-lg text-cream group-hover:text-gold">
                  {s.navLabel}
                </span>
                <span className="text-gold" aria-hidden>
                  →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Book a session anywhere in Sydney"
        text="Studio in Lane Cove, or a full mobile studio brought to your office. Check live availability and reserve your shoot in under a minute."
      />
    </>
  );
}

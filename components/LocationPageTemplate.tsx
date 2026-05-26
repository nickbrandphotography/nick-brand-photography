import Image from "next/image";
import Link from "next/link";
import type { Location } from "@/lib/locations";
import { getImage, getImages } from "@/lib/images";
import { site, absoluteUrl } from "@/lib/site";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";
import { Container, Eyebrow, SectionHeading } from "./Section";
import Button from "./Button";
import Breadcrumbs from "./Breadcrumbs";
import Gallery from "./Gallery";
import PricingCards from "./PricingCards";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import CTASection from "./CTASection";
import JsonLd from "./JsonLd";

/** Full suburb landing page, rendered from a Location definition. */
export default function LocationPageTemplate({
  location,
}: {
  location: Location;
}) {
  const hero = getImage("corporate-headshots", 9, `Corporate headshots in ${location.suburb}`);
  const gallery = getImages("corporate-headshots", 6, `${location.suburb} corporate headshots`);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
    { name: location.suburb, path: `/locations/${location.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[faqSchema(location.faqs), breadcrumbSchema(crumbs)]}
      />

      <Breadcrumbs crumbs={crumbs} />

      {/* Hero */}
      <section className="border-y border-border bg-ink-2">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <Eyebrow>{location.suburb}</Eyebrow>
            <h1 className="font-display mt-5 text-4xl leading-[1.1] text-cream sm:text-5xl lg:text-[3.2rem]">
              {location.h1}
            </h1>
            <p className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-muted">
              {location.intro[0]}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={site.bookingUrl}>Check Availability</Button>
              <Button href="/contact" variant="outline">
                Enquire About {location.suburb}
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden border border-border sm:aspect-[3/2] lg:aspect-[4/5]">
            <Image
              src={hero.src}
              alt={hero.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 520px"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      {/* Local context */}
      <section className="section bg-ink">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-5">
              {location.intro.slice(1).map((p) => (
                <p
                  key={p.slice(0, 32)}
                  className="text-[1.05rem] leading-relaxed text-muted"
                >
                  {p}
                </p>
              ))}
              <p className="text-[1.05rem] leading-relaxed text-muted">
                {location.logistics}
              </p>
            </div>
            <div className="border border-border bg-surface p-7">
              <p className="eyebrow">Working in {location.suburb}</p>
              <ul className="mt-5 space-y-3">
                {location.localSignals.map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-3 text-sm text-muted"
                  >
                    <span className="text-gold" aria-hidden>
                      ✦
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Gallery */}
      <section className="section bg-ink-2">
        <Container>
          <SectionHeading
            eyebrow="Recent Work"
            title={`Headshots for ${location.suburb} businesses`}
          />
          <div className="mt-10">
            <Gallery images={gallery} />
          </div>
        </Container>
      </section>

      {/* Pricing */}
      <PricingCards
        groupKey="corporate"
        title={`Headshot pricing for ${location.suburb}`}
      />

      <Testimonials limit={3} />

      <FAQ
        faqs={location.faqs}
        title={`${location.suburb} headshot questions`}
      />

      {/* Back to service */}
      <section className="section bg-ink">
        <Container>
          <div className="border border-border bg-surface p-8 text-center">
            <p className="text-[0.97rem] text-muted">
              Looking for the full service overview?
            </p>
            <Link
              href="/corporate-headshots-sydney"
              className="font-display mt-2 inline-block text-2xl text-cream transition-colors hover:text-gold"
            >
              Corporate Headshots in Sydney →
            </Link>
          </div>
        </Container>
      </section>

      <CTASection
        title={`Book a headshot session in ${location.suburb}`}
      />
    </>
  );
}

/** Shared metadata builder for location pages. */
export function locationMetadata(location: Location) {
  return {
    title: location.metaTitle,
    description: location.metaDescription,
    alternates: { canonical: absoluteUrl(`/locations/${location.slug}`) },
    openGraph: {
      title: location.metaTitle,
      description: location.metaDescription,
      url: absoluteUrl(`/locations/${location.slug}`),
      type: "website",
      images: [
        {
          url: getImage("corporate-headshots", 9).jpg,
          alt: location.h1,
        },
      ],
    },
  };
}

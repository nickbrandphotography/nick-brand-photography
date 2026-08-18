import Image from "next/image";
import Link from "next/link";
import type { Location } from "@/lib/locations";
import { nearbyLocations } from "@/lib/locations";
import { getImage, pickImages } from "@/lib/images";
import { locationGalleries, locationGallery, locationHero } from "@/lib/galleries";
import { site, absoluteUrl } from "@/lib/site";
import {
  faqSchema,
  breadcrumbSchema,
  imageObjectSchema,
  locationServiceSchema,
} from "@/lib/schema";
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
  // Every suburb page used to share one hardcoded hero photo and one identical
  // gallery — a large part of why the twelve pages measured ~53% duplicate.
  const heroPick = locationHero[location.slug] ?? { i: 9, alt: `Corporate headshot photographed by ${site.name}` };
  const hero = getImage("corporate-headshots", heroPick.i, undefined);
  const heroAlt = heroPick.alt;
  const gallery = pickImages(
    locationGalleries[location.slug] ?? locationGallery,
  );
  const nearby = nearbyLocations(location.slug);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
    { name: location.suburb, path: `/locations/${location.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          locationServiceSchema(location.suburb, location.slug),
          faqSchema(location.faqs),
          breadcrumbSchema(crumbs),
          imageObjectSchema(hero.src, heroAlt),
        ]}
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
            <div className="mt-8 flex flex-col gap-3 sm:flex-row" data-cta="location-hero">
              <Button href={site.bookingUrl}>Check Availability</Button>
              <Button href="/contact" variant="outline">
                Enquire About {location.suburb}
              </Button>
            </div>
          </div>
          <div className="overflow-hidden border border-border bg-ink-2">
            <Image
              src={hero.src}
              alt={heroAlt}
              width={hero.width}
              height={hero.height}
              priority
              sizes="(max-width: 1024px) 100vw, 520px"
              quality={85}
              className="h-auto w-full"
            />
          </div>
        </Container>
      </section>

      {/* Local context */}
      <section className="section bg-ink">
        <Container>
          <SectionHeading
            eyebrow="Local Context"
            title={`Photographing ${location.suburb} businesses`}
          />
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
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
              {location.gettingThere ? (
                <p className="text-[1.05rem] leading-relaxed text-muted">
                  {location.gettingThere}
                </p>
              ) : null}
              {location.onSiteNote ? (
                <p className="text-[1.05rem] leading-relaxed text-muted">
                  {location.onSiteNote}
                </p>
              ) : null}
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
            <Gallery
              images={gallery}
              schemaName={`Corporate headshots for ${location.suburb} businesses`}
            />
          </div>
        </Container>
      </section>

      {/* Pricing */}
      {/* Suburb pages sell headshots, so they list the headshot sessions only —
          not family or portfolio work, which isn't what these pages rank for. */}
      <PricingCards
        sessionIds={[
          "headshot-essential",
          "headshot-professional",
          "team-quote",
        ]}
        title={`Headshot pricing for ${location.suburb}`}
      />

      <Testimonials limit={3} />

      <FAQ
        faqs={location.faqs}
        title={`${location.suburb} headshot questions`}
      />

      {/* Contextual links — services, neighbouring suburbs, pricing.
          These pages previously linked out to exactly one other page. */}
      <section className="section bg-ink">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/corporate-headshots-sydney"
              className="group border border-border bg-surface p-7 transition-colors hover:border-gold"
            >
              <p className="text-[0.9rem] text-muted">Full service overview</p>
              <p className="font-display mt-2 text-xl text-cream group-hover:text-gold">
                Corporate Headshots in Sydney →
              </p>
            </Link>
            <Link
              href="/team-headshots-sydney"
              className="group border border-border bg-surface p-7 transition-colors hover:border-gold"
            >
              <p className="text-[0.9rem] text-muted">
                Photographing a whole team
              </p>
              <p className="font-display mt-2 text-xl text-cream group-hover:text-gold">
                On-site Team Headshot Days →
              </p>
            </Link>
            <Link
              href="/corporate-headshot-pricing-sydney"
              className="group border border-border bg-surface p-7 transition-colors hover:border-gold"
            >
              <p className="text-[0.9rem] text-muted">
                What headshots cost in Sydney
              </p>
              <p className="font-display mt-2 text-xl text-cream group-hover:text-gold">
                Pricing Guide →
              </p>
            </Link>
          </div>

          {nearby.length ? (
            <p className="mt-10 text-[0.97rem] leading-relaxed text-muted">
              Nick also photographs businesses nearby in{" "}
              {nearby.map((n, i) => (
                <span key={n.slug}>
                  <Link
                    href={`/locations/${n.slug}`}
                    className="text-gold transition-colors hover:text-gold-soft"
                  >
                    {n.suburb}
                  </Link>
                  {i < nearby.length - 2
                    ? ", "
                    : i === nearby.length - 2
                      ? " and "
                      : ""}
                </span>
              ))}
              , and{" "}
              <Link
                href="/locations"
                className="text-gold transition-colors hover:text-gold-soft"
              >
                right across Greater Sydney
              </Link>
              .
            </p>
          ) : null}
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
  const heroPick = locationHero[location.slug] ?? { i: 9 };
  const ogImage = getImage("corporate-headshots", heroPick.i).jpg;
  return {
    title: location.metaTitle,
    description: location.metaDescription,
    alternates: { canonical: absoluteUrl(`/locations/${location.slug}`) },
    openGraph: {
      title: location.metaTitle,
      description: location.metaDescription,
      url: absoluteUrl(`/locations/${location.slug}`),
      type: "website",
      images: [{ url: ogImage, alt: location.h1 }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: location.metaTitle,
      description: location.metaDescription,
      images: [ogImage],
    },
  };
}

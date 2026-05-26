import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/lib/services";
import { getService } from "@/lib/services";
import { getImage, getImages } from "@/lib/images";
import { site, absoluteUrl } from "@/lib/site";
import {
  serviceSchema,
  faqSchema,
  breadcrumbSchema,
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

/** Full service silo page, rendered from a Service definition. */
export default function ServicePageTemplate({ service }: { service: Service }) {
  const hero = getImage(service.heroSilo, service.heroIndex, service.h1);
  const gallery = getImages(service.gallerySilo, service.galleryCount, service.navLabel);
  const related = service.related
    .map((slug) => getService(slug))
    .filter((s): s is Service => Boolean(s));

  const crumbs = [
    { name: "Home", path: "/" },
    { name: service.navLabel, path: `/${service.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          serviceSchema(service),
          faqSchema(service.faqs),
          breadcrumbSchema(crumbs),
        ]}
      />

      <Breadcrumbs crumbs={crumbs} />

      {/* Hero */}
      <section className="border-y border-border bg-ink-2">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <Eyebrow>{service.eyebrow}</Eyebrow>
            <h1 className="font-display mt-5 text-4xl leading-[1.1] text-cream sm:text-5xl lg:text-[3.4rem]">
              {service.h1}
            </h1>
            <p className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-muted">
              {service.intro[0]}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={site.bookingUrl}>Check Availability</Button>
              <Button href="/contact" variant="outline">
                Ask a Question
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

      {/* Intro / overview */}
      {service.intro.length > 1 ? (
        <section className="section bg-ink">
          <Container>
            <div className="max-w-3xl space-y-5">
              {service.intro.slice(1).map((p) => (
                <p
                  key={p.slice(0, 32)}
                  className="text-[1.05rem] leading-relaxed text-muted"
                >
                  {p}
                </p>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Outcomes */}
      <section className="section bg-ink-2">
        <Container>
          <SectionHeading
            eyebrow="What You Get"
            title="Photography built around outcomes"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {service.outcomes.map((o, i) => (
              <div
                key={o.title}
                className="border border-border bg-surface p-7"
              >
                <span className="font-display text-2xl text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-3 text-xl text-cream">
                  {o.title}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
                  {o.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="section bg-ink">
        <Container>
          <SectionHeading
            eyebrow="The Process"
            title="Simple, from enquiry to delivery"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, i) => (
              <div key={step.title} className="border-t border-gold pt-5">
                <span className="text-xs uppercase tracking-[0.18em] text-faint">
                  Step {i + 1}
                </span>
                <h3 className="font-display mt-2 text-lg text-cream">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Gallery */}
      <section className="section bg-ink-2">
        <Container>
          <SectionHeading
            eyebrow="Recent Work"
            title={`${service.navLabel} portfolio`}
          />
          <div className="mt-10">
            <Gallery images={gallery} />
          </div>
        </Container>
      </section>

      {/* Who it's for */}
      <section className="section bg-ink">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <SectionHeading eyebrow="Who It's For" title="Is this service right for you?" />
            <ul className="grid gap-3 sm:grid-cols-2">
              {service.whoFor.map((w) => (
                <li
                  key={w}
                  className="flex items-start gap-3 border border-border bg-surface px-4 py-3.5 text-sm text-muted"
                >
                  <span className="text-gold" aria-hidden>
                    ✦
                  </span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Pricing */}
      {service.pricingGroupKey ? (
        <PricingCards groupKey={service.pricingGroupKey} />
      ) : null}

      {/* Testimonials */}
      <Testimonials limit={3} />

      {/* FAQ */}
      <FAQ faqs={service.faqs} />

      {/* Related services */}
      {related.length ? (
        <section className="section bg-ink-2">
          <Container>
            <SectionHeading eyebrow="Explore More" title="Related services" />
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${r.slug}`}
                  className="group border border-border bg-surface p-7 transition-colors hover:border-gold"
                >
                  <h3 className="font-display text-xl text-cream group-hover:text-gold">
                    {r.navLabel}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {r.summary}
                  </p>
                  <span className="mt-4 inline-block text-xs uppercase tracking-[0.16em] text-gold">
                    View service →
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CTASection />
    </>
  );
}

/** Shared metadata builder for service pages. */
export function serviceMetadata(slug: string) {
  const service = getService(slug);
  if (!service) return {};
  const ogImage = getImage(service.heroSilo, service.heroIndex).jpg;
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: absoluteUrl(`/${slug}`) },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: absoluteUrl(`/${slug}`),
      type: "website",
      images: [{ url: ogImage, alt: service.h1 }],
    },
  };
}

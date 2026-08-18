import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/lib/services";
import { getService } from "@/lib/services";
import { getImage, getImages, pickImages, siloCount } from "@/lib/images";
import { serviceGalleries } from "@/lib/galleries";
import { getPost } from "@/lib/posts";
import { getLocation } from "@/lib/locations";
import { site, absoluteUrl } from "@/lib/site";
import { bookingHref } from "@/lib/booking";
import {
  serviceSchema,
  faqSchema,
  breadcrumbSchema,
  imageObjectSchema,
} from "@/lib/schema";
import { Container, Eyebrow, SectionHeading } from "./Section";
import Button from "./Button";
import Breadcrumbs from "./Breadcrumbs";
import Gallery from "./Gallery";
import PricingCards from "./PricingCards";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import CTASection from "./CTASection";
import ContactForm from "./ContactForm";
import JsonLd from "./JsonLd";

/** Full service silo page, rendered from a Service definition. */
export default function ServicePageTemplate({ service }: { service: Service }) {
  // Prefer the service's own silo once it actually has photographs in it — the
  // events and team pages borrow from the corporate library until then.
  const heroSilo =
    service.heroSiloWhenAvailable && siloCount(service.heroSiloWhenAvailable) > 0
      ? service.heroSiloWhenAvailable
      : service.heroSilo;
  const heroIndex =
    heroSilo === service.heroSilo ? service.heroIndex : 1;
  const hero = getImage(heroSilo, heroIndex, service.h1);

  const curated = serviceGalleries[service.slug];
  const gallery = curated
    ? pickImages(curated)
    : getImages(service.gallerySilo, service.galleryCount, service.navLabel);

  // Objections that acknowledge a thin portfolio retire themselves once the
  // service's OWN silo is big enough, so the page can't end up apologising for
  // a problem that has since been fixed.
  //
  // Deliberately measured against `siloCount(service.gallerySilo)` and not
  // `gallery.length`: the gallery is padded with borrowed frames from the
  // corporate and model libraries precisely because these silos are thin, so
  // counting the padding would retire the admission while it was still true.
  const ownImages = siloCount(service.gallerySilo);
  const objections = (service.objections ?? []).filter(
    (o) => !o.hideWhenGalleryAtLeast || ownImages < o.hideWhenGalleryAtLeast,
  );
  const related = service.related
    .map((slug) => getService(slug))
    .filter((s): s is Service => Boolean(s));
  const posts = (service.relatedPosts ?? [])
    .map((slug) => getPost(slug))
    .filter((p): p is NonNullable<ReturnType<typeof getPost>> => Boolean(p));
  const nearby = (service.relatedLocations ?? [])
    .map((slug) => getLocation(slug))
    .filter((l): l is NonNullable<ReturnType<typeof getLocation>> => Boolean(l));

  // "Check Availability" opens a booking calendar, which is right for one
  // person picking a time and wrong for an office manager arranging thirty
  // staff and an invoice. Team, executive and event pages override it.
  const primaryCtaHref = service.ctaHref ?? bookingHref(service.bookingSessionId);
  const primaryCtaLabel = service.ctaLabel ?? "Check Availability";

  const crumbs = [
    { name: "Home", path: "/" },
    { name: service.navLabel, path: `/${service.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          serviceSchema(service),
          // FAQ schema covers the FAQ block only. The objections are rendered
          // as ordinary visible prose further up the page, which is what
          // actually matters for extraction — duplicating several hundred words
          // of them into JSON-LD as well just inflates the payload on every
          // page for no additional benefit.
          faqSchema(service.faqs),
          breadcrumbSchema(crumbs),
          imageObjectSchema(hero.src, hero.alt),
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
            <div
              className="mt-8 flex flex-col gap-3 sm:flex-row"
              data-cta="service-hero"
            >
              <Button href={primaryCtaHref}>{primaryCtaLabel}</Button>
              <Button href="/contact" variant="outline">
                Ask a Question
              </Button>
            </div>
            <p className="mt-4 text-[0.82rem] text-faint">
              Nick replies personally, usually within one business day.
            </p>
          </div>
          <div className="overflow-hidden border border-border bg-ink-2">
            <Image
              src={hero.src}
              alt={hero.alt}
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
            title={`What a ${service.navLabel.toLowerCase()} session actually delivers`}
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
            title="From first enquiry to finished images"
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

      {/* Gallery — or an honest note when there is no portfolio for this
          service yet. Showing corporate headshots as evidence of event
          coverage misled both visitors and Google Images. */}
      {gallery.length > 0 || service.galleryNote ? (
        <section className="section bg-ink-2">
          <Container>
            <SectionHeading
              eyebrow="Recent Work"
              title={`${service.navLabel} portfolio`}
            />
            {gallery.length > 0 ? (
              <div className="mt-10">
                <Gallery
                  images={gallery}
                  schemaName={`${service.navLabel} — Sydney portfolio by ${site.name}`}
                />
              </div>
            ) : (
              <div className="mt-10 max-w-3xl border border-border bg-surface p-8">
                <p className="text-[1.02rem] leading-relaxed text-muted">
                  {service.galleryNote}
                </p>
                <div className="mt-6" data-cta="gallery-note">
                  <Button href="/contact" variant="outline">
                    Ask to See Relevant Work
                  </Button>
                </div>
              </div>
            )}
          </Container>
        </section>
      ) : null}

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

      {/* Industry-specific guidance */}
      {service.industryNotes?.length ? (
        <section className="section bg-ink-2">
          <Container>
            <SectionHeading
              eyebrow="By Industry"
              title="What changes depending on the work you do"
              lead="The brief is not the same for a barrister, a startup founder and a real estate agent. These are the differences that actually matter on the day."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {service.industryNotes.map((n) => (
                <div key={n.title} className="border-l border-gold bg-surface p-7">
                  <h3 className="font-display text-xl text-cream">{n.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
                    {n.text}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Pricing — this service's own sessions only */}
      {service.pricingSessionIds?.length ? (
        <PricingCards
          sessionIds={service.pricingSessionIds}
          title={service.pricingTitle ?? "Pricing"}
        />
      ) : null}

      {/* What the price covers, and what it doesn't */}
      {service.costNotes?.length || service.notIncluded?.length ? (
        <section className="section bg-ink">
          <Container>
            <div className="grid gap-12 lg:grid-cols-2">
              {service.costNotes?.length ? (
                <div>
                  <SectionHeading
                    eyebrow="The Cost"
                    title="What you're actually paying for"
                  />
                  <ul className="mt-8 space-y-4">
                    {service.costNotes.map((c) => (
                      <li
                        key={c.slice(0, 32)}
                        className="flex items-start gap-3 text-[0.97rem] leading-relaxed text-muted"
                      >
                        <span className="mt-1 text-gold" aria-hidden>
                          ✦
                        </span>
                        {c}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-[0.9rem] text-faint">
                    {site.priceNote}
                  </p>
                  <Link
                    href="/corporate-headshot-pricing-sydney"
                    className="mt-4 inline-block text-xs uppercase tracking-[0.16em] text-gold transition-colors hover:text-gold-soft"
                  >
                    Full Sydney headshot pricing guide →
                  </Link>
                </div>
              ) : null}

              {service.notIncluded?.length ? (
                <div>
                  <SectionHeading
                    eyebrow="Being Straight"
                    title="What isn't included"
                  />
                  <ul className="mt-8 space-y-4">
                    {service.notIncluded.map((n) => (
                      <li
                        key={n.slice(0, 32)}
                        className="flex items-start gap-3 text-[0.97rem] leading-relaxed text-muted"
                      >
                        <span className="mt-1 text-faint" aria-hidden>
                          —
                        </span>
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Common mistakes */}
      {service.commonMistakes?.length ? (
        <section className="section bg-ink-2">
          <Container>
            <SectionHeading
              eyebrow="Worth Knowing"
              title="What tends to go wrong — and how it's avoided"
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {service.commonMistakes.map((m) => (
                <div key={m.title} className="border border-border bg-surface p-7">
                  <h3 className="font-display text-lg text-cream">{m.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
                    {m.text}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <Testimonials limit={3} />

      {/* Objections — deliberately NOT inside the FAQ accordion. These are the
          reasons people don't book, and a hesitant buyer should not have to
          click to read them. */}
      {objections.length ? (
        <section className="section bg-ink-2">
          <Container>
            <SectionHeading
              eyebrow="Honest Answers"
              title="The questions people actually hesitate over"
            />
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              {objections.map((o) => (
                <div key={o.q}>
                  <h3 className="font-display text-lg leading-snug text-cream">
                    {o.q}
                  </h3>
                  <p className="mt-3 text-[0.97rem] leading-relaxed text-muted">
                    {o.a}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* FAQ */}
      <FAQ faqs={service.faqs} id="faq" />

      {/* Enquire without leaving the page */}
      <section className="section bg-ink-2">
        <Container className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <Eyebrow>Enquire</Eyebrow>
            <h2 className="font-display mt-5 text-3xl text-cream sm:text-4xl">
              Ask about {service.navLabel.toLowerCase()}
            </h2>
            <p className="mt-5 text-[1.02rem] leading-relaxed text-muted">
              Send a few details and Nick will reply with the right session,
              honest advice and a clear quote — usually within one business day.
            </p>
            <p className="mt-4 text-[0.97rem] leading-relaxed text-muted">
              Prefer to talk it through?{" "}
              <a
                href={`tel:${site.phoneIntl}`}
                className="text-gold transition-colors hover:text-gold-soft"
              >
                Call {site.phone}
              </a>
              .
            </p>
          </div>
          <ContactForm
            compact
            defaultInterest={service.formInterest}
            source={service.slug}
          />
        </Container>
      </section>

      {/* Contextual internal links: guides, suburbs, related services.
          These pages previously linked out only to a "related services" grid. */}
      {posts.length || nearby.length ? (
        <section className="section bg-ink">
          <Container>
            <div className="grid gap-12 lg:grid-cols-2">
              {posts.length ? (
                <div>
                  <SectionHeading eyebrow="Read First" title="Before your session" />
                  <ul className="mt-8 space-y-4">
                    {posts.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/blog/${p.slug}`}
                          className="group block border border-border bg-surface p-6 transition-colors hover:border-gold"
                        >
                          <span className="font-display text-lg text-cream group-hover:text-gold">
                            {p.title} →
                          </span>
                          <span className="mt-2 block text-sm leading-relaxed text-muted">
                            {p.excerpt}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {nearby.length ? (
                <div>
                  <SectionHeading
                    eyebrow="Where Nick Works"
                    title="Sydney areas covered"
                  />
                  <p className="mt-6 text-[0.97rem] leading-relaxed text-muted">
                    Sessions run from the Lane Cove studio or on-site at your
                    office. There are detailed pages for{" "}
                    {nearby.map((l, i) => (
                      <span key={l.slug}>
                        <Link
                          href={`/locations/${l.slug}`}
                          className="text-gold transition-colors hover:text-gold-soft"
                        >
                          {l.suburb}
                        </Link>
                        {i < nearby.length - 2
                          ? ", "
                          : i === nearby.length - 2
                            ? " and "
                            : ""}
                      </span>
                    ))}
                    , plus{" "}
                    <Link
                      href="/locations"
                      className="text-gold transition-colors hover:text-gold-soft"
                    >
                      every other area across Greater Sydney
                    </Link>
                    .
                  </p>
                  <p className="mt-6 text-[0.97rem] leading-relaxed text-muted">
                    New to Nick?{" "}
                    <Link
                      href="/about"
                      className="text-gold transition-colors hover:text-gold-soft"
                    >
                      Read how he works and why
                    </Link>
                    .
                  </p>
                </div>
              ) : null}
            </div>
          </Container>
        </section>
      ) : null}

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

      <CTASection
        sessionId={service.bookingSessionId}
        ctaLabel={service.ctaLabel}
        ctaHref={service.ctaHref}
      />
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
    twitter: {
      card: "summary_large_image" as const,
      title: service.metaTitle,
      description: service.metaDescription,
      images: [ogImage],
    },
  };
}

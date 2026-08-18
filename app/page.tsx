import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { services } from "@/lib/services";
import { getImage, pickImages, nickPortrait } from "@/lib/images";
import { homeFeatured } from "@/lib/galleries";
import { Container, Eyebrow, SectionHeading } from "@/components/Section";
import Button from "@/components/Button";
import TrustStats from "@/components/TrustStats";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { personSchema, faqSchema, imageObjectSchema } from "@/lib/schema";
import { homeFaqs } from "@/lib/faqs";

export const metadata: Metadata = {
  title: `${site.tagline} | ${site.name}`,
  description: site.description,
  alternates: { canonical: absoluteUrl("/") },
};

const heroImage = getImage(
  "corporate-headshots",
  6,
  // build() in lib/images.ts already appends " by Nick Brand Photography" —
  // do not include it here, or the credit is duplicated in the alt text and
  // the ImageObject schema caption.
  "Sydney corporate headshot",
);
const featured = pickImages(homeFeatured);

export default function HomePage() {
  return (
    <>
      {/* Structured data. The LocalBusiness (#business) and WebSite entities are
          emitted from app/layout.tsx so they appear on EVERY page — a crawler or
          answer engine fetching a single service page used to get a dangling
          {"@id": ".../#business"} reference with no node to resolve it. Only the
          homepage-specific nodes live here. */}
      <JsonLd
        data={[
          personSchema(),
          faqSchema(homeFaqs),
          imageObjectSchema(heroImage.src, heroImage.alt),
        ]}
      />

      {/* Hero */}
      <section className="border-b border-border bg-ink-2">
        <Container className="grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <Eyebrow>Sydney Photographer</Eyebrow>
            <h1 className="font-display mt-6 text-[2.7rem] leading-[1.06] text-cream sm:text-6xl lg:text-[4rem]">
              Corporate Headshot &amp;{" "}
              <span className="text-gold">Personal Branding</span> Photographer
              in Sydney
            </h1>
            <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-muted">
              Professional headshots, executive portraits and personal branding
              photography for Sydney professionals and teams. Studio in Lane
              Cove — or on-site at your office, anywhere across Sydney.
            </p>
            {/* The positioning claim. Previously the site never said, anywhere,
                why someone should choose Nick over the next competent Sydney
                photographer — which is also what an AI answer engine needs
                before it can recommend anyone. */}
            <p className="mt-5 max-w-xl border-l border-gold pl-5 text-[1.02rem] leading-relaxed text-cream/90">
              One photographer, every frame. Nick shoots each session himself —
              which is why a team of fifty comes back looking like it belongs to
              one company, and why the person who quotes you is the person who
              turns up.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row" data-cta="home-hero">
              <Button href={site.bookingUrl}>Book a Session</Button>
              <Button
                href="/corporate-headshot-pricing-sydney"
                variant="outline"
              >
                See Pricing
              </Button>
            </div>
            <p className="mt-4 text-[0.85rem] text-faint">
              Corporate headshots from $395 · teams from $285 per person · no
              GST added
            </p>
          </div>
          <div className="overflow-hidden border border-border bg-ink-2">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              width={heroImage.width}
              height={heroImage.height}
              priority
              sizes="(max-width: 1024px) 100vw, 540px"
              quality={85}
              className="h-auto w-full"
            />
          </div>
        </Container>
      </section>

      {/* Trust stats */}
      <section className="bg-ink">
        <Container className="py-14">
          <TrustStats />
        </Container>
      </section>

      {/* Services */}
      <section className="section bg-ink-2">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="Photography for every professional need"
            lead="Each service is built around a clear outcome — a credible image that works for your career, your brand or your business."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const img = getImage(s.heroSilo, s.heroIndex, s.navLabel);
              return (
                <Link
                  key={s.slug}
                  href={`/${s.slug}`}
                  className="group flex flex-col border border-border bg-surface transition-colors hover:border-gold"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-ink-2">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 360px"
                      quality={82}
                      className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex grow flex-col p-6">
                    <h3 className="font-display text-xl text-cream group-hover:text-gold">
                      {s.navLabel}
                    </h3>
                    <p className="mt-2 grow text-sm leading-relaxed text-muted">
                      {s.summary}
                    </p>
                    <span className="mt-4 text-xs uppercase tracking-[0.16em] text-gold">
                      Learn more →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* About teaser */}
      <section className="section bg-ink">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden border border-border bg-ink-2">
            <Image
              src={nickPortrait.src}
              alt={nickPortrait.alt}
              width={nickPortrait.width}
              height={nickPortrait.height}
              sizes="(max-width: 1024px) 100vw, 540px"
              quality={85}
              className="h-auto w-full"
            />
          </div>
          <div>
            <Eyebrow>About Nick</Eyebrow>
            <h2 className="font-display mt-5 text-3xl text-cream sm:text-4xl">
              The face behind the lens
            </h2>
            <p className="mt-5 text-[1.02rem] leading-relaxed text-muted">
              Nick is a Sydney-based commercial and portrait photographer with
              over 20 years behind the lens. Based in Lane Cove, he shoots
              across all of Sydney — from corporate boardrooms in the CBD to
              golden-hour family sessions on the coast.
            </p>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-muted">
              The approach is simple: a relaxed session, honest direction, and
              images that actually look like you — just the best version.
            </p>
            <div className="mt-8">
              <Button href="/about" variant="outline">
                More About Nick
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured work */}
      <section className="section bg-ink-2">
        <Container>
          <SectionHeading
            eyebrow="Portfolio"
            title="Recent work from Sydney shoots"
          />
          <div className="mt-10">
            <Gallery
              images={featured}
              schemaName={`Recent Sydney portrait and headshot work by ${site.name}`}
            />
          </div>
          <div className="mt-10 text-center">
            <Button href="/portfolio" variant="outline">
              View the Full Portfolio
            </Button>
          </div>
        </Container>
      </section>

      {/* Pricing entry point. The homepage previously showed no prices at all,
          on a site whose single biggest commercial advantage is that its
          pricing is published and final. */}
      <section className="section bg-ink">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Eyebrow>Investment</Eyebrow>
              <h2 className="font-display mt-5 text-3xl text-cream sm:text-4xl">
                Published prices, and the quote is the invoice
              </h2>
              <p className="mt-5 text-[1.02rem] leading-relaxed text-muted">
                Corporate headshots start at $395, the 90-minute Professional
                session is $695, and team headshot days are $285 per person for
                five or more — including travel across Greater Sydney and the
                on-site mobile studio.
              </p>
              <p className="mt-4 text-[1.02rem] leading-relaxed text-muted">
                Nick Brand Photography is not registered for GST, so nothing is
                added at invoice. Most Sydney studios quote ex-GST, which is
                worth knowing when you compare.
              </p>
              <div className="mt-8" data-cta="home-pricing">
                <Button href="/corporate-headshot-pricing-sydney">
                  What Headshots Cost in Sydney
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { p: "$395", l: "Individual — Essential, 45 min" },
                { p: "$695", l: "Individual — Professional, 90 min" },
                { p: "$285", l: "Per person — teams of 5+" },
              ].map((row) => (
                <div
                  key={row.l}
                  className="flex items-baseline justify-between gap-6 border border-border bg-surface px-6 py-5"
                >
                  <span className="font-display text-3xl text-gold">
                    {row.p}
                  </span>
                  <span className="text-right text-sm text-muted">{row.l}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Testimonials limit={3} />

      <FAQ faqs={homeFaqs} eyebrow="Questions" title="Common questions" />

      <CTASection />
    </>
  );
}
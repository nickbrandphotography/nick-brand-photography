import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { services } from "@/lib/services";
import { getImage, getImages, nickPortrait } from "@/lib/images";
import { Container, Eyebrow, SectionHeading } from "@/components/Section";
import Button from "@/components/Button";
import TrustStats from "@/components/TrustStats";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: `${site.tagline} | ${site.name}`,
  description: site.description,
  alternates: { canonical: absoluteUrl("/") },
};

const heroImage = getImage(
  "corporate-headshots",
  2,
  "Sydney corporate headshot by Nick Brand Photography",
);
const featured = getImages(
  "corporate-headshots",
  6,
  "Sydney corporate and branding photography",
);

const homeFaqs = [
  {
    q: "What type of photography does Nick Brand Photography specialise in?",
    a: "Nick Brand Photography specialises in corporate headshots, personal branding photography, executive portraits, team headshots, LinkedIn headshots, actor headshots and corporate event photography across Sydney.",
  },
  {
    q: "Where is Nick Brand Photography based?",
    a: "The studio is at 84 Centennial Avenue, Lane Cove NSW. Sessions also run on-site at offices and on location across Greater Sydney, including the CBD, North Sydney, Surry Hills, Parramatta and Chatswood.",
  },
  {
    q: "How do I book a photography session?",
    a: "Bookings are made online through the booking page, which shows live availability. You can also call 0403 835 467 or email info@nickbrandphotography.com to discuss a shoot.",
  },
  {
    q: "Do you photograph teams at their own office?",
    a: "Yes. On-site team headshot days are run across Sydney with a mobile studio set up in your office, so staff are photographed consistently with minimal disruption.",
  },
];

export default function HomePage() {
  return (
    <>
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
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href={site.bookingUrl}>Book a Session</Button>
              <Button href="/corporate-headshots-sydney" variant="outline">
                View Services
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden border border-border">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 540px"
              className="object-cover"
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
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 360px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
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
          <div className="relative aspect-[3/2] overflow-hidden border border-border">
            <Image
              src={nickPortrait.src}
              alt={nickPortrait.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 540px"
              className="object-cover"
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
            <Gallery images={featured} />
          </div>
        </Container>
      </section>

      <Testimonials limit={3} />

      <FAQ faqs={homeFaqs} eyebrow="Questions" title="Common questions" />

      <CTASection />
    </>
  );
}

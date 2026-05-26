import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { services } from "@/lib/services";
import { nickPortrait } from "@/lib/images";
import { Container, Eyebrow, SectionHeading } from "@/components/Section";
import Button from "@/components/Button";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrustStats from "@/components/TrustStats";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { personSchema, breadcrumbSchema } from "@/lib/schema";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

export const metadata: Metadata = {
  title: `About Nick Brand — Sydney Photographer | ${site.name}`,
  description:
    "Meet Nick Brand — a Sydney commercial and portrait photographer with over 20 years behind the lens. Studio in Lane Cove, working on-site across all of Sydney.",
  alternates: { canonical: absoluteUrl("/about") },
  openGraph: {
    title: `About Nick Brand — Sydney Photographer`,
    description:
      "Sydney commercial and portrait photographer with 20+ years of experience. Studio in Lane Cove, working across all of Sydney.",
    url: absoluteUrl("/about"),
    type: "profile",
    images: [{ url: nickPortrait.jpg, alt: nickPortrait.alt }],
  },
};

/* Approach values — drawn from the relaxed, outcome-led style on the homepage. */
const approach = [
  {
    title: "A relaxed session",
    text: "Most people say they hate having their photo taken. Nick's sessions are calm and unhurried, so the camera stops being the thing you're bracing against.",
  },
  {
    title: "Honest direction",
    text: "You don't need to know how to pose. Clear, friendly direction on the day means you're guided to the expressions and angles that actually work for you.",
  },
  {
    title: "Images that look like you",
    text: "The goal is never a stranger in a nice photo. It's you on a good day — credible, approachable and recognisable to anyone who meets you.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[personSchema(), breadcrumbSchema(crumbs)]} />

      <Breadcrumbs crumbs={crumbs} />

      {/* Hero */}
      <section className="border-y border-border bg-ink-2">
        <Container className="grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <Eyebrow>About Nick</Eyebrow>
            <h1 className="font-display mt-5 text-4xl leading-[1.1] text-cream sm:text-5xl lg:text-[3.4rem]">
              The photographer behind the lens
            </h1>
            <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-muted">
              Nick Brand is a Sydney-based commercial and portrait photographer
              with over 20 years of experience. He runs a studio in Lane Cove
              and works on-site across all of Sydney — from corporate
              boardrooms in the CBD to personal branding shoots on location.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={site.bookingUrl}>Book a Session</Button>
              <Button href="/contact" variant="outline">
                Get in Touch
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden border border-border">
            <Image
              src={nickPortrait.src}
              alt={nickPortrait.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 520px"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      {/* Story */}
      <section className="section bg-ink">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Eyebrow>The Story</Eyebrow>
            <h2 className="font-display mt-5 text-3xl text-cream sm:text-4xl">
              From a childhood prize to thousands of portraits
            </h2>
            <div className="mt-6 space-y-5 text-[1.05rem] leading-relaxed text-muted">
              <p>
                Nick's path to photography started early. At seven years old,
                his mum entered one of his photographs in a competition — and
                it won. That first taste of seeing his own image recognised
                sparked a fascination with photography, creativity and art that
                has never left him.
              </p>
              <p>
                Entirely self-taught, Nick began behind the camera with
                landscapes and abstract work, drawn to photography as a way of
                making something creative and his own. But he always loved
                working with people, and the move into portraits was a natural
                progression.
              </p>
              <p>
                More than twenty years on, Nick has photographed thousands of
                people across virtually every industry. What he loves most
                hasn't changed since that first competition: the reaction — the
                moment someone sees their photos and realises just how good
                they can look.
              </p>
              <p>
                His real skill is putting people at ease. Most people arrive
                certain they're not photogenic, and Nick is exceptional at
                getting even the most reluctant subject to relax and forget the
                camera is there. Every frame is aimed at the same thing:
                catching the real person through the eyes — the window to the
                soul.
              </p>
              <p>
                For around seven years Nick has worked from a private studio in
                Lane Cove on Sydney's Lower North Shore — a relaxed, unhurried
                space rather than a sterile commercial set. He shoots in the
                studio and on-site at offices in equal measure, anywhere across
                Sydney.
              </p>
              <p>
                Away from client work, Nick is usually still creating — editing,
                shooting, or building his two other creative ventures: a fashion
                label born from his abstract art, and a bodyscape photographic
                art practice. The same creative instinct that started at seven
                runs through all of it.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Approach */}
      <section className="section bg-ink-2">
        <Container>
          <SectionHeading
            eyebrow="The Approach"
            title="How a session with Nick works"
            lead="The method is simple, and it's the same whether you're booking a single headshot or a full team day."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {approach.map((a, i) => (
              <div
                key={a.title}
                className="flex flex-col border border-border bg-surface p-7"
              >
                <span className="font-display text-3xl text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-3 text-xl text-cream">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {a.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Trust stats */}
      <section className="bg-ink">
        <Container className="py-14">
          <TrustStats />
        </Container>
      </section>

      {/* What Nick shoots */}
      <section className="section bg-ink-2">
        <Container>
          <SectionHeading
            eyebrow="What Nick Shoots"
            title="Photography for every professional need"
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

      <Testimonials limit={3} />

      <CTASection
        title="Let's make your next photo a great one"
        text="Book a session with Nick — studio in Lane Cove, or on-site at your office anywhere across Sydney."
      />
    </>
  );
}

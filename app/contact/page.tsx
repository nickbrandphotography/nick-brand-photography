import type { Metadata } from "next";
import { site, absoluteUrl } from "@/lib/site";
import { Container, Eyebrow, SectionHeading } from "@/components/Section";
import Button from "@/components/Button";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export const metadata: Metadata = {
  title: `Contact Nick Brand Photography | Sydney Photographer`,
  description:
    "Get in touch with Nick Brand Photography. Studio at 84 Centennial Avenue, Lane Cove NSW. Call 0403 835 467, email info@nickbrandphotography.com, or book a session online.",
  alternates: { canonical: absoluteUrl("/contact") },
};

const fullAddress = `${site.address.street}, ${site.address.suburb} ${site.address.state} ${site.address.postcode}`;
const mapsQuery = encodeURIComponent(`${site.name}, ${fullAddress}`);
const mapEmbedUrl = `https://maps.google.com/maps?q=${mapsQuery}&z=15&output=embed`;
const mapsLinkUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

const methods = [
  {
    label: "Call or text",
    value: site.phone,
    href: `tel:${site.phoneIntl}`,
    note: "The fastest way to reach Nick about a shoot.",
  },
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    note: "Send a brief and Nick will reply with options and a quote.",
  },
  {
    label: "Book online",
    value: "Check live availability",
    href: "/book",
    note: "See open times and reserve your session instantly.",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <Breadcrumbs crumbs={crumbs} />

      {/* Hero */}
      <section className="border-b border-border bg-ink-2">
        <Container className="py-16 text-center lg:py-20">
          <div className="flex justify-center">
            <Eyebrow>Get In Touch</Eyebrow>
          </div>
          <h1 className="font-display mx-auto mt-6 max-w-3xl text-[2.5rem] leading-[1.08] text-cream sm:text-5xl lg:text-[3.4rem]">
            Contact Nick Brand Photography
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-muted">
            Planning headshots, personal branding or a team shoot? Get in
            touch and Nick will help you choose the right session. Studio in
            Lane Cove, working across all of Sydney.
          </p>
        </Container>
      </section>

      {/* Contact methods */}
      <section className="section bg-ink">
        <Container>
          <SectionHeading
            eyebrow="Reach Out"
            title="Three easy ways to get started"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {methods.map((m) => (
              <a
                key={m.label}
                href={m.href}
                target={m.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  m.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="group flex flex-col border border-border bg-surface p-7 transition-colors hover:border-gold"
              >
                <span className="text-xs uppercase tracking-[0.18em] text-gold">
                  {m.label}
                </span>
                <span className="font-display mt-3 text-xl text-cream group-hover:text-gold">
                  {m.value}
                </span>
                <span className="mt-2 text-sm leading-relaxed text-muted">
                  {m.note}
                </span>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* Enquiry form */}
      <section className="section bg-ink-2">
        <Container className="grid items-start gap-12 lg:grid-cols-[1fr_1.25fr]">
          <div className="lg:sticky lg:top-28">
            <Eyebrow>Send a Message</Eyebrow>
            <h2 className="font-display mt-5 text-3xl text-cream sm:text-4xl">
              Tell Nick about your shoot
            </h2>
            <p className="mt-5 text-[1.02rem] leading-relaxed text-muted">
              Fill in a few details and Nick will reply with the right session,
              honest advice and a clear quote — usually within a business day.
              There&apos;s no obligation, and no hard sell.
            </p>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-muted">
              Not sure what you need? That&apos;s fine — describe what it&apos;s
              for and Nick will point you in the right direction.
            </p>
          </div>
          <ContactForm />
        </Container>
      </section>

      {/* Studio details + map */}
      <section className="section bg-ink">


        <Container className="grid items-stretch gap-12 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <Eyebrow>The Studio</Eyebrow>
            <h2 className="font-display mt-5 text-3xl text-cream sm:text-4xl">
              Visit the Lane Cove studio
            </h2>
            <p className="mt-5 text-[1.02rem] leading-relaxed text-muted">
              The studio is a relaxed, private space on Sydney's Lower North
              Shore — easy to reach from the CBD, North Sydney and Chatswood,
              with parking close by. Prefer not to travel? Nick brings a full
              mobile studio to your office for team and on-site shoots.
            </p>

            <dl className="mt-8 space-y-5 border-t border-border pt-8">
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-gold">
                  Address
                </dt>
                <dd className="mt-1 text-[1.02rem] text-cream">
                  {site.address.street}
                  <br />
                  {site.address.suburb} {site.address.state}{" "}
                  {site.address.postcode}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-gold">
                  Hours
                </dt>
                <dd className="mt-1 text-[1.02rem] text-cream">
                  {site.hours}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-gold">
                  Service area
                </dt>
                <dd className="mt-1 text-[1.02rem] text-cream">
                  {site.serviceArea} — on-site shoots anywhere across Sydney
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={site.bookingUrl}>Book a Session</Button>
              <Button
                href={mapsLinkUrl}
                variant="outline"
              >
                Get Directions
              </Button>
            </div>
          </div>

          <div className="min-h-[360px] border border-border bg-surface">
            <iframe
              src={mapEmbedUrl}
              title={`Map to ${site.name}, ${fullAddress}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[360px] w-full"
            />
          </div>
        </Container>
      </section>

      <CTASection
        title="Ready when you are"
        text="Whether it's a single headshot or a full team day, getting started is quick. Check availability or send Nick a message — he'll take care of the rest."
      />
    </>
  );
}

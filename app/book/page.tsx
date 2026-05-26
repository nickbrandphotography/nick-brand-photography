import type { Metadata } from "next";
import { site, absoluteUrl } from "@/lib/site";
import { Container, Eyebrow, SectionHeading } from "@/components/Section";
import Button from "@/components/Button";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrustStats from "@/components/TrustStats";
import FAQ from "@/components/FAQ";
import JsonLd from "@/components/JsonLd";
import BookingFlow from "@/components/BookingFlow";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Book a Session", path: "/book" },
];

export const metadata: Metadata = {
  title: `Book a Photography Session in Sydney | ${site.name}`,
  description:
    "Book your corporate headshot, personal branding or team photography session with Nick Brand Photography. Check live availability and reserve your shoot online in under a minute.",
  alternates: { canonical: absoluteUrl("/book") },
};

const steps = [
  {
    n: "01",
    title: "Pick a time",
    text: "Choose a slot that suits you from Nick's live calendar below. Availability updates in real time, so what you see is what you get.",
  },
  {
    n: "02",
    title: "Tell Nick about the shoot",
    text: "Let Nick know the type of session — headshots, personal branding, a team day — and anything specific you have in mind. He'll be in touch to confirm the details.",
  },
  {
    n: "03",
    title: "Show up and relax",
    text: "Come to the Lane Cove studio, or have Nick bring a mobile studio to your office. Honest direction means you don't need to know how to pose.",
  },
];

const bookingFaqs = [
  {
    q: "How far in advance should I book?",
    a: "Individual headshot and personal branding sessions can often be booked within the same week. Team headshot days and corporate event coverage are best booked two to three weeks ahead so the date and crew can be locked in.",
  },
  {
    q: "What happens after I book online?",
    a: "You'll receive an instant confirmation, and Nick will follow up to confirm the shoot details — location, number of people, wardrobe and the look you're after. Nothing is left to guesswork on the day.",
  },
  {
    q: "Can you photograph our team at our own office?",
    a: "Yes. On-site days run across Greater Sydney with a full mobile studio set up in your workplace, so staff are photographed consistently with minimal disruption to the working day.",
  },
  {
    q: "What if I need to reschedule?",
    a: "Plans change — just let Nick know as early as you can and the session will be moved to a new time. You can reschedule directly from your booking confirmation email.",
  },
  {
    q: "Do you prefer a quick chat before booking?",
    a: `Absolutely. If you'd rather talk through your shoot first, call ${site.phone} or email ${site.email} and Nick will help you choose the right session before you reserve a time.`,
  },
];

export default function BookPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), faqSchema(bookingFaqs)]} />

      <Breadcrumbs crumbs={crumbs} />

      {/* Hero */}
      <section className="border-b border-border bg-ink-2">
        <Container className="py-16 text-center lg:py-20">
          <div className="flex justify-center">
            <Eyebrow>Book a Session</Eyebrow>
          </div>
          <h1 className="font-display mx-auto mt-6 max-w-3xl text-[2.5rem] leading-[1.08] text-cream sm:text-5xl lg:text-[3.4rem]">
            Reserve your Sydney photography session
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-muted">
            Check live availability and secure your shoot in under a minute.
            Studio in Lane Cove — or on-site at your office, anywhere across
            Sydney.
          </p>
        </Container>
      </section>

      {/* Trust stats */}
      <section className="bg-ink">
        <Container className="py-12">
          <TrustStats />
        </Container>
      </section>

      {/* How booking works */}
      <section className="section bg-ink-2">
        <Container>
          <SectionHeading
            eyebrow="How It Works"
            title="Booking takes about a minute"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.n}
                className="flex flex-col border border-border bg-surface p-7"
              >
                <span className="font-display text-3xl text-gold">{s.n}</span>
                <h3 className="font-display mt-3 text-xl text-cream">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Custom booking flow */}
      <section className="section bg-ink" id="book">
        <Container>
          <SectionHeading
            eyebrow="Live Availability"
            title="Choose a time that suits you"
            lead="Pick a session and reserve your slot in under a minute. Availability is live — every time shown is genuinely open."
          />
          <div className="mt-10">
            <BookingFlow />
          </div>
          <p className="mt-6 text-center text-sm text-faint">
            Prefer to talk it through first? Call{" "}
            <a
              href={`tel:${site.phoneIntl}`}
              className="text-gold transition-colors hover:text-gold-soft"
            >
              {site.phone}
            </a>
            .
          </p>
        </Container>
      </section>

      {/* Prefer to talk first */}
      <section className="bg-ink-2">
        <Container className="py-14">
          <div className="border border-gold/40 bg-surface px-8 py-12 text-center sm:px-14">
            <span className="rule-gold mx-auto" />
            <h2 className="font-display mt-6 text-2xl text-cream sm:text-3xl">
              Prefer to talk it through first?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[0.97rem] leading-relaxed text-muted">
              Not sure which session is right, or organising a shoot for a
              larger team? Have a quick chat with Nick before you book.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href={`tel:${site.phoneIntl}`} variant="gold">
                Call {site.phone}
              </Button>
              <Button href={`mailto:${site.email}`} variant="outline">
                Email Nick
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <FAQ
        faqs={bookingFaqs}
        eyebrow="Booking Questions"
        title="Before you book"
      />
    </>
  );
}

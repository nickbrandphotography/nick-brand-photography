import { site } from "@/lib/site";
import { bookingHref } from "@/lib/booking";
import Button from "./Button";
import { Container } from "./Section";

/** Booking-focused call-to-action band. Used near the end of every page. */
export default function CTASection({
  title = "Ready to book your session?",
  text = "Check live availability and secure your shoot in under a minute. Studio in Lane Cove or on-site anywhere across Sydney.",
  sessionId,
}: {
  title?: string;
  text?: string;
  /**
   * Session to preselect — service pages pass their own so the client lands on
   * the session they were reading about. Omit on general pages.
   */
  sessionId?: string;
}) {
  return (
    <section className="section bg-ink-2">
      <Container>
        <div className="border border-gold/40 bg-surface px-8 py-14 text-center sm:px-14">
          <span className="rule-gold mx-auto" />
          <h2 className="font-display mt-6 text-3xl text-cream sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[0.97rem] leading-relaxed text-muted">
            {text}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={bookingHref(sessionId)} variant="gold">
              Check Availability
            </Button>
            <Button href={`tel:${site.phoneIntl}`} variant="outline">
              Call {site.phone}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

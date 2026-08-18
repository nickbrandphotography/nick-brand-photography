import Link from "next/link";
import { getTiers } from "@/lib/pricing";
import { bookingHref } from "@/lib/booking";
import { Container, SectionHeading } from "./Section";

/**
 * Pricing cards for a service page.
 *
 * Takes the exact sessions the page offers, NOT a pricing group. Rendering a
 * whole group is what put actor and band tiers on the family page and family
 * tiers on the actor page — every page now lists its own service only.
 */
export default function PricingCards({
  sessionIds,
  eyebrow = "Pricing",
  title = "Pricing",
  lead,
}: {
  /** Session type ids, in display order — see pricingSessionIds in lib/services.ts. */
  sessionIds: string[];
  eyebrow?: string;
  title?: string;
  lead?: string;
}) {
  const tiers = getTiers(sessionIds);
  if (tiers.length === 0) return null;

  // The grid tracks the number of tiers, so a single-session page gets one
  // properly-sized card instead of a lonely third of a row.
  const gridClass =
    tiers.length === 1
      ? "mx-auto max-w-md"
      : tiers.length === 2
        ? "sm:grid-cols-2 mx-auto max-w-3xl"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="section bg-ink-2">
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          lead={
            lead ??
            "Transparent pricing. Every session includes professional editing and a private online gallery."
          }
        />

        <div className={`mt-12 grid gap-6 ${gridClass}`}>
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col border p-8 ${
                tier.highlight
                  ? "border-gold bg-surface-2"
                  : "border-border bg-surface"
              }`}
            >
              {tier.badge ? (
                <span className="mb-4 self-start bg-gold px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ink">
                  {tier.badge}
                </span>
              ) : (
                <span className="mb-4 h-[1.55rem]" aria-hidden />
              )}

              <h3 className="font-display text-2xl text-cream">{tier.name}</h3>

              <p className="mt-3 flex items-start gap-1">
                <span className="mt-1 text-base text-gold">$</span>
                <span className="font-display text-5xl leading-none text-gold">
                  {tier.price.replace("$", "")}
                </span>
              </p>
              <p className="mt-2 text-xs uppercase tracking-wider text-faint">
                {tier.unit}
              </p>

              <ul className="mt-6 space-y-3 border-t border-border pt-6">
                {tier.features.map((feat) => (
                  <li key={feat} className="flex gap-3 text-sm text-muted">
                    <span className="text-gold" aria-hidden>
                      ✓
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={bookingHref(tier.sessionTypeId)}
                className={`mt-8 inline-flex items-center justify-center px-6 py-3.5 text-[0.74rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
                  tier.highlight
                    ? "bg-gold text-ink hover:bg-gold-soft"
                    : "border border-border-strong text-cream hover:border-gold hover:text-gold"
                }`}
              >
                {tier.ctaLabel}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-faint">
          Prices in AUD. Custom and ongoing-retainer arrangements are available
          on enquiry.
        </p>
      </Container>
    </section>
  );
}

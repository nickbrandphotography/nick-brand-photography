import Link from "next/link";
import { pricingGroups } from "@/lib/pricing";
import { site } from "@/lib/site";
import { Container, SectionHeading } from "./Section";

/** Three-column pricing cards for a service line. */
export default function PricingCards({
  groupKey,
  eyebrow = "Pricing",
  title,
  lead,
}: {
  groupKey: "corporate" | "branding" | "portrait";
  eyebrow?: string;
  title?: string;
  lead?: string;
}) {
  const group = pricingGroups[groupKey];

  return (
    <section className="section bg-ink-2">
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title ?? group.label}
          lead={
            lead ??
            "Transparent pricing. Every session includes professional editing and a private online gallery."
          }
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {group.tiers.map((tier) => (
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

              <h3 className="font-display text-2xl text-cream">
                {tier.name}
              </h3>

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
                  <li
                    key={feat}
                    className="flex gap-3 text-sm text-muted"
                  >
                    <span className="text-gold" aria-hidden>
                      ✓
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={site.bookingUrl}
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

import { testimonials } from "@/lib/testimonials";
import { site } from "@/lib/site";
import { Container, SectionHeading } from "./Section";

function Stars() {
  return (
    <div className="flex gap-0.5 text-gold" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} aria-hidden>
          ★
        </span>
      ))}
    </div>
  );
}

/** Client testimonials sourced from Google reviews. */
export default function Testimonials({
  limit = 3,
}: {
  limit?: number;
}) {
  const items = testimonials.slice(0, limit);

  return (
    <section className="section bg-ink">
      <Container>
        <SectionHeading
          eyebrow="Client Reviews"
          title="Rated 5 stars by Sydney clients"
          lead="A consistent five-star rating on Google from corporate, headshot and portrait clients across Sydney."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col border border-border bg-surface p-7"
            >
              <Stars />
              <blockquote className="mt-4 grow text-[0.96rem] leading-relaxed text-cream">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <span className="block text-sm font-medium text-cream">
                  {t.name}
                </span>
                <span className="text-xs text-faint">
                  {t.context ? `${t.context} · ` : ""}Google review
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {site.social.google ? (
          <div className="mt-10 text-center">
            <a
              href={site.social.google}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-gold transition-colors hover:text-gold-soft"
            >
              Read all reviews on Google →
            </a>
          </div>
        ) : null}
      </Container>
    </section>
  );
}

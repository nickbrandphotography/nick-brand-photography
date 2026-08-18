import type { FAQ as FAQItem } from "@/lib/services";
import { Container, SectionHeading } from "./Section";

/**
 * Accessible FAQ accordion.
 *
 * IMPORTANT — every answer is rendered into the HTML on every request.
 *
 * This used to be a client component that rendered `{isOpen ? <p>{f.a}</p> : null}`,
 * which meant only the currently-open answer existed in the DOM at all. Every
 * other answer was missing from the server-rendered HTML entirely — not hidden,
 * absent — so Googlebot, GPTBot, ClaudeBot and PerplexityBot never saw roughly
 * 80% of the best answer copy on the site, including every "How much does X cost
 * in Sydney?" answer. It also put the FAQPage structured data at odds with
 * Google's requirement that FAQ content be visible on the page.
 *
 * Native <details>/<summary> fixes all of that: the text is always in the
 * document, it is expandable without JavaScript, and it is accessible by
 * default. Do not reintroduce conditional rendering of `f.a`.
 *
 * (components/Testimonials.tsx already followed this principle for reviews.)
 */
export default function FAQ({
  faqs,
  eyebrow = "Questions",
  title = "Frequently asked questions",
  id,
}: {
  faqs: FAQItem[];
  eyebrow?: string;
  title?: string;
  id?: string;
}) {
  if (!faqs.length) return null;

  return (
    <section className="section bg-ink" id={id}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className="mt-10 divide-y divide-border border-y border-border">
          {faqs.map((f, i) => (
            <details key={f.q} className="group" open={i === 0}>
              <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-6 py-5 text-left marker:hidden [&::-webkit-details-marker]:hidden">
                <span className="text-[1.02rem] text-cream">{f.q}</span>
                <span
                  className="shrink-0 text-xl text-gold transition-transform duration-200 group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="pb-6 pr-10 text-[0.95rem] leading-relaxed text-muted">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

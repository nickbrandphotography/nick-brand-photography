"use client";

import { useEffect, useRef, useState } from "react";
import { testimonials, aggregateRating } from "@/lib/testimonials";
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

/**
 * Client testimonials sourced from Google reviews.
 *
 * The visible cards rotate through the full review set so different pages —
 * and repeat visits — surface different quotes, rather than the same three
 * everywhere. Every review is also rendered in a visually-hidden list so the
 * full text is always present in the HTML for crawlers, regardless of which
 * window is showing. Auto-rotation pauses on hover/focus and is disabled for
 * visitors who prefer reduced motion.
 */
export default function Testimonials({
  limit = 3,
  // Was 6s, which moved a quote out from under someone mid-sentence.
  intervalMs = 11000,
}: {
  limit?: number;
  intervalMs?: number;
}) {
  const total = testimonials.length;
  const windowSize = Math.min(limit, total);
  const canRotate = total > windowSize;

  const [start, setStart] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    if (!canRotate || paused || reduceMotion.current) return;
    const id = setInterval(
      () => setStart((s) => (s + 1) % total),
      intervalMs,
    );
    return () => clearInterval(id);
  }, [canRotate, paused, intervalMs, total]);

  const visible = Array.from(
    { length: windowSize },
    (_, k) => testimonials[(start + k) % total],
  );

  return (
    <section
      className="section bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Container>
        <SectionHeading
          eyebrow="Client Reviews"
          title="Rated 5 stars by Sydney clients"
          lead={`A consistent ${aggregateRating.ratingValue} rating across ${aggregateRating.reviewCount} five-star Google reviews from corporate, headshot and portrait clients across Sydney.`}
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3" aria-live="polite">
          {visible.map((t) => (
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

        {canRotate ? (
          <div
            className="mt-8 flex justify-center gap-2"
            role="group"
            aria-label="Choose which reviews to show"
          >
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setStart(i)}
                aria-label={`Show reviews starting with ${t.name}`}
                aria-current={i === start}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === start ? "bg-gold" : "bg-border hover:bg-muted"
                }`}
              />
            ))}
          </div>
        ) : null}

        {/* Full review text, always in the DOM for search engines. */}
        <ul className="sr-only">
          {testimonials.map((t) => (
            <li key={t.name}>
              &ldquo;{t.quote}&rdquo; — {t.name}, five-star Google review
            </li>
          ))}
        </ul>

        {site.social.google ? (
          <div className="mt-10 text-center">
            <a
              href={site.social.google}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-gold transition-colors hover:text-gold-soft"
            >
              Read all {aggregateRating.reviewCount} reviews on Google →
            </a>
          </div>
        ) : null}
      </Container>
    </section>
  );
}

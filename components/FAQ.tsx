"use client";

import { useState } from "react";
import type { FAQ as FAQItem } from "@/lib/services";
import { Container, SectionHeading } from "./Section";

/** Accessible FAQ accordion. FAQPage schema is rendered separately by pages. */
export default function FAQ({
  faqs,
  eyebrow = "Questions",
  title = "Frequently asked questions",
}: {
  faqs: FAQItem[];
  eyebrow?: string;
  title?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section bg-ink">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className="mt-10 divide-y divide-border border-y border-border">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="text-[1.02rem] text-cream">{f.q}</span>
                  <span
                    className={`shrink-0 text-xl text-gold transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                {isOpen ? (
                  <p className="pb-6 pr-10 text-[0.95rem] leading-relaxed text-muted">
                    {f.a}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { mainNav, site } from "@/lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-ink/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="font-display text-lg tracking-wide text-cream"
          onClick={() => setOpen(false)}
        >
          Nick Brand
          <span className="text-gold"> Photography</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.82rem] tracking-wide text-muted transition-colors hover:text-cream"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="bg-gold px-5 py-2.5 text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-gold-soft"
          >
            Book Now
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span
            className={`h-px w-6 bg-cream transition-transform ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-cream transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-cream transition-transform ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {open ? (
        <nav className="border-t border-border bg-ink-2 lg:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col px-5 py-3 sm:px-8">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3 text-sm text-muted transition-colors hover:text-cream"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="mt-4 mb-2 bg-gold px-5 py-3 text-center text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-ink"
            >
              Book Now
            </Link>
            <a
              href={`tel:${site.phoneIntl}`}
              className="py-3 text-center text-sm text-gold"
            >
              {site.phone}
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
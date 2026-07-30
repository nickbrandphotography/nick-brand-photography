"use client";

import { useState } from "react";
import Link from "next/link";
import { mainNav, site } from "@/lib/site";
import { services } from "@/lib/services";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const closeAll = () => {
    setOpen(false);
    setServicesOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-ink/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="shrink-0 whitespace-nowrap font-display text-lg tracking-wide text-cream"
          onClick={closeAll}
        >
          Nick Brand
          <span className="text-gold"> Photography</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {/* Services dropdown — keeps the 8 service pages out of the
              top-level bar, which is what was overflowing the header. */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setServicesOpen((v) => !v)}
              aria-expanded={servicesOpen}
              className="flex items-center gap-1 whitespace-nowrap text-[0.82rem] tracking-wide text-muted transition-colors hover:text-cream"
            >
              Services
              <span
                className={`text-[0.6rem] transition-transform ${servicesOpen ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>

            {servicesOpen && (
              <div className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3">
                <div className="grid gap-1 border border-border bg-ink-2 p-3 shadow-xl">
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/${s.slug}`}
                      onClick={() => setServicesOpen(false)}
                      className="px-3 py-2 text-[0.82rem] text-muted transition-colors hover:bg-surface hover:text-cream"
                    >
                      {s.navLabel}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-[0.82rem] tracking-wide text-muted transition-colors hover:text-cream"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="whitespace-nowrap bg-gold px-5 py-2.5 text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-gold-soft"
          >
            Book Now
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-1.5 lg:hidden"
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
            <button
              type="button"
              onClick={() => setMobileServicesOpen((v) => !v)}
              aria-expanded={mobileServicesOpen}
              className="flex items-center justify-between border-b border-border py-3 text-left text-sm text-muted transition-colors hover:text-cream"
            >
              Services
              <span
                className={`text-[0.65rem] transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>
            {mobileServicesOpen && (
              <div className="flex flex-col border-b border-border bg-ink pl-4">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/${s.slug}`}
                    onClick={() => setOpen(false)}
                    className="py-2.5 text-sm text-muted transition-colors hover:text-cream"
                  >
                    {s.navLabel}
                  </Link>
                ))}
              </div>
            )}

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

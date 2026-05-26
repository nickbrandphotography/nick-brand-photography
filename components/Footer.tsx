"use client";

import Link from "next/link";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { locations } from "@/lib/locations";
import { Container } from "./Section";

/** Site footer with contact details, full service/location links and business info. */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-ink-2">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand + contact */}
          <div>
            <p className="font-display text-xl text-cream">
              Nick Brand <span className="text-gold">Photography</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Sydney corporate headshot &amp; personal branding photographer.
              Studio in Lane Cove, on-site across Greater Sydney.
            </p>
            <address className="mt-6 space-y-1.5 text-sm not-italic text-muted">
              <p>
                {site.address.street}, {site.address.suburb}{" "}
                {site.address.state} {site.address.postcode}
              </p>
              <p>
                <a
                  href={`tel:${site.phoneIntl}`}
                  className="transition-colors hover:text-gold"
                >
                  {site.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-gold"
                >
                  {site.email}
                </a>
              </p>
              <p>Open {site.hours}</p>
            </address>
          </div>

          {/* Services nav — all service silos */}
          <div>
            <p className="eyebrow">Services</p>
            <ul className="mt-5 space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/${s.slug}`}
                    className="text-sm text-muted transition-colors hover:text-cream"
                  >
                    {s.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas served — a sample; the /locations hub links every suburb. */}
          <div>
            <p className="eyebrow">Areas We Serve</p>
            <ul className="mt-5 space-y-2.5">
              {locations.slice(0, 6).map((l) => (
                <li key={l.slug}>
                  <Link
                    href={`/locations/${l.slug}`}
                    className="text-sm text-muted transition-colors hover:text-cream"
                  >
                    {l.suburb}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/locations"
                  className="text-sm text-gold transition-colors hover:text-gold-soft"
                >
                  All Sydney locations →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company / connect */}
          <div>
            <p className="eyebrow">Company</p>
            <ul className="mt-5 space-y-2.5">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted transition-colors hover:text-cream"
                >
                  About Nick
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted transition-colors hover:text-cream"
                >
                  Tips &amp; Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/book"
                  className="text-sm text-muted transition-colors hover:text-cream"
                >
                  Book a Session
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted transition-colors hover:text-cream"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition-colors hover:text-cream"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition-colors hover:text-cream"
                >
                  LinkedIn
                </a>
              </li>
              {site.social.google ? (
                <li>
                  <a
                    href={site.social.google}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted transition-colors hover:text-cream"
                  >
                    Google Reviews
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-border pt-6 text-xs text-faint sm:flex-row sm:justify-between">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <p>Corporate &amp; personal branding photography — Sydney, Australia.</p>
        </div>
      </Container>
    </
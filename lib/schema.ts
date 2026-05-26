/**
 * Structured data (JSON-LD) builders.
 * Returns plain objects; render them with the <JsonLd> component, which
 * stringifies and escapes them safely.
 */

import { site, absoluteUrl } from "./site";
import { testimonials, aggregateRating } from "./testimonials";
import type { FAQ, Service } from "./services";
import { pricingGroups } from "./pricing";

const ORG_ID = `${site.url}/#business`;
const PERSON_ID = `${site.url}/#nick`;

/** LocalBusiness / ProfessionalService — the core entity for the whole site. */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": ORG_ID,
    name: site.name,
    description: site.description,
    url: site.url,
    image: absoluteUrl("/images/about/nick-brand-photographer-sydney.jpg"),
    telephone: site.phoneIntl,
    email: site.email,
    priceRange: "$$$",
    founder: { "@id": PERSON_ID },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.suburb,
      addressRegion: site.address.state,
      postalCode: site.address.postcode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    areaServed: { "@type": "City", name: "Sydney" },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "07:00",
      closes: "19:00",
    },
    sameAs: [
      site.social.instagram,
      site.social.linkedin,
      site.social.google,
    ].filter(Boolean),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: aggregateRating.bestRating,
    },
    review: testimonials.map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.name },
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating,
        bestRating: 5,
      },
      reviewBody: t.quote,
    })),
  };
}

/** Person schema for Nick Brand. */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: site.founder,
    jobTitle: "Photographer",
    description:
      "Sydney-based commercial and portrait photographer with over 20 years of experience.",
    image: absoluteUrl("/images/about/nick-brand-photographer-sydney.jpg"),
    worksFor: { "@id": ORG_ID },
    url: absoluteUrl("/about"),
    sameAs: [site.social.instagram, site.social.linkedin].filter(Boolean),
  };
}

/** A Service entity, linked to the business. */
export function serviceSchema(service: Service) {
  const base = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.h1,
    description: service.metaDescription,
    serviceType: service.navLabel,
    url: absoluteUrl(`/${service.slug}`),
    areaServed: { "@type": "City", name: "Sydney" },
    provider: { "@id": ORG_ID },
  };

  // When the service has published pricing, expose it as an OfferCatalog so
  // search engines and AI answer engines can quote accurate "from" prices.
  const group = service.pricingGroupKey
    ? pricingGroups[service.pricingGroupKey]
    : undefined;
  if (!group) return base;

  return {
    ...base,
    offers: group.tiers.map((tier) => ({
      "@type": "Offer",
      name: tier.name,
      price: tier.priceValue,
      priceCurrency: "AUD",
      url: absoluteUrl(`/${service.slug}`),
      availability: "https://schema.org/InStock",
      seller: { "@id": ORG_ID },
    })),
  };
}

/** FAQPage schema from a list of FAQs. */
export function faqSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** BreadcrumbList schema. Pass [{name, path}] from home to current page. */
export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/** WebSite schema — helps establish the entity for search and AI. */
export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    publisher: { "@id": ORG_ID },
  };
}

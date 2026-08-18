/**
 * Structured data (JSON-LD) builders.
 * Returns plain objects; render them with the <JsonLd> component, which
 * stringifies and escapes them safely.
 */

import { site, absoluteUrl } from "./site";
import { testimonials, aggregateRating } from "./testimonials";
import type { FAQ, Service } from "./services";
import { services } from "./services";
import { locations } from "./locations";
import { getTiers, pricingGroups } from "./pricing";

const ORG_ID = `${site.url}/#business`;
const PERSON_ID = `${site.url}/#nick`;

/** Real min/max across every published tier, so priceRange isn't a vague "$$$". */
function priceRange(): string {
  const all = Object.values(pricingGroups).flatMap((g) =>
    g.tiers.map((t) => t.priceValue),
  );
  return `$${Math.min(...all)}-$${Math.max(...all)}`;
}

/**
 * Where Nick actually works. A single {"@type":"City","name":"Sydney"} was the
 * thinnest possible expression of a Greater Sydney service area — this names the
 * suburbs that have their own landing pages plus a radius around the studio.
 */
function areaServed() {
  return [
    { "@type": "City", name: "Sydney", address: { "@type": "PostalAddress", addressRegion: "NSW", addressCountry: "AU" } },
    {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: site.geo.lat,
        longitude: site.geo.lng,
      },
      geoRadius: "50000",
    },
    ...locations.map((l) => ({
      "@type": "Place" as const,
      name: `${l.suburb}, NSW`,
    })),
  ];
}

/** LocalBusiness / ProfessionalService — the core entity for the whole site. */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": ORG_ID,
    name: site.name,
    alternateName: site.shortName,
    description: site.description,
    slogan: site.tagline,
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/images/og/logo.png"),
    },
    image: [
      absoluteUrl("/images/about/nick-brand-photographer-sydney.jpg"),
      absoluteUrl("/images/corporate-headshots/corporate-headshot-sydney-02.jpg"),
      absoluteUrl("/images/personal-branding/personal-branding-photography-sydney-01.jpg"),
    ],
    telephone: site.phoneIntl,
    email: site.email,
    priceRange: priceRange(),
    currenciesAccepted: "AUD",
    hasMap: site.social.google,
    founder: { "@id": PERSON_ID },
    employee: { "@id": PERSON_ID },
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
    areaServed: areaServed(),
    // Topic association — what this business is actually expert in.
    knowsAbout: [
      "Corporate headshot photography",
      "Personal branding photography",
      "Executive portrait photography",
      "On-site team and office headshots",
      "LinkedIn profile photography",
      "Actor headshots and model portfolios",
      "Corporate event photography",
    ],
    // Ties the nine standalone Service nodes together as one catalogue.
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Photography services in Sydney",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.h1,
          url: absoluteUrl(`/${s.slug}`),
        },
      })),
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "07:00",
      closes: "19:00",
    },
    sameAs: [
      site.social.instagram,
      site.social.linkedin,
      site.social.google,
    ].filter(Boolean),
    /**
     * Honest, real Google reviews. Note that Google has treated self-serving
     * reviews — reviews about the entity, published by the entity — as
     * ineligible for review rich results since 2019, so this will not produce
     * stars in the SERP. It stays because it is accurate and because it helps
     * answer engines understand the business. Do not spend time optimising it,
     * and never inflate reviewCount.
     */
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
      "Sydney-based commercial and portrait photographer with over 20 years of experience, specialising in corporate headshots, executive portraits and personal branding photography.",
    image: absoluteUrl("/images/about/nick-brand-photographer-sydney.jpg"),
    worksFor: { "@id": ORG_ID },
    url: absoluteUrl("/about"),
    knowsAbout: [
      "Corporate headshot photography",
      "Personal branding photography",
      "Executive portraiture",
      "Studio lighting",
      "On-location portrait photography",
    ],
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
    // Just the city here. The full suburb list lives on the LocalBusiness node,
    // which is now emitted sitewide from app/layout.tsx — repeating fourteen
    // Place entries per Service node only bloats the payload on every page.
    areaServed: { "@type": "City", name: "Sydney" },
    provider: { "@id": ORG_ID },
  };

  // When the service has published pricing, expose it as an OfferCatalog so
  // search engines and AI answer engines can quote accurate "from" prices.
  // Offers must mirror the tiers actually shown on the page — a family page
  // that advertised actor and band offers to search engines was wrong twice
  // over, in the markup and on screen.
  const tiers = service.pricingSessionIds
    ? getTiers(service.pricingSessionIds)
    : [];
  if (tiers.length === 0) return base;

  return {
    ...base,
    offers: tiers.map((tier) => ({
      "@type": "Offer",
      name: tier.name,
      price: tier.priceValue,
      priceCurrency: "AUD",
      url: absoluteUrl(`/${service.slug}`),
      availability: "https://schema.org/InStock",
      seller: { "@id": ORG_ID },
      // Not GST-registered, so the advertised price is the final price.
      priceSpecification: {
        "@type": "PriceSpecification",
        price: tier.priceValue,
        priceCurrency: "AUD",
        valueAddedTaxIncluded: false,
      },
    })),
  };
}

/**
 * Service schema for a suburb landing page.
 *
 * The 12 location pages previously carried no service, business or place markup
 * at all — structurally they were FAQ pages that happened to mention a suburb,
 * which is the opposite of what a local landing page should look like.
 */
export function locationServiceSchema(suburb: string, slug: string) {
  const tiers = getTiers([
    "headshot-essential",
    "headshot-professional",
    "team-quote",
  ]);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Corporate headshot photography in ${suburb}`,
    description: `Corporate headshots, LinkedIn portraits and on-site team headshot days for businesses in ${suburb}, Sydney, by Nick Brand Photography.`,
    serviceType: "Corporate headshot photography",
    url: absoluteUrl(`/locations/${slug}`),
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Place", name: `${suburb}, NSW, Australia` },
    offers: tiers.map((tier) => ({
      "@type": "Offer",
      name: tier.name,
      price: tier.priceValue,
      priceCurrency: "AUD",
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

/**
 * ImageObject schema for a hero/portfolio photograph. Links the image to
 * Nick (creator) and the business (copyright holder) so Google Images and AI
 * answer engines can attribute the work correctly.
 * Pass a site-relative path (e.g. "/images/corporate-headshots/...webp").
 */
export function imageObjectSchema(path: string, caption: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: absoluteUrl(path),
    url: absoluteUrl(path),
    caption,
    creditText: site.name,
    // creator must be a self-contained Person/Organization object: the
    // ImageObject often renders in its own JSON-LD block where a bare
    // { "@id": … } reference can't resolve, which Google's Image Metadata
    // validator reports as "Invalid object type for field creator".
    creator: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: site.founder,
    },
    copyrightNotice: `© ${site.name}`,
    copyrightHolder: { "@id": ORG_ID },
    // Licensing fields enable the Google Images "Licensable" badge.
    license: absoluteUrl("/image-licensing"),
    acquireLicensePage: absoluteUrl("/image-licensing"),
  };
}

/**
 * A gallery of ImageObjects. Previously only hero images carried ImageObject
 * markup, so the Licensable-badge eligibility applied to roughly 30 of the 132
 * photographs on the site.
 */
export function imageGallerySchema(
  images: { src: string; alt: string }[],
  name: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name,
    associatedMedia: images.map((img) => ({
      "@type": "ImageObject",
      contentUrl: absoluteUrl(img.src),
      caption: img.alt,
      creditText: site.name,
      creator: { "@type": "Person", "@id": PERSON_ID, name: site.founder },
      copyrightNotice: `© ${site.name}`,
      license: absoluteUrl("/image-licensing"),
      acquireLicensePage: absoluteUrl("/image-licensing"),
    })),
  };
}

/** WebSite schema — helps establish the entity for search and AI. */
export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    inLanguage: "en-AU",
    publisher: { "@id": ORG_ID },
  };
}

/** Organization reference for article publishers etc. */
export const orgRef = { "@id": ORG_ID };

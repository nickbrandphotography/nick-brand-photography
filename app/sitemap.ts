import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { services } from "@/lib/services";
import { posts } from "@/lib/posts";
import { locations } from "@/lib/locations";
import { serviceGalleries, locationGalleries } from "@/lib/galleries";
import { getImage, pickImages } from "@/lib/images";

/**
 * XML sitemap covering every indexable route — home, service silos, blog
 * index and posts, suburb pages and conversion pages.
 */
/**
 * Date the site's core (non-blog) content was last meaningfully updated.
 * Using a stable real date — rather than `new Date()` at build time — keeps
 * lastmod honest: it no longer changes on every deploy or reads as identical
 * build timestamps, which search engines learn to ignore.
 *
 * BUMP THIS when you make substantive content changes to service, location or
 * static pages. It sat at 2026-06-25 for nearly two months while the site was
 * being worked on, which told search engines the opposite of the truth.
 * Blog posts carry their own publish dates automatically.
 */
const CONTENT_UPDATED = new Date("2026-08-18");

/** Absolute image URLs for a route, for <image:image> entries. */
function imagesFor(paths: string[]): string[] {
  return paths.map((p) => absoluteUrl(p));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = CONTENT_UPDATED;

  const home: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((s) => {
    const curated = serviceGalleries[s.slug];
    const gallery = curated ? pickImages(curated) : [];
    const hero = getImage(s.heroSilo, s.heroIndex);
    return {
      url: absoluteUrl(`/${s.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      // 132 photographs on a photography site, none of which were previously
      // submitted to Google Images.
      images: imagesFor([hero.src, ...gallery.slice(0, 8).map((g) => g.src)]),
    };
  });

  const pricingPage: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/corporate-headshot-pricing-sydney"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  const locationsIndex: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/locations"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const locationPages: MetadataRoute.Sitemap = locations.map((l) => {
    const gallery = locationGalleries[l.slug]
      ? pickImages(locationGalleries[l.slug])
      : [];
    return {
      url: absoluteUrl(`/locations/${l.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: imagesFor(gallery.slice(0, 6).map((g) => g.src)),
    };
  });

  const blogIndex: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/blog"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Was "yearly", which actively discouraged recrawling the informational
  // content that AEO depends on most.
  const blogPosts: MetadataRoute.Sitemap = posts.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: "monthly",
    priority: 0.6,
    images: imagesFor([getImage(p.heroSilo, p.heroIndex).src]),
  }));

  const conversionPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/portfolio"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/faq"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/book"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/terms"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/image-licensing"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  return [
    ...home,
    ...servicePages,
    ...pricingPage,
    ...locationsIndex,
    ...locationPages,
    ...blogIndex,
    ...blogPosts,
    ...conversionPages,
  ];
}

import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { services } from "@/lib/services";
import { posts } from "@/lib/posts";
import { locations } from "@/lib/locations";

/**
 * XML sitemap covering every indexable route — home, service silos, blog
 * index and posts, suburb pages and conversion pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const home: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: absoluteUrl(`/${s.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const locationsIndex: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/locations"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const locationPages: MetadataRoute.Sitemap = locations.map((l) => ({
    url: absoluteUrl(`/locations/${l.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogIndex: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/blog"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const blogPosts: MetadataRoute.Sitemap = posts.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: new Date(p.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const conversionPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/about"),
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
  ];

  return [
    ...home,
    ...servicePages,
    ...locationsIndex,
    ...locationPages,
    ...blogIndex,
    ...blogPosts,
    ...conversionPages,
  ];
}

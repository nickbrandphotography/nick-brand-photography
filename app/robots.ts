import type { MetadataRoute } from "next";
import { absoluteUrl, site } from "@/lib/site";

/**
 * robots.txt — allows full crawling and points crawlers (and AI search
 * engines) to the XML sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: site.url,
  };
}

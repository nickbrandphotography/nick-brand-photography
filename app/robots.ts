import type { MetadataRoute } from "next";
import { absoluteUrl, site } from "@/lib/site";

/**
 * robots.txt — allows full crawling and points crawlers (and AI search
 * engines) to the XML sitemap. Private routes (booking admin and the
 * self-service /manage/[token] page) are disallowed so they stay out of
 * the index and don't waste crawl budget.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/manage/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: site.url,
  };
}

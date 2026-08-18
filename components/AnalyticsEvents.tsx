"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Sitewide conversion tracking, done with one delegated listener.
 *
 * Rather than turning Button, Footer, Header, CTASection and every pricing card
 * into client components just to attach onClick handlers, this mounts once in
 * the root layout and listens on the document. It therefore captures every
 * phone, email and booking link on the site — including ones added later —
 * with no per-component wiring and no extra JavaScript in the page tree.
 *
 * `booking_complete` and `enquiry_submit` are fired from their own components,
 * because only those know when the action actually succeeded.
 */
export default function AnalyticsEvents() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement | null)?.closest?.("a");
      if (!el) return;

      const href = el.getAttribute("href") ?? "";
      // Where on the page the click happened, so GA4 can tell a header call
      // from a footer call from a mid-article CTA.
      const source =
        el.closest("header")
          ? "header"
          : el.closest("footer")
            ? "footer"
            : el.closest("[data-cta]")?.getAttribute("data-cta") ?? "body";

      if (href.startsWith("tel:")) {
        track("call_click", { source });
      } else if (href.startsWith("mailto:")) {
        track("email_click", { source });
      } else if (href === "/book" || href.startsWith("/book?")) {
        const session = href.includes("session=")
          ? decodeURIComponent(href.split("session=")[1].split("&")[0])
          : undefined;
        track("booking_start", { source, session_type: session });
      } else if (href.includes("google.com/maps") || href.includes("share.google")) {
        track("maps_click", { source });
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

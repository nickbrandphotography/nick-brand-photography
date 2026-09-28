import type { Metadata } from "next";
import { Suspense } from "react";
import ConfirmedClient from "./ConfirmedClient";

export const metadata: Metadata = {
  title: "Booking Confirmed | Nick Brand Photography",
  // Reached only by redirect right after a booking or enquiry — nothing to
  // rank for, and letting it into the index would put someone else's booking
  // reference in a search snippet.
  robots: { index: false, follow: false },
};

/**
 * /book/confirmed — the one URL every completed booking or enquiry lands on.
 *
 * A real page (not a step inside BookingFlow) so Google Ads, Meta Pixel and
 * any future conversion tracker can be pointed at a specific URL and fire
 * reliably on page load, the way those tools are designed to work. See
 * goToConfirmation in components/BookingFlow.tsx for the redirect, and
 * components/BookingConfirmation.tsx for where the actual tracking calls fire.
 *
 * useSearchParams() requires a Suspense boundary for the page to still
 * prerender the static shell around it.
 */
export default function ConfirmedPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmedClient />
    </Suspense>
  );
}

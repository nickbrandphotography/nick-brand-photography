/**
 * Conversion tracking helpers.
 *
 * Everything routes through `track()`, which is a no-op unless GA4 has actually
 * loaded (NEXT_PUBLIC_GA_ID set — see app/layout.tsx). That means these calls are
 * safe to sprinkle through components without guarding each one, and local dev
 * never pollutes the property.
 *
 * The four events below are the site's real conversion points. Mark
 * `booking_complete` and `enquiry_submit` as key events in GA4 (Admin → Events),
 * and treat `call_click` / `email_click` as secondary conversions — for a
 * business like this a phone call is often the highest-intent action of all.
 *
 * `trackBookingComplete` and `trackEnquiry` also fire the Google Ads conversion
 * event and the Meta Pixel event, the same way they fire the GA4 event — one
 * call, every tracker that's actually configured. Each one is independently
 * gated on its own env var and is a silent no-op until that var is set, same
 * pattern as GA4. Nothing here needs to change when the Meta Pixel gets set up
 * later; it starts firing the moment NEXT_PUBLIC_META_PIXEL_ID exists.
 */

type GtagParams = Record<string, string | number | boolean | undefined>;
type FbqParams = Record<string, string | number | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js",
      targetOrName: string | Date,
      params?: GtagParams,
    ) => void;
    fbq?: (
      command: "init" | "track" | "trackCustom",
      eventOrId: string,
      params?: FbqParams,
    ) => void;
  }
}

/** Send a GA4 event. Silently does nothing when analytics isn't loaded. */
export function track(event: string, params: GtagParams = {}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}

/** Send a Meta Pixel event. Silently does nothing until the pixel is loaded. */
function trackMeta(event: string, params: FbqParams = {}): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}

/**
 * Fire the Google Ads conversion event.
 *
 * Set NEXT_PUBLIC_GOOGLE_ADS_ID (e.g. AW-XXXXXXXXX) and
 * NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL — the part after the slash in the
 * `send_to` string Google Ads shows when you create a "Website" conversion
 * action — in Vercel. Until both are set this is a silent no-op.
 */
function trackGoogleAdsConversion(value?: number, transactionId?: string): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
  if (!adsId || !label) return;
  window.gtag("event", "conversion", {
    send_to: `${adsId}/${label}`,
    value,
    currency: "AUD",
    transaction_id: transactionId,
  });
}

/** Visitor clicked through to the booking flow. */
export const trackBookingStart = (source: string, sessionId?: string) =>
  track("booking_start", { source, session_type: sessionId });

/**
 * Visitor completed a booking (paid or pay-on-the-day). Mark as a key event
 * in GA4. `reference` is passed to Google Ads as the conversion's
 * transaction_id, so a duplicate page load can't double-count it.
 */
export const trackBookingComplete = (
  sessionId?: string,
  value?: number,
  reference?: string,
) => {
  track("booking_complete", { session_type: sessionId, value, currency: "AUD" });
  trackGoogleAdsConversion(value, reference);
  trackMeta("Schedule", { content_name: sessionId, value, currency: "AUD" });
};

/**
 * Visitor submitted the enquiry form, or an enquiry-only booking request
 * (team/event quotes). Mark as a key event in GA4.
 */
export const trackEnquiry = (interest: string, source: string) => {
  track("enquiry_submit", { interest, source });
  trackGoogleAdsConversion();
  trackMeta("Lead", { content_name: interest });
};

/** Visitor tapped the phone number. */
export const trackCall = (source: string) => track("call_click", { source });

/** Visitor tapped an email link. */
export const trackEmail = (source: string) => track("email_click", { source });

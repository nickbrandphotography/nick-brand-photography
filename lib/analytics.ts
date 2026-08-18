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
 */

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js",
      targetOrName: string | Date,
      params?: GtagParams,
    ) => void;
  }
}

/** Send a GA4 event. Silently does nothing when analytics isn't loaded. */
export function track(event: string, params: GtagParams = {}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}

/** Visitor clicked through to the booking flow. */
export const trackBookingStart = (source: string, sessionId?: string) =>
  track("booking_start", { source, session_type: sessionId });

/** Visitor completed a booking. Mark as a key event in GA4. */
export const trackBookingComplete = (sessionId?: string, value?: number) =>
  track("booking_complete", {
    session_type: sessionId,
    value,
    currency: "AUD",
  });

/** Visitor submitted the enquiry form. Mark as a key event in GA4. */
export const trackEnquiry = (interest: string, source: string) =>
  track("enquiry_submit", { interest, source });

/** Visitor tapped the phone number. */
export const trackCall = (source: string) => track("call_click", { source });

/** Visitor tapped an email link. */
export const trackEmail = (source: string) => track("email_click", { source });

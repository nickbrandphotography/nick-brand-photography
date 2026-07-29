/**
 * POST /api/bookings — RETIRED.
 *
 * This route used to create a confirmed Google Calendar event directly from
 * an unauthenticated POST body, with no payment step. That meant anyone who
 * found this URL could reserve a real slot on Nick's calendar for free,
 * even though the booking UI displayed a deposit amount.
 *
 * Bookings for priced sessions now go through:
 *   1. POST /api/checkout           — creates a Stripe Checkout Session
 *   2. Stripe redirects to Checkout — customer actually pays
 *   3. POST /api/stripe/webhook     — on confirmed payment, THIS creates
 *      the calendar event (via lib/booking-fulfillment.ts)
 *   4. GET  /api/checkout/status    — the booking page polls this to show
 *      the confirmation screen
 *
 * This endpoint is kept only to return a clear error instead of a 404, in
 * case anything still points at it (old bookmarks, cached JS, etc).
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "This booking method has been retired. Please use the booking page at /book, which now takes payment securely through Stripe before reserving a slot.",
    },
    { status: 410 },
  );
}

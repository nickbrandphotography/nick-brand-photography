/**
 * GET /api/checkout/status?session_id=cs_...
 *
 * Read-only. The booking page polls this after Stripe redirects the client
 * back from Checkout, to find out whether the webhook has finished writing
 * the Google Calendar event yet.
 *
 * This route NEVER creates a booking itself — only the webhook
 * (app/api/stripe/webhook/route.ts) calls fulfillCheckoutSession's
 * creation path in practice, because this route only reaches the
 * "already fulfilled" branch (metadata.calendarEventId is read, never
 * written, from here — see lib/booking-fulfillment.ts for why that keeps
 * this safe from double-booking races).
 *
 * Response: { status: "unpaid" } | { status: "processing" } |
 *           { status: "paid", ...bookingDetails } | { status: "error", message }
 */

import { NextRequest, NextResponse } from "next/server";
import { getStripe, stripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }
  if (!stripeConfigured()) {
    return NextResponse.json(
      { status: "error", message: "Payments are not configured." },
      { status: 503 },
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ status: "unpaid" });
    }

    const md = (session.metadata ?? {}) as Record<string, string>;

    if (!md.calendarEventId) {
      // Payment succeeded, but the webhook hasn't finished creating the
      // calendar event yet. The frontend should poll again shortly.
      return NextResponse.json({ status: "processing" });
    }

    return NextResponse.json({
      status: "paid",
      reference: md.reference ?? "",
      manageToken: md.calendarEventId,
      sessionName: md.sessionName ?? "",
      dateLabel: md.dateLabel ?? "",
      timeLabel: md.timeLabel ?? "",
      locationLabel: md.locationLabel ?? "",
      depositAud: Number(md.depositAud ?? 0),
      totalAud: Number(md.totalAud ?? 0),
      customerName: md.customerName ?? "",
      // Stamped by the webhook (lib/booking-fulfillment.ts) — lets the
      // confirmation screen promise an email only when one was really sent.
      emailSent: md.emailSent === "1",
    });
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ status: "error", message: raw }, { status: 500 });
  }
}

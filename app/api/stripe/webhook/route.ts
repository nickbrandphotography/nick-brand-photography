/**
 * POST /api/stripe/webhook
 *
 * Stripe calls this URL when a Checkout Session finishes. On
 * `checkout.session.completed` with payment_status "paid", this is the ONE
 * place that creates the real Google Calendar event for the booking (via
 * lib/booking-fulfillment.ts) — the deposit is only charged AND the slot is
 * only reserved once Stripe confirms the card actually went through.
 *
 * SETUP (Nick does this in the Stripe Dashboard, not in code):
 *   1. Dashboard → Developers → Webhooks → Add endpoint.
 *   2. Endpoint URL: https://www.nickbrandphotography.com/api/stripe/webhook
 *   3. Events to send: checkout.session.completed
 *   4. Copy the "Signing secret" (starts with whsec_...) into Vercel as
 *      STRIPE_WEBHOOK_SECRET.
 *
 * This route reads the raw request body (required for signature
 * verification) — do not add any body-parsing middleware in front of it.
 */

import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { fulfillCheckoutSession } from "@/lib/booking-fulfillment";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[stripe webhook] Missing STRIPE_WEBHOOK_SECRET env var");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Invalid signature";
    console.error("[stripe webhook] Signature verification failed:", raw);
    return NextResponse.json({ error: `Webhook error: ${raw}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { id: string };
    try {
      const result = await fulfillCheckoutSession(session.id);
      if (result.status === "error") {
        // Log loudly — this means Nick was paid but the calendar event
        // wasn't created and needs manual follow-up. Still return 200 so
        // Stripe doesn't retry forever for a booking that will need a
        // human to fix rather than a retry.
        console.error("[stripe webhook] Fulfillment error:", result.message);
      }
    } catch (err) {
      console.error("[stripe webhook] Unexpected fulfillment error:", err);
      // Return 500 so Stripe retries — this branch is for genuinely
      // unexpected failures (e.g. transient network error), not business
      // logic errors, which are handled above.
      return NextResponse.json({ error: "Fulfillment failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

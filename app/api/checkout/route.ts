/**
 * POST /api/checkout
 *
 * Creates a Stripe Checkout Session for the deposit on a priced session
 * (headshots, portfolio, family — anything with `mode: "instant"` in
 * lib/booking.ts). The browser is redirected to Stripe's hosted payment
 * page; the actual Google Calendar event is only created once Stripe
 * confirms the payment succeeded (see app/api/stripe/webhook/route.ts and
 * lib/booking-fulfillment.ts). This route never touches the calendar.
 *
 * Request body (JSON) — mirrors what BookingFlow already collects:
 * {
 *   sessionId, date (YYYY-MM-DD), hour, minute, locationMode, postcode,
 *   travelFee, name, email, phone, company?, note?,
 *   dateLabel, timeLabel, locationLabel   // display strings for the receipt
 * }
 *
 * Success response: { url: string }  — Stripe Checkout URL to redirect to.
 */

import { NextRequest, NextResponse } from "next/server";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { getSessionType, makeReference } from "@/lib/booking";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!stripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Online payment isn't set up yet. Please call or email to book this session — see the options above.",
      },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    sessionId,
    date: dateStr,
    hour,
    minute,
    locationMode,
    postcode,
    travelFee,
    name,
    email,
    phone,
    company,
    note,
    dateLabel,
    timeLabel,
    locationLabel,
  } = body as Record<string, unknown>;

  if (
    typeof sessionId !== "string" ||
    typeof dateStr !== "string" ||
    typeof hour !== "number" ||
    typeof minute !== "number" ||
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof phone !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !phone.trim()
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const session = getSessionType(sessionId);
  if (!session || session.mode !== "instant" || session.price <= 0) {
    return NextResponse.json(
      { error: "This session type isn't available for online payment." },
      { status: 400 },
    );
  }

  const fee = typeof travelFee === "number" ? travelFee : 0;
  const totalAud = session.price + fee;
  const depositAud = Math.round(totalAud * session.depositPct);
  const reference = makeReference();

  // Stripe metadata values must be strings, max 500 chars each.
  const clip = (s: unknown, max = 480) =>
    typeof s === "string" ? s.slice(0, max) : "";

  const metadata: Record<string, string> = {
    reference,
    sessionId,
    sessionName: session.name,
    durationMin: String(session.durationMin),
    date: dateStr,
    hour: String(hour),
    minute: String(minute),
    locationMode: clip(locationMode, 50),
    locationLabel: clip(locationLabel, 100) || "Lane Cove Studio, Sydney",
    postcode: clip(postcode, 20),
    travelFee: String(fee),
    totalAud: String(totalAud),
    depositAud: String(depositAud),
    customerName: clip(name, 200),
    customerEmail: clip(email, 200),
    customerPhone: clip(phone, 50),
    company: clip(company, 200),
    note: clip(note, 480),
    dateLabel: clip(dateLabel, 100),
    timeLabel: clip(timeLabel, 50),
  };

  try {
    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "aud",
            unit_amount: depositAud * 100,
            product_data: {
              name: `${session.name} — booking deposit`,
              description: `${
                typeof dateLabel === "string" ? dateLabel : ""
              } at ${typeof timeLabel === "string" ? timeLabel : ""}. Balance of $${
                totalAud - depositAud
              } AUD due on the day. Ref ${reference}.`,
            },
          },
        },
      ],
      metadata,
      success_url: `${absoluteUrl("/book")}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${absoluteUrl("/book")}?cancelled=1`,
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("[checkout] Stripe error:", err);
    const raw = err instanceof Error ? err.message : "Unknown Stripe error";
    return NextResponse.json(
      { error: `Could not start checkout: ${raw}` },
      { status: 500 },
    );
  }
}

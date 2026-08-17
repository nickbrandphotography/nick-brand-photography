/**
 * Turns a PAID Stripe Checkout Session into a real Google Calendar booking.
 *
 * This is the single place that writes the calendar event once payment has
 * succeeded. It is called from the Stripe webhook (app/api/stripe/webhook)
 * — and ONLY from there — so there is exactly one writer and no risk of two
 * requests racing to create duplicate calendar events for the same payment.
 *
 * The client-facing status route (app/api/checkout/status) only ever reads;
 * it never creates bookings itself. It polls this same metadata until the
 * webhook has finished.
 *
 * Known limitation: idempotency relies on Stripe Checkout Session metadata
 * (checking `calendarEventId` before creating an event) rather than a
 * database transaction. This is safe under Stripe's normal at-least-once
 * webhook redelivery because only the webhook route calls this function,
 * but it is not a true atomic lock. Once Supabase is connected (Phase A in
 * BOOKING-SETUP.md), move this check to a DB row with a unique constraint
 * on the Stripe session ID for a hard guarantee.
 */

import { getStripe } from "./stripe";
import { createBookingEvent } from "./google-calendar";
import { sendBookingConfirmation } from "./email";

export type FulfillmentResult =
  | {
      status: "paid";
      reference: string;
      manageToken: string;
      sessionName: string;
      dateLabel: string;
      timeLabel: string;
      locationLabel: string;
      depositAud: number;
      totalAud: number;
      customerName: string;
      /**
       * Whether the confirmation email to the client was accepted by Resend.
       * False when email isn't configured yet (see lib/email.ts) or the send
       * failed — the confirmation screen tells the client the truth either way
       * instead of promising an email that never arrives.
       */
      emailSent: boolean;
    }
  | { status: "unpaid" }
  | { status: "error"; message: string };

function metaStr(
  md: Record<string, string>,
  key: string,
  fallback = "",
): string {
  return md[key] ?? fallback;
}

/**
 * Ensures a paid Checkout Session has a corresponding Google Calendar
 * event. Safe to call more than once for the same session — if
 * `calendarEventId` is already stamped on the session's metadata, the
 * existing event details are returned instead of creating a duplicate.
 */
export async function fulfillCheckoutSession(
  checkoutSessionId: string,
): Promise<FulfillmentResult> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);

  if (session.payment_status !== "paid") {
    return { status: "unpaid" };
  }

  const md = (session.metadata ?? {}) as Record<string, string>;
  const reference = metaStr(md, "reference");
  const depositAud = Number(md.depositAud ?? 0);
  const totalAud = Number(md.totalAud ?? 0);

  // Already fulfilled — return the existing event instead of re-creating.
  if (md.calendarEventId) {
    return {
      status: "paid",
      reference,
      manageToken: md.calendarEventId,
      sessionName: metaStr(md, "sessionName"),
      dateLabel: metaStr(md, "dateLabel"),
      timeLabel: metaStr(md, "timeLabel"),
      locationLabel: metaStr(md, "locationLabel"),
      depositAud,
      totalAud,
      customerName: metaStr(md, "customerName"),
      emailSent: md.emailSent === "1",
    };
  }

  const hasCredentials =
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_CALENDAR_ID;

  if (!hasCredentials) {
    return {
      status: "error",
      message:
        "Payment succeeded but the calendar isn't connected (missing Google Calendar env vars). Nick has been charged-through and needs to check Vercel env vars, then manually add this booking.",
    };
  }

  const [y, mo, d] = metaStr(md, "date", "1970-01-01").split("-").map(Number);
  const date = new Date(y, (mo || 1) - 1, d || 1);

  try {
    const eventId = await createBookingEvent({
      reference,
      sessionName: metaStr(md, "sessionName"),
      durationMin: Number(md.durationMin ?? 0),
      date,
      hour: Number(md.hour ?? 0),
      minute: Number(md.minute ?? 0),
      customerName: metaStr(md, "customerName"),
      customerEmail: metaStr(md, "customerEmail"),
      customerPhone: metaStr(md, "customerPhone"),
      company: metaStr(md, "company") || undefined,
      location: metaStr(md, "locationLabel"),
      note: metaStr(md, "note") || undefined,
      totalAud,
      depositAud,
    });

    // Confirmation email + .ics invite. Deliberately AFTER the calendar
    // event: the booking is real whether or not email is configured, and
    // sendBookingConfirmation never throws, so a mail failure can't lose a
    // paid booking. Its result is recorded so the confirmation screen can
    // avoid promising an email that was never sent.
    const emailSent = await sendBookingConfirmation({
      reference,
      sessionName: metaStr(md, "sessionName"),
      customerName: metaStr(md, "customerName"),
      customerEmail: metaStr(md, "customerEmail"),
      date: metaStr(md, "date", "1970-01-01"),
      hour: Number(md.hour ?? 0),
      minute: Number(md.minute ?? 0),
      durationMin: Number(md.durationMin ?? 0),
      dateLabel: metaStr(md, "dateLabel"),
      timeLabel: metaStr(md, "timeLabel"),
      locationLabel: metaStr(md, "locationLabel"),
      depositAud,
      totalAud,
      manageToken: eventId,
      note: metaStr(md, "note") || undefined,
    });

    // Stamp the event ID back onto the session so re-delivered webhooks
    // (or a client status poll that arrives after this) see it's done.
    await stripe.checkout.sessions.update(checkoutSessionId, {
      metadata: { ...md, calendarEventId: eventId, emailSent: emailSent ? "1" : "0" },
    });

    return {
      status: "paid",
      reference,
      manageToken: eventId,
      sessionName: metaStr(md, "sessionName"),
      dateLabel: metaStr(md, "dateLabel"),
      timeLabel: metaStr(md, "timeLabel"),
      locationLabel: metaStr(md, "locationLabel"),
      depositAud,
      totalAud,
      customerName: metaStr(md, "customerName"),
      emailSent,
    };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Unknown calendar error";
    return {
      status: "error",
      message: `Payment succeeded but the calendar event could not be created: ${raw}`,
    };
  }
}

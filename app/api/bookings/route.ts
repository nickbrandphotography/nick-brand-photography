/**
 * POST /api/bookings — creates a confirmed booking, with no payment step.
 *
 * HISTORY, because this route was deliberately retired once and is now back:
 * it originally created a calendar event from an unauthenticated POST, which
 * meant anyone who found the URL could fill Nick's calendar for free. It was
 * replaced by Stripe Checkout, where the deposit payment gated the booking.
 *
 * Nick has now turned deposits off (Stripe was never configured, so every
 * online booking was dying with "payment system not set up"). Without a
 * payment there is no Stripe webhook, so this is the only thing that can
 * write the booking — the free-booking risk is back by design. It is mitigated
 * here rather than ignored:
 *
 *   - honeypot field (`botcheck`) rejects the simplest bots
 *   - per-IP rate limit
 *   - the requested slot must be inside opening hours, fit the session length,
 *     sit within the notice/horizon window, and still be genuinely free
 *     according to Google Calendar
 *   - contact fields must look real before anything is written
 *
 * To go back to deposits: set STRIPE_SECRET_KEY in Vercel, restore the
 * /api/checkout call in components/BookingFlow.tsx (the route and its webhook
 * are untouched and still work), and give the session types a non-zero
 * depositPct in lib/booking.ts.
 *
 * Request body (JSON):
 * {
 *   sessionId, date (YYYY-MM-DD), hour, minute, locationMode, postcode,
 *   travelFee, name, email, phone, company?, note?,
 *   dateLabel, timeLabel, locationLabel, botcheck?
 * }
 *
 * Success: { reference, manageToken, emailSent }
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getSessionType,
  makeReference,
  getDaySlots,
  MIN_NOTICE_DAYS,
  HORIZON_DAYS,
  startOfToday,
} from "@/lib/booking";
import { createBookingEvent, getRealDaySlots } from "@/lib/google-calendar";
import { sendBookingConfirmation } from "@/lib/email";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---------------------------------------------------------------------- */
/*  Rate limiting                                                         */
/*                                                                        */
/*  In-memory and therefore per-instance and best-effort: a serverless     */
/*  platform can run several instances and recycle them at will, so a      */
/*  determined attacker gets more than MAX_PER_WINDOW. It stops casual     */
/*  abuse and runaway scripts, which is what it's for. A hard guarantee    */
/*  needs the database (Phase A in BOOKING-SETUP.md) or Vercel KV.         */
/* ---------------------------------------------------------------------- */

const WINDOW_MS = 60 * 60 * 1000; // one hour
const MAX_PER_WINDOW = 4;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the map can't grow without bound.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/* ---------------------------------------------------------------------- */

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot — a real client never fills this in.
  if (body.botcheck) {
    return NextResponse.json({ error: "Rejected" }, { status: 400 });
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      {
        error:
          "That's several bookings from this connection in a short time. Please call and Nick will sort the rest out directly.",
      },
      { status: 429 },
    );
  }

  const {
    sessionId,
    date: dateStr,
    hour,
    minute,
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

  const str = (v: unknown, max = 480) =>
    typeof v === "string" ? v.slice(0, max).trim() : "";

  const customerName = str(name, 200);
  const customerEmail = str(email, 200);
  const customerPhone = str(phone, 50);

  if (
    typeof sessionId !== "string" ||
    typeof dateStr !== "string" ||
    typeof hour !== "number" ||
    typeof minute !== "number" ||
    !customerName ||
    !customerEmail ||
    !customerPhone
  ) {
    return NextResponse.json(
      { error: "Missing required booking details." },
      { status: 400 },
    );
  }

  if (!EMAIL_RE.test(customerEmail)) {
    return NextResponse.json(
      { error: "That email address doesn't look right." },
      { status: 400 },
    );
  }

  // Australian numbers, allowing spaces, dashes, brackets and +61.
  if (customerPhone.replace(/[^\d]/g, "").length < 8) {
    return NextResponse.json(
      { error: "That phone number doesn't look right." },
      { status: 400 },
    );
  }

  const session = getSessionType(sessionId);
  if (!session || session.mode !== "instant") {
    return NextResponse.json(
      { error: "That session can't be booked online." },
      { status: 400 },
    );
  }

  /* --- the requested date must be real and inside the booking window --- */

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return NextResponse.json({ error: "Invalid date." }, { status: 400 });
  }
  const [y, mo, d] = dateStr.split("-").map(Number);
  const date = new Date(y, mo - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== mo - 1 ||
    date.getDate() !== d
  ) {
    return NextResponse.json({ error: "Invalid date." }, { status: 400 });
  }

  const today = startOfToday();
  const earliest = new Date(today);
  earliest.setDate(earliest.getDate() + MIN_NOTICE_DAYS);
  const latest = new Date(today);
  latest.setDate(latest.getDate() + HORIZON_DAYS);

  if (date < earliest || date > latest) {
    return NextResponse.json(
      {
        error: `Please choose a date between ${MIN_NOTICE_DAYS} and ${HORIZON_DAYS} days from now.`,
      },
      { status: 400 },
    );
  }

  /* --- the slot must exist in the schedule and still be free ----------- */

  const hasCalendar = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_CALENDAR_ID,
  );

  let slots;
  try {
    slots = hasCalendar
      ? await getRealDaySlots(date, session.durationMin)
      : getDaySlots(date, session.durationMin);
  } catch (err) {
    console.error("[bookings] Could not read availability:", err);
    return NextResponse.json(
      {
        error:
          "We couldn't confirm that time is still free. Please try again in a moment.",
      },
      { status: 503 },
    );
  }

  const slot = slots.find((s) => s.hour === hour && s.minute === minute);
  if (!slot) {
    return NextResponse.json(
      { error: "That start time isn't offered for this session length." },
      { status: 400 },
    );
  }
  if (!slot.available) {
    return NextResponse.json(
      {
        error:
          "Sorry — that time was taken while you were filling in the form. Please pick another.",
      },
      { status: 409 },
    );
  }

  if (!hasCalendar) {
    return NextResponse.json(
      {
        error:
          "The booking calendar isn't connected yet, so the slot can't be held. Please call or email and Nick will book you in directly.",
      },
      { status: 503 },
    );
  }

  /* --- write it ------------------------------------------------------- */

  const fee = typeof travelFee === "number" && travelFee > 0 ? travelFee : 0;
  const totalAud = session.price + fee;
  const reference = makeReference();
  const location = str(locationLabel, 100) || "Lane Cove Studio, Sydney";

  let eventId: string;
  try {
    eventId = await createBookingEvent({
      reference,
      sessionName: session.name,
      durationMin: session.durationMin,
      date,
      hour,
      minute,
      customerName,
      customerEmail,
      customerPhone,
      company: str(company, 200) || undefined,
      location,
      note: str(note) || undefined,
      totalAud,
      depositAud: 0,
    });
  } catch (err) {
    console.error("[bookings] Calendar write failed:", err);
    return NextResponse.json(
      {
        error:
          "We couldn't write the booking to the calendar. Please call and Nick will confirm your time directly.",
      },
      { status: 502 },
    );
  }

  // Email must never fail the booking — the slot is already held.
  let emailSent = false;
  try {
    emailSent = await sendBookingConfirmation({
      reference,
      sessionName: session.name,
      customerName,
      customerEmail,
      date: dateStr,
      hour,
      minute,
      durationMin: session.durationMin,
      dateLabel: str(dateLabel, 100),
      timeLabel: str(timeLabel, 50),
      locationLabel: location,
      depositAud: 0,
      totalAud,
      manageToken: eventId,
      note: str(note) || undefined,
    });
  } catch (err) {
    console.error("[bookings] Confirmation email failed:", err);
  }

  return NextResponse.json({
    reference,
    manageToken: eventId,
    emailSent,
  });
}

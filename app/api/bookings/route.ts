/**
 * POST /api/bookings
 *
 * Creates a confirmed booking by writing a Google Calendar event.
 * Returns a booking reference and a manage token (the Calendar event ID)
 * that powers the /manage/[token] self-service page.
 *
 * Request body (JSON):
 * {
 *   sessionId:     string          // e.g. "headshot-professional"
 *   date:          string          // YYYY-MM-DD
 *   hour:          number
 *   minute:        number
 *   locationMode:  "studio" | "onlocation"
 *   postcode?:     string
 *   travelFee:     number          // AUD, 0 for studio shoots
 *   name:          string
 *   email:         string
 *   phone:         string
 *   company?:      string
 *   note?:         string
 * }
 *
 * Success response:
 * { reference: string, manageToken: string }
 *
 * If Calendar credentials are not configured, returns a mock response so
 * the UI still works in development.
 */

import { NextRequest, NextResponse } from "next/server";
import { createBookingEvent } from "@/lib/google-calendar";
import { getSessionType, makeReference } from "@/lib/booking";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
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
  } = body as {
    sessionId: string;
    date: string;
    hour: number;
    minute: number;
    locationMode: string;
    postcode?: string;
    travelFee: number;
    name: string;
    email: string;
    phone: string;
    company?: string;
    note?: string;
  };

  // Basic validation.
  if (!sessionId || !dateStr || hour == null || minute == null || !name || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const session = getSessionType(sessionId);
  if (!session) {
    return NextResponse.json({ error: "Unknown session type" }, { status: 400 });
  }

  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const totalAud = session.price + (travelFee ?? 0);
  const depositAud = Math.round(totalAud * session.depositPct);

  const locationLabel =
    locationMode === "onlocation"
      ? `On-location — ${postcode}`
      : "Lane Cove Studio, Sydney";

  const reference = makeReference();

  // If Calendar credentials are configured, write the real event.
  const hasCredentials =
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_CALENDAR_ID;

  if (hasCredentials) {
    try {
      const eventId = await createBookingEvent({
        reference,
        sessionName: session.name,
        durationMin: session.durationMin,
        date,
        hour,
        minute,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        company,
        location: locationLabel,
        note,
        totalAud,
        depositAud,
      });

      return NextResponse.json({ reference, manageToken: eventId });
    } catch (err) {
      console.error("[bookings] Calendar API error:", err);

      // Forward the real Google error to the front-end so the failure mode is
      // visible (e.g. "writer access required" → the service account hasn't
      // been granted edit permission on the calendar). The booking UI shows
      // this string verbatim in its error banner.
      const raw =
        err instanceof Error ? err.message : "Unknown calendar error";

      let friendly = "Could not create calendar event. Please try again.";
      const lower = raw.toLowerCase();
      if (
        lower.includes("writer access") ||
        lower.includes("insufficient") ||
        lower.includes("forbidden") ||
        lower.includes("permission")
      ) {
        friendly =
          "The booking calendar isn't accepting events from this service account yet. In Google Calendar, share the calendar with the service account email and set its permission to \"Make changes to events\".";
      } else if (lower.includes("not found")) {
        friendly =
          "Google Calendar couldn't find the configured calendar. Check that GOOGLE_CALENDAR_ID in Vercel matches the calendar ID exactly.";
      } else if (lower.includes("invalid_grant") || lower.includes("jwt")) {
        friendly =
          "The Google service account credentials are invalid. Re-check GOOGLE_PRIVATE_KEY in Vercel — line breaks often get mangled on paste.";
      }

      return NextResponse.json(
        { error: friendly, detail: raw },
        { status: 500 },
      );
    }
  }

  // Fallback: mock response for local dev without credentials.
  return NextResponse.json({ reference, manageToken: reference });
}

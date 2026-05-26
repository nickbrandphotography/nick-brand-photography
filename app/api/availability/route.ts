/**
 * GET /api/availability?date=YYYY-MM-DD&duration=45
 *
 * Returns the available time slots for a specific date and session duration,
 * based on real Google Calendar busy blocks.
 *
 * Response: { slots: Slot[] }
 * Each Slot: { label: string, hour: number, minute: number, available: boolean }
 *
 * Falls back to the mock availability engine if the Calendar API is not yet
 * configured (i.e. env vars are missing), so the booking UI still works in
 * development before credentials are set up.
 */

import { NextRequest, NextResponse } from "next/server";
import { getRealDaySlots } from "@/lib/google-calendar";
import { getDaySlots } from "@/lib/booking";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const dateParam = searchParams.get("date"); // YYYY-MM-DD
  const durationParam = searchParams.get("duration"); // minutes as string

  if (!dateParam || !durationParam) {
    return NextResponse.json(
      { error: "Missing date or duration query param" },
      { status: 400 },
    );
  }

  const [year, month, day] = dateParam.split("-").map(Number);
  const date = new Date(year, month - 1, day); // local midnight
  const durationMin = parseInt(durationParam, 10);

  if (isNaN(durationMin) || durationMin <= 0) {
    return NextResponse.json({ error: "Invalid duration" }, { status: 400 });
  }

  // If Calendar credentials are configured, use the real engine.
  const hasCredentials =
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_CALENDAR_ID;

  if (hasCredentials) {
    try {
      const slots = await getRealDaySlots(date, durationMin);
      return NextResponse.json({ slots });
    } catch (err) {
      console.error("[availability] Calendar API error:", err);
      // Fall through to mock on transient errors.
    }
  }

  // Fallback: deterministic mock (matches the client-side mock in lib/booking.ts).
  const slots = getDaySlots(date, durationMin);
  return NextResponse.json({ slots });
}

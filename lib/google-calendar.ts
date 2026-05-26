/**
 * Google Calendar integration for Nick Brand Photography.
 *
 * Uses a service account (not OAuth) so no user login is required.
 * The service account must have been shared on Nick's calendar with
 * "Make changes to events" permission.
 *
 * Required env vars (set in .env.local):
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL
 *   GOOGLE_PRIVATE_KEY          (the private_key field from the JSON key file)
 *   GOOGLE_CALENDAR_ID          (Nick's calendar ID, looks like an email address)
 *
 * This module is server-only — never imported from client components.
 */

import { google } from "googleapis";
import { OPENING_HOURS, dateKey, type Slot } from "./booking";

/* -------------------------------------------------------------------------- */
/*  Auth                                                                       */
/* -------------------------------------------------------------------------- */

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !rawKey) {
    throw new Error(
      "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY in env",
    );
  }

  // .env.local stores \n as a literal backslash-n; convert to real newlines.
  const privateKey = rawKey.replace(/\\n/g, "\n");

  return new google.auth.GoogleAuth({
    credentials: { client_email: email, private_key: privateKey },
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
}

function getCalendarId(): string {
  const id = process.env.GOOGLE_CALENDAR_ID;
  if (!id) throw new Error("Missing GOOGLE_CALENDAR_ID in env");
  return id;
}

/* -------------------------------------------------------------------------- */
/*  Busy-block fetching                                                        */
/* -------------------------------------------------------------------------- */

export type BusyBlock = { start: Date; end: Date };

/**
 * Returns all busy periods on a given calendar day (local Sydney time).
 * The calendar API returns UTC; we compare against slot start/end times.
 */
export async function getBusyBlocks(date: Date): Promise<BusyBlock[]> {
  const auth = getAuth();
  const calendar = google.calendar({ version: "v3", auth });

  // Build a window from midnight to midnight (Sydney local → UTC offset handled
  // by using full ISO strings with the local date boundaries).
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      items: [{ id: getCalendarId() }],
    },
  });

  const busy = res.data.calendars?.[getCalendarId()]?.busy ?? [];
  return busy.map((b) => ({
    start: new Date(b.start!),
    end: new Date(b.end!),
  }));
}

/* -------------------------------------------------------------------------- */
/*  Slot availability (server-side, uses real busy blocks)                    */
/* -------------------------------------------------------------------------- */

function formatTime(h: number, m: number): string {
  const period = h >= 12 ? "pm" : "am";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, "0")} ${period}`;
}

/**
 * Returns slots for the day, marking each as available or not based on
 * real Google Calendar busy blocks.
 */
export async function getRealDaySlots(
  date: Date,
  durationMin: number,
): Promise<Slot[]> {
  const hours = OPENING_HOURS[date.getDay()];
  if (!hours || durationMin <= 0) return [];

  const [open, close] = hours;
  const step = durationMin >= 90 ? 60 : 30;
  const busy = await getBusyBlocks(date);

  const slots: Slot[] = [];
  for (let m = open * 60; m + durationMin <= close * 60; m += step) {
    const hh = Math.floor(m / 60);
    const mm = m % 60;

    const slotStart = new Date(date);
    slotStart.setHours(hh, mm, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + durationMin);

    // Slot is unavailable if it overlaps any busy block.
    const available = !busy.some(
      (b) => slotStart < b.end && slotEnd > b.start,
    );

    slots.push({ label: formatTime(hh, mm), hour: hh, minute: mm, available });
  }
  return slots;
}

/* -------------------------------------------------------------------------- */
/*  Create a booking event on Google Calendar                                 */
/* -------------------------------------------------------------------------- */

export type BookingEventData = {
  reference: string;
  sessionName: string;
  durationMin: number;
  date: Date;
  hour: number;
  minute: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company?: string;
  location: string;
  note?: string;
  totalAud: number;
  depositAud: number;
};

/**
 * Creates a Google Calendar event for a confirmed booking.
 * Returns the Google Calendar event ID (used as the manage token).
 */
export async function createBookingEvent(
  data: BookingEventData,
): Promise<string> {
  const auth = getAuth();
  const calendar = google.calendar({ version: "v3", auth });

  const start = new Date(data.date);
  start.setHours(data.hour, data.minute, 0, 0);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + data.durationMin);

  const description = [
    `Reference: ${data.reference}`,
    `Session: ${data.sessionName}`,
    `Client: ${data.customerName}`,
    `Email: ${data.customerEmail}`,
    `Phone: ${data.customerPhone}`,
    data.company ? `Company: ${data.company}` : null,
    `Location: ${data.location}`,
    data.note ? `Notes: ${data.note}` : null,
    `Total: $${data.totalAud} AUD`,
    `Deposit: $${data.depositAud} AUD`,
  ]
    .filter(Boolean)
    .join("\n");

  const event = await calendar.events.insert({
    calendarId: getCalendarId(),
    requestBody: {
      summary: `📷 ${data.sessionName} — ${data.customerName}`,
      description,
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
      location: data.location,
      // Store booking reference in extended properties for easy lookup.
      extendedProperties: {
        private: {
          nbpReference: data.reference,
          nbpCustomerEmail: data.customerEmail,
          nbpDeposit: String(data.depositAud),
          nbpTotal: String(data.totalAud),
        },
      },
    },
  });

  if (!event.data.id) throw new Error("Calendar event created without an ID");
  return event.data.id;
}

/* -------------------------------------------------------------------------- */
/*  Cancel / delete a booking event                                           */
/* -------------------------------------------------------------------------- */

/**
 * Deletes (cancels) a Google Calendar event by its event ID.
 */
export async function deleteBookingEvent(eventId: string): Promise<void> {
  const auth = getAuth();
  const calendar = google.calendar({ version: "v3", auth });
  await calendar.events.delete({
    calendarId: getCalendarId(),
    eventId,
  });
}

/* -------------------------------------------------------------------------- */
/*  Re-export OPENING_HOURS so API routes can use it without importing        */
/*  from booking.ts (which has client-side code mixed in)                     */
/* -------------------------------------------------------------------------- */
export { dateKey };

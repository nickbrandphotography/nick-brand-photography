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

/**
 * Normalise the private key as stored in env (Vercel, .env.local, etc.) into
 * a real PEM string that OpenSSL will accept. Handles every paste variant
 * that has burnt me at least once:
 *   - Wrapping double quotes from copy-pasting the JSON string verbatim
 *   - Literal "\n" sequences from .env.local format
 *   - Windows \r\n line endings
 *   - Leading/trailing whitespace
 * If the result doesn't look like a PEM key, throw a clear error rather than
 * letting OpenSSL fail with "DECODER routines::unsupported".
 */
function normalisePrivateKey(raw: string): string {
  let key = raw.trim();
  // Strip surrounding quotes if the value was pasted with them.
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  // Convert literal backslash-n to real newlines, then strip carriage returns.
  key = key.replace(/\\n/g, "\n").replace(/\r/g, "");

  if (!key.includes("BEGIN PRIVATE KEY") || !key.includes("END PRIVATE KEY")) {
    throw new Error(
      "GOOGLE_PRIVATE_KEY in env doesn't look like a PEM private key — missing BEGIN/END markers. Re-paste the private_key value from your service account JSON file.",
    );
  }
  return key;
}

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !rawKey) {
    throw new Error(
      "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY in env",
    );
  }

  const privateKey = normalisePrivateKey(rawKey);

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
/*  Sydney timezone handling                                                   */
/* -------------------------------------------------------------------------- */
/*
 * Vercel serverless functions run in UTC, so naive `setHours()` calls produce
 * times 10–11 hours off Sydney wall-clock time. All bookings are physically in
 * Sydney, so every wall-clock time in this module is interpreted in
 * Australia/Sydney explicitly, regardless of server timezone.
 */

const SYDNEY_TZ = "Australia/Sydney";

/** Milliseconds Sydney is ahead of UTC at a given instant (handles DST). */
function sydneyOffsetMs(at: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: SYDNEY_TZ,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p = Object.fromEntries(
    dtf.formatToParts(at).map((x) => [x.type, x.value]),
  );
  const asUTC = Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    p.hour === "24" ? 0 : Number(p.hour),
    Number(p.minute),
    Number(p.second),
  );
  return asUTC - at.getTime();
}

/** The UTC instant corresponding to a Sydney wall-clock time. */
function sydneyInstant(
  y: number,
  mo: number, // 1-based month
  d: number,
  h = 0,
  mi = 0,
  s = 0,
  ms = 0,
): Date {
  const wall = Date.UTC(y, mo - 1, d, h, mi, s, ms);
  // Two iterations converge even across DST transitions.
  let utc = wall;
  for (let i = 0; i < 2; i++) {
    utc = wall - sydneyOffsetMs(new Date(utc));
  }
  return new Date(utc);
}

/** Extracts the calendar-date components a `Date` was constructed with. */
function dateParts(date: Date): [number, number, number] {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
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

  // Midnight-to-midnight window in Sydney time, independent of server TZ.
  const [y, mo, d] = dateParts(date);
  const dayStart = sydneyInstant(y, mo, d, 0, 0, 0, 0);
  const dayEnd = sydneyInstant(y, mo, d, 23, 59, 59, 999);

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

  const [y, mo, d] = dateParts(date);
  const slots: Slot[] = [];
  for (let m = open * 60; m + durationMin <= close * 60; m += step) {
    const hh = Math.floor(m / 60);
    const mm = m % 60;

    const slotStart = sydneyInstant(y, mo, d, hh, mm);
    const slotEnd = new Date(slotStart.getTime() + durationMin * 60_000);

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

  // Send Sydney wall-clock times with an explicit timeZone so the event
  // is correct no matter what timezone the server runs in.
  const [y, mo, d] = dateParts(data.date);
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${y}-${pad(mo)}-${pad(d)}`;
  const endTotalMin = data.hour * 60 + data.minute + data.durationMin;
  const startDateTime = `${dateStr}T${pad(data.hour)}:${pad(data.minute)}:00`;
  const endDateTime = `${dateStr}T${pad(Math.floor(endTotalMin / 60))}:${pad(endTotalMin % 60)}:00`;

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
      start: { dateTime: startDateTime, timeZone: SYDNEY_TZ },
      end: { dateTime: endDateTime, timeZone: SYDNEY_TZ },
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

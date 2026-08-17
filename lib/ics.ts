/**
 * Minimal iCalendar (.ics) builder for booking confirmations.
 *
 * Attached to the confirmation email so the client can add the shoot to
 * whatever calendar they use. Deliberately dependency-free — the format is
 * simple enough that a library isn't worth the install.
 *
 * Times are written as UTC (a trailing "Z" on DTSTART/DTEND), which is the
 * most portable form: every calendar client converts it to the reader's own
 * timezone. The caller passes real UTC instants; see sydneyInstant() in
 * lib/google-calendar.ts for how Sydney wall-clock times are converted, and
 * note that Vercel runs in UTC so never use setHours() for this.
 */

/** "2026-08-19T23:30:00.000Z" -> "20260819T233000Z" */
function icsStamp(d: Date): string {
  return `${d.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

/**
 * Escapes a value for an iCalendar text field: backslashes, semicolons,
 * commas and newlines all carry meaning in the format.
 */
function esc(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Folds lines to the 75-octet limit in RFC 5545. Long descriptions otherwise
 * break in stricter clients (Outlook in particular).
 */
function fold(line: string): string {
  if (line.length <= 73) return line;
  const chunks: string[] = [line.slice(0, 73)];
  let rest = line.slice(73);
  while (rest.length > 72) {
    chunks.push(` ${rest.slice(0, 72)}`);
    rest = rest.slice(72);
  }
  if (rest) chunks.push(` ${rest}`);
  return chunks.join("\r\n");
}

export type IcsEvent = {
  /** Stable unique id — the booking reference is ideal. */
  uid: string;
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
  organiserName: string;
  organiserEmail: string;
};

/** Builds a single-event VCALENDAR document. */
export function buildIcs(event: IcsEvent): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nick Brand Photography//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${esc(event.uid)}`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(event.start)}`,
    `DTEND:${icsStamp(event.end)}`,
    fold(`SUMMARY:${esc(event.title)}`),
    fold(`DESCRIPTION:${esc(event.description)}`),
    fold(`LOCATION:${esc(event.location)}`),
    fold(
      `ORGANIZER;CN=${esc(event.organiserName)}:mailto:${event.organiserEmail}`,
    ),
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    "DESCRIPTION:Photography session tomorrow",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

/**
 * Transactional email for Nick Brand Photography.
 *
 * Sends the booking confirmation (with an .ics calendar invite attached) to
 * the client, and an internal copy to the studio. Uses Resend's REST API over
 * plain fetch — no SDK, so nothing to install and it runs fine on the Vercel
 * Edge/Node runtimes.
 *
 * SETUP (until this is done, no email is sent and nothing breaks):
 *   1. Create a free account at resend.com and verify the sending domain
 *      nickbrandphotography.com (add the DNS records Resend shows you).
 *   2. Add these to Vercel → Project → Settings → Environment Variables:
 *        RESEND_API_KEY   = re_...          (mark as Sensitive)
 *        EMAIL_FROM       = "Nick Brand Photography <studio@nickbrandphotography.com>"
 *      EMAIL_FROM is optional — it defaults to the address above, which only
 *      works once the domain is verified in Resend.
 *   3. Redeploy. Env var changes do nothing until a redeploy.
 *
 * Until the domain is verified, Resend only accepts sends to your own account
 * address — test with that before pointing it at a client.
 *
 * Email failure must NEVER fail a booking: the client has already paid and the
 * calendar event already exists by the time this runs. Every function here
 * reports failure by returning false, and never throws.
 */

import { site } from "./site";
import { buildIcs } from "./ics";
import { sydneyInstant } from "./google-calendar";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/** True when the env vars needed to send are present. */
export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function fromAddress(): string {
  return (
    process.env.EMAIL_FROM ||
    `${site.name} <${site.email}>`
  );
}

const AUD = (n: number) => `$${n.toLocaleString("en-AU")}`;

export type BookingEmailInput = {
  reference: string;
  sessionName: string;
  customerName: string;
  customerEmail: string;
  /** YYYY-MM-DD, Sydney date. */
  date: string;
  /** Sydney wall-clock start. */
  hour: number;
  minute: number;
  durationMin: number;
  dateLabel: string;
  timeLabel: string;
  locationLabel: string;
  depositAud: number;
  totalAud: number;
  /**
   * Google Calendar event id, the self-service token for /manage/<token>.
   * NOT linked from the email yet: that page still renders sample data (see
   * components/ManageBooking.tsx), so clients are asked to reply or call
   * instead. Link it once the page reads a real booking.
   */
  manageToken: string;
  note?: string;
};

/* ------------------------------------------------------------------------ */

function confirmationHtml(b: BookingEmailInput): string {
  const balance = b.totalAud - b.depositAud;
  const firstName = b.customerName.trim().split(/\s+/)[0] || "there";
  const row = (label: string, value: string) =>
    `<tr>
       <td style="padding:6px 16px 6px 0;color:#8a8a8a;font-size:13px;">${label}</td>
       <td style="padding:6px 0;color:#1a1a1a;font-size:14px;font-weight:500;">${value}</td>
     </tr>`;

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f4f2ef;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <p style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#a08252;margin:0 0 24px;">
      ${site.name}
    </p>

    <h1 style="font-size:24px;line-height:1.25;color:#1a1a1a;margin:0 0 16px;font-weight:600;">
      Your session is booked
    </h1>

    <p style="font-size:15px;line-height:1.6;color:#3a3a3a;margin:0 0 24px;">
      Thanks ${firstName} — your deposit is received and the time below is held
      for you. The calendar invite is attached to this email.
    </p>

    <div style="background:#fff;border:1px solid #e4e0da;padding:20px 24px;margin:0 0 24px;">
      <table style="width:100%;border-collapse:collapse;">
        ${row("Session", b.sessionName)}
        ${row("Date", b.dateLabel)}
        ${row("Time", b.timeLabel)}
        ${row("Location", b.locationLabel)}
        ${row("Reference", b.reference)}
        ${row("Deposit paid", AUD(b.depositAud))}
        ${row("Balance on the day", AUD(balance))}
      </table>
    </div>

    <p style="font-size:15px;line-height:1.6;color:#3a3a3a;margin:0 0 8px;font-weight:600;">
      Before the shoot
    </p>
    <ul style="font-size:14px;line-height:1.7;color:#3a3a3a;margin:0 0 24px;padding-left:20px;">
      <li>Bring two or three outfit options — solid colours photograph best.</li>
      <li>Arrive five minutes early so we can start on time.</li>
      <li>No need to know how to pose. Nick directs you through it.</li>
    </ul>

    <p style="font-size:14px;line-height:1.6;color:#3a3a3a;margin:0 0 24px;">
      Need to move or cancel the session? Just reply to this email, or call
      ${site.phone}. Nick will sort it out.
    </p>

    <p style="font-size:13px;line-height:1.6;color:#8a8a8a;margin:0;border-top:1px solid #e4e0da;padding-top:16px;">
      ${site.name} · ${site.address.street}, ${site.address.suburb}
      ${site.address.state} ${site.address.postcode}<br>
      ${site.phone} · ${site.email}
    </p>
  </div>
</body></html>`;
}

function confirmationText(b: BookingEmailInput): string {
  const balance = b.totalAud - b.depositAud;
  return [
    `Your session is booked — ${site.name}`,
    "",
    `Session:  ${b.sessionName}`,
    `Date:     ${b.dateLabel}`,
    `Time:     ${b.timeLabel}`,
    `Location: ${b.locationLabel}`,
    `Reference: ${b.reference}`,
    `Deposit paid: ${AUD(b.depositAud)}`,
    `Balance on the day: ${AUD(balance)}`,
    "",
    "Bring two or three outfit options — solid colours photograph best.",
    "Arrive five minutes early. No need to know how to pose.",
    "",
    `To move or cancel, reply to this email or call ${site.phone}.`,
    `Questions: ${site.phone} · ${site.email}`,
  ].join("\n");
}

function studioNotificationHtml(b: BookingEmailInput): string {
  return `<!doctype html>
<html><body style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;color:#1a1a1a;">
  <h2 style="font-size:18px;margin:0 0 12px;">New paid booking — ${b.reference}</h2>
  <p style="margin:0 0 4px;"><strong>${b.sessionName}</strong></p>
  <p style="margin:0 0 12px;">${b.dateLabel} at ${b.timeLabel} · ${b.locationLabel}</p>
  <p style="margin:0 0 4px;">${b.customerName} — ${b.customerEmail}</p>
  <p style="margin:0 0 12px;">Deposit ${AUD(b.depositAud)} paid · total ${AUD(b.totalAud)}</p>
  ${b.note ? `<p style="margin:0 0 12px;"><em>Note:</em> ${b.note}</p>` : ""}
  <p style="margin:0;color:#8a8a8a;">The calendar event has already been created.</p>
</body></html>`;
}

/* ------------------------------------------------------------------------ */

type ResendPayload = {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text?: string;
  reply_to?: string;
  attachments?: { filename: string; content: string }[];
};

/** POSTs one email to Resend. Returns false on any failure; never throws. */
async function send(payload: ResendPayload): Promise<boolean> {
  if (!emailConfigured()) return false;
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[email] Resend rejected the send (${res.status}): ${body}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Could not reach Resend:", err);
    return false;
  }
}

/**
 * Sends the client confirmation (with .ics invite) plus an internal copy to
 * the studio. Returns true only if the CLIENT email was accepted — that is
 * what the confirmation screen reports to the customer.
 */
export async function sendBookingConfirmation(
  b: BookingEmailInput,
): Promise<boolean> {
  if (!emailConfigured()) return false;

  const [y, mo, d] = b.date.split("-").map(Number);
  const start = sydneyInstant(y, mo || 1, d || 1, b.hour, b.minute);
  const end = new Date(start.getTime() + b.durationMin * 60_000);

  const ics = buildIcs({
    uid: `${b.reference}@nickbrandphotography.com`,
    title: `${b.sessionName} — ${site.name}`,
    description: [
      `Reference ${b.reference}.`,
      `Deposit ${AUD(b.depositAud)} paid; balance ${AUD(
        b.totalAud - b.depositAud,
      )} due on the day.`,
      `Questions: ${site.phone}`,
    ].join(" "),
    location: b.locationLabel,
    start,
    end,
    organiserName: site.name,
    organiserEmail: site.email,
  });

  const clientOk = await send({
    from: fromAddress(),
    to: [b.customerEmail],
    reply_to: site.email,
    subject: `Booking confirmed — ${b.sessionName}, ${b.dateLabel}`,
    html: confirmationHtml(b),
    text: confirmationText(b),
    attachments: [
      {
        filename: `nick-brand-photography-${b.reference}.ics`,
        content: Buffer.from(ics, "utf8").toString("base64"),
      },
    ],
  });

  // Internal copy — sent regardless of whether the client email landed, so
  // Nick still hears about the booking if the client address bounces.
  await send({
    from: fromAddress(),
    to: [site.email],
    reply_to: b.customerEmail,
    subject: `New booking — ${b.customerName}, ${b.dateLabel} (${b.reference})`,
    html: studioNotificationHtml(b),
  });

  return clientOk;
}

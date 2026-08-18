# Booking system — setup & roadmap

This file explains the custom booking system that now lives on the `/book`
page, how to see it running, and the steps to turn it into a fully live
system with Google Calendar sync and payments.

---

## 1. See it running right now

The booking flow works today with **no accounts, no API keys, no database**.
It uses realistic mock availability so you can click through the whole
experience.

From the project folder, in a terminal:

```bash
npm run dev
```

Then open **http://localhost:3000/book** in your browser.

Try it on your phone too (the dev server prints a "Network" address you can
open on any device on the same Wi-Fi) — the flow is mobile-first.

What you can do in the preview:

- Choose a session (corporate headshots, portfolio, family, or a team enquiry)
- Browse a live-style calendar — fully-booked and out-of-window dates are
  greyed out
- Pick an open time slot
- For corporate headshots, choose the Lane Cove studio or an on-location
  shoot — enter the postcode and a travel fee is added automatically
- Enter details and reach a confirmation screen with a booking reference
- The team/events option routes to a quote-enquiry form instead

You can also preview the **customer self-service page** at
**http://localhost:3000/manage/preview** — view a sample booking, reschedule
it to a new date and time, or cancel it. This is the page a client reaches
from the secure link in their confirmation email.

---

## 2. What is real vs. mock right now

| Part | Status |
|---|---|
| The full booking UI / flow / design | **Real** — production code |
| Mobile-responsive layout | **Real** |
| Session types & pricing | **Real** (from `lib/booking.ts`, mirrors `lib/pricing.ts`) |
| Calendar availability | **Real** when the Google env vars are set — falls back to deterministic mock if they're missing or the API errors |
| Google Calendar sync | **Connected** — writes the event, reads free/busy for availability |
| Payments (Stripe) | **Off** — deposits removed 2026-08-17. `STRIPE_SECRET_KEY` was never set in Vercel, so every online booking failed with "payment system not set up". Bookings now confirm with no payment and the full fee is settled on the day. The Stripe route and webhook remain in the repo, unused |
| Abuse protection on booking | **Real** — honeypot, per-IP rate limit (4/hour, best-effort in-memory), slot re-checked against Google Calendar before writing |
| Saving the booking | **The calendar event is the record.** No database yet (Phase A) |
| Enquiry submissions (team + branding quotes) | **Real** — emailed via Web3Forms, same key as the contact form |
| Confirmation email + `.ics` invite | **Built, needs `RESEND_API_KEY`** — see Phase E |
| Reminders / SMS | **Not yet connected** |
| Reschedule & cancel page (`/manage/<token>`) | **Mock** — shows a sample booking; the page says so |

Availability, opening hours and session lengths all come from `OPENING_HOURS`
and `sessionTypes` in `lib/booking.ts` — the mock engine and the real Google
Calendar engine read the same constants, so hours only need changing once.

---

## 3. The files involved

- `app/book/page.tsx` — the booking page (now uses the custom flow instead of
  the old Calendly embed).
- `components/BookingFlow.tsx` — the entire interactive booking experience.
  **This does not change** when the backend is added.
- `app/manage/[token]/page.tsx` — the customer self-service page.
- `components/ManageBooking.tsx` — view, reschedule and cancel a booking.
- `components/MonthCalendar.tsx` — the reusable month calendar grid.
- `lib/booking.ts` — session types, the availability engine, and the
  on-location **travel zones** (postcode area → flat fee). To change travel
  pricing, edit the `travelZones` list here — fees, zone names and postcode
  ranges are all adjustable. This file is the **single seam** to the backend:
  when the real system is built, only this file is rewired to call the API.
- `supabase/schema.sql` — the full production database schema, ready to run.

---

## 4. Turning it live — the phased plan

Each phase produces something that works. Do them in order.

### Phase A — Database (Supabase)

1. Create a free account at supabase.com and a new project.
2. In the project's **SQL Editor**, paste the contents of
   `supabase/schema.sql` and run it. This creates every table and seeds your
   organization, staff record, session types and working hours.
3. In **Project Settings → API**, copy the project URL and the keys.
4. Create a file named `.env.local` in the project root:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

   (`.env.local` is private and is never committed to git.)

### Phase B — Wire availability to the database

Replace the mock functions in `lib/booking.ts` (`getDaySlots`, `isBookable`)
with calls to a new `/api/availability` route that reads `availability_rules`,
`availability_exceptions` and `bookings` from Supabase. The UI does not change.

### Phase C — Google Calendar two-way sync

1. In the Google Cloud Console, create OAuth credentials and enable the
   Google Calendar API.
2. Add "Sign in with Google" for the admin (you) — this also grants calendar
   access.
3. On a confirmed booking, create a Google Calendar event; import your
   personal busy blocks back so they hide slots. (Full logic is in the
   blueprint document, section 8.)

### Phase D — Payments (Stripe) — currently switched off

Deposits are off as of 2026-08-17. Bookings are written directly by
`app/api/bookings/route.ts` and clients pay on the day.

To turn deposits back on:

1. Add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in Vercel and redeploy.
2. Give the instant session types a non-zero `depositPct` in `lib/booking.ts`
   (they were all `0.2` before).
3. In `components/BookingFlow.tsx`, point the instant submit back at
   `/api/checkout` and restore the redirect to `json.url`.

The Stripe route, its webhook and `lib/booking-fulfillment.ts` were left intact
and still work — nothing needs rebuilding. The booking flow's deposit copy is
already conditional on `depositPct`, so the deposit rows and "Continue to
payment" button reappear on their own.

**Trade-off to be aware of while deposits are off:** anyone can hold a slot
without paying, so no-shows cost a session slot rather than a forfeited
deposit. The safeguards in the booking route limit casual abuse but can't
replace a deposit.

### Phase E — Confirmations & reminders

Confirmation email is **built** (2026-08-17) and waits only on an API key.
`lib/email.ts` sends the client a confirmation with an `.ics` calendar invite
attached, plus an internal copy to the studio, from the Stripe webhook once the
calendar event exists. To switch it on:

1. Create a free account at [resend.com] and verify the sending domain
   `nickbrandphotography.com` using the DNS records Resend gives you.
2. In Vercel → Settings → Environment Variables add:
   - `RESEND_API_KEY` = `re_...` (mark **Sensitive**)
   - `EMAIL_FROM` = `Nick Brand Photography <studio@nickbrandphotography.com>`
     (optional — this is the default)
3. **Redeploy.** Env var changes do nothing until a redeploy.

Until the key is set, no email is sent, nothing errors, and the confirmation
screen tells the client their details are on screen instead of promising an
email. Once the key is set the screen switches to promising the email
automatically — it reads the `emailSent` flag the webhook stamps on the Stripe
session.

Before pointing it at a real client, note Resend only accepts sends to your own
account address until the domain is verified.

Still to do in this phase: SMS (Twilio), reminders the day before, prep guides
and post-shoot follow-ups.

---

## 5. The full blueprint

The complete product and engineering plan — database design, API
architecture, the double-booking guarantee, calendar sync logic, automation
flows, the V2 and SaaS roadmaps — is in the **Booking Platform Blueprint**
document delivered alongside this build. Refer to it for the detail behind
each phase above.

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
| Calendar availability | **Mock** — generated locally, deterministic |
| Saving the booking | **Mock** — not yet stored anywhere |
| Google Calendar sync | **Not yet connected** |
| Payments (Stripe) | **Not yet connected** |
| Confirmation emails / SMS | **Not yet connected** |

The preview is honest about this — the confirmation screen says so.

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

### Phase D — Payments (Stripe)

Connect Stripe so the "Confirm booking" button takes the deposit. The booking
only becomes `confirmed` once payment succeeds.

### Phase E — Confirmations & reminders

Add email (Resend) and SMS (Twilio) for confirmations, reminders, prep guides
and post-shoot follow-ups.

---

## 5. The full blueprint

The complete product and engineering plan — database design, API
architecture, the double-booking guarantee, calendar sync logic, automation
flows, the V2 and SaaS roadmaps — is in the **Booking Platform Blueprint**
document delivered alongside this build. Refer to it for the detail behind
each phase above.

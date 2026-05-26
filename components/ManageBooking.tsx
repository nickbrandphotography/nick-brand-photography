"use client";

/**
 * ManageBooking — the customer self-service page.
 *
 * Reached from the secure link in a confirmation email (/manage/[token]).
 * Lets a client view, reschedule or cancel their booking without emailing
 * Nick. Currently shows a SAMPLE booking with mock availability; when the
 * backend is connected, the booking is loaded by its token from Supabase.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "@/components/Section";
import MonthCalendar from "@/components/MonthCalendar";
import {
  getSessionType,
  getDaySlots,
  formatLongDate,
  startOfToday,
  type SessionType,
  type Slot,
} from "@/lib/booking";

type View = "view" | "reschedule" | "rescheduled" | "cancel" | "cancelled";

type Booking = {
  reference: string;
  service: SessionType;
  date: Date;
  slot: { label: string; hour: number; minute: number };
  customerName: string;
  customerEmail: string;
  location: string;
};

const AUD = (n: number) => `$${n.toLocaleString("en-AU")}`;

export default function ManageBooking({ token }: { token: string }) {
  const [booking, setBooking] = useState<Booking>(() => {
    const date = startOfToday();
    date.setDate(date.getDate() + 16);
    while (date.getDay() === 0 || date.getDay() === 6) {
      date.setDate(date.getDate() + 1);
    }
    return {
      reference: token && token !== "preview" ? token.toUpperCase() : "NBP-7K3Q",
      service: getSessionType("headshot-professional") as SessionType,
      date,
      slot: { label: "10:00 am", hour: 10, minute: 0 },
      customerName: "Jordan Mitchell",
      customerEmail: "jordan.mitchell@example.com",
      location: "Lane Cove studio",
    };
  });

  const [view, setView] = useState<View>("view");
  const [newDate, setNewDate] = useState<Date | null>(null);
  const [newSlot, setNewSlot] = useState<Slot | null>(null);
  const [working, setWorking] = useState(false);

  const deposit = useMemo(
    () => Math.round(booking.service.price * booking.service.depositPct),
    [booking.service],
  );

  const openSlots = newDate
    ? getDaySlots(newDate, booking.service.durationMin).filter(
        (s) => s.available,
      )
    : [];

  function confirmReschedule() {
    if (!newDate || !newSlot) return;
    setWorking(true);
    window.setTimeout(() => {
      setBooking({ ...booking, date: newDate, slot: newSlot });
      setWorking(false);
      setView("rescheduled");
    }, 750);
  }

  function confirmCancel() {
    setWorking(true);
    window.setTimeout(() => {
      setWorking(false);
      setView("cancelled");
    }, 750);
  }

  return (
    <section className="section bg-ink">
      <Container>
        <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="rule-gold" />
          <span className="eyebrow">Manage Booking</span>
        </div>
        <h1 className="font-display mt-5 text-3xl text-cream sm:text-4xl">
          {view === "cancelled"
            ? "Booking cancelled"
            : view === "rescheduled"
              ? "Session rescheduled"
              : "Your booking"}
        </h1>

        <div className="mt-8 border border-border bg-surface p-6 sm:p-8">
          {/* ---------------------------------------------------------- */}
          {view === "view" && (
            <>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-gold/15 px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-wider text-gold">
                  Confirmed
                </span>
                <span className="text-[0.74rem] tracking-wider text-faint">
                  {booking.reference}
                </span>
              </div>
              <h2 className="font-display mt-4 text-2xl text-cream">
                {booking.service.name}
              </h2>
              <dl className="mt-5 space-y-3 text-sm">
                <Row label="Date" value={formatLongDate(booking.date)} />
                <Row label="Time" value={booking.slot.label} />
                <Row
                  label="Duration"
                  value={`${booking.service.durationMin} minutes`}
                />
                <Row label="Location" value={booking.location} />
                <Row label="Booked by" value={booking.customerName} />
              </dl>
              <dl className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
                <Row label="Session fee" value={AUD(booking.service.price)} />
                <Row label="Deposit paid" value={AUD(deposit)} accent />
                <Row
                  label="Balance on the day"
                  value={AUD(booking.service.price - deposit)}
                />
              </dl>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setNewDate(null);
                    setNewSlot(null);
                    setView("reschedule");
                  }}
                  className="bg-gold px-7 py-3.5 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold-soft"
                >
                  Reschedule
                </button>
                <button
                  type="button"
                  onClick={() => setView("cancel")}
                  className="border border-border-strong px-7 py-3.5 text-[0.78rem] uppercase tracking-[0.18em] text-cream transition-colors hover:border-gold hover:text-gold"
                >
                  Cancel booking
                </button>
              </div>
            </>
          )}

          {/* ---------------------------------------------------------- */}
          {view === "reschedule" && (
            <>
              <button
                type="button"
                onClick={() => setView("view")}
                className="text-[0.72rem] uppercase tracking-[0.16em] text-faint transition-colors hover:text-gold"
              >
                ← Back to booking
              </button>
              <h2 className="font-display mt-3 text-2xl text-cream">
                Pick a new date &amp; time
              </h2>
              <p className="mt-2 text-sm text-muted">
                {booking.service.name} · {booking.service.durationMin} minutes.
              </p>

              <div className="mt-6">
                <MonthCalendar
                  durationMin={booking.service.durationMin}
                  selectedDate={newDate}
                  onPick={(d) => {
                    setNewDate(d);
                    setNewSlot(null);
                  }}
                />
              </div>

              {newDate && (
                <div className="mt-6 border-t border-border pt-6">
                  <p className="text-sm text-cream">
                    {formatLongDate(newDate)}
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {openSlots.map((slot) => {
                      const isSel =
                        newSlot != null &&
                        newSlot.hour === slot.hour &&
                        newSlot.minute === slot.minute;
                      return (
                        <button
                          key={slot.label}
                          type="button"
                          onClick={() => setNewSlot(slot)}
                          className={`border py-2.5 text-sm transition-colors ${
                            isSel
                              ? "border-gold bg-gold font-semibold text-ink"
                              : "border-border bg-ink-2 text-cream hover:border-gold hover:text-gold"
                          }`}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="button"
                disabled={!newSlot || working}
                onClick={confirmReschedule}
                className="mt-7 w-full bg-gold px-7 py-3.5 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-30"
              >
                {working ? "Saving…" : "Confirm new time"}
              </button>
            </>
          )}

          {/* ---------------------------------------------------------- */}
          {view === "rescheduled" && (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold text-xl text-ink">
                ✓
              </div>
              <h2 className="font-display mt-5 text-2xl text-cream">
                All done
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
                Your session has been moved. An updated confirmation and
                calendar invite are on the way.
              </p>
              <dl className="mx-auto mt-6 max-w-xs border border-border bg-ink-2 p-5 text-left text-sm">
                <Row label="New date" value={formatLongDate(booking.date)} />
                <div className="mt-3">
                  <Row label="New time" value={booking.slot.label} />
                </div>
              </dl>
              <button
                type="button"
                onClick={() => setView("view")}
                className="mt-6 border border-border-strong px-7 py-3.5 text-[0.78rem] uppercase tracking-[0.18em] text-cream transition-colors hover:border-gold hover:text-gold"
              >
                View booking
              </button>
            </div>
          )}

          {/* ---------------------------------------------------------- */}
          {view === "cancel" && (
            <>
              <h2 className="font-display text-2xl text-cream">
                Cancel this booking?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                You&apos;re about to cancel your{" "}
                <span className="text-cream">{booking.service.name}</span> on{" "}
                <span className="text-cream">
                  {formatLongDate(booking.date)}
                </span>{" "}
                at {booking.slot.label}. The slot will be released for other
                clients. Nick will be in touch about your {AUD(deposit)}{" "}
                deposit — cancellations are handled flexibly, case by case.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={working}
                  onClick={confirmCancel}
                  className="border border-border-strong px-7 py-3.5 text-[0.78rem] uppercase tracking-[0.18em] text-cream transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
                >
                  {working ? "Cancelling…" : "Yes, cancel booking"}
                </button>
                <button
                  type="button"
                  onClick={() => setView("view")}
                  className="bg-gold px-7 py-3.5 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold-soft"
                >
                  Keep my booking
                </button>
              </div>
            </>
          )}

          {/* ---------------------------------------------------------- */}
          {view === "cancelled" && (
            <div className="text-center">
              <h2 className="font-display text-2xl text-cream">
                Your booking is cancelled
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
                The {booking.service.name} session has been cancelled and the
                time released. A confirmation email has been sent. Nick will
                follow up about your deposit shortly.
              </p>
              <Link
                href="/book"
                className="mt-6 inline-block bg-gold px-7 py-3.5 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold-soft"
              >
                Book a new session
              </Link>
            </div>
          )}
        </div>

        {/* Help footer */}
        {(view === "view" || view === "reschedule" || view === "cancel") && (
          <p className="mt-6 text-center text-sm text-faint">
            Need a hand? Call{" "}
            <a
              href={`tel:${site.phoneIntl}`}
              className="text-gold transition-colors hover:text-gold-soft"
            >
              {site.phone}
            </a>{" "}
            or email{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-gold transition-colors hover:text-gold-soft"
            >
              {site.email}
            </a>
            .
          </p>
        )}

        <p className="mt-4 text-center text-[0.72rem] leading-relaxed text-faint">
          Preview note: this page shows a sample booking with mock data. Once
          the backend is connected, your real booking loads securely from its
          link.
        </p>
        </div>
      </Container>
    </section>
  );
}

function Row({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-faint">{label}</dt>
      <dd className={accent ? "font-semibold text-gold" : "text-cream"}>
        {value}
      </dd>
    </div>
  );
}

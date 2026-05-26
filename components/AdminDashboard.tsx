"use client";

/**
 * AdminDashboard — Nick's cockpit (preview).
 *
 * Today's schedule, upcoming bookings, new enquiries and headline numbers
 * at a glance. Currently renders MOCK data so it can be viewed with no
 * backend. When Supabase is connected, the mock arrays below are replaced
 * by a read from /api/admin/* — the layout stays the same.
 *
 * In production this route sits behind Supabase Auth (admin login).
 */

import { useMemo } from "react";
import { Container } from "@/components/Section";
import { startOfToday, formatLongDate } from "@/lib/booking";

type Status = "confirmed" | "pending" | "completed";

type AdminBooking = {
  ref: string;
  client: string;
  service: string;
  date: Date;
  time: string;
  status: Status;
  amount: number;
};

type Enquiry = {
  company: string;
  contact: string;
  topic: string;
  daysAgo: number;
};

const AUD = (n: number) => `$${n.toLocaleString("en-AU")}`;

function addDays(base: Date, n: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}

function shortDate(d: Date): string {
  return d.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function AdminDashboard() {
  const today = useMemo(() => startOfToday(), []);

  const bookings = useMemo<AdminBooking[]>(
    () => [
      { ref: "NBP-9F2K", client: "Sarah Chen", service: "Corporate Headshot — Essential", date: today, time: "9:00 am", status: "confirmed", amount: 395 },
      { ref: "NBP-4T8M", client: "Marcus Reid", service: "Corporate Headshot — Professional", date: today, time: "11:30 am", status: "confirmed", amount: 695 },
      { ref: "NBP-7K3Q", client: "Priya Nair", service: "Corporate Headshot — Essential", date: today, time: "2:00 pm", status: "confirmed", amount: 395 },
      { ref: "NBP-2W6H", client: "James Whitfield", service: "Corporate Headshot — Professional", date: addDays(today, 2), time: "10:00 am", status: "confirmed", amount: 695 },
      { ref: "NBP-5N1P", client: "The Donnelly Family", service: "Family Session", date: addDays(today, 3), time: "9:00 am", status: "confirmed", amount: 550 },
      { ref: "NBP-8R4C", client: "Alana Burke", service: "Actor & Model Portfolio", date: addDays(today, 5), time: "1:00 pm", status: "pending", amount: 750 },
      { ref: "NBP-3J7D", client: "Tom Hargreave", service: "Corporate Headshot — Professional", date: addDays(today, 8), time: "10:00 am", status: "confirmed", amount: 695 },
      { ref: "NBP-6X2L", client: "Rebecca Lin", service: "Corporate Headshot — Essential", date: addDays(today, 12), time: "9:30 am", status: "confirmed", amount: 395 },
      { ref: "NBP-1B9V", client: "David Osei", service: "Corporate Headshot — Professional", date: addDays(today, -3), time: "11:00 am", status: "completed", amount: 695 },
      { ref: "NBP-0M5G", client: "Nina Falk", service: "Corporate Headshot — Essential", date: addDays(today, -6), time: "3:00 pm", status: "completed", amount: 395 },
    ],
    [today],
  );

  const enquiries = useMemo<Enquiry[]>(
    () => [
      { company: "Hartley & Co", contact: "Eleanor Hartley", topic: "Executive portraits — leadership team of 8", daysAgo: 0 },
      { company: "Northbridge Legal", contact: "Daniel Cruz", topic: "On-site team headshots — 24 staff", daysAgo: 2 },
      { company: "Vela Studio", contact: "Mia Tran", topic: "Corporate event coverage — product launch", daysAgo: 4 },
    ],
    [],
  );

  const todays = bookings.filter(
    (b) => b.date.toDateString() === today.toDateString(),
  );
  const upcoming = bookings
    .filter((b) => b.date > today)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  const futureConfirmed = bookings.filter(
    (b) => b.date >= today && b.status === "confirmed",
  );
  const confirmedValue = bookings
    .filter((b) => b.status !== "pending")
    .reduce((sum, b) => sum + b.amount, 0);
  const next7 = bookings.filter(
    (b) => b.date >= today && b.date <= addDays(today, 7),
  ).length;

  const stats = [
    { label: "Upcoming sessions", value: String(futureConfirmed.length) },
    { label: "Confirmed value", value: AUD(confirmedValue) },
    { label: "Open enquiries", value: String(enquiries.length) },
    { label: "Next 7 days", value: String(next7) },
  ];

  return (
    <section className="section bg-ink">
      <Container>
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="rule-gold" />
              <span className="eyebrow">Admin</span>
            </div>
            <h1 className="font-display mt-4 text-3xl text-cream sm:text-4xl">
              Booking dashboard
            </h1>
            <p className="mt-2 text-sm text-muted">
              {formatLongDate(today)}
            </p>
          </div>
          <span className="rounded-full border border-border-strong px-3 py-1 text-[0.66rem] uppercase tracking-wider text-faint">
            Preview · mock data
          </span>
        </div>

        {/* Stat cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="border border-border bg-surface p-6">
              <p className="text-[0.72rem] uppercase tracking-[0.14em] text-faint">
                {s.label}
              </p>
              <p className="font-display mt-3 text-3xl text-gold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Today + enquiries */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Today's schedule */}
          <div className="border border-border bg-surface p-6">
            <h2 className="font-display text-xl text-cream">
              Today&apos;s schedule
            </h2>
            {todays.length === 0 ? (
              <p className="mt-4 text-sm text-faint">
                No sessions booked today.
              </p>
            ) : (
              <ul className="mt-5 space-y-3">
                {todays.map((b) => (
                  <li
                    key={b.ref}
                    className="flex items-center gap-4 border border-border bg-ink-2 p-4"
                  >
                    <div className="w-20 shrink-0 text-center">
                      <p className="font-display text-base text-gold">
                        {b.time}
                      </p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-cream">{b.client}</p>
                      <p className="truncate text-[0.8rem] text-faint">
                        {b.service}
                      </p>
                    </div>
                    <StatusBadge status={b.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* New enquiries */}
          <div className="border border-border bg-surface p-6">
            <h2 className="font-display text-xl text-cream">New enquiries</h2>
            <ul className="mt-5 space-y-3">
              {enquiries.map((e) => (
                <li
                  key={e.company}
                  className="border border-border bg-ink-2 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-cream">{e.company}</p>
                    <span className="shrink-0 text-[0.72rem] text-faint">
                      {e.daysAgo === 0
                        ? "Today"
                        : `${e.daysAgo} day${e.daysAgo > 1 ? "s" : ""} ago`}
                    </span>
                  </div>
                  <p className="mt-1 text-[0.8rem] text-muted">{e.topic}</p>
                  <p className="mt-1 text-[0.76rem] text-faint">
                    {e.contact}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Upcoming bookings */}
        <div className="mt-6 border border-border bg-surface p-6">
          <h2 className="font-display text-xl text-cream">
            Upcoming bookings
          </h2>
          <div className="mt-5 overflow-hidden">
            {/* Column headers (desktop) */}
            <div className="hidden grid-cols-[1.4fr_1.6fr_1fr_0.8fr_0.7fr] gap-4 border-b border-border pb-3 text-[0.68rem] uppercase tracking-[0.12em] text-faint sm:grid">
              <span>Client</span>
              <span>Session</span>
              <span>Date &amp; time</span>
              <span>Status</span>
              <span className="text-right">Value</span>
            </div>
            <ul>
              {upcoming.map((b) => (
                <li
                  key={b.ref}
                  className="grid grid-cols-2 gap-x-4 gap-y-1 border-b border-border py-4 text-sm sm:grid-cols-[1.4fr_1.6fr_1fr_0.8fr_0.7fr] sm:items-center sm:gap-y-0"
                >
                  <span className="text-cream">{b.client}</span>
                  <span className="text-muted">{b.service}</span>
                  <span className="text-muted">
                    {shortDate(b.date)} · {b.time}
                  </span>
                  <span>
                    <StatusBadge status={b.status} />
                  </span>
                  <span className="text-right font-medium text-cream">
                    {AUD(b.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-6 text-center text-[0.72rem] leading-relaxed text-faint">
          Preview note: this dashboard shows sample data. When the backend is
          connected it reads live bookings, and this route is protected by an
          admin login.
        </p>
      </Container>
    </section>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    confirmed: "bg-gold/15 text-gold",
    pending: "border border-border-strong text-muted",
    completed: "bg-surface-2 text-faint",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-wider ${styles[status]}`}
    >
      {status}
    </span>
  );
}

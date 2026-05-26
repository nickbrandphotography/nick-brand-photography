"use client";

/**
 * MonthCalendar — a reusable month-grid date picker.
 *
 * Shows only dates that are genuinely bookable for the given session length
 * (via lib/booking). Manages its own month navigation. Used by the
 * manage-booking reschedule flow.
 */

import { useMemo, useState } from "react";
import { isBookable, startOfToday } from "@/lib/booking";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MonthCalendar({
  durationMin,
  selectedDate,
  onPick,
}: {
  durationMin: number;
  selectedDate: Date | null;
  onPick: (d: Date) => void;
}) {
  const today = useMemo(() => startOfToday(), []);
  const [viewMonth, setViewMonth] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const canGoPrev =
    viewMonth.getFullYear() > today.getFullYear() ||
    (viewMonth.getFullYear() === today.getFullYear() &&
      viewMonth.getMonth() > today.getMonth());

  const cells = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Mon = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const out: (Date | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(new Date(year, month, d));
    return out;
  }, [viewMonth]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          disabled={!canGoPrev}
          onClick={() =>
            setViewMonth(
              new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1),
            )
          }
          className="flex h-9 w-9 items-center justify-center border border-border text-cream transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
        >
          ‹
        </button>
        <span className="font-display text-lg text-cream">
          {viewMonth.toLocaleDateString("en-AU", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          type="button"
          aria-label="Next month"
          onClick={() =>
            setViewMonth(
              new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1),
            )
          }
          className="flex h-9 w-9 items-center justify-center border border-border text-cream transition-colors hover:border-gold hover:text-gold"
        >
          ›
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="py-2 text-center text-[0.66rem] uppercase tracking-wider text-faint"
          >
            {w}
          </div>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={`pad-${i}`} />;
          const bookable = isBookable(date, durationMin);
          const isSelected =
            selectedDate != null &&
            date.toDateString() === selectedDate.toDateString();
          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={!bookable}
              onClick={() => onPick(date)}
              className={`aspect-square text-sm transition-colors ${
                isSelected
                  ? "bg-gold font-semibold text-ink"
                  : bookable
                    ? "bg-ink-2 text-cream hover:bg-surface-2 hover:text-gold"
                    : "text-faint/40"
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[0.74rem] text-faint">
        Greyed dates are fully booked or outside the booking window.
      </p>
    </div>
  );
}

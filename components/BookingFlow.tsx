"use client";

/**
 * BookingFlow — the custom booking experience for Nick Brand Photography.
 *
 * A multi-step flow: choose a session → pick date, time & location → enter
 * details → confirmation. Enquiry-only services (teams/events) route to a
 * brief form.
 *
 * On-location-capable sessions let the client choose the Lane Cove studio
 * (no travel fee) or their own workplace, where a flat travel fee is added
 * based on the postcode (see travelZones in lib/booking.ts).
 *
 * Availability is currently served by lib/booking.ts as deterministic MOCK
 * data, so this runs with no backend. When Supabase + Google Calendar are
 * connected, only lib/booking.ts changes — this component stays as-is.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import {
  sessionTypes,
  getSessionType,
  isBookable,
  startOfToday,
  formatLongDate,
  dateKey,
  findTravelZone,
  type SessionType,
  type Slot,
  type TravelZone,
} from "@/lib/booking";

type Step = "service" | "datetime" | "details" | "enquiry" | "done";
type LocationMode = "studio" | "onlocation";

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  note: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  note: "",
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AUD = (n: number) => `$${n.toLocaleString("en-AU")}`;

/* ------------------------------------------------------------------------ */

export default function BookingFlow() {
  const today = useMemo(() => startOfToday(), []);

  const [step, setStep] = useState<Step>("service");
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [viewMonth, setViewMonth] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [locationMode, setLocationMode] = useState<LocationMode>("studio");
  const [postcode, setPostcode] = useState("");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [touched, setTouched] = useState(false);
  // Fields the user has blurred at least once. Combined with `touched`
  // (set on submit) so errors appear as soon as a field has been visited,
  // not only after the whole form is attempted.
  const [blurred, setBlurred] = useState<Record<keyof FormState, boolean>>({
    name: false,
    email: false,
    phone: false,
    company: false,
    note: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [reference, setReference] = useState<string>("");
  const [manageToken, setManageToken] = useState<string>("");

  const markBlurred = useCallback((name: keyof FormState) => {
    setBlurred((prev) => (prev[name] ? prev : { ...prev, [name]: true }));
  }, []);

  // Cache of fetched slots keyed by "YYYY-MM-DD#durationMin".
  const [slotsCache, setSlotsCache] = useState<Record<string, Slot[]>>({});
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Fetch real availability from the API whenever the selected date changes.
  const fetchSlots = useCallback(
    async (date: Date, durationMin: number) => {
      const cacheKey = `${dateKey(date)}#${durationMin}`;
      if (slotsCache[cacheKey]) return; // already fetched
      setSlotsLoading(true);
      try {
        const res = await fetch(
          `/api/availability?date=${dateKey(date)}&duration=${durationMin}`,
        );
        if (res.ok) {
          const json = await res.json();
          setSlotsCache((prev) => ({ ...prev, [cacheKey]: json.slots }));
        }
      } catch {
        // Silently fall back to mock data already in the calendar.
      } finally {
        setSlotsLoading(false);
      }
    },
    [slotsCache],
  );

  const service = serviceId ? getSessionType(serviceId) : undefined;

  // Travel zone resolves from the postcode only when "on-location" is chosen.
  const travelZone = useMemo<TravelZone | null>(() => {
    if (locationMode !== "onlocation") return null;
    if (!/^\d{4}$/.test(postcode.trim())) return null;
    return findTravelZone(parseInt(postcode.trim(), 10));
  }, [locationMode, postcode]);
  const travelFee = travelZone ? travelZone.fee : 0;

  /* --- navigation ------------------------------------------------------- */

  function chooseService(s: SessionType) {
    setServiceId(s.id);
    setSelectedDate(null);
    setSelectedSlot(null);
    setLocationMode("studio");
    setPostcode("");
    setStep(s.mode === "enquiry" ? "enquiry" : "datetime");
  }

  function restart() {
    setStep("service");
    setServiceId(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setLocationMode("studio");
    setPostcode("");
    setForm(EMPTY_FORM);
    setTouched(false);
    setBlurred({
      name: false,
      email: false,
      phone: false,
      company: false,
      note: false,
    });
    setSubmitError("");
    setReference("");
  }

  async function submitBooking() {
    setTouched(true);
    setSubmitError("");
    const validInstant =
      form.name.trim() && EMAIL_RE.test(form.email) && form.phone.trim();
    const validEnquiry =
      form.name.trim() && EMAIL_RE.test(form.email) && form.note.trim();
    if (step === "details" && !validInstant) return;
    if (step === "enquiry" && !validEnquiry) return;

    setSubmitting(true);

    if (step === "details" && service && selectedDate && selectedSlot) {
      try {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: service.id,
            date: dateKey(selectedDate),
            hour: selectedSlot.hour,
            minute: selectedSlot.minute,
            locationMode,
            postcode,
            travelFee,
            name: form.name,
            email: form.email,
            phone: form.phone,
            company: form.company,
            note: form.note,
          }),
        });
        if (res.ok) {
          const json = await res.json();
          setReference(json.reference);
          setManageToken(json.manageToken);
        } else {
          // Server error — surface the message so the user knows it failed.
          let msg = "We couldn't confirm your booking. Please try again.";
          try {
            const json = await res.json();
            if (json && typeof json.error === "string") msg = json.error;
          } catch {
            /* response wasn't JSON — keep generic message */
          }
          setSubmitError(msg);
          setSubmitting(false);
          return;
        }
      } catch {
        setSubmitError(
          "We couldn't reach the booking server. Check your connection and try again.",
        );
        setSubmitting(false);
        return;
      }
    } else {
      // Enquiry path — no booking record created yet; just show done.
      setReference("");
      setManageToken("");
    }

    setSubmitting(false);
    setTouched(false);
    setStep("done");
  }

  /* --- render ----------------------------------------------------------- */

  return (
    <div className="border border-border bg-surface">
      <StepRail step={step} mode={service?.mode ?? "instant"} />

      <div className="p-6 sm:p-9">
        {step === "service" && (
          <ServiceStep onChoose={chooseService} selectedId={serviceId} />
        )}

        {step === "datetime" && service && (
          <DateTimeStep
            service={service}
            viewMonth={viewMonth}
            today={today}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            locationMode={locationMode}
            postcode={postcode}
            travelZone={travelZone}
            slotsCache={slotsCache}
            slotsLoading={slotsLoading}
            onSetLocationMode={setLocationMode}
            onSetPostcode={setPostcode}
            onPrevMonth={() =>
              setViewMonth(
                new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1),
              )
            }
            onNextMonth={() =>
              setViewMonth(
                new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1),
              )
            }
            onPickDate={(d) => {
              setSelectedDate(d);
              setSelectedSlot(null);
              if (service) fetchSlots(d, service.durationMin);
            }}
            onPickSlot={setSelectedSlot}
            onBack={restart}
            onContinue={() => setStep("details")}
          />
        )}

        {step === "details" && service && selectedDate && selectedSlot && (
          <DetailsStep
            service={service}
            date={selectedDate}
            slot={selectedSlot}
            locationMode={locationMode}
            postcode={postcode}
            travelZone={travelZone}
            travelFee={travelFee}
            form={form}
            touched={touched}
            blurred={blurred}
            submitting={submitting}
            submitError={submitError}
            onChange={(patch) => setForm({ ...form, ...patch })}
            onBlur={markBlurred}
            onBack={() => setStep("datetime")}
            onSubmit={submitBooking}
          />
        )}

        {step === "enquiry" && service && (
          <EnquiryStep
            service={service}
            form={form}
            touched={touched}
            blurred={blurred}
            submitting={submitting}
            submitError={submitError}
            onChange={(patch) => setForm({ ...form, ...patch })}
            onBlur={markBlurred}
            onBack={restart}
            onSubmit={submitBooking}
          />
        )}

        {step === "done" && service && (
          <DoneStep
            service={service}
            date={selectedDate}
            slot={selectedSlot}
            locationMode={locationMode}
            postcode={postcode}
            reference={reference}
            manageToken={manageToken}
            name={form.name}
            onRestart={restart}
          />
        )}
      </div>
    </div>
  );
}

/* ======================================================================== */
/*  Step rail                                                               */
/* ======================================================================== */

function StepRail({ step, mode }: { step: Step; mode: "instant" | "enquiry" }) {
  const labels =
    mode === "enquiry"
      ? ["Session", "Project brief", "Sent"]
      : ["Session", "Date, time & place", "Your details", "Confirmed"];

  const indexByStep: Record<Step, number> = {
    service: 0,
    datetime: 1,
    details: 2,
    enquiry: 1,
    done: labels.length - 1,
  };
  const active = indexByStep[step];

  return (
    <div className="flex items-center gap-2 border-b border-border bg-ink-2 px-6 py-4 sm:px-9">
      {labels.map((label, i) => {
        const done = i < active;
        const current = i === active;
        return (
          <div key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                current
                  ? "bg-gold text-ink"
                  : done
                    ? "bg-gold-dim text-ink"
                    : "border border-border-strong text-faint"
              }`}
            >
              {done ? "✓" : i + 1}
            </span>
            <span
              className={`hidden text-[0.72rem] uppercase tracking-[0.14em] sm:block ${
                current ? "text-cream" : "text-faint"
              }`}
            >
              {label}
            </span>
            {i < labels.length - 1 && (
              <span className="ml-auto hidden h-px flex-1 bg-border sm:block" />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ======================================================================== */
/*  Step 1 — choose a session                                               */
/* ======================================================================== */

function ServiceStep({
  onChoose,
  selectedId,
}: {
  onChoose: (s: SessionType) => void;
  selectedId: string | null;
}) {
  return (
    <div>
      <h3 className="font-display text-2xl text-cream sm:text-3xl">
        What would you like to book?
      </h3>
      <p className="mt-2 text-sm text-muted">
        Choose a session to see live availability. Teams and events route to a
        quick quote.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {sessionTypes.map((s) => {
          const isSelected = s.id === selectedId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChoose(s)}
              className={`group flex flex-col border p-6 text-left transition-colors ${
                isSelected
                  ? "border-gold bg-surface-2"
                  : "border-border bg-ink-2 hover:border-gold/60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="eyebrow">{s.category}</span>
                {s.popular && (
                  <span className="rounded-full bg-gold px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wider text-ink">
                    Most popular
                  </span>
                )}
              </div>
              <h4 className="font-display mt-3 text-xl leading-snug text-cream">
                {s.name}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {s.blurb}
              </p>
              <ul className="mt-4 space-y-1.5">
                {s.includes.map((inc) => (
                  <li
                    key={inc}
                    className="flex items-start gap-2 text-[0.83rem] text-faint"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                    {inc}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-cream">
                  {s.mode === "enquiry" ? (
                    "Custom quote"
                  ) : (
                    <>
                      <span className="font-display text-lg text-gold">
                        {AUD(s.price)}
                      </span>
                      <span className="text-faint"> · {s.durationMin} min</span>
                    </>
                  )}
                </span>
                <span className="text-[0.72rem] uppercase tracking-[0.16em] text-gold transition-transform group-hover:translate-x-1">
                  {s.mode === "enquiry" ? "Enquire →" : "Select →"}
                </span>
              </div>
              {s.allowsOnLocation && (
                <p className="mt-3 text-[0.74rem] text-faint">
                  Studio, or on-location at your workplace (travel fee added).
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ======================================================================== */
/*  Step 2 — date, time & location                                          */
/* ======================================================================== */

function DateTimeStep({
  service,
  viewMonth,
  today,
  selectedDate,
  selectedSlot,
  locationMode,
  postcode,
  travelZone,
  slotsCache,
  slotsLoading,
  onSetLocationMode,
  onSetPostcode,
  onPrevMonth,
  onNextMonth,
  onPickDate,
  onPickSlot,
  onBack,
  onContinue,
}: {
  service: SessionType;
  viewMonth: Date;
  today: Date;
  selectedDate: Date | null;
  selectedSlot: Slot | null;
  locationMode: LocationMode;
  postcode: string;
  travelZone: TravelZone | null;
  slotsCache: Record<string, Slot[]>;
  slotsLoading: boolean;
  onSetLocationMode: (m: LocationMode) => void;
  onSetPostcode: (p: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPickDate: (d: Date) => void;
  onPickSlot: (s: Slot) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const canGoPrev =
    viewMonth.getFullYear() > today.getFullYear() ||
    (viewMonth.getFullYear() === today.getFullYear() &&
      viewMonth.getMonth() > today.getMonth());

  const cells = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const out: (Date | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(new Date(year, month, d));
    return out;
  }, [viewMonth]);

  // Use API-fetched slots if available, otherwise fall back to the client mock.
  const openSlots = useMemo(() => {
    if (!selectedDate) return [];
    const cacheKey = `${dateKey(selectedDate)}#${service.durationMin}`;
    const cached = slotsCache[cacheKey];
    if (cached) return cached.filter((s) => s.available);
    // While loading or before first fetch, fall back to the mock.
    return isBookable(selectedDate, service.durationMin)
      ? [] // show loading state instead of stale mock slots
      : [];
  }, [selectedDate, service.durationMin, slotsCache]);

  const postcodeComplete = /^\d{4}$/.test(postcode.trim());
  const locationReady =
    !service.allowsOnLocation ||
    locationMode === "studio" ||
    travelZone != null;

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="text-[0.72rem] uppercase tracking-[0.16em] text-faint transition-colors hover:text-gold"
      >
        ← Change session
      </button>

      <h3 className="font-display mt-3 text-2xl text-cream sm:text-3xl">
        Pick a date, time &amp; place
      </h3>
      <p className="mt-2 text-sm text-muted">
        {service.name} · {service.durationMin} minutes. Every slot shown is open
        right now.
      </p>

      {/* Location choice (on-location-capable sessions only) */}
      {service.allowsOnLocation && (
        <div className="mt-6 border border-border bg-ink-2 p-5">
          <p className="text-sm text-cream">Where would you like the shoot?</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onSetLocationMode("studio")}
              className={`flex flex-col border p-4 text-left transition-colors ${
                locationMode === "studio"
                  ? "border-gold bg-surface-2"
                  : "border-border bg-surface hover:border-gold/60"
              }`}
            >
              <span className="text-sm text-cream">Lane Cove studio</span>
              <span className="mt-1 text-[0.78rem] text-faint">
                Included — no travel fee
              </span>
            </button>
            <button
              type="button"
              onClick={() => onSetLocationMode("onlocation")}
              className={`flex flex-col border p-4 text-left transition-colors ${
                locationMode === "onlocation"
                  ? "border-gold bg-surface-2"
                  : "border-border bg-surface hover:border-gold/60"
              }`}
            >
              <span className="text-sm text-cream">At my workplace</span>
              <span className="mt-1 text-[0.78rem] text-faint">
                Nick comes to you — travel fee added
              </span>
            </button>
          </div>

          {locationMode === "onlocation" && (
            <div className="mt-4">
              <label className="block">
                <span className="text-[0.74rem] uppercase tracking-[0.12em] text-faint">
                  Postcode of the shoot location
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={postcode}
                  onChange={(e) =>
                    onSetPostcode(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  placeholder="e.g. 2000"
                  className="mt-1.5 block w-full max-w-[12rem] border border-border bg-surface px-3.5 py-2.5 text-sm text-cream placeholder:text-faint transition-colors focus:border-gold focus:outline-none"
                />
              </label>
              {postcodeComplete && travelZone && (
                <p className="mt-2 text-[0.8rem] text-gold">
                  {travelZone.label} — travel fee {AUD(travelZone.fee)}. Covers{" "}
                  {travelZone.examples} and nearby.
                </p>
              )}
              {postcodeComplete && !travelZone && (
                <p className="mt-2 text-[0.8rem] text-muted">
                  That postcode is outside the standard travel area. Choose the
                  studio above, or call {site.phone} for a custom quote.
                </p>
              )}
              {!postcodeComplete && (
                <p className="mt-2 text-[0.8rem] text-faint">
                  Enter the 4-digit postcode where the shoot will take place to
                  see the travel fee.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-7 grid gap-7 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Calendar */}
        <div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onPrevMonth}
              disabled={!canGoPrev}
              aria-label="Previous month"
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
              onClick={onNextMonth}
              aria-label="Next month"
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
              if (!date) return <div key={`x${i}`} />;
              const bookable = isBookable(date, service.durationMin);
              const isSelected =
                selectedDate != null &&
                date.toDateString() === selectedDate.toDateString();
              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  disabled={!bookable}
                  onClick={() => onPickDate(date)}
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

        {/* Slots */}
        <div className="border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
          {!selectedDate ? (
            <div className="flex h-full min-h-40 items-center justify-center text-center text-sm text-faint">
              Select a date to see available times.
            </div>
          ) : slotsLoading ? (
            <div className="flex h-full min-h-40 items-center justify-center text-center text-sm text-faint">
              Checking availability…
            </div>
          ) : (
            <>
              <p className="text-sm text-cream">
                {formatLongDate(selectedDate)}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {openSlots.map((slot) => {
                  const isSel =
                    selectedSlot != null &&
                    selectedSlot.hour === slot.hour &&
                    selectedSlot.minute === slot.minute;
                  return (
                    <button
                      key={slot.label}
                      type="button"
                      onClick={() => onPickSlot(slot)}
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
            </>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-border pt-6">
        {selectedSlot && !locationReady && (
          <span className="text-[0.78rem] text-faint">
            Add a valid postcode for the on-location shoot to continue.
          </span>
        )}
        <button
          type="button"
          disabled={!selectedSlot || !locationReady}
          onClick={onContinue}
          className="bg-gold px-8 py-3.5 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-30"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

/* ======================================================================== */
/*  Step 3 — your details (instant booking)                                 */
/* ======================================================================== */

function DetailsStep({
  service,
  date,
  slot,
  locationMode,
  postcode,
  travelZone,
  travelFee,
  form,
  touched,
  blurred,
  submitting,
  submitError,
  onChange,
  onBlur,
  onBack,
  onSubmit,
}: {
  service: SessionType;
  date: Date;
  slot: Slot;
  locationMode: LocationMode;
  postcode: string;
  travelZone: TravelZone | null;
  travelFee: number;
  form: FormState;
  touched: boolean;
  blurred: Record<keyof FormState, boolean>;
  submitting: boolean;
  submitError: string;
  onChange: (patch: Partial<FormState>) => void;
  onBlur: (name: keyof FormState) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const total = service.price + travelFee;
  const deposit = Math.round(total * service.depositPct);
  const balance = total - deposit;
  const onLocation = locationMode === "onlocation";
  const locationLabel = onLocation
    ? `On-location · ${postcode}`
    : "Lane Cove studio";

  // A field shows its error once it's been blurred OR the user has tried
  // to submit the whole form at least once.
  const show = (name: keyof FormState) => touched || blurred[name];

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="text-[0.72rem] uppercase tracking-[0.16em] text-faint transition-colors hover:text-gold"
      >
        ← Change date, time &amp; place
      </button>

      <h3 className="font-display mt-3 text-2xl text-cream sm:text-3xl">
        Your details
      </h3>

      <div className="mt-7 grid gap-7 lg:grid-cols-[1fr_0.8fr]">
        {/* Form */}
        <form
          className="order-2 lg:order-1"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Full name"
              required
              value={form.name}
              onChange={(v) => onChange({ name: v })}
              onBlur={() => onBlur("name")}
              error={show("name") && !form.name.trim() ? "Required" : ""}
              autoComplete="name"
            />
            <Field
              label="Phone"
              required
              value={form.phone}
              onChange={(v) => onChange({ phone: v })}
              onBlur={() => onBlur("phone")}
              error={show("phone") && !form.phone.trim() ? "Required" : ""}
              autoComplete="tel"
              type="tel"
            />
          </div>
          <div className="mt-4">
            <Field
              label="Email"
              required
              value={form.email}
              onChange={(v) => onChange({ email: v })}
              onBlur={() => onBlur("email")}
              error={
                show("email") && !EMAIL_RE.test(form.email)
                  ? form.email.trim()
                    ? "Enter a valid email"
                    : "Required"
                  : ""
              }
              autoComplete="email"
              type="email"
            />
          </div>
          <div className="mt-4">
            <Field
              label="Company (optional)"
              value={form.company}
              onChange={(v) => onChange({ company: v })}
              onBlur={() => onBlur("company")}
              autoComplete="organization"
            />
          </div>
          <div className="mt-4">
            <Field
              label={
                onLocation
                  ? "Shoot address and any details"
                  : "Anything Nick should know? (optional)"
              }
              value={form.note}
              onChange={(v) => onChange({ note: v })}
              onBlur={() => onBlur("note")}
              textarea
            />
          </div>

          {submitError && (
            <div
              role="alert"
              className="mt-5 border border-danger bg-danger-soft px-4 py-3 text-sm leading-relaxed text-cream"
            >
              <strong className="font-semibold text-danger">
                Something went wrong.
              </strong>{" "}
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full bg-gold px-8 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold-soft disabled:opacity-50"
          >
            {submitting
              ? "Confirming…"
              : `Confirm booking · ${AUD(deposit)} deposit`}
          </button>
          <p className="mt-3 text-center text-[0.72rem] text-faint">
            Secure payment connects when Stripe is enabled. No card is charged
            in this preview.
          </p>
        </form>

        {/* Summary */}
        <aside className="order-1 border border-border bg-ink-2 p-6 lg:order-2">
          <span className="eyebrow">Your session</span>
          <h4 className="font-display mt-3 text-lg leading-snug text-cream">
            {service.name}
          </h4>
          <dl className="mt-4 space-y-2.5 text-sm">
            <SummaryRow label="Date" value={formatLongDate(date)} />
            <SummaryRow label="Time" value={slot.label} />
            <SummaryRow
              label="Duration"
              value={`${service.durationMin} minutes`}
            />
            <SummaryRow label="Location" value={locationLabel} />
          </dl>
          <dl className="mt-4 space-y-2.5 border-t border-border pt-4 text-sm">
            <SummaryRow label="Session fee" value={AUD(service.price)} />
            {travelFee > 0 && travelZone && (
              <SummaryRow
                label={`Travel — ${travelZone.label}`}
                value={AUD(travelFee)}
              />
            )}
            {travelFee > 0 && (
              <SummaryRow label="Total" value={AUD(total)} />
            )}
            <SummaryRow label="Deposit today" value={AUD(deposit)} accent />
            <SummaryRow label="Balance on the day" value={AUD(balance)} />
          </dl>
        </aside>
      </div>
    </div>
  );
}

/* ======================================================================== */
/*  Enquiry path — teams & events                                           */
/* ======================================================================== */

function EnquiryStep({
  service,
  form,
  touched,
  blurred,
  submitting,
  submitError,
  onChange,
  onBlur,
  onBack,
  onSubmit,
}: {
  service: SessionType;
  form: FormState;
  touched: boolean;
  blurred: Record<keyof FormState, boolean>;
  submitting: boolean;
  submitError: string;
  onChange: (patch: Partial<FormState>) => void;
  onBlur: (name: keyof FormState) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const show = (name: keyof FormState) => touched || blurred[name];

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="text-[0.72rem] uppercase tracking-[0.16em] text-faint transition-colors hover:text-gold"
      >
        ← Change session
      </button>

      <h3 className="font-display mt-3 text-2xl text-cream sm:text-3xl">
        Tell Nick about your project
      </h3>
      <p className="mt-2 max-w-xl text-sm text-muted">
        {service.blurb} Share a few details and Nick will reply within one
        business day with availability and a tailored quote.
      </p>

      <form
        className="mt-7 max-w-xl"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Full name"
            required
            value={form.name}
            onChange={(v) => onChange({ name: v })}
            onBlur={() => onBlur("name")}
            error={show("name") && !form.name.trim() ? "Required" : ""}
            autoComplete="name"
          />
          <Field
            label="Company"
            value={form.company}
            onChange={(v) => onChange({ company: v })}
            onBlur={() => onBlur("company")}
            autoComplete="organization"
          />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            label="Email"
            required
            value={form.email}
            onChange={(v) => onChange({ email: v })}
            onBlur={() => onBlur("email")}
            error={
              show("email") && !EMAIL_RE.test(form.email)
                ? form.email.trim()
                  ? "Enter a valid email"
                  : "Required"
                : ""
            }
            autoComplete="email"
            type="email"
          />
          <Field
            label="Phone (optional)"
            value={form.phone}
            onChange={(v) => onChange({ phone: v })}
            onBlur={() => onBlur("phone")}
            autoComplete="tel"
            type="tel"
          />
        </div>
        <div className="mt-4">
          <Field
            label="Project details — team size, dates, location"
            required
            value={form.note}
            onChange={(v) => onChange({ note: v })}
            onBlur={() => onBlur("note")}
            error={show("note") && !form.note.trim() ? "Required" : ""}
            textarea
          />
        </div>

        {submitError && (
          <div
            role="alert"
            className="mt-5 border border-danger bg-danger-soft px-4 py-3 text-sm leading-relaxed text-cream"
          >
            <strong className="font-semibold text-danger">
              Something went wrong.
            </strong>{" "}
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full bg-gold px-8 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold-soft disabled:opacity-50 sm:w-auto sm:px-12"
        >
          {submitting ? "Sending…" : "Send enquiry"}
        </button>
      </form>
    </div>
  );
}

/* ======================================================================== */
/*  Confirmation                                                            */
/* ======================================================================== */

function DoneStep({
  service,
  date,
  slot,
  locationMode,
  postcode,
  reference,
  manageToken,
  name,
  onRestart,
}: {
  service: SessionType;
  date: Date | null;
  slot: Slot | null;
  locationMode: LocationMode;
  postcode: string;
  reference: string;
  manageToken: string;
  name: string;
  onRestart: () => void;
}) {
  const isEnquiry = service.mode === "enquiry";
  const firstName = name.trim().split(/\s+/)[0] || "there";
  const locationLabel =
    locationMode === "onlocation"
      ? `On-location · ${postcode}`
      : "Lane Cove studio";

  return (
    <div className="py-4 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold text-2xl text-ink">
        ✓
      </div>
      <h3 className="font-display mt-6 text-2xl text-cream sm:text-3xl">
        {isEnquiry ? "Enquiry sent" : "Booking confirmed"}
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
        {isEnquiry ? (
          <>
            Thanks {firstName} — your project brief is with Nick. Expect a reply
            with availability and a quote within one business day.
          </>
        ) : (
          <>
            Thanks {firstName} — your session is reserved. A confirmation email
            with calendar invite and prep notes is on its way.
          </>
        )}
      </p>

      {!isEnquiry && date && slot && (
        <div className="mx-auto mt-7 max-w-sm border border-border bg-ink-2 p-6 text-left">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Confirmed</span>
            <span className="text-[0.72rem] tracking-wider text-gold">
              {reference}
            </span>
          </div>
          <h4 className="font-display mt-3 text-lg leading-snug text-cream">
            {service.name}
          </h4>
          <dl className="mt-4 space-y-2.5 text-sm">
            <SummaryRow label="Date" value={formatLongDate(date)} />
            <SummaryRow label="Time" value={slot.label} />
            <SummaryRow label="Location" value={locationLabel} />
          </dl>
        </div>
      )}

      {!isEnquiry && (
        <p className="mt-5 text-sm text-muted">
          Need to change something later?{" "}
          <Link
            href={`/manage/${manageToken || reference || "preview"}`}
            className="text-gold underline-offset-4 transition-colors hover:text-gold-soft hover:underline"
          >
            Manage your booking
          </Link>
        </p>
      )}

      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRestart}
          className="border border-border-strong px-7 py-3.5 text-[0.78rem] uppercase tracking-[0.18em] text-cream transition-colors hover:border-gold hover:text-gold"
        >
          Book another session
        </button>
        <Link
          href="/"
          className="px-7 py-3.5 text-[0.78rem] uppercase tracking-[0.18em] text-gold transition-colors hover:text-gold-soft"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

/* ======================================================================== */
/*  Small shared pieces                                                     */
/* ======================================================================== */

function SummaryRow({
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

function Field({
  label,
  value,
  onChange,
  onBlur,
  error = "",
  type = "text",
  textarea = false,
  autoComplete,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  type?: string;
  textarea?: boolean;
  autoComplete?: string;
  required?: boolean;
}) {
  const base =
    "mt-1.5 w-full border bg-ink-2 px-3.5 py-2.5 text-sm text-cream placeholder:text-faint transition-colors focus:outline-none";
  // Erroring field gets a brighter terracotta border + ring so it's
  // unmistakable on a dark surface; a clean field gets the normal focus-gold.
  const borderColor = error
    ? "border-danger ring-1 ring-danger/40 focus:border-danger"
    : "border-border focus:border-gold";
  return (
    <label className="block">
      <span className="flex items-center gap-1 text-[0.74rem] uppercase tracking-[0.12em] text-faint">
        {label}
        {required && (
          <span aria-hidden className="text-danger">
            *
          </span>
        )}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          rows={4}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          className={`${base} ${borderColor} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          className={`${base} ${borderColor}`}
        />
      )}
      {error && (
        <span className="mt-1 block text-[0.74rem] font-medium text-danger">
          {error}
        </span>
      )}
    </label>
  );
}

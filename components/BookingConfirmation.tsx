"use client";

/**
 * BookingConfirmation — the confirmation screen shown on /book/confirmed.
 *
 * Previously this rendered in place as the last step of BookingFlow, with no
 * URL of its own. That meant no third-party conversion pixel could be pointed
 * at it — Google Ads, Meta Pixel and similar tools fire on a page load at a
 * specific URL, not a React state change. Every completed booking or enquiry
 * now does a real navigation to /book/confirmed (see goToConfirmation in
 * BookingFlow.tsx) so this component's mount is a genuine page load, and the
 * conversion trackers below fire exactly once, reliably.
 */

import { useEffect } from "react";
import Link from "next/link";
import { trackBookingComplete, trackEnquiry } from "@/lib/analytics";

export default function BookingConfirmation({
  isEnquiry,
  sessionName,
  dateLabel,
  timeLabel,
  locationLabel,
  reference = "",
  manageToken = "",
  name,
  emailSent = false,
  value,
}: {
  isEnquiry: boolean;
  sessionName: string;
  dateLabel?: string | null;
  timeLabel?: string | null;
  locationLabel?: string | null;
  reference?: string;
  manageToken?: string;
  name: string;
  emailSent?: boolean;
  value?: number;
}) {
  const firstName = name.trim().split(/\s+/)[0] || "there";

  // Fires once, when the confirmation actually renders — the one place a
  // booking or enquiry is real, so the one place every conversion tracker
  // (GA4, Google Ads, Meta Pixel) fires from.
  useEffect(() => {
    if (isEnquiry) {
      trackEnquiry(sessionName, "book");
    } else {
      trackBookingComplete(sessionName, value, reference);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        ) : emailSent ? (
          <>
            Thanks {firstName} — your time is reserved. A confirmation email
            with your calendar invite and prep notes is on its way.
          </>
        ) : (
          <>
            Your booking is confirmed, and your session details are below.
            Please keep a copy for your records. I&rsquo;ll be in touch before
            the day with everything you need to know, including some helpful
            preparation notes.
          </>
        )}
      </p>

      {!isEnquiry && !emailSent && (
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          I look forward to working with you.
        </p>
      )}

      {!isEnquiry && dateLabel && timeLabel && (
        <div className="mx-auto mt-7 max-w-sm border border-border bg-ink-2 p-6 text-left">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Confirmed</span>
            <span className="text-[0.72rem] tracking-wider text-gold">
              {reference}
            </span>
          </div>
          <h4 className="font-display mt-3 text-lg leading-snug text-cream">
            {sessionName}
          </h4>
          <dl className="mt-4 space-y-2.5 text-sm">
            <SummaryRow label="Date" value={dateLabel} />
            <SummaryRow label="Time" value={timeLabel} />
            {locationLabel && (
              <SummaryRow label="Location" value={locationLabel} />
            )}
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
        <Link
          href="/book"
          className="border border-border-strong px-7 py-3.5 text-[0.78rem] uppercase tracking-[0.18em] text-cream transition-colors hover:border-gold hover:text-gold"
        >
          Book another session
        </Link>
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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-faint">{label}</dt>
      <dd className="text-cream">{value}</dd>
    </div>
  );
}

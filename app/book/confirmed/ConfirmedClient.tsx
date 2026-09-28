"use client";

import { useSearchParams } from "next/navigation";
import { Container } from "@/components/Section";
import BookingConfirmation from "@/components/BookingConfirmation";

export default function ConfirmedClient() {
  const params = useSearchParams();

  const type = params.get("type");
  const isEnquiry = type === "enquiry";
  const service = params.get("service") ?? "your session";
  const name = params.get("name") ?? "there";
  const dateLabel = params.get("date");
  const timeLabel = params.get("time");
  const locationLabel = params.get("location");
  const reference = params.get("ref") ?? "";
  const manageToken = params.get("token") ?? "";
  const emailSent = params.get("emailSent") === "1";
  const rawValue = params.get("value");
  const value = rawValue ? Number(rawValue) : undefined;

  return (
    <section className="section bg-ink">
      <Container className="max-w-xl">
        <div className="border border-border bg-surface p-6 sm:p-9">
          <BookingConfirmation
            isEnquiry={isEnquiry}
            sessionName={service}
            name={name}
            dateLabel={dateLabel}
            timeLabel={timeLabel}
            locationLabel={locationLabel}
            reference={reference}
            manageToken={manageToken}
            emailSent={emailSent}
            value={Number.isFinite(value) ? value : undefined}
          />
        </div>
      </Container>
    </section>
  );
}

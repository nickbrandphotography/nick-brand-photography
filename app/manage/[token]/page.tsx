import type { Metadata } from "next";
import ManageBooking from "@/components/ManageBooking";

export const metadata: Metadata = {
  title: "Manage Your Booking | Nick Brand Photography",
  description:
    "View, reschedule or cancel your photography session with Nick Brand Photography.",
  // A booking-management page is private to the client — keep it out of search.
  robots: { index: false, follow: false },
};

/**
 * /manage/[token] — the secure self-service page a client reaches from the
 * link in their confirmation email. The token identifies the booking.
 */
export default async function ManagePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ManageBooking token={token} />;
}

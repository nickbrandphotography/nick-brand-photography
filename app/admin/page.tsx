import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Booking Dashboard | Nick Brand Photography",
  // Admin area — never index.
  robots: { index: false, follow: false },
};

/**
 * /admin — the booking dashboard (preview).
 * In production this is protected by Supabase Auth (admin login).
 */
export default function AdminPage() {
  return <AdminDashboard />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePageTemplate, {
  serviceMetadata,
} from "@/components/ServicePageTemplate";
import { getService } from "@/lib/services";

const SLUG = "band-photographer-sydney";

export const metadata: Metadata = serviceMetadata(SLUG);

/**
 * Render per-request from the deployment serving the request, instead of from a
 * statically-cached payload. Prevents Vercel "version skew": after a new deploy,
 * a client-side navigation into this page was being answered with an older build
 * and reverting the hero to a previous photo. Matches the other service pages.
 */
export const dynamic = "force-dynamic";

export default function Page() {
  const service = getService(SLUG);
  if (!service) notFound();
  return <ServicePageTemplate service={service} />;
}

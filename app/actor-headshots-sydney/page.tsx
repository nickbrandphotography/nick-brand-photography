import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePageTemplate, {
  serviceMetadata,
} from "@/components/ServicePageTemplate";
import { getService } from "@/lib/services";

const SLUG = "actor-headshots-sydney";

export const metadata: Metadata = serviceMetadata(SLUG);

export default function Page() {
  const service = getService(SLUG);
  if (!service) notFound();
  return <ServicePageTemplate service={service} />;
}

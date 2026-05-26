import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationPageTemplate, {
  locationMetadata,
} from "@/components/LocationPageTemplate";
import { getLocation, locationSlugs } from "@/lib/locations";

type Props = { params: Promise<{ slug: string }> };

/** Statically generate every suburb page at build time. */
export function generateStaticParams() {
  return locationSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) return {};
  return locationMetadata(location);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) notFound();
  return <LocationPageTemplate location={location} />;
}

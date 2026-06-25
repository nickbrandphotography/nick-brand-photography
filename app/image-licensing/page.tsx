import type { Metadata } from "next";
import { site, absoluteUrl } from "@/lib/site";
import { Container, Eyebrow } from "@/components/Section";
import Breadcrumbs from "@/components/Breadcrumbs";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Image Licensing", path: "/image-licensing" },
];

const title = `Image Licensing & Usage Rights | ${site.name}`;
const description =
  "Licensing and usage terms for photographs by Nick Brand Photography. All images are protected by copyright. Contact us to license an image or arrange usage rights.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/image-licensing") },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/image-licensing"),
    type: "website",
    images: [
      {
        url: "/images/og/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Image licensing — Nick Brand Photography, Sydney",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/og/og-default.jpg"],
  },
};

export default function ImageLicensingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <Breadcrumbs crumbs={crumbs} />

      {/* Hero */}
      <section className="border-b border-border bg-ink-2">
        <Container className="py-16 text-center lg:py-20">
          <div className="flex justify-center">
            <Eyebrow>Usage Rights</Eyebrow>
          </div>
          <h1 className="font-display mx-auto mt-6 max-w-3xl text-[2.5rem] leading-[1.08] text-cream sm:text-5xl lg:text-[3.4rem]">
            Image Licensing
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-muted">
            Every photograph on this site is original work created by{" "}
            {site.founder}. Here&apos;s how copyright, usage and licensing work
            — and how to license an image for your own use.
          </p>
        </Container>
      </section>

      {/* Terms */}
      <section className="section bg-ink">
        <Container className="mx-auto max-w-3xl">
          <div className="space-y-10">
            <div>
              <h2 className="font-display text-2xl text-cream sm:text-3xl">
                Copyright
              </h2>
              <p className="mt-4 text-[1.02rem] leading-relaxed text-muted">
                All images displayed on {site.url.replace("https://", "")} are
                the copyright of {site.name} and are protected under Australian
                and international copyright law. Copyright is retained by{" "}
                {site.founder} at all times unless a written agreement states
                otherwise. Images may not be copied, reproduced, downloaded,
                republished, resold or redistributed without prior written
                permission.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-cream sm:text-3xl">
                Licensing an image
              </h2>
              <p className="mt-4 text-[1.02rem] leading-relaxed text-muted">
                Licences for commercial, editorial or personal use are
                available on request. The licence fee depends on how, where and
                for how long the image will be used. To request a licence, get
                in touch with the image filename or URL and a short description
                of the intended use, and {site.founder} will reply with terms
                and a quote.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-cream sm:text-3xl">
                Clients and shoot deliverables
              </h2>
              <p className="mt-4 text-[1.02rem] leading-relaxed text-muted">
                If {site.founder} has photographed you or your team, the usage
                rights granted to you are set out in your booking agreement.
                Final delivered images typically include a personal and
                business usage licence for the agreed purpose. If you need to
                extend your usage, just ask.
              </p>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="font-display text-2xl text-cream sm:text-3xl">
                Request a licence
              </h2>
              <p className="mt-4 text-[1.02rem] leading-relaxed text-muted">
                Email{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="text-gold underline-offset-4 hover:underline"
                >
                  {site.email}
                </a>{" "}
                or call{" "}
                <a
                  href={`tel:${site.phoneIntl}`}
                  className="text-gold underline-offset-4 hover:underline"
                >
                  {site.phone}
                </a>{" "}
                to discuss licensing and usage rights.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <CTASection
        title="Need to license an image?"
        text="Get in touch with the image details and how you'd like to use it, and Nick will reply with licensing terms and a quote."
      />
    </>
  );
}

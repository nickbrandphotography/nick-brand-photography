import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import AnalyticsEvents from "@/components/AnalyticsEvents";
import { site } from "@/lib/site";
import { localBusinessSchema, webSiteSchema } from "@/lib/schema";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/**
 * NOTE: there is deliberately NO `alternates.canonical` here.
 *
 * A canonical set on the root layout is inherited by any page that forgets to
 * set its own — which would silently canonicalise that page to the homepage and
 * drop it from the index. Every route sets its own canonical; keeping the root
 * free means a missing canonical fails loudly (no tag) rather than silently
 * (wrong tag).
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.tagline} | ${site.name}`,
    template: `%s`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_AU",
    url: site.url,
    title: `${site.tagline} | ${site.name}`,
    description: site.description,
    images: [
      {
        url: "/images/og/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Nick Brand Photography — Sydney corporate headshot and personal branding photographer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.tagline} | ${site.name}`,
    description: site.description,
    images: ["/images/og/og-default.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#131312",
  colorScheme: "dark",
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-AU"
      className={`${cormorant.variable} ${inter.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-ink">
        {/* The business + website entities, on every page. */}
        <JsonLd data={[localBusinessSchema(), webSiteSchema()]} />

        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />

        {/* Google Analytics 4.
            Set NEXT_PUBLIC_GA_ID in Vercel (Project → Settings → Environment
            Variables) to the measurement ID, e.g. G-XXXXXXXXXX. Until it is set
            nothing is loaded, so local dev and previews stay clean.
            Conversion events are sent from lib/analytics.ts. */}
        {GA_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
            </Script>
            <AnalyticsEvents />
          </>
        ) : null}
      </body>
    </html>
  );
}

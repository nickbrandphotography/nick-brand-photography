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
// Set in Vercel → Settings → Environment Variables. Each is an independent
// no-op until its own var is set — turning one on never depends on the others.
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID; // e.g. AW-XXXXXXXXX
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
// gtag.js is shared between GA4 and Google Ads — one script load, one or two
// `gtag('config', …)` calls depending on which are actually set.
const GTAG_LOADER_ID = GA_ID || GOOGLE_ADS_ID;

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

        {/* Google Analytics 4 + Google Ads.
            Set NEXT_PUBLIC_GA_ID to the GA4 measurement ID (G-XXXXXXXXXX) and/or
            NEXT_PUBLIC_GOOGLE_ADS_ID to the Ads account ID (AW-XXXXXXXXX) in
            Vercel. Either one on its own is enough to load gtag.js; both can be
            set together. Until at least one is set nothing is loaded, so local
            dev and previews stay clean. The conversion event itself — with the
            NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL Google Ads gives you — fires
            from the booking confirmation page, not here; see lib/analytics.ts
            and app/book/confirmed/page.tsx. */}
        {GTAG_LOADER_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_LOADER_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${GA_ID ? `gtag('config', '${GA_ID}');` : ""}
${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ""}`}
            </Script>
            <AnalyticsEvents />
          </>
        ) : null}

        {/* Meta Pixel.
            Set NEXT_PUBLIC_META_PIXEL_ID in Vercel to turn this on — until then
            it's not loaded at all. Fires PageView sitewide (for retargeting
            audiences) plus a Lead/Schedule event on the booking confirmation
            page — see lib/analytics.ts. */}
        {META_PIXEL_ID ? (
          <>
            <Script id="meta-pixel-init" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
            </Script>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                alt=""
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        ) : null}
      </body>
    </html>
  );
}

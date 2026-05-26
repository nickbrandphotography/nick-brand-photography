import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";
import { localBusinessSchema, personSchema, webSiteSchema } from "@/lib/schema";

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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.tagline} | ${site.name}`,
    template: `%s`,
  },
  description: site.description,
  alternates: { canonical: site.url },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_AU",
    url: site.url,
    title: `${site.tagline} | ${site.name}`,
    description: site.description,
    images: [
      {
        url: "/images/corporate-headshots/corporate-headshot-sydney-02.jpg",
        alt: "Nick Brand Photography — Sydney corporate headshot and personal branding photographer",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#131312",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-AU"
      className={`${cormorant.variable} ${inter.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-ink">
        <JsonLd
          data={[localBusinessSchema(), personSchema(), webSiteSchema()]}
        />
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

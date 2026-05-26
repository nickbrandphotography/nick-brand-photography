import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site, absoluteUrl } from "@/lib/site";
import { posts } from "@/lib/posts";
import { getImage } from "@/lib/images";
import { Container, Eyebrow } from "@/components/Section";
import Breadcrumbs from "@/components/Breadcrumbs";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
];

export const metadata: Metadata = {
  title: `Photography Tips & Guides | ${site.name}`,
  description:
    "Practical guides on corporate headshots, LinkedIn photos, executive portraits and personal branding photography in Sydney — from Nick Brand Photography.",
  alternates: { canonical: absoluteUrl("/blog") },
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Deterministic date formatter — avoids timezone drift in server rendering. */
function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));

export default function BlogPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <Breadcrumbs crumbs={crumbs} />

      {/* Hero */}
      <section className="border-b border-border bg-ink-2">
        <Container className="py-16 text-center lg:py-20">
          <div className="flex justify-center">
            <Eyebrow>Tips &amp; Guides</Eyebrow>
          </div>
          <h1 className="font-display mx-auto mt-6 max-w-3xl text-[2.5rem] leading-[1.08] text-cream sm:text-5xl lg:text-[3.4rem]">
            Photography advice for Sydney professionals
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-muted">
            Practical guides on getting the most from your headshots, personal
            branding and team photography — what to wear, how to prepare and
            what actually makes an image work.
          </p>
        </Container>
      </section>

      {/* Post grid */}
      <section className="section bg-ink">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sortedPosts.map((post) => {
              const img = getImage(
                post.heroSilo,
                post.heroIndex,
                post.title,
              );
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col border border-border bg-surface transition-colors hover:border-gold"
                >
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 360px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex grow flex-col p-6">
                    <span className="text-xs uppercase tracking-[0.16em] text-gold">
                      {post.category}
                    </span>
                    <h2 className="font-display mt-3 text-xl leading-snug text-cream group-hover:text-gold">
                      {post.title}
                    </h2>
                    <p className="mt-2 grow text-sm leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                    <span className="mt-5 text-xs text-faint">
                      {formatDate(post.date)} · {post.readingTime}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <CTASection
        title="Ready to put it into practice?"
        text="Book a session with Nick and get headshots or branding photography that does the job — studio in Lane Cove or on-site across Sydney."
      />
    </>
  );
}

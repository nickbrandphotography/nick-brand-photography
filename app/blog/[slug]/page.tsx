import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site, absoluteUrl } from "@/lib/site";
import { getPost, postSlugs } from "@/lib/posts";
import { getService } from "@/lib/services";
import { getImage, nickPortrait } from "@/lib/images";
import { Container, Eyebrow } from "@/components/Section";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

type Props = { params: Promise<{ slug: string }> };

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

/** Statically generate every blog post at build time. */
export function generateStaticParams() {
  return postSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const ogImage = getImage(post.heroSilo, post.heroIndex).jpg;
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: absoluteUrl(`/blog/${slug}`) },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: absoluteUrl(`/blog/${slug}`),
      type: "article",
      publishedTime: post.date,
      images: [{ url: ogImage, alt: post.title }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const hero = getImage(post.heroSilo, post.heroIndex, post.title);
  const relatedService = getService(post.relatedService);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    dateModified: post.date,
    image: absoluteUrl(hero.src),
    articleSection: post.category,
    author: {
      "@type": "Person",
      name: site.founder,
      url: absoluteUrl("/about"),
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };

  return (
    <>
      <JsonLd
        data={
          post.faqs && post.faqs.length
            ? [articleSchema, faqSchema(post.faqs), breadcrumbSchema(crumbs)]
            : [articleSchema, breadcrumbSchema(crumbs)]
        }
      />

      <Breadcrumbs crumbs={crumbs} />

      {/* Hero */}
      <article>
        <section className="border-b border-border bg-ink-2">
          <Container className="py-14 lg:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <div className="flex justify-center">
                <Eyebrow>{post.category}</Eyebrow>
              </div>
              <h1 className="font-display mt-6 text-[2.3rem] leading-[1.12] text-cream sm:text-4xl lg:text-[3rem]">
                {post.title}
              </h1>
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border">
                  <Image
                    src={nickPortrait.src}
                    alt={nickPortrait.alt}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="text-left text-sm leading-tight">
                  <Link
                    href="/about"
                    rel="author"
                    className="text-cream transition-colors hover:text-gold"
                  >
                    By {site.founder}
                  </Link>
                  <p className="text-xs text-faint">
                    {formatDate(post.date)} · {post.readingTime}
                  </p>
                </div>
              </div>
            </div>
            <div className="relative mt-10 aspect-[16/9] overflow-hidden border border-border">
              <Image
                src={hero.src}
                alt={hero.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover"
              />
            </div>
          </Container>
        </section>

        {/* Body */}
        <section className="section bg-ink">
          <Container>
            <div className="mx-auto max-w-3xl">
              {/* Intro */}
              <div className="space-y-5">
                {post.intro.map((p) => (
                  <p
                    key={p.slice(0, 32)}
                    className="text-[1.1rem] leading-relaxed text-cream/90"
                  >
                    {p}
                  </p>
                ))}
              </div>

              {/* Sections */}
              {post.sections.map((s) => (
                <div key={s.heading} className="mt-12">
                  <h2 className="font-display text-2xl text-cream sm:text-3xl">
                    {s.heading}
                  </h2>
                  {s.paragraphs ? (
                    <div className="mt-4 space-y-4">
                      {s.paragraphs.map((p) => (
                        <p
                          key={p.slice(0, 32)}
                          className="text-[1.02rem] leading-relaxed text-muted"
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                  ) : null}
                  {s.list ? (
                    <ul className="mt-5 space-y-3">
                      {s.list.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-[1.02rem] leading-relaxed text-muted"
                        >
                          <span className="mt-0.5 text-gold" aria-hidden>
                            ✦
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}

              {/* Related service */}
              {relatedService ? (
                <div className="mt-14 border border-gold/40 bg-surface p-8 text-center">
                  <p className="text-[0.97rem] text-muted">
                    Related service
                  </p>
                  <Link
                    href={`/${relatedService.slug}`}
                    className="font-display mt-2 inline-block text-2xl text-cream transition-colors hover:text-gold"
                  >
                    {relatedService.navLabel} →
                  </Link>
                </div>
              ) : null}
            </div>
          </Container>
        </section>
      </article>

      {/* FAQ */}
      {post.faqs && post.faqs.length ? (
        <FAQ faqs={post.faqs} eyebrow="Questions" title="Frequently asked" />
      ) : null}

      <CTASection />
    </>
  );
}

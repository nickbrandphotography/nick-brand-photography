/**
 * Client testimonials — sourced from Nick Brand Photography's Google reviews.
 * All reviews are five-star. Used on the homepage, service pages and in
 * Review / AggregateRating structured data.
 */

export type Testimonial = {
  name: string;
  rating: 5;
  quote: string;
  context?: string; // role / shoot type, where known
  source: "Google";
};

export const testimonials: Testimonial[] = [
  {
    name: "Victor Mitech",
    rating: 5,
    quote:
      "Nick was great! Super friendly and professional. He made us feel comfortable and the photos came out amazing. If you're in Sydney and need a good photographer, we definitely recommend him!",
    source: "Google",
  },
  {
    name: "Alex Foster",
    rating: 5,
    quote:
      "Needed some head shots done for work. Super professional and spot-on. Thanks again Nick for your talent.",
    context: "Corporate headshots",
    source: "Google",
  },
  {
    name: "Rita N",
    rating: 5,
    quote:
      "We had an amazing experience with Nick. He is very approachable, fun to work with yet exceptionally professional.",
    source: "Google",
  },
  {
    name: "Natalie Kilminster",
    rating: 5,
    quote:
      "Highly recommend Nick. Very professional and friendly. He knows his stuff and the photos are amazing!",
    source: "Google",
  },
  {
    name: "A Dzananovic",
    rating: 5,
    quote: "Great experience, professional work — thanks Nick.",
    source: "Google",
  },
];

/**
 * Aggregate rating for schema. Rating value is confirmed 5.0, and reviewCount
 * reflects the live Google Business Profile total (7 as of May 2026). The
 * `testimonials` array above is a displayed sample of these reviews.
 * Update reviewCount whenever the Google review count changes.
 */
export const aggregateRating = {
  ratingValue: "5.0",
  reviewCount: 7,
  bestRating: "5",
};

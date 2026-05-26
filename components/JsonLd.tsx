/**
 * Renders a JSON-LD structured data block.
 * The `<` escaping prevents XSS via injected strings (per Next.js guidance).
 */

export default function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

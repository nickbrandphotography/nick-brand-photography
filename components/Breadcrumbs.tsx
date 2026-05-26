import Link from "next/link";
import { Container } from "./Section";

/** Visible breadcrumb trail. Pair with breadcrumbSchema() for structured data. */
export default function Breadcrumbs({
  crumbs,
}: {
  crumbs: { name: string; path: string }[];
}) {
  return (
    <Container>
      <nav aria-label="Breadcrumb" className="py-5">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-faint">
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-2">
                {last ? (
                  <span className="text-muted">{c.name}</span>
                ) : (
                  <Link
                    href={c.path}
                    className="transition-colors hover:text-gold"
                  >
                    {c.name}
                  </Link>
                )}
                {!last ? <span className="text-faint">/</span> : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </Container>
  );
}

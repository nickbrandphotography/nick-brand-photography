import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "gold" | "outline" | "ghost";

const styles: Record<Variant, string> = {
  gold:
    "bg-gold text-ink hover:bg-gold-soft font-semibold",
  outline:
    "border border-border-strong text-cream hover:border-gold hover:text-gold",
  ghost: "text-cream hover:text-gold",
};

/**
 * Primary call-to-action link. Renders an external <a> for booking/tel links,
 * otherwise a Next.js <Link>.
 */
export default function Button({
  href,
  children,
  variant = "gold",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[0.78rem] tracking-[0.18em] uppercase transition-colors duration-200";
  const cls = `${base} ${styles[variant]} ${className}`;
  const external =
    href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");

  if (external) {
    return (
      <a
        href={href}
        className={cls}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

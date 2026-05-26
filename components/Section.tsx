import type { ReactNode } from "react";

/** Centred max-width content wrapper. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

/** A small uppercase eyebrow label with a gold rule. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="rule-gold" />
      <span className="eyebrow">{children}</span>
    </div>
  );
}

/** Section heading block: eyebrow + display title + optional lead text. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={
        align === "center"
          ? "flex flex-col items-center text-center"
          : "flex flex-col items-start"
      }
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="font-display mt-5 text-3xl leading-tight text-cream sm:text-4xl lg:text-[2.7rem]">
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 max-w-2xl text-[0.97rem] leading-relaxed text-muted">
          {lead}
        </p>
      ) : null}
    </div>
  );
}

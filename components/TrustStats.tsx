import { site } from "@/lib/site";

const stats = [
  { value: site.stats.years, label: "Years Experience" },
  { value: site.stats.sessions, label: "Sessions Delivered" },
  { value: `${site.stats.rating}★`, label: "Google Rating" },
  { value: site.stats.insured, label: "Public Liability Insured" },
];

/** Compact trust-signal strip. */
export default function TrustStats({
  bordered = true,
}: {
  bordered?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-2 gap-px overflow-hidden bg-border lg:grid-cols-4 ${
        bordered ? "border border-border" : ""
      }`}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex flex-col items-center bg-surface px-4 py-9 text-center"
        >
          <span className="font-display text-4xl text-gold lg:text-5xl">
            {s.value}
          </span>
          <span className="mt-2 text-[0.68rem] uppercase tracking-[0.18em] text-faint">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

"use client";

/**
 * ContactForm — the enquiry form on /contact.
 *
 * Submits via Web3Forms (https://web3forms.com) using the access key in
 * lib/site.ts. No backend or API route is required. If the key is blank,
 * the component shows a phone/email fallback instead of a broken form.
 */

import { useState } from "react";
import { site } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

const SESSION_OPTIONS = [
  "General enquiry",
  "Corporate headshots",
  "Personal branding",
  "Team / office headshots",
  "Actor / model portfolio",
  "Family session",
  "Corporate event",
];

const fieldClass =
  "mt-1.5 w-full border border-border bg-ink px-3.5 py-2.5 text-sm text-cream placeholder:text-faint transition-colors focus:border-gold focus:outline-none";

export default function ContactForm() {
  const hasKey = site.web3formsKey.trim().length > 0;

  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: SESSION_OPTIONS[0],
    message: "",
  });

  function update(patch: Partial<typeof form>) {
    setForm({ ...form, ...patch });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: site.web3formsKey,
          subject: `New enquiry from ${site.domain}`,
          from_name: form.name,
          name: form.name,
          email: form.email,
          phone: form.phone,
          session_interest: form.interest,
          message: form.message,
          botcheck: false,
        }),
      });
      const data: { success?: boolean } = await res.json();
      setStatus(data.success ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  /* --- fallback when no Web3Forms key is configured --------------------- */
  if (!hasKey) {
    return (
      <div className="border border-border bg-surface p-7">
        <h3 className="font-display text-xl text-cream">
          Get in touch with Nick
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          The quickest way to reach Nick is by phone or email.
        </p>
        <div className="mt-5 space-y-3">
          <a
            href={`tel:${site.phoneIntl}`}
            className="block border border-border-strong px-5 py-3 text-sm text-cream transition-colors hover:border-gold hover:text-gold"
          >
            Call {site.phone}
          </a>
          <a
            href={`mailto:${site.email}`}
            className="block border border-border-strong px-5 py-3 text-sm text-cream transition-colors hover:border-gold hover:text-gold"
          >
            Email {site.email}
          </a>
        </div>
      </div>
    );
  }

  /* --- success state ---------------------------------------------------- */
  if (status === "success") {
    return (
      <div className="border border-border bg-surface p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold text-xl text-ink">
          ✓
        </div>
        <h3 className="font-display mt-5 text-2xl text-cream">
          Message sent
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
          Thanks {form.name.trim().split(/\s+/)[0] || "for reaching out"} —
          your enquiry is with Nick. Expect a reply, usually within one
          business day.
        </p>
      </div>
    );
  }

  /* --- the form --------------------------------------------------------- */
  return (
    <form onSubmit={handleSubmit} className="border border-border bg-surface p-7">
      {/* Honeypot — hidden from people, catches bots. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-[0.74rem] uppercase tracking-[0.12em] text-faint">
            Full name
          </span>
          <input
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => update({ name: e.target.value })}
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className="text-[0.74rem] uppercase tracking-[0.12em] text-faint">
            Phone
          </span>
          <input
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => update({ phone: e.target.value })}
            className={fieldClass}
          />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="text-[0.74rem] uppercase tracking-[0.12em] text-faint">
          Email
        </span>
        <input
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={(e) => update({ email: e.target.value })}
          className={fieldClass}
        />
      </label>

      <label className="mt-5 block">
        <span className="text-[0.74rem] uppercase tracking-[0.12em] text-faint">
          What is the shoot for?
        </span>
        <select
          value={form.interest}
          onChange={(e) => update({ interest: e.target.value })}
          className={fieldClass}
        >
          {SESSION_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-5 block">
        <span className="text-[0.74rem] uppercase tracking-[0.12em] text-faint">
          Tell Nick about your shoot
        </span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => update({ message: e.target.value })}
          className={`${fieldClass} resize-none`}
        />
      </label>

      {status === "error" && (
        <p className="mt-4 text-sm text-gold">
          Something went wrong sending your message. Please try again, or call{" "}
          {site.phone}.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 w-full bg-gold px-8 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold-soft disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
      <p className="mt-3 text-center text-[0.72rem] text-faint">
        No obligation, no hard sell — Nick will reply with honest advice and a
        clear quote.
      </p>
    </form>
  );
}

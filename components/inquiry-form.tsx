"use client";

/**
 * <InquiryForm /> — public lead-capture form for Builders Corner and
 * Four Squared.
 *
 * The form posts to `submitInquiryAction` in lib/actions/inquiry.ts
 * which appends a JSON record to data/inquiries.json. On success the
 * form swaps to a thank-you message in place. On error we keep the
 * fields filled in and surface inline field errors.
 *
 * Styling is driven by a `brand` prop so we get one component, two
 * looks: navy + gold serif for Builders Corner, near-black + emerald
 * for Four Squared.
 */

import { useRef, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { submitInquiryAction, type Brand, type InquiryResult } from "@/lib/actions/inquiry";

const NEEDS = [
  "Custom kitchen design",
  "Custom bath design",
  "Cabinetry quote",
  "Installation / remodel",
  "Schedule a walkthrough",
  "In-store measuring & planning",
  "General question",
  "Other",
] as const;

type Props = {
  brand: Brand;
  /** Defaults to the brand's standard headline; pass to override. */
  heading?: string;
  /** Defaults to a 1-line intro under the heading; pass to override. */
  intro?: string;
  /** Optional override for the submit button label. */
  submitLabel?: string;
};

const COPY: Record<
  Brand,
  { heading: string; intro: string; submitLabel: string }
> = {
  builders: {
    heading: "Book a consultation.",
    intro:
      "First consult is free. We'll meet you in the showroom at 825 Washington or come measure your space.",
    submitLabel: "Send to Builders Corner",
  },
  "four-squared": {
    heading: "Tell us about your project.",
    intro:
      "Walkthroughs, estimates, design help — we read every one ourselves.",
    submitLabel: "Send to Four Squared",
  },
};

export function InquiryForm({ brand, heading, intro, submitLabel }: Props) {
  const copy = COPY[brand];
  const headingText = heading ?? copy.heading;
  const introText = intro ?? copy.intro;
  const submitText = submitLabel ?? copy.submitLabel;

  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<InquiryResult | null>(null);
  const pathname = usePathname() ?? "/";

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("brand", brand);
    fd.set("source_path", pathname);
    startTransition(async () => {
      const r = await submitInquiryAction(fd);
      setResult(r);
      // Focus management: on success, move keyboard focus to the
      // thank-you region (so screen-reader users hear the result).
      // On error, focus the heading so we re-announce the form.
      setTimeout(() => {
        if (r.ok) {
          successRef.current?.focus();
        } else {
          headingRef.current?.focus();
        }
      }, 0);
    });
  };

  const isBuilders = brand === "builders";

  if (result?.ok) {
    return (
      <SuccessPanel brand={brand} successRef={successRef} />
    );
  }

  const fieldErrors = result && !result.ok ? result.fieldErrors ?? {} : {};

  // Brand-aware class fragments. Kept inline so the whole component is
  // grep-able for either brand's tokens.
  // Unified visual treatment across both brands. Both forms now use
  // the Price-Less display + sans typography, full bordered input
  // boxes, and a real solid submit button so older customers always
  // see a tappable target.
  const accent = isBuilders ? "text-[var(--brand-priceless)]" : "text-emerald-400";
  const headingClass =
    "font-display text-5xl leading-[1.02] text-[var(--foreground)] md:text-6xl";
  const introClass =
    "mt-6 max-w-xl text-base leading-relaxed text-[var(--foreground)] md:text-lg";
  const labelBase =
    "font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground)]";
  const fieldBase =
    "w-full rounded-md border bg-white px-3.5 py-3 text-base text-[var(--foreground)] outline-none focus:ring-0";
  const underline = isBuilders
    ? "border-[var(--border)] focus:border-[var(--brand-priceless)]"
    : "border-[var(--border)] focus:border-emerald-600";
  const submitClass = isBuilders
    ? "inline-flex items-center justify-center gap-2 rounded-md bg-[var(--brand-priceless)] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[var(--brand-priceless-dark)] disabled:opacity-50"
    : "inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50";

  return (
    <div>
      <div className={`font-${isBuilders ? "couture" : "mono"} ${isBuilders ? "text-2xl italic" : "text-xs uppercase tracking-[0.14em]"} ${accent}`}>
        {isBuilders ? "Get in touch" : "Project intake"}
      </div>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className={`${headingClass} mt-5 outline-none`}
      >
        {headingText}
      </h2>
      <p className={introClass}>{introText}</p>

      <form
        ref={formRef}
        onSubmit={onSubmit}
        noValidate
        className="mt-12"
        aria-describedby={result && !result.ok ? "inquiry-form-error" : undefined}
      >
        {/* Top-level error banner so a missed field doesn't leave the
            user wondering why nothing happened. */}
        {result && !result.ok ? (
          <div
            id="inquiry-form-error"
            role="alert"
            className={`mb-8 border-l-2 p-4 text-base ${
              isBuilders
                ? "border-[var(--brand-builders-gold)] bg-[var(--brand-builders-gold)]/10 text-[var(--brand-builders)]"
                : "border-emerald-500 bg-emerald-500/10 text-[var(--foreground)]"
            }`}
          >
            {result.error}
          </div>
        ) : null}

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Your name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Jane Hanson"
            error={fieldErrors.name}
            labelClass={labelBase}
            inputClass={`${fieldBase} ${underline}`}
          />
          <Field
            label="Email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="jane@example.com"
            error={fieldErrors.email}
            labelClass={labelBase}
            inputClass={`${fieldBase} ${underline}`}
          />
          <Field
            label="Phone (optional)"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="(715) 555-0142"
            error={fieldErrors.phone}
            labelClass={labelBase}
            inputClass={`${fieldBase} ${underline}`}
          />
          <div className="flex flex-col gap-2">
            <label htmlFor="need" className={labelBase}>
              What do you need? <span className={accent}>*</span>
            </label>
            <select
              id="need"
              name="need"
              required
              defaultValue=""
              className={`${fieldBase} ${underline}`}
              aria-invalid={fieldErrors.need ? "true" : undefined}
              aria-describedby={fieldErrors.need ? "need-error" : undefined}
            >
              <option value="" disabled>
                Select one
              </option>
              {NEEDS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            {fieldErrors.need ? (
              <p id="need-error" className="text-sm text-red-700">
                {fieldErrors.need}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <label htmlFor="project" className={labelBase}>
            Tell us about the project
          </label>
          <textarea
            id="project"
            name="project"
            rows={4}
            placeholder="Old galley kitchen, want to take out the wall to the dining room. Two cooks, big island."
            className={`${fieldBase} ${underline}`}
          />
        </div>

        <div className="mt-10 flex flex-col-reverse items-start justify-between gap-5 sm:flex-row sm:items-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            We don't share your info. Or just call <span className="whitespace-nowrap font-semibold text-[var(--foreground)]">(715) 848-3855</span>.
          </p>
          <button
            type="submit"
            disabled={pending}
            className={submitClass}
            aria-busy={pending}
          >
            {pending ? "Sending…" : submitText}
            {isBuilders ? <span aria-hidden>→</span> : null}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  required,
  placeholder,
  autoComplete,
  error,
  labelClass,
  inputClass,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  labelClass: string;
  inputClass: string;
}) {
  const id = name;
  const errId = `${id}-error`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelClass}>
        {label}
        {required ? (
          <span className="ml-1 text-[var(--brand-builders-gold)]">*</span>
        ) : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={inputClass}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errId : undefined}
      />
      {error ? (
        <p id={errId} className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SuccessPanel({
  brand,
  successRef,
}: {
  brand: Brand;
  successRef: React.RefObject<HTMLDivElement | null>;
}) {
  const isBuilders = brand === "builders";
  return (
    <div
      ref={successRef}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      className={`outline-none ${
        isBuilders
          ? "border-l-4 border-[var(--brand-builders-gold)] pl-8"
          : "border-l-4 border-emerald-500 pl-8"
      }`}
    >
      <div
        className={
          isBuilders
            ? "font-couture text-2xl italic text-[var(--brand-builders-gold)]"
            : "font-mono text-xs uppercase tracking-[0.14em] text-emerald-700"
        }
      >
        Got it.
      </div>
      <h2
        className={
          isBuilders
            ? "font-couture mt-5 text-5xl leading-[1.05] tracking-[-0.02em] text-[var(--brand-builders)] md:text-6xl"
            : "font-display mt-5 text-5xl leading-[1.02] text-[var(--foreground)] md:text-6xl"
        }
      >
        Thanks. We'll be in touch within one business day.
      </h2>
      <p
        className={
          isBuilders
            ? "mt-6 max-w-xl text-lg leading-[1.7] text-[var(--muted-foreground)] md:text-xl"
            : "mt-6 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg"
        }
      >
        Can't wait? Call{" "}
        <a
          href="tel:+17158483855"
          className={
            isBuilders
              ? "underline decoration-[var(--brand-builders-gold)] decoration-2 underline-offset-4 hover:text-[var(--brand-builders)]"
              : "underline decoration-emerald-500 decoration-2 underline-offset-4 hover:text-[var(--foreground)]"
          }
        >
          (715) 848-3855
        </a>
        .
      </p>
    </div>
  );
}

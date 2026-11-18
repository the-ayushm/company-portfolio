"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { budgetOptions, projectTypes, timelineOptions } from "@/config/contact";
import { contactSchema, type ContactFormData, type ContactFormInput } from "@/lib/validations/contact";
import { Button } from "@/components/ui/button";
import { consumePrefill, PREFILL_EVENT } from "@/lib/utils/prefill";
import { cn } from "@/lib/utils/cn";

type Status = "idle" | "submitting" | "success" | "error";

const inputCls =
  "peer w-full rounded-xl border border-line bg-white/[0.02] px-4 pb-2.5 pt-6 text-[0.95rem] text-fg outline-none transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-transparent hover:border-line-strong focus:border-accent/60 focus:bg-white/[0.04] focus:shadow-[0_0_0_4px_rgba(109,124,255,0.12)] aria-[invalid=true]:border-danger/60";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    reset,
    formState: { errors },
  } = useForm<ContactFormInput, unknown, ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      description: "",
      website: "",
      consent: false as unknown as true,
      startedAt: 0,
    },
  });

  // Record when the form was rendered (bots submit instantly) and apply any pre-selected service.
  useEffect(() => {
    setValue("startedAt", Date.now());
    const pre = consumePrefill();
    if (pre) setValue("projectType", pre as ContactFormInput["projectType"]);
    const onPrefill = (e: Event) =>
      setValue("projectType", (e as CustomEvent<string>).detail as ContactFormInput["projectType"], { shouldValidate: true });
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, [setValue]);

  const description = watch("description") ?? "";

  const onSubmit = async (data: ContactFormData) => {
    setStatus("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        return;
      }
      const body = (await res.json().catch(() => null)) as { error?: { message?: string; fields?: Record<string, string[]> } } | null;
      if (res.status === 422 && body?.error?.fields) {
        for (const [field, msgs] of Object.entries(body.error.fields)) {
          setError(field as FieldPath<ContactFormInput>, { message: msgs[0] });
        }
      }
      setServerError(body?.error?.message ?? "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setServerError("Network error — please check your connection and try again.");
      setStatus("error");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-card p-6 sm:p-10">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-96 rounded-full bg-accent/10 blur-3xl" />
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <SuccessState
            key="success"
            onReset={() => {
              reset();
              setValue("startedAt", Date.now());
              setStatus("idle");
            }}
          />
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.4 }}
            className="relative flex flex-col gap-8"
            aria-describedby={serverError ? "form-error" : undefined}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="fullName" error={errors.fullName?.message} required>
                <input id="fullName" autoComplete="name" placeholder="Full name" aria-invalid={!!errors.fullName} className={inputCls} {...register("fullName")} />
              </Field>
              <Field label="Work email" name="email" error={errors.email?.message} required>
                <input id="email" type="email" autoComplete="email" placeholder="Work email" aria-invalid={!!errors.email} className={inputCls} {...register("email")} />
              </Field>
              <Field label="Phone / WhatsApp" name="phone" error={errors.phone?.message}>
                <input id="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="Phone" aria-invalid={!!errors.phone} className={inputCls} {...register("phone")} />
              </Field>
              <Field label="Company name" name="companyName" error={errors.companyName?.message}>
                <input id="companyName" autoComplete="organization" placeholder="Company" aria-invalid={!!errors.companyName} className={inputCls} {...register("companyName")} />
              </Field>
            </div>

            <ChipGroup
              legend="Project type"
              name="projectType"
              options={projectTypes.map((p) => ({ value: p, label: p }))}
              register={register}
              selected={watch("projectType")}
              error={errors.projectType?.message}
            />
            <div className="grid gap-8 md:grid-cols-2">
              <ChipGroup
                legend="Estimated budget (INR)"
                name="estimatedBudget"
                options={[...budgetOptions]}
                register={register}
                selected={watch("estimatedBudget")}
                error={errors.estimatedBudget?.message}
              />
              <ChipGroup
                legend="Project timeline"
                name="projectTimeline"
                options={[...timelineOptions]}
                register={register}
                selected={watch("projectTimeline")}
                error={errors.projectTimeline?.message}
              />
            </div>

            <Field label="Tell us about your project" name="description" error={errors.description?.message} required>
              <textarea
                id="description"
                rows={5}
                placeholder="Project description"
                aria-invalid={!!errors.description}
                className={cn(inputCls, "resize-y min-h-[140px]")}
                {...register("description")}
              />
              <span className="pointer-events-none absolute bottom-3 right-4 font-mono text-[0.65rem] text-fg-3">
                {description.length}/5000
              </span>
            </Field>

            {/* Honeypot — visually hidden, ignored by humans and assistive tech */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="website">Website</label>
              <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
            </div>
            <input type="hidden" {...register("startedAt", { valueAsNumber: true })} />

            <div>
              <label className="group flex cursor-pointer items-start gap-3 text-sm text-fg-2">
                <input type="checkbox" className="peer sr-only" aria-invalid={!!errors.consent} {...register("consent")} />
                <span
                  aria-hidden
                  className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border border-line-strong transition-colors peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-signal [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
                >
                  <svg viewBox="0 0 12 12" className="size-3 text-white transition-opacity">
                    <path d="M2 6.5 L5 9 L10 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>
                  I agree that my details will be stored and used to respond to this inquiry, as described in the{" "}
                  <Link href="/privacy" className="text-fg underline underline-offset-4 hover:text-accent">
                    privacy notice
                  </Link>
                  .
                </span>
              </label>
              {errors.consent?.message && <ErrorText id="consent-error">{errors.consent.message}</ErrorText>}
            </div>

            <AnimatePresence>
              {serverError && (
                <motion.p
                  id="form-error"
                  role="alert"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/[0.06] px-4 py-3 text-sm text-danger"
                >
                  <AlertCircle className="size-4 shrink-0" aria-hidden />
                  {serverError}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-fg-3">Fields marked * are required.</p>
              <Button type="submit" size="lg" icon={status !== "submitting"} disabled={status === "submitting"} aria-busy={status === "submitting"}>
                {status === "submitting" ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" aria-hidden /> Sending…
                  </span>
                ) : (
                  "Send Inquiry"
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, name, error, required, children }: { label: string; name: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className="relative">
        {children}
        <label
          htmlFor={name}
          className="pointer-events-none absolute left-4 top-2 text-[0.7rem] font-medium uppercase tracking-[0.08em] text-fg-3 transition-colors peer-focus:text-accent"
        >
          {label}
          {required && " *"}
        </label>
      </div>
      {error && <ErrorText id={`${name}-error`}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <motion.p id={id} role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 flex items-center gap-1.5 text-xs text-danger">
      <AlertCircle className="size-3.5" aria-hidden />
      {children}
    </motion.p>
  );
}

function ChipGroup({
  legend,
  name,
  options,
  register,
  selected,
  error,
}: {
  legend: string;
  name: "projectType" | "estimatedBudget" | "projectTimeline";
  options: { value: string; label: string }[];
  register: ReturnType<typeof useForm<ContactFormInput, unknown, ContactFormData>>["register"];
  selected?: string;
  error?: string;
}) {
  return (
    <fieldset aria-invalid={!!error}>
      <legend className="mb-3 text-[0.7rem] font-medium uppercase tracking-[0.08em] text-fg-3">{legend} *</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = selected === o.value;
          return (
            <label
              key={o.value}
              className={cn(
                "relative cursor-pointer select-none rounded-full border px-4 py-2 text-sm transition-all duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-signal",
                on ? "border-accent bg-accent/15 text-fg" : "border-line text-fg-2 hover:border-line-strong hover:text-fg",
              )}
            >
              <input type="radio" value={o.value} className="sr-only" {...register(name)} />
              {on && <motion.span layoutId={`chip-${name}`} className="absolute inset-0 -z-0 rounded-full bg-accent/10" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="relative">{o.label}</span>
            </label>
          );
        })}
      </div>
      {error && <ErrorText id={`${name}-error`}>{error}</ErrorText>}
    </fieldset>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex min-h-[520px] flex-col items-center justify-center gap-6 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute inset-0 rounded-full border border-success/40"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 2, delay: 0.3 + i * 0.4, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
        <svg viewBox="0 0 80 80" className="relative size-24">
          <motion.circle cx="40" cy="40" r="36" fill="none" stroke="var(--success)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} />
          <motion.path d="M25 41 L35 51 L56 30" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }} />
        </svg>
      </div>
      <h3 className="display text-4xl sm:text-5xl">
        Thank you<span className="accent-serif text-success">.</span>
      </h3>
      <p className="max-w-md leading-relaxed text-fg-2">
        Your inquiry has been received. We&apos;ll review your requirements and get back to you to schedule a discovery
        conversation.
      </p>
      <Button variant="ghost" onClick={onReset}>
        Send another inquiry
      </Button>
    </motion.div>
  );
}

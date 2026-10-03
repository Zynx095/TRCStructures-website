"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { primaryPhone, telHref, whatsappHref } from "@/config/contact";
import { contactPage } from "@/content/pages/contact";
import { FIELD_ORDER, LIMITS, normalise, validate, type EnquiryField, type FieldErrors } from "@/lib/enquiry";
import { cn } from "@/lib/cn";

type Status = "idle" | "sending" | "success" | "error";

const inputBase =
  "mt-2 block min-h-12 w-full border border-ink/25 bg-white px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink aria-[invalid=true]:border-error";

export function EnquiryForm() {
  const { form } = contactPage;
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(0);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const wa = whatsappHref();

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "success" || status === "error") resultRef.current?.focus();
  }, [status]);

  const id = (f: EnquiryField) => `${uid}-${f}`;
  const describedBy = (f: EnquiryField, hint?: boolean) =>
    [errors[f] ? `${id(f)}-error` : null, hint ? `${id(f)}-hint` : null].filter(Boolean).join(" ") || undefined;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, unknown>;
    const input = normalise({ ...data, startedAt: startedAt.current });
    const found = validate(input);
    setErrors(found);
    const first = FIELD_ORDER.find((f) => found[f]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(first))}`)?.focus();
      return;
    }
    setStatus("sending");
    setServerError(null);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: FieldErrors; error?: string };
      if (res.ok && body.ok) {
        setStatus("success");
        formRef.current?.reset();
        return;
      }
      if (body.errors) {
        setErrors(body.errors);
        setStatus("idle");
        return;
      }
      setServerError(
        res.status === 429 ? "Too many enquiries from this connection. Please wait a few minutes, or call us." : form.error.text,
      );
      setStatus("error");
    } catch {
      setServerError(form.error.text);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div ref={resultRef} tabIndex={-1} role="status" className="border-l-[3px] border-success bg-white p-8 outline-none">
        <h3 className="font-heading text-h3 font-semibold">{form.success.title}</h3>
        <p className="mt-3 text-muted">{form.success.text}</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-6 font-heading font-semibold underline underline-offset-4">
          Send another enquiry
        </button>
      </div>
    );
  }

  const field = (f: EnquiryField, label: string, input: ReactNode, opts: { optional?: boolean; hint?: string } = {}) => (
    <div>
      <label htmlFor={id(f)} className="font-heading font-semibold">
        {label}
        {opts.optional && <span className="ml-2 font-normal text-muted">(optional)</span>}
      </label>
      {opts.hint && (
        <p id={`${id(f)}-hint`} className="mt-1 text-sm text-muted">
          {opts.hint}
        </p>
      )}
      {input}
      {errors[f] && (
        <p id={`${id(f)}-error`} className="mt-2 flex items-center gap-2 text-sm font-medium text-error">
          <span aria-hidden className="size-1.5 bg-error" />
          {errors[f]}
        </p>
      )}
    </div>
  );

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby={`${uid}-note`} className="grid gap-6">
      {status === "error" && serverError && (
        <div ref={resultRef} tabIndex={-1} role="alert" className="border-l-[3px] border-error bg-white p-5 outline-none">
          <p className="font-heading font-semibold">{form.error.title}</p>
          <p className="mt-1 text-sm text-muted">{serverError}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold">
            <a href={telHref()} className="inline-flex items-center gap-2 underline underline-offset-4">
              <PhoneIcon size={16} /> {primaryPhone.display}
            </a>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline underline-offset-4">
                <WhatsAppIcon size={16} /> WhatsApp
              </a>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {field(
          "name",
          "Your name",
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name}
            required
            aria-invalid={!!errors.name}
            aria-describedby={describedBy("name")}
            className={inputBase}
          />,
        )}
        {field(
          "phone",
          "Phone",
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={LIMITS.phone}
            required
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone")}
            className={inputBase}
          />,
        )}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {field(
          "email",
          "Email",
          <input
            id={id("email")}
            name="email"
            type="email"
            autoComplete="email"
            maxLength={LIMITS.email}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
            className={inputBase}
          />,
          { optional: true },
        )}
        {field(
          "projectType",
          "Type of work",
          <select
            id={id("projectType")}
            name="projectType"
            required
            defaultValue=""
            aria-invalid={!!errors.projectType}
            aria-describedby={describedBy("projectType")}
            className={cn(inputBase, "appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10")}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%231b1f23' stroke-width='1.6'/%3E%3C/svg%3E\")",
            }}
          >
            <option value="" disabled>
              Choose one
            </option>
            {form.projectTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>,
        )}
      </div>
      {field(
        "location",
        "Site location",
        <input
          id={id("location")}
          name="location"
          type="text"
          autoComplete="address-level2"
          maxLength={LIMITS.location}
          required
          aria-invalid={!!errors.location}
          aria-describedby={describedBy("location", true)}
          className={inputBase}
        />,
        { hint: "Area and town, e.g. Nelamangala." },
      )}
      {field(
        "message",
        "What needs building?",
        <textarea
          id={id("message")}
          name="message"
          rows={5}
          maxLength={LIMITS.message}
          required
          aria-invalid={!!errors.message}
          aria-describedby={describedBy("message", true)}
          className={cn(inputBase, "resize-y")}
        />,
        { hint: "Size, stage and timing help us prepare for the visit." },
      )}

      {/* honeypot: hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-company`}>Leave this field empty</label>
        <input id={`${uid}-company`} name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id={`${uid}-note`} className="text-sm text-muted">
          {form.note}{" "}
          <Link href="/privacy" className="underline underline-offset-4">
            Privacy
          </Link>
        </p>
        <Button type="submit" disabled={status === "sending"} className="sm:min-w-48">
          {status === "sending" ? form.sending : form.submit}
        </Button>
      </div>
      <p aria-live="polite" className="sr-only">
        {status === "sending" ? form.sending : ""}
      </p>
    </form>
  );
}

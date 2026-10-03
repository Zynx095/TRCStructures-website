/**
 * Enquiry form contract — shared by the browser (instant feedback) and the API route
 * (the authority). Keep messages short and specific.
 */
import { contactPage } from "@/content/pages/contact";

export interface EnquiryInput {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  location: string;
  message: string;
  /** honeypot — real people never fill this */
  companyWebsite?: string;
  /** ms timestamp when the form was first shown */
  startedAt?: number;
}

export type EnquiryField = "name" | "phone" | "email" | "projectType" | "location" | "message";
export type FieldErrors = Partial<Record<EnquiryField, string>>;

export const LIMITS = {
  name: 80,
  phone: 20,
  email: 120,
  location: 120,
  message: 2000,
} as const;

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max) : "";

export function normalise(raw: Record<string, unknown>): EnquiryInput {
  return {
    name: clean(raw.name, LIMITS.name),
    phone: clean(raw.phone, LIMITS.phone),
    email: clean(raw.email, LIMITS.email),
    projectType: clean(raw.projectType, 60),
    location: clean(raw.location, LIMITS.location),
    message: clean(raw.message, LIMITS.message),
    companyWebsite: clean(raw.companyWebsite, 200),
    startedAt: typeof raw.startedAt === "number" ? raw.startedAt : Number(raw.startedAt) || undefined,
  };
}

export function validate(input: EnquiryInput): FieldErrors {
  const errors: FieldErrors = {};
  if (input.name.length < 2) errors.name = "Enter your name.";

  const digits = input.phone.replace(/\D/g, "");
  if (!input.phone) errors.phone = "Enter a phone number so we can call you back.";
  else if (!/^[+\d][\d\s-]*$/.test(input.phone) || digits.length < 10 || digits.length > 13)
    errors.phone = "Enter a 10-digit mobile number, with or without +91.";

  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.email)) errors.email = "Check the email address, or leave it empty.";

  if (!contactPage.form.projectTypes.includes(input.projectType)) errors.projectType = "Choose the type of work.";
  if (input.location.length < 2) errors.location = "Tell us where the site is (area or town).";
  if (input.message.length < 10) errors.message = "Describe the work in a sentence or two.";
  return errors;
}

export const FIELD_ORDER: EnquiryField[] = ["name", "phone", "email", "projectType", "location", "message"];

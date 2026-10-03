import "server-only";
import { site } from "@/config/site";
import type { EnquiryInput } from "./enquiry";

/**
 * Sends a validated enquiry. Configure ONE of these in the server environment
 * (never NEXT_PUBLIC_*):
 *  - RESEND_API_KEY + ENQUIRY_TO_EMAIL (+ optional ENQUIRY_FROM_EMAIL)  → email via Resend's HTTP API
 *  - ENQUIRY_WEBHOOK_URL                                                → JSON POST (Make, Zapier, Slack, Formspree…)
 * With neither set: development logs the enquiry; production reports "not configured".
 */
export type DeliveryResult = { ok: true } | { ok: false; reason: "not-configured" | "failed" };

function asText(e: EnquiryInput): string {
  return [
    `New enquiry from the ${site.name} website`,
    "",
    `Name: ${e.name}`,
    `Phone: ${e.phone}`,
    `Email: ${e.email || "—"}`,
    `Work: ${e.projectType}`,
    `Site location: ${e.location}`,
    "",
    e.message,
  ].join("\n");
}

export async function deliverEnquiry(e: EnquiryInput): Promise<DeliveryResult> {
  const { RESEND_API_KEY, ENQUIRY_TO_EMAIL, ENQUIRY_FROM_EMAIL, ENQUIRY_WEBHOOK_URL } = process.env;

  try {
    if (RESEND_API_KEY && ENQUIRY_TO_EMAIL) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: ENQUIRY_FROM_EMAIL || `Website enquiries <onboarding@resend.dev>`,
          to: ENQUIRY_TO_EMAIL.split(",").map((s) => s.trim()),
          reply_to: e.email || undefined,
          subject: `Enquiry: ${e.projectType} — ${e.location}`,
          text: asText(e),
        }),
        signal: AbortSignal.timeout(10000),
      });
      return res.ok ? { ok: true } : { ok: false, reason: "failed" };
    }

    if (ENQUIRY_WEBHOOK_URL) {
      const res = await fetch(ENQUIRY_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "website", receivedAt: new Date().toISOString(), text: asText(e), ...e }),
        signal: AbortSignal.timeout(10000),
      });
      return res.ok ? { ok: true } : { ok: false, reason: "failed" };
    }
  } catch {
    return { ok: false, reason: "failed" };
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[enquiry] delivery not configured — logged instead:\n" + asText(e));
    return { ok: true };
  }
  return { ok: false, reason: "not-configured" };
}

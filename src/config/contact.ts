/**
 * ALL public contact details live here — change them once, they update everywhere
 * (header, footer, mobile action bar, contact page, structured data).
 *
 * Status (October 2026): taken from the portfolio contact page and the Udyam
 * certificate. The questionnaire asks the client to confirm which number/email is
 * public and whether WhatsApp is active. Until then:
 * - primary phone = first number on the portfolio contact page (also on the Udyam record)
 * - public email  = first email on the portfolio contact page
 * - WhatsApp      = primary phone (UNCONFIRMED — set `enabled: false` if not on WhatsApp)
 */

export interface PhoneNumber {
  label: string;
  /** E.164 without spaces, used for tel: links */
  e164: string;
  /** display format */
  display: string;
}

export const contact = {
  phones: [
    { label: "Primary", e164: "+919036622450", display: "+91 90366 22450" },
    { label: "Alternate", e164: "+919880422113", display: "+91 98804 22113" },
  ] satisfies PhoneNumber[],

  whatsapp: {
    enabled: true,
    /** country code + number, digits only */
    number: "919036622450",
    prefill: "Hello T R Constructions, I would like to discuss a project.",
  },

  email: {
    /** shown publicly */
    public: "trc.bglr@gmail.com",
    /** other addresses found in client documents — not published */
    unpublished: ["tulsiram.pm@gmail.com", "trconstructions.gst@gmail.com"],
  },

  address: {
    /** as printed on the portfolio contact page; GST certificate shows "No. 6" */
    streetLines: ["No. 6 (466), 3rd Main Road", "C.M. Halli, Devasandra, New BEL Road"],
    locality: "Bengaluru",
    region: "Karnataka",
    postalCode: "560054",
    country: "IN",
    countryName: "India",
  },

  /** pending client confirmation — leave undefined to hide */
  hours: undefined as string | undefined,

  map: {
    /** used for the click-to-load map embed and the directions link */
    query: "3rd Main Road, C.M. Halli, Devasandra, New BEL Road, Bengaluru 560054",
    /** add confirmed coordinates to enable geo in structured data, e.g. { lat: 13.0, lng: 77.5 } */
    geo: undefined as { lat: number; lng: number } | undefined,
  },

  /** add confirmed profiles: { label: "Instagram", href: "https://..." } */
  social: [] as { label: string; href: string }[],
} as const;

export const primaryPhone = contact.phones[0];

export function telHref(phone: PhoneNumber = primaryPhone): string {
  return `tel:${phone.e164}`;
}

export function whatsappHref(message: string = contact.whatsapp.prefill): string | null {
  if (!contact.whatsapp.enabled) return null;
  return `https://wa.me/${contact.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export function mailtoHref(subject = "Project enquiry"): string {
  return `mailto:${contact.email.public}?subject=${encodeURIComponent(subject)}`;
}

export function mapsDirectionsHref(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.map.query)}`;
}

export function mapsEmbedSrc(): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(contact.map.query)}&output=embed`;
}

export function addressLines(): string[] {
  const a = contact.address;
  return [...a.streetLines, `${a.locality}, ${a.region} ${a.postalCode}`];
}

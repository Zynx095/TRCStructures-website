/**
 * Company identity. Facts here come from the GST certificate (REG-06), the Udyam
 * certificate and the company portfolio. Do not add claims that are not documented.
 */

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const site = {
  name: "T R Constructions",
  /** the mark the company already uses */
  monogram: "TRC",
  proprietor: "Tulsi Ram Narayan Reddy",
  constitution: "Proprietorship",
  /** GST registration approved and business commenced on this date (GST REG-06, Udyam) */
  registeredOn: "2021-04-28",
  url: siteUrl,
  locale: "en_IN",
  language: "en-IN",
  /** one-sentence description used by SEO defaults and the footer */
  description:
    "T R Constructions is a Bengaluru civil and building contractor executing structure, blockwork, finishes, interiors and water-tank works for developers, institutions and homeowners across Karnataka and Andhra Pradesh.",
  /** shown as understated badges; registration numbers are deliberately not published */
  registrations: [
    {
      id: "gst",
      label: "GST registered",
      detail: "Regular registration, Karnataka — since April 2021",
    },
    {
      id: "msme",
      label: "MSME (Udyam) registered",
      detail: "Micro enterprise — registered April 2021",
    },
  ],
  /** Udyam NIC activities that relate to construction (cleaning activity intentionally not listed) */
  registeredActivities: [
    "Construction of buildings",
    "Civil engineering projects",
    "Specialised construction activities",
  ],
} as const;

export type Site = typeof site;

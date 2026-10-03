/**
 * Content model for the T R Constructions website.
 *
 * Rule of thumb: every field that appears on the public site must be traceable to a
 * client document or the client's own project list. Optional fields stay empty until
 * confirmed. Sensitive fields use `Disclosure<T>` so the data can be stored now and
 * published later by flipping `display` to true.
 */

export type ProjectStatus = "completed" | "ongoing" | "upcoming";

/**
 * How T R Constructions was engaged on a project.
 * - full-contract: whole works package (materials + labour) — only when documented
 * - labour-only:   labour contract, materials by others
 * - partnership:   executed jointly with / under another firm
 * - execution:     T R Constructions executed the stated works; contract type not documented
 */
export type ProjectScope = "full-contract" | "labour-only" | "partnership" | "execution";

export type ProjectCategory =
  | "residential"
  | "commercial"
  | "institutional"
  | "infrastructure"
  | "interiors"
  | "water-infrastructure"
  | "industrial";

/** Where the status came from. Portfolio statuses are undated and need re-confirmation. */
export type StatusSource = "client-update" | "portfolio";

export type ServiceSlug =
  | "residential-construction"
  | "commercial-institutional-works"
  | "sump-oht-construction"
  | "interiors-fit-outs"
  | "renovation"
  | "peb-industrial-structures"
  | "layout-land-development";

/** Illustrative line drawing used when a project has no published photographs. */
export type DrawingKind = "tank" | "residential" | "villa" | "portal-frame";

export interface FocalPoint {
  /** percentage from the left edge, 0–100 */
  x: number;
  /** percentage from the top edge, 0–100 */
  y: number;
}

export interface MediaImage {
  /** path inside /public, e.g. "/images/portfolio/hal-staff-villas/01-villas-under-construction.jpg" */
  src: string;
  /** what is visible in the photo — factual, no marketing */
  alt: string;
  caption?: string;
  /** crop focus for wide/desktop frames */
  focal?: FocalPoint;
  /** crop focus for tall/mobile frames */
  focalMobile?: FocalPoint;
  /** "inferred" = attributed to the project from the portfolio page order, not a caption */
  attribution?: "documented" | "inferred";
}

export interface ProjectLocation {
  area?: string;
  city?: string;
  state?: string;
}

/** A value we hold but only publish when `display` is true (client approval). */
export interface Disclosure<T> {
  value: T;
  display: boolean;
}

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  secondaryCategories?: ProjectCategory[];
  /** omit when the source does not state a location */
  location?: ProjectLocation;
  status: ProjectStatus;
  statusSource: StatusSource;
  /** qualifier shown with the status, e.g. "Near finishing stage" */
  statusNote?: string;
  scope: ProjectScope;
  /** one factual sentence: what T R Constructions did / is doing */
  role: string;
  /** scope items exactly as documented */
  works?: string[];
  /** one line for cards and meta descriptions */
  summary: string;
  /** factual paragraphs for the detail page */
  description?: string[];
  client?: Disclosure<string>;
  /** firm the work was executed with / under (partnership projects) */
  partner?: string;
  value?: Disclosure<string>;
  area?: string;
  capacity?: string;
  duration?: string;
  services: ServiceSlug[];
  /** first image is the cover. Empty → an illustrative drawing is shown instead */
  images: MediaImage[];
  drawing?: DrawingKind;
  /** appears in the home-page gallery */
  featured?: boolean;
  /** ascending sort order across the site */
  order: number;
  visible: boolean;
  /** provenance of the facts (internal, shown in small print on detail pages) */
  source: string;
}

export interface Service {
  slug: ServiceSlug;
  name: string;
  /** short label for tight UI (tabs, chips) */
  shortName: string;
  /** one line */
  summary: string;
  description: string[];
  /** typical work items in this service */
  includes: string[];
  /** wording that keeps the claim honest, e.g. { label: "Current work", text: "Four projects under execution…" } */
  qualifier?: { label: string; text: string };
  image?: MediaImage;
  drawing?: DrawingKind;
  /** special page feature */
  feature?: "tank-structure";
  order: number;
  visible: boolean;
  seo: { title: string; description: string };
}

export interface Affiliation {
  name: string;
  /** path inside /public. Copy from assets-source/affiliations/ only after approval */
  logo?: string;
  /** e.g. "Client — labour contract, school building" */
  relationship?: string;
  projectSlugs?: string[];
  /** client confirmed the relationship AND permission to display */
  approved: boolean;
  /** editorial toggle */
  visible: boolean;
  /** internal note — never rendered */
  note?: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  organisation?: string;
  projectSlug?: string;
  date?: string;
  /** written permission from the person quoted */
  approved: boolean;
  visible: boolean;
}

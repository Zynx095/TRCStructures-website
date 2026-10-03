import { contact } from "@/config/contact";
import { site } from "@/config/site";
import { getProjectStats } from "@/content/projects";
import { getServices } from "@/content/services";
import type { Project, Service } from "@/content/types";

export const orgId = `${site.url}/#organization`;

/**
 * GeneralContractor (a LocalBusiness subtype). No ratings, reviews, founding claims
 * or geo coordinates unless they are confirmed in config.
 */
export function organizationSchema() {
  const { states } = getProjectStats();
  const a = contact.address;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": orgId,
    name: site.name,
    alternateName: site.monogram,
    url: site.url,
    logo: `${site.url}/brand/trc-logo-512.png`,
    image: `${site.url}/brand/trc-logo-512.png`,
    description: site.description,
    telephone: contact.phones[0].e164,
    email: contact.email.public,
    address: {
      "@type": "PostalAddress",
      streetAddress: a.streetLines.join(", "),
      addressLocality: a.locality,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    areaServed: states.map((name) => ({ "@type": "State", name })),
    knowsAbout: getServices().map((s) => s.name),
  };
  if (contact.map.geo) {
    data.geo = { "@type": "GeoCoordinates", latitude: contact.map.geo.lat, longitude: contact.map.geo.lng };
  }
  if (contact.social.length) data.sameAs = contact.social.map((s) => s.href);
  return data;
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    inLanguage: site.language,
    publisher: { "@id": orgId },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export function serviceSchema(service: Service) {
  const { states } = getProjectStats();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: service.summary,
    url: `${site.url}/services/${service.slug}`,
    provider: { "@id": orgId },
    areaServed: states.map((name) => ({ "@type": "State", name })),
  };
}

/** Project pages are described as a CreativeWork about the site work, credited to the company. */
export function projectSchema(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${site.url}/projects/${project.slug}`,
    creator: { "@id": orgId },
    image: project.images.slice(0, 3).map((i) => `${site.url}${i.src}`),
    ...(project.location?.city || project.location?.area
      ? { locationCreated: { "@type": "Place", name: [project.location.area, project.location.city, project.location.state].filter(Boolean).join(", ") } }
      : {}),
  };
}

/** serialise safely for a <script type="application/ld+json"> */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

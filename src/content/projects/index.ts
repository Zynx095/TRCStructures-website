import type { Project, ProjectCategory, ProjectScope, ProjectStatus, ServiceSlug } from "../types";
import { projects as allProjects } from "./data";

/** when the client last confirmed the status of current works (update when they send a new list) */
export const CLIENT_UPDATE_LABEL = "October 2026";

export const categoryLabels: Record<ProjectCategory, string> = {
  residential: "Residential",
  commercial: "Commercial",
  institutional: "Institutional",
  infrastructure: "Infrastructure",
  interiors: "Interiors",
  "water-infrastructure": "Water infrastructure",
  industrial: "Industrial",
};

export const statusLabels: Record<ProjectStatus, string> = {
  completed: "Completed",
  ongoing: "Ongoing",
  upcoming: "Upcoming",
};

export const scopeLabels: Record<ProjectScope, string> = {
  "full-contract": "Full contract",
  "labour-only": "Labour only",
  partnership: "Partnership",
  execution: "Execution scope",
};

/** plain-language explanation shown in tooltips/legends */
export const scopeDescriptions: Record<ProjectScope, string> = {
  "full-contract": "T R Constructions held the complete works contract.",
  "labour-only": "T R Constructions supplied the labour; materials were supplied by others.",
  partnership: "Executed together with, or in the name of, a partner firm.",
  execution: "T R Constructions executed the works listed; the contract type is not stated in the source.",
};

export function getProjects(): Project[] {
  return allProjects.filter((p) => p.visible).sort((a, b) => a.order - b.order);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((p) => p.featured && p.images.length > 0);
}

/** the client's current list of works (status confirmed by the client) */
export function getCurrentWorks(): Project[] {
  return getProjects().filter((p) => p.statusSource === "client-update" && p.status === "ongoing");
}

export function getProjectsForService(slug: ServiceSlug): Project[] {
  return getProjects().filter((p) => p.services.includes(slug));
}

export function getRelatedProjects(project: Project, limit = 3): Project[] {
  const pool = getProjects().filter((p) => p.slug !== project.slug);
  const score = (p: Project) =>
    (p.category === project.category ? 3 : 0) +
    p.services.filter((s) => project.services.includes(s)).length * 2 +
    (p.images.length > 0 ? 1 : 0);
  return pool
    .map((p) => ({ p, s: score(p) }))
    .filter(({ s }) => s > 1)
    .sort((a, b) => b.s - a.s || a.p.order - b.p.order)
    .slice(0, limit)
    .map(({ p }) => p);
}

/** categories that actually have visible projects, in display order */
export function getCategoriesInUse(): ProjectCategory[] {
  const order: ProjectCategory[] = [
    "residential",
    "commercial",
    "institutional",
    "interiors",
    "infrastructure",
    "water-infrastructure",
    "industrial",
  ];
  const used = new Set(getProjects().flatMap((p) => [p.category, ...(p.secondaryCategories ?? [])]));
  return order.filter((c) => used.has(c));
}

export function formatLocation(p: Pick<Project, "location">): string | null {
  const l = p.location;
  if (!l) return null;
  return [l.area, l.city, l.state].filter(Boolean).join(", ") || null;
}

export function shortLocation(p: Pick<Project, "location">): string | null {
  const l = p.location;
  if (!l) return null;
  return l.area ?? l.city ?? l.state ?? null;
}

/** facts derived from the data — never hand-typed numbers */
export function getProjectStats() {
  const list = getProjects();
  const portfolio = list.filter((p) => p.statusSource === "portfolio");
  const current = getCurrentWorks();
  const states = Array.from(new Set(list.map((p) => p.location?.state).filter(Boolean))) as string[];
  const places = Array.from(
    new Set(list.map((p) => p.location?.area ?? p.location?.city).filter(Boolean)),
  ) as string[];
  return {
    total: list.length,
    portfolio: portfolio.length,
    portfolioCompleted: portfolio.filter((p) => p.status === "completed").length,
    current: current.length,
    states,
    places,
    photographs: list.reduce((n, p) => n + p.images.length, 0),
  };
}

export { allProjects };

/** compact view model for linking to a project from other sections */
export interface ProjectRef {
  slug: string;
  title: string;
  status: Project["status"];
  statusSource: Project["statusSource"];
  scope: Project["scope"];
  location: string | null;
}

export function projectRef(p: Project): ProjectRef {
  return {
    slug: p.slug,
    title: p.title,
    status: p.status,
    statusSource: p.statusSource,
    scope: p.scope,
    location: shortLocation(p),
  };
}

export function projectRefs(slugs: string[]): ProjectRef[] {
  return slugs.map((s) => getProject(s)).filter((p): p is Project => Boolean(p)).map(projectRef);
}

import type { Service, ServiceSlug } from "../types";
import { services as allServices } from "./data";

export function getServices(): Service[] {
  return allServices.filter((s) => s.visible).sort((a, b) => a.order - b.order);
}

export function getService(slug: string): Service | undefined {
  return getServices().find((s) => s.slug === slug);
}

export function serviceName(slug: ServiceSlug): string {
  return allServices.find((s) => s.slug === slug)?.name ?? slug;
}

export { allServices };

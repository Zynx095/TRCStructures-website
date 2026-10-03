import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getProjects } from "@/content/projects";
import { getServices } from "@/content/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly") => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    page("/", 1, "weekly"),
    page("/projects", 0.9, "weekly"),
    page("/services", 0.8),
    page("/about", 0.6),
    page("/contact", 0.7),
    page("/privacy", 0.2, "yearly"),
    ...getServices().map((s) => page(`/services/${s.slug}`, 0.7)),
    ...getProjects().map((p) => page(`/projects/${p.slug}`, p.images.length ? 0.6 : 0.5)),
  ];
}

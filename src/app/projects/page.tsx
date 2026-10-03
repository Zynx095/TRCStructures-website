import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectExplorer } from "@/components/projects/ProjectExplorer";
import { ScopeChip, StatusChip } from "@/components/ui/Chips";
import {
  CLIENT_UPDATE_LABEL,
  formatLocation,
  getCategoriesInUse,
  getCurrentWorks,
  getProjectStats,
  getProjects,
} from "@/content/projects";

const description =
  "Project register of T R Constructions: civil, residential, institutional, interior and water-tank works in Karnataka and Andhra Pradesh — each with its status and our scope.";

export const metadata: Metadata = {
  title: "Projects",
  description,
  alternates: { canonical: "/projects" },
  openGraph: { title: "Projects | T R Constructions", description, url: "/projects" },
};

export default function ProjectsPage() {
  const projects = getProjects();
  const stats = getProjectStats();
  const current = getCurrentWorks();

  return (
    <>
      <PageHeader
        title="Projects"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
        ]}
        intro={
          <p>
            {stats.total} projects: {stats.portfolio} from the company portfolio and {stats.current} under way now. Every
            entry states its status and what T R Constructions was engaged to do.
          </p>
        }
      />

      <section aria-labelledby="current-title" className="border-b border-line bg-concrete">
        <div className="shell py-10 lg:py-12">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="current-title" className="font-heading text-h3 font-semibold">
              Under way now
            </h2>
            <p className="text-sm text-muted">Client project update, {CLIENT_UPDATE_LABEL}</p>
          </div>
          <ul className="no-scrollbar relative -mx-[clamp(1rem,4.2vw,4.5rem)] mt-6 flex snap-x snap-mandatory gap-px overflow-x-auto px-[clamp(1rem,4.2vw,4.5rem)] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:border sm:border-line sm:bg-line sm:px-0 lg:grid-cols-3">
            {current.map((p) => (
              <li key={p.slug} className="w-[78vw] shrink-0 snap-start border border-line bg-concrete sm:w-auto sm:border-0">
                <Link href={`/projects/${p.slug}`} className="group/cur flex h-full flex-col gap-3 p-5 hover:bg-paper">
                  <span className="display-type text-[1.9rem] leading-none">{formatLocation(p)}</span>
                  <span className="font-heading font-medium underline-offset-4 group-hover/cur:underline">{p.title}</span>
                  <span className="mt-auto flex flex-wrap gap-2 pt-2">
                    <StatusChip status={p.status} source={p.statusSource} />
                    <ScopeChip scope={p.scope} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="All projects" className="pb-16">
        <ProjectExplorer projects={projects} categories={getCategoriesInUse()} />
      </section>
    </>
  );
}

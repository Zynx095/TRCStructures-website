import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactBand } from "@/components/home/ContactBand";
import { ImageStory } from "@/components/projects/ImageStory";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectHero } from "@/components/projects/ProjectHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { TitleBlock, type TitleBlockItem } from "@/components/ui/TitleBlock";
import {
  CLIENT_UPDATE_LABEL,
  categoryLabels,
  formatLocation,
  getProject,
  getProjects,
  getRelatedProjects,
  scopeDescriptions,
  scopeLabels,
  statusLabels,
} from "@/content/projects";
import { serviceName } from "@/content/services";
import { projectSchema } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const location = formatLocation(project);
  const description = `${project.summary}${location ? ` ${location}.` : ""} ${statusLabels[project.status]} — ${scopeLabels[project.scope].toLowerCase()}.`;
  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: `${project.title} | T R Constructions`, description, url: `/projects/${project.slug}`, type: "article" },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const location = formatLocation(project);
  const statusLine =
    project.statusSource === "client-update"
      ? `Status from the client's project update, ${CLIENT_UPDATE_LABEL}.${project.statusNote ? ` ${project.statusNote}.` : ""}`
      : project.status === "completed"
        ? `Recorded as completed in the company portfolio.${project.statusNote ? ` ${project.statusNote}.` : ""}`
        : "Status as recorded in the company portfolio; an update is awaited.";

  const facts: TitleBlockItem[] = [
    { label: "Location", value: location ?? "Not disclosed" },
    {
      label: "Type",
      value: [project.category, ...(project.secondaryCategories ?? [])].map((c) => categoryLabels[c]).join(", "),
    },
    { label: "Status", value: `${statusLabels[project.status]}${project.statusNote ? ` (${project.statusNote.toLowerCase()})` : ""}` },
    { label: "Scope", value: scopeLabels[project.scope] },
  ];
  if (project.client?.display) facts.push({ label: "Client", value: project.client.value });
  if (project.partner) facts.push({ label: "Executed with", value: project.partner });
  if (project.area) facts.push({ label: "Built-up area", value: project.area });
  if (project.capacity) facts.push({ label: "Capacity", value: project.capacity });
  if (project.duration) facts.push({ label: "Duration", value: project.duration });
  if (project.value?.display) facts.push({ label: "Value", value: project.value.value });

  const related = getRelatedProjects(project, 3);
  const story = project.images.slice(1);

  return (
    <>
      <ProjectHero project={project} statusLine={statusLine} />

      <section aria-label="Project details" className="section-y">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <TitleBlock items={facts} />
            <p className="mt-4 text-sm text-muted">{scopeDescriptions[project.scope]}</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="font-heading text-h3 font-semibold">{project.role}</h2>
            <div className="prose-trc mt-6 text-lede text-muted">
              {(project.description ?? [project.summary]).map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
            {project.works && project.works.length > 0 && (
              <div className="mt-8">
                <h3 className="lettering text-muted">Works</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.works.map((w) => (
                    <li key={w} className="lettering border border-ink/20 px-3 py-2">
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-8">
              <h3 className="lettering text-muted">Service</h3>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {project.services.map((s) => (
                  <li key={s}>
                    <ButtonLink href={`/services/${s}`} variant="ghost">
                      {serviceName(s)}
                    </ButtonLink>
                  </li>
                ))}
              </ul>
            </div>
            {project.images.length === 0 && (
              <p className="mt-10 border-l-[3px] border-amber bg-concrete px-5 py-4 text-sm">
                Site photographs for this project have not been published yet. The drawing above is illustrative.
              </p>
            )}
          </div>
        </div>
      </section>

      {story.length > 0 && (
        <section aria-labelledby="photos-title" className="pb-20 lg:pb-28">
          <div className="shell">
            <h2 id="photos-title" className="font-heading text-h2 font-semibold">
              On site
            </h2>
            <div className="mt-10">
              <ImageStory images={story} title={project.title} />
            </div>
          </div>
        </section>
      )}

      <section aria-label="Source" className="border-t border-line">
        <div className="shell py-6 text-sm text-muted">
          <p>
            Source: {project.source}.
            {project.images.some((i) => i.attribution === "inferred") &&
              " Some photographs are attributed to this project by their position in the portfolio and are marked."}
          </p>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="section-y bg-concrete">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 id="related-title" className="font-heading text-h2 font-semibold">
                Related projects
              </h2>
              <ButtonLink href="/projects" variant="ghost">
                All projects
              </ButtonLink>
            </div>
            <ul className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <ProjectCard project={p} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <ContactBand
        title="Planning similar work?"
        text="Tell us where the site is and what needs building. We will get back to you to arrange a site visit."
        primary={{ label: "Request a site visit", href: "/contact#enquiry" }}
      />
      <JsonLd data={projectSchema(project)} />
    </>
  );
}

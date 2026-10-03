import { formatLocation, getProject, getProjects, scopeLabels, statusLabels } from "@/content/projects";
import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Project by T R Constructions";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return renderOgImage({ title: "Projects", subtitle: "T R Constructions, Bengaluru" });
  const location = formatLocation(project);
  return renderOgImage({
    title: project.title,
    subtitle: `${statusLabels[project.status]} · ${scopeLabels[project.scope]}${location ? ` · ${location}` : ""}`,
    photo: project.images[0]?.src,
  });
}

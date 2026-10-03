import Link from "next/link";
import { ViewTransition } from "react";
import { Drawing } from "@/components/media/Drawing";
import { Photo } from "@/components/media/Photo";
import { ProjectChips } from "@/components/ui/Chips";
import { categoryLabels, formatLocation } from "@/content/projects";
import type { Project } from "@/content/types";
import { cn } from "@/lib/cn";

export function projectTransitionName(slug: string) {
  return `project-${slug}`;
}

/** Cover visual: first photograph, or a labelled illustrative drawing when none exists. */
export function ProjectCover({
  project,
  sizes,
  eager,
  className,
  morph = false,
  hoverZoom = true,
}: {
  project: Project;
  sizes: string;
  eager?: boolean;
  className?: string;
  /** shares the image with the project page through a view transition */
  morph?: boolean;
  /** subtle zoom on hover (off when GSAP animates the image) */
  hoverZoom?: boolean;
}) {
  const cover = project.images[0];
  const inner = (
    <div className={cn("relative h-full w-full overflow-hidden bg-slate", className)}>
      {cover ? (
        <Photo
          image={cover}
          sizes={sizes}
          eager={eager}
          className={hoverZoom ? "transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover/card:scale-[1.035]" : undefined}
        />
      ) : (
        <Drawing kind={project.drawing ?? "residential"} />
      )}
    </div>
  );
  if (!morph) return inner;
  return (
    <ViewTransition name={projectTransitionName(project.slug)} share="morph" default="none">
      {inner}
    </ViewTransition>
  );
}

export function ProjectMeta({ project, tone = "light", headingLevel = 3 }: { project: Project; tone?: "light" | "dark"; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const location = formatLocation(project);
  return (
    <div className={cn("mt-4 border-t pt-3", tone === "dark" ? "border-white/20" : "border-ink/15")}>
      <div className="flex items-start justify-between gap-4">
        <H className="font-heading text-[1.15rem] font-semibold leading-snug tracking-[-0.01em] lg:text-xl">{project.title}</H>
        <span className={cn("lettering shrink-0 pt-1", tone === "dark" ? "text-white/60" : "text-muted")}>
          {categoryLabels[project.category]}
        </span>
      </div>
      <p className={cn("mt-1 text-sm", tone === "dark" ? "text-white/65" : "text-muted")}>
        {location ?? "Location not disclosed"}
      </p>
      <ProjectChips project={project} className="mt-3" />
    </div>
  );
}

export function ProjectCard({
  project,
  sizes,
  eager,
  aspect = "aspect-[4/3]",
  tone = "light",
  morph = true,
  className,
}: {
  project: Project;
  sizes: string;
  eager?: boolean;
  aspect?: string;
  tone?: "light" | "dark";
  morph?: boolean;
  className?: string;
}) {
  return (
    <article className={cn("group/card", className)}>
      <Link href={`/projects/${project.slug}`} className="block" data-cursor="View project">
        <div className={aspect}>
          <ProjectCover project={project} sizes={sizes} eager={eager} morph={morph} />
        </div>
        <ProjectMeta project={project} tone={tone} />
      </Link>
    </article>
  );
}

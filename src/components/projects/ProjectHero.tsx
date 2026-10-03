"use client";

import { useRef, ViewTransition } from "react";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { Drawing } from "@/components/media/Drawing";
import { Photo } from "@/components/media/Photo";
import { ProjectChips } from "@/components/ui/Chips";
import { media } from "@/config/motion";
import type { Project } from "@/content/types";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { projectTransitionName } from "./ProjectCard";

/**
 * Project page opening. The cover arrives from the card via a shared view transition
 * (WOW 06); GSAP then sets the title line by line.
 */
export function ProjectHero({ project, statusLine }: { project: Project; statusLine: string }) {
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const cover = project.images[0];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.motionOk, () => {
        const split = SplitText.create(title.current!, { type: "lines", mask: "lines", aria: "auto" });
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(split.lines, { yPercent: 105, duration: 1.1, stagger: 0.08 }, 0.15)
          .from("[data-hero-meta]", { opacity: 0, y: 16, duration: 0.7, stagger: 0.06 }, 0.45);
        return () => split.revert();
      });
    },
    { scope: root },
  );

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: project.title, path: `/projects/${project.slug}` },
  ];

  if (!cover) {
    return (
      <section ref={root} data-tone="deep" className="relative overflow-hidden pb-14 pt-32 lg:pb-20 lg:pt-40">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <Breadcrumbs items={crumbs} className="text-white" />
            <h1 ref={title} className="display-type mt-8 text-h1 lg:text-[clamp(3rem,1.5rem+3.6vw,6rem)] lg:leading-[0.92]">
              {project.title}
            </h1>
            <div data-hero-meta className="mt-6 text-white">
              <ProjectChips project={project} />
            </div>
            <p data-hero-meta className="mt-4 max-w-md text-sm text-white/65">
              {statusLine}
            </p>
          </div>
          <div className="lg:col-span-6">
            <ViewTransition name={projectTransitionName(project.slug)} share="morph" default="none">
              <div className="aspect-[4/3] w-full">
                <Drawing kind={project.drawing ?? "residential"} />
              </div>
            </ViewTransition>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={root} data-tone="deep" className="relative flex min-h-[80svh] flex-col justify-end overflow-hidden lg:min-h-[92svh]">
      <ViewTransition name={projectTransitionName(project.slug)} share="morph" default="none">
        <div className="absolute inset-0">
          <Photo image={cover} sizes="100vw" priority quality={75} />
        </div>
      </ViewTransition>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(0deg,rgb(21_28_34/0.95)_0%,rgb(21_28_34/0.7)_30%,rgb(21_28_34/0.15)_62%,rgb(21_28_34/0.35)_100%)]"
      />
      <div className="shell relative pb-12 pt-36 lg:pb-16">
        <Breadcrumbs items={crumbs} className="text-white" />
        <h1 ref={title} className="display-type mt-6 max-w-[16ch] text-[clamp(2.6rem,1.4rem+5vw,7.5rem)] leading-[0.9]">
          {project.title}
        </h1>
        <div data-hero-meta className="mt-6 text-white">
          <ProjectChips project={project} />
        </div>
        <p data-hero-meta className="mt-3 max-w-lg text-sm text-white/70">
          {statusLine}
        </p>
      </div>
    </section>
  );
}

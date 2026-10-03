"use client";

import Link from "next/link";
import { useRef } from "react";
import { ProjectCover, ProjectMeta } from "@/components/projects/ProjectCard";
import { ButtonLink } from "@/components/ui/Button";
import { media } from "@/config/motion";
import type { Project } from "@/content/types";
import { cn } from "@/lib/cn";
import { aspectOf } from "@/lib/images";
import { gsap, queueRefresh, useGSAP } from "@/lib/gsap";

interface Props {
  title: string;
  intro: string;
  cta: { label: string; href: string };
  projects: Project[];
  totals: { total: number; withPhotos: number };
}

/**
 * WOW 05 — selected projects. Desktop: the section pins and the photographs travel
 * sideways with the scroll. Phones: native swipe with snap points.
 */
export function ProjectGallery({ title, intro, cta, projects, totals }: Props) {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${media.desktop} and ${media.motionOk}`, () => {
        const t = track.current!;
        const distance = () => Math.max(0, t.scrollWidth - frame.current!.clientWidth);
        const items = gsap.utils.toArray<HTMLElement>("[data-gallery-item]", t);
        gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: frame.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
              if (counter.current) {
                const i = Math.min(items.length, Math.floor(self.progress * items.length) + 1);
                counter.current.textContent = String(i).padStart(2, "0");
              }
            },
          },
        });
        queueRefresh();
        // photographs drift slightly inside their frames for depth
        items.forEach((item) => {
          const img = item.querySelector("img");
          if (!img) return;
          gsap.fromTo(
            img,
            { xPercent: -4, scale: 1.1 },
            {
              xPercent: 4,
              ease: "none",
              scrollTrigger: {
                trigger: frame.current,
                start: "top top",
                end: () => `+=${distance()}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="gallery-title" className="relative bg-concrete">
      <div className="shell section-y pb-10 lg:pb-14">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="gallery-title" className="display-type text-display lg:col-span-7">
            {title}
          </h2>
          <div className="self-end lg:col-span-4 lg:col-start-9">
            <p className="max-w-md text-lede text-muted">{intro}</p>
            <div className="mt-5">
              <ButtonLink href={cta.href} variant="ghost">
                {cta.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      <div ref={frame} className="relative overflow-hidden pb-16 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:pb-0">
        <div
          ref={track}
          className="no-scrollbar relative flex snap-x snap-mandatory gap-5 overflow-x-auto px-[clamp(1rem,4.2vw,4.5rem)] lg:snap-none lg:gap-10 lg:overflow-visible"
        >
          {projects.map((p) => {
            const portrait = p.images[0] ? aspectOf(p.images[0].src) < 0.95 : false;
            return (
              <article
                key={p.slug}
                data-gallery-item
                className={cn(
                  "group/card shrink-0 snap-start",
                  portrait ? "w-[64vw] sm:w-[40vw] lg:w-auto" : "w-[84vw] sm:w-[60vw] lg:w-auto",
                )}
              >
                <Link href={`/projects/${p.slug}`} className="block" data-cursor="View project">
                  <div
                    className={cn(
                      "lg:h-[min(58vh,38vw)]",
                      portrait ? "aspect-[3/4]" : "aspect-[4/3]",
                    )}
                  >
                    <ProjectCover
                      project={p}
                      sizes={portrait ? "(min-width: 1024px) 30vw, 64vw" : "(min-width: 1024px) 52vw, 84vw"}
                      morph
                      hoverZoom={false}
                    />
                  </div>
                  <ProjectMeta project={p} />
                </Link>
              </article>
            );
          })}
          <div data-gallery-item className="flex w-[84vw] shrink-0 snap-start sm:w-[50vw] lg:w-[30vw]">
            <Link
              href={cta.href}
              className="group/end flex w-full flex-col justify-between bg-slate p-8 text-white lg:h-[min(58vh,38vw)]"
            >
              <span className="lettering text-amber">Project register</span>
              <span>
                <span className="display-type block text-[clamp(2.4rem,1.6rem+2.6vw,4.4rem)] leading-[0.9]">
                  All {totals.total} projects
                </span>
                <span className="mt-3 block text-white/70">
                  {totals.withPhotos} with photographs, filterable by status and type.
                </span>
              </span>
              <span className="font-heading font-semibold underline-offset-4 group-hover/end:underline">{cta.label}</span>
            </Link>
          </div>
        </div>

        <div aria-hidden className="shell mt-8 hidden items-center gap-6 lg:flex">
          <span className="lettering text-muted">
            <span ref={counter}>01</span> / {String(projects.length + 1).padStart(2, "0")}
          </span>
          <span className="relative h-[3px] flex-1 bg-ink/10">
            <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-amber" />
          </span>
        </div>
      </div>
    </section>
  );
}

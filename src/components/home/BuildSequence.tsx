"use client";

import Link from "next/link";
import { useRef } from "react";
import { riseIn } from "@/animations/reveal";
import { buildSequence, drawIn } from "@/animations/sequence";
import { Photo } from "@/components/media/Photo";
import { ScopeChip, StatusChip } from "@/components/ui/Chips";
import { media } from "@/config/motion";
import type { SequenceStage } from "@/content/pages/home";
import type { ProjectRef } from "@/content/projects";
import { gsap, queueRefresh, useGSAP } from "@/lib/gsap";
import { SectionDrawing } from "./SectionDrawing";

interface Props {
  title: string;
  intro: string;
  stages: (SequenceStage & { projects: ProjectRef[] })[];
}

/** WOW 02 — four construction stages, each told with photographs from real sites. */
export function BuildSequence({ title, intro, stages }: Props) {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${media.desktop} and ${media.motionOk}`, () => {
        buildSequence(root.current!, frame.current!);
        queueRefresh();
        return () => root.current?.removeAttribute("data-enhanced");
      });
      mm.add(`${media.mobile} and ${media.motionOk}`, () => {
        root.current!.querySelectorAll<HTMLElement>("[data-stage]").forEach((row) => {
          riseIn(row.querySelector("[data-stage-media]"), row, { start: "top 85%" });
        });
        drawIn(root.current!.querySelectorAll("[data-seq-drawing] path, [data-seq-drawing] line"), root.current!, {
          start: "top 70%",
          stagger: 0.01,
        });
      });
    },
    { scope: root },
  );

  const projectsFor = (slug: string) => stages.flatMap((s) => s.projects).find((p) => p.slug === slug);

  return (
    <section ref={root} data-tone="dark" aria-labelledby="seq-title" className="group/seq relative">
      <div className="shell section-y pb-12 lg:pb-16">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="seq-title" className="display-type text-display lg:col-span-7">
            {title}
          </h2>
          <p className="max-w-md self-end text-lede text-white/75 lg:col-span-4 lg:col-start-9">{intro}</p>
        </div>
      </div>

      <div ref={frame} className="relative group-data-[enhanced]/seq:h-svh group-data-[enhanced]/seq:overflow-hidden">
        {/* drawing: static at the top on phones, persistent overlay on desktop */}
        <div className="shell lg:hidden">
          <div data-seq-drawing className="mx-auto mb-12 max-w-md text-white/80">
            <SectionDrawing />
          </div>
        </div>

        <ol className="relative group-data-[enhanced]/seq:h-full">
          {stages.map((stage, i) => {
            const [main, inset] = stage.images;
            const mainProject = projectsFor(main.projectSlug);
            return (
              <li
                key={stage.id}
                data-stage
                className="relative pb-16 group-data-[enhanced]/seq:absolute group-data-[enhanced]/seq:inset-0 group-data-[enhanced]/seq:pb-0"
              >
                <div className="shell grid h-full items-center gap-8 lg:grid-cols-12 lg:gap-12 group-data-[enhanced]/seq:pt-20">
                  <figure
                    data-stage-media
                    className="relative aspect-[4/3] w-full overflow-hidden bg-slate-raised lg:col-span-7 lg:aspect-auto lg:h-[min(72vh,44vw)]"
                  >
                    <Photo image={main} sizes="(min-width: 1024px) 58vw, 100vw" />
                    {inset && (
                      <div className="absolute bottom-5 right-5 hidden aspect-[4/3] w-[36%] overflow-hidden border-[6px] border-slate lg:block">
                        <Photo image={inset} sizes="22vw" />
                      </div>
                    )}
                    {mainProject && (
                      <figcaption className="absolute bottom-0 left-0 max-w-[60%] bg-slate-deep/85 px-4 py-3">
                        <span className="lettering block text-[0.68rem] text-white/60">Photograph</span>
                        <span className="block font-heading text-sm text-white">{mainProject.title}</span>
                      </figcaption>
                    )}
                  </figure>

                  <div data-stage-text className="lg:col-span-5 lg:pb-[11rem]">
                    <p className="lettering text-amber">
                      Stage {stage.number} of {String(stages.length).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3">
                      <span className="display-type block text-[clamp(3.2rem,1.4rem+5.4vw,7.5rem)] leading-[0.85]">
                        {stage.stage}
                      </span>
                      <span className="mt-3 block font-heading text-h3 font-medium text-white/90">{stage.title}</span>
                    </h3>
                    <p className="mt-4 max-w-md text-white/75">{stage.text}</p>
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Work in this stage">
                      {stage.works.map((w) => (
                        <li key={w} className="lettering border border-white/20 px-2.5 py-1.5 text-white/80">
                          {w}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-7">
                      <p className="lettering text-white/55">Seen on</p>
                      <ul className="mt-2 divide-y divide-white/10 border-y border-white/10">
                        {stage.projects.map((p) => (
                          <li key={p.slug}>
                            <Link
                              href={`/projects/${p.slug}`}
                              className="group/ref flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3"
                            >
                              <span className="font-heading font-medium underline-offset-4 group-hover/ref:underline">
                                {p.title}
                              </span>
                              <span className="flex gap-2 text-white/80">
                                <StatusChip status={p.status} source={p.statusSource} />
                                <ScopeChip scope={p.scope} />
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {i === 0 && <span className="sr-only">Scroll to move through the four stages.</span>}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* desktop overlay: drawing + progress */}
        <div aria-hidden data-seq-overlay className="pointer-events-none absolute inset-x-0 bottom-0 hidden group-data-[enhanced]/seq:block">
          <div className="shell grid grid-cols-12 gap-12">
            <div className="col-span-5 col-start-8 pb-8">
              <div className="max-w-[17rem] text-white/80">
                <SectionDrawing />
              </div>
              <ol className="mt-4 grid grid-cols-4 gap-2">
                {stages.map((s) => (
                  <li key={s.id} data-progress-step style={{ ["--fill" as string]: 0 }} className="min-w-0">
                    <span className="block h-[3px] bg-white/15">
                      <span className="block h-full origin-left scale-x-[var(--fill)] bg-amber" />
                    </span>
                    <span className="lettering mt-2 block truncate text-[0.68rem] text-white/60">{s.stage}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

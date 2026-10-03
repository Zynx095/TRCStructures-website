"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef } from "react";
import { liftIn } from "@/animations/reveal";
import { Drawing } from "@/components/media/Drawing";
import { Photo } from "@/components/media/Photo";
import { ButtonLink } from "@/components/ui/Button";
import { ProjectChips, ScopeChip, StatusChip } from "@/components/ui/Chips";
import { media } from "@/config/motion";
import type { MediaImage, Project } from "@/content/types";
import { cn } from "@/lib/cn";
import { gsap, queueRefresh, useGSAP } from "@/lib/gsap";
import { useSceneEnabled } from "@/three/support";
import type { TankState } from "@/three/TankStructure";

const TankScene = dynamic(() => import("@/three/TankStructure"), { ssr: false });

export interface WaterSite {
  slug: string;
  title: string;
  place: string;
  project: Pick<Project, "status" | "statusSource" | "scope">;
}

interface Props {
  title: string;
  qualifier: string;
  text: string;
  steps: { id: string; title: string; text: string }[];
  sites: WaterSite[];
  updateLabel: string;
  related: { slug: string; title: string; role: string; capacity?: string; images: MediaImage[]; project: Project } | null;
  cta: { label: string; href: string };
}

/** WOW 04 — sump & OHT as current capability: a structure that assembles step by step. */
export function WaterSection({ title, qualifier, text, steps, sites, updateLabel, related, cta }: Props) {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const state = useRef<TankState>({ progress: 0, orbit: -0.6 });
  const sceneOn = useSceneEnabled();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      if (sceneOn) {
        mm.add(`${media.desktop} and ${media.motionOk}`, () => {
          const items = q("[data-water-step]");
          gsap.set(items, { opacity: 0.7 });
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: frame.current,
              start: "top top",
              end: () => `+=${window.innerHeight * 2.4}`,
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          tl.to(state.current, { progress: 5.05, duration: 5 }, 0).to(state.current, { orbit: 0.6, duration: 5 }, 0);
          items.forEach((item, i) => {
            tl.to(item, { opacity: 1, duration: 0.2 }, i * 0.95)
              .to(item.querySelector("[data-step-mark]"), { scaleX: 1, duration: 0.4 }, i * 0.95);
          });
          queueRefresh();
        });
      }
      mm.add(media.motionOk, () => {
        liftIn(q("[data-site-row]"), q("[data-sites]")[0], { stagger: 0.07 });
      });
      mm.add(media.reduce, () => {
        state.current.progress = 5;
      });
    },
    { scope: root, dependencies: [sceneOn], revertOnUpdate: true },
  );

  return (
    <section ref={root} data-tone="deep" aria-labelledby="water-title" className="relative">
      <div className="shell section-y pb-10 lg:pb-12">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="lettering inline-flex items-center gap-2 bg-amber px-2.5 py-1.5 text-ink">
              <span aria-hidden className="size-2 bg-ink" />
              {qualifier}
            </p>
            <h2 id="water-title" className="display-type mt-5 text-display">
              {title}
            </h2>
          </div>
          <p className="max-w-md self-end text-lede text-white/75 lg:col-span-4 lg:col-start-9">{text}</p>
        </div>
      </div>

      <div ref={frame} className={cn("relative", sceneOn && "lg:h-svh")}>
        <div className="shell grid h-full items-center gap-10 lg:grid-cols-12">
          <div className="relative lg:col-span-7 lg:h-full">
            {sceneOn ? (
              <TankScene
                state={state}
                className="aspect-square w-full lg:absolute lg:inset-0 lg:aspect-auto"
                fallback={
                  <div className="aspect-[4/3] w-full">
                    <Drawing kind="tank" label={false} />
                  </div>
                }
              />
            ) : (
              <div className="aspect-[4/3] w-full">
                <Drawing kind="tank" label={false} />
              </div>
            )}
          </div>
          <ol className="lg:col-span-5" aria-label="How a sump and overhead tank system is built">
            {steps.map((s, i) => (
              <li key={s.id} data-water-step className="border-t border-slate-line py-4 last:border-b">
                <div className="flex items-baseline gap-4">
                  <span className="lettering w-6 text-amber">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex-1">
                    <h3 className="font-heading text-xl font-semibold">{s.title}</h3>
                    <p className="mt-1 text-[0.95rem] text-white/70">{s.text}</p>
                    <span
                      data-step-mark
                      aria-hidden
                      className={cn("mt-3 block h-[3px] w-16 origin-left bg-amber", sceneOn ? "lg:scale-x-0" : "")}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="shell section-y pt-16 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div data-sites className="lg:col-span-7">
            <h3 className="font-heading text-h3 font-semibold">Under way now</h3>
            <p className="mt-2 text-sm text-white/60">Status from the client&apos;s project update, {updateLabel}.</p>
            <ul className="mt-6 border-t border-slate-line">
              {sites.map((site) => (
                <li key={site.slug} data-site-row className="border-b border-slate-line">
                  <Link
                    href={`/projects/${site.slug}`}
                    className="group/site grid gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6"
                    data-cursor="View project"
                  >
                    <span className="min-w-0">
                      <span className="display-type block text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)] leading-none text-white group-hover/site:text-amber">
                        {site.place}
                      </span>
                      <span className="mt-1.5 block text-sm text-white/70">{site.title}</span>
                    </span>
                    <span className="flex gap-2 text-white/85">
                      <StatusChip status={site.project.status} source={site.project.statusSource} />
                      <ScopeChip scope={site.project.scope} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <ButtonLink href={cta.href} variant="ghost" className="text-white">
                {cta.label}
              </ButtonLink>
            </div>
          </div>

          {related && (
            <div className="lg:col-span-5">
              <h3 className="font-heading text-h3 font-semibold">Related completed work</h3>
              <Link href={`/projects/${related.slug}`} className="group/rel mt-6 block" data-cursor="View project">
                <div className="grid grid-cols-2 gap-2">
                  {related.images.slice(0, 3).map((img, i) => (
                    <div key={img.src} className={cn("relative overflow-hidden bg-slate", i === 0 ? "col-span-2 aspect-[16/10]" : "aspect-[4/3]")}>
                      <Photo image={img} sizes={i === 0 ? "(min-width: 1024px) 36vw, 100vw" : "(min-width: 1024px) 18vw, 50vw"} className="transition-transform duration-700 group-hover/rel:scale-[1.03]" />
                    </div>
                  ))}
                </div>
                <p className="mt-4 font-heading text-lg font-semibold underline-offset-4 group-hover/rel:underline">{related.title}</p>
                <p className="mt-1 text-sm text-white/70">
                  {related.role}
                  {related.capacity ? ` Capacity: ${related.capacity}.` : ""}
                </p>
                <ProjectChips project={related.project} className="mt-3 text-white/85" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

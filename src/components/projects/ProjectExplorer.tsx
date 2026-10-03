"use client";

import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Photo } from "@/components/media/Photo";
import { ScopeChip, StatusChip } from "@/components/ui/Chips";
import { GridIcon, ListIcon } from "@/components/ui/Icons";
import { media } from "@/config/motion";
import { categoryLabels, formatLocation, scopeDescriptions, scopeLabels } from "@/content/projects";
import type { Project, ProjectCategory, ProjectScope } from "@/content/types";
import { cn } from "@/lib/cn";
import { Flip } from "gsap/Flip";
import { gsap, queueRefresh } from "@/lib/gsap";
import { ProjectCover, ProjectMeta } from "./ProjectCard";

type StatusFilter = "all" | "ongoing" | "completed";
type View = "gallery" | "register";

if (typeof window !== "undefined") gsap.registerPlugin(Flip);

const SPANS = ["lg:col-span-7", "lg:col-span-5 lg:mt-20", "lg:col-span-5", "lg:col-span-7 lg:mt-20", "lg:col-span-4", "lg:col-span-4 lg:mt-12", "lg:col-span-4"];
const ASPECTS = ["aspect-[3/2]", "aspect-[4/3]", "aspect-[4/3]", "aspect-[3/2]", "aspect-[4/5]", "aspect-[4/5]", "aspect-[4/5]"];

function FilterButton({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "lettering inline-flex min-h-11 items-center gap-2 border px-3.5 transition-colors",
        pressed ? "border-ink bg-ink text-white" : "border-ink/20 hover:border-ink/60",
      )}
    >
      {children}
    </button>
  );
}

export function ProjectExplorer({ projects, categories }: { projects: Project[]; categories: ProjectCategory[] }) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState<ProjectCategory | "all">("all");
  const [view, setView] = useState<View>("gallery");
  const [preview, setPreview] = useState<Project | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const previewBox = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const matches = (p: Project) =>
    (status === "all" || p.status === status) &&
    (category === "all" || p.category === category || (p.secondaryCategories ?? []).includes(category));

  const visible = projects.filter(matches);
  const counts = useMemo(
    () => ({
      ongoing: projects.filter((p) => p.status === "ongoing").length,
      completed: projects.filter((p) => p.status === "completed").length,
    }),
    [projects],
  );

  const capture = () => {
    if (view !== "gallery" || window.matchMedia(media.reduce).matches || !root.current) return;
    flipState.current = Flip.getState(root.current.querySelectorAll("[data-flip]"));
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    if (!state) return;
    const ctx = gsap.context(() => {
      Flip.from(state, {
        duration: 0.75,
        ease: "power3.inOut",
        absolute: true,
        stagger: 0.012,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.55, delay: 0.2 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.3 }),
        onComplete: () => queueRefresh(),
      });
    }, root);
    return () => ctx.kill();
  }, [status, category]);

  const setFilter = (fn: () => void) => {
    capture();
    fn();
  };

  const onRegisterMove = (e: PointerEvent) => {
    const box = previewBox.current;
    if (!box) return;
    gsap.to(box, { x: e.clientX + 24, y: e.clientY - 90, duration: 0.45, ease: "power3.out" });
  };

  const visibleSlugs = visible.map((p) => p.slug);

  return (
    <div ref={root}>
      {/* controls */}
      <div className="sticky top-0 z-20 border-b border-line bg-paper py-3 lg:py-4">
        <div className="shell grid gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
              <FilterButton pressed={status === "all"} onClick={() => setFilter(() => setStatus("all"))}>
                All <span className="opacity-75">{projects.length}</span>
              </FilterButton>
              <FilterButton pressed={status === "ongoing"} onClick={() => setFilter(() => setStatus("ongoing"))}>
                Ongoing <span className="opacity-75">{counts.ongoing}</span>
              </FilterButton>
              <FilterButton pressed={status === "completed"} onClick={() => setFilter(() => setStatus("completed"))}>
                Completed <span className="opacity-75">{counts.completed}</span>
              </FilterButton>
            </div>
            <div className="flex items-center gap-4">
              <p aria-live="polite" className="hidden text-sm text-muted sm:block">
                Showing {visible.length} of {projects.length}
              </p>
              <div role="group" aria-label="View" className="flex">
                <button
                  type="button"
                  aria-pressed={view === "gallery"}
                  onClick={() => setView("gallery")}
                  className={cn("inline-flex size-11 items-center justify-center border", view === "gallery" ? "border-ink bg-ink text-white" : "border-ink/20")}
                  aria-label="Gallery view"
                >
                  <GridIcon size={18} />
                </button>
                <button
                  type="button"
                  aria-pressed={view === "register"}
                  onClick={() => setView("register")}
                  className={cn("-ml-px inline-flex size-11 items-center justify-center border", view === "register" ? "border-ink bg-ink text-white" : "border-ink/20")}
                  aria-label="Register view"
                >
                  <ListIcon size={18} />
                </button>
              </div>
            </div>
          </div>
          <div className="no-scrollbar -mx-[clamp(1rem,4.2vw,4.5rem)] overflow-x-auto px-[clamp(1rem,4.2vw,4.5rem)]">
            <div role="group" aria-label="Filter by type" className="flex w-max gap-2">
              <FilterButton pressed={category === "all"} onClick={() => setFilter(() => setCategory("all"))}>
                All types
              </FilterButton>
              {categories.map((c) => (
                <FilterButton key={c} pressed={category === c} onClick={() => setFilter(() => setCategory(c))}>
                  {categoryLabels[c]}
                </FilterButton>
              ))}
            </div>
          </div>
          <p aria-hidden className="text-sm text-muted sm:hidden">
            Showing {visible.length} of {projects.length}
          </p>
        </div>
      </div>

      <div className="shell pt-6">
        <details className="group/legend border-b border-line pb-4 text-sm">
          <summary className="cursor-pointer list-none font-heading font-medium underline-offset-4 hover:underline">
            How to read status and scope
          </summary>
          <dl className="mt-4 grid gap-x-10 gap-y-3 md:grid-cols-2">
            <div>
              <dt className="flex items-center gap-2">
                <StatusChip status="ongoing" source="portfolio" />
              </dt>
              <dd className="mt-1 text-muted">A dashed outline means the status is as recorded in the company portfolio and awaits an update.</dd>
            </div>
            {(Object.keys(scopeLabels) as ProjectScope[]).map((s) => (
              <div key={s}>
                <dt>
                  <ScopeChip scope={s} />
                </dt>
                <dd className="mt-1 text-muted">{scopeDescriptions[s]}</dd>
              </div>
            ))}
          </dl>
        </details>
      </div>

      {visible.length === 0 && (
        <div className="shell py-24 text-center">
          <p className="font-heading text-h3 font-semibold">No projects match these filters.</p>
          <button
            type="button"
            className="mt-4 underline underline-offset-4"
            onClick={() => {
              setStatus("all");
              setCategory("all");
            }}
          >
            Show all projects
          </button>
        </div>
      )}

      {view === "gallery" ? (
        <ul className="shell grid grid-cols-1 gap-x-8 gap-y-14 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-20 lg:py-16">
          {projects.map((p) => {
            const visibleIndex = visibleSlugs.indexOf(p.slug);
            const show = visibleIndex > -1;
            const k = Math.max(visibleIndex, 0) % SPANS.length;
            return (
              <li key={p.slug} data-flip data-flip-id={p.slug} hidden={!show} className={cn("group/card min-w-0", SPANS[k])}>
                <Link href={`/projects/${p.slug}`} className="block" data-cursor="View project">
                  <div className={ASPECTS[k]}>
                    <ProjectCover
                      project={p}
                      sizes={k < 4 ? "(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
                      morph
                    />
                  </div>
                  <ProjectMeta project={p} />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="shell py-10 lg:py-14" onPointerLeave={() => setPreview(null)}>
          {/* desktop table */}
          <table className="hidden w-full border-collapse text-left lg:table">
            <caption className="sr-only">Project register</caption>
            <thead>
              <tr className="lettering border-b border-ink text-muted">
                <th scope="col" className="w-14 py-3 font-semibold">
                  No.
                </th>
                <th scope="col" className="py-3 font-semibold">
                  Project
                </th>
                <th scope="col" className="py-3 font-semibold">
                  Location
                </th>
                <th scope="col" className="py-3 font-semibold">
                  Type
                </th>
                <th scope="col" className="py-3 font-semibold">
                  Status
                </th>
                <th scope="col" className="py-3 font-semibold">
                  Scope
                </th>
              </tr>
            </thead>
            <tbody onPointerMove={onRegisterMove}>
              {visible.map((p, i) => (
                <tr
                  key={p.slug}
                  className="group/row border-b border-line transition-colors hover:bg-concrete"
                  onPointerEnter={() => setPreview(p.images.length ? p : null)}
                >
                  <td className="lettering py-4 text-muted">{String(i + 1).padStart(2, "0")}</td>
                  <td className="py-4 pr-6">
                    <Link href={`/projects/${p.slug}`} className="font-heading text-lg font-semibold underline-offset-4 group-hover/row:underline">
                      {p.title}
                    </Link>
                  </td>
                  <td className="py-4 pr-6 text-muted">{formatLocation(p) ?? "Not disclosed"}</td>
                  <td className="py-4 pr-6 text-muted">{categoryLabels[p.category]}</td>
                  <td className="py-4 pr-4">
                    <StatusChip status={p.status} source={p.statusSource} />
                  </td>
                  <td className="py-4">
                    <ScopeChip scope={p.scope} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* phones: stacked register */}
          <ol className="border-t border-ink lg:hidden">
            {visible.map((p, i) => (
              <li key={p.slug} className="border-b border-line">
                <Link href={`/projects/${p.slug}`} className="grid grid-cols-[2.25rem_1fr] gap-x-2 py-4">
                  <span className="lettering pt-1 text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-heading text-lg font-semibold leading-snug">{p.title}</span>
                    <span className="mt-1 block text-sm text-muted">
                      {formatLocation(p) ?? "Location not disclosed"}, {categoryLabels[p.category].toLowerCase()}
                    </span>
                    <span className="mt-3 flex flex-wrap gap-2">
                      <StatusChip status={p.status} source={p.statusSource} />
                      <ScopeChip scope={p.scope} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          {/* hover preview */}
          <div
            ref={previewBox}
            aria-hidden
            className={cn(
              "pointer-events-none fixed left-0 top-0 z-30 hidden aspect-[4/3] w-72 overflow-hidden bg-slate shadow-2xl transition-opacity duration-300 lg:block",
              preview ? "opacity-100" : "opacity-0",
            )}
          >
            {preview?.images[0] && <Photo key={preview.slug} image={preview.images[0]} sizes="288px" quality={60} eager />}
          </div>
        </div>
      )}
    </div>
  );
}

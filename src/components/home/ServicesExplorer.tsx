"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Drawing } from "@/components/media/Drawing";
import { Photo } from "@/components/media/Photo";
import { ButtonLink } from "@/components/ui/Button";
import { ScopeChip, StatusChip } from "@/components/ui/Chips";
import { PlusIcon } from "@/components/ui/Icons";
import { Qualifier } from "@/components/ui/Qualifier";
import { media } from "@/config/motion";
import type { ProjectRef } from "@/content/projects";
import type { Service } from "@/content/types";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";

export type ServiceWithRefs = Service & { projects: ProjectRef[] };

function Visual({ service, eager }: { service: Service; eager?: boolean }) {
  if (service.image) {
    return (
      <>
        <Photo image={service.image} sizes="(min-width: 1024px) 52vw, 100vw" eager={eager} />
        {service.image.caption && (
          <span className="absolute bottom-0 left-0 max-w-[75%] bg-slate-deep/85 px-3 py-2 font-heading text-[0.8rem] text-white">
            {service.image.caption}
          </span>
        )}
      </>
    );
  }
  return <Drawing kind={service.drawing ?? "portal-frame"} />;
}

function Details({ service }: { service: ServiceWithRefs }) {
  return (
    <div data-svc-details>
      {service.qualifier && <Qualifier label={service.qualifier.label} text={service.qualifier.text} />}
      <p className={cn("max-w-xl text-lede", service.qualifier && "mt-4")}>{service.summary}</p>
      <ul className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2" aria-label="Typical work">
        {service.includes.map((item) => (
          <li key={item} className="flex items-baseline gap-3 text-[0.95rem]">
            <span aria-hidden className="mt-[0.35em] size-1.5 shrink-0 bg-amber" />
            {item}
          </li>
        ))}
      </ul>
      {service.projects.length > 0 && (
        <div className="mt-7">
          <p className="lettering text-muted">Projects</p>
          <ul className="mt-2 divide-y divide-line border-y border-line">
            {service.projects.slice(0, 4).map((p) => (
              <li key={p.slug}>
                <Link href={`/projects/${p.slug}`} className="group/ref flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2.5">
                  <span className="font-heading font-medium underline-offset-4 group-hover/ref:underline">{p.title}</span>
                  <span className="flex gap-2">
                    <StatusChip status={p.status} source={p.statusSource} />
                    <ScopeChip scope={p.scope} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
        <ButtonLink href={`/services/${service.slug}`} variant="ghost">
          Service details<span className="sr-only">: {service.name}</span>
        </ButtonLink>
        <ButtonLink href="/contact#enquiry" variant="ghost">
          Discuss this work
        </ButtonLink>
      </div>
    </div>
  );
}

/**
 * WOW 03 — service explorer. Desktop: a vertical tab list drives a large visual panel
 * (keyboard: arrows/Home/End). Phones: an accordion with the same content.
 */
export function ServicesExplorer({ title, intro, services }: { title: string; intro: string; services: ServiceWithRefs[] }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(0);
  const prev = useRef(0);
  const hoverTimer = useRef<number | undefined>(undefined);
  const uid = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useGSAP(
    () => {
      const from = prev.current;
      const next = active;
      prev.current = next;
      if (from === next) return;
      const reduce = window.matchMedia(media.reduce).matches;
      const visuals = root.current!.querySelectorAll<HTMLElement>("[data-svc-visual]");
      gsap.killTweensOf(visuals);
      visuals.forEach((v, i) => {
        if (i !== next && i !== from) gsap.set(v, { clipPath: "inset(0% 0% 0% 100%)", zIndex: 0 });
      });
      gsap.set(visuals[from], { zIndex: 1, clipPath: "inset(0% 0% 0% 0%)" });
      if (reduce) {
        gsap.set(visuals[next], { zIndex: 2, clipPath: "inset(0% 0% 0% 0%)" });
        return;
      }
      gsap.fromTo(
        visuals[next],
        { zIndex: 2, clipPath: "inset(0% 0% 0% 100%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power4.inOut" },
      );
      const img = visuals[next].querySelector("img");
      if (img) gsap.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.4, ease: "power3.out" });
      gsap.fromTo(
        root.current!.querySelectorAll(`[data-svc-panel="${next}"] [data-svc-details] > *`),
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power3.out", delay: 0.15 },
      );
    },
    { scope: root, dependencies: [active], revertOnUpdate: false },
  );

  const select = (i: number) => setActive(i);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = services.length - 1;
    const next =
      e.key === "ArrowDown" ? (i === last ? 0 : i + 1) : e.key === "ArrowUp" ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : null;
    if (next === null) return;
    e.preventDefault();
    tabRefs.current[next]?.focus();
    select(next);
  };

  return (
    <section ref={root} aria-labelledby={`${uid}-title`} className="section-y relative">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id={`${uid}-title`} className="display-type text-display lg:col-span-7">
            {title}
          </h2>
          <p className="max-w-md self-end text-lede text-muted lg:col-span-4 lg:col-start-9">{intro}</p>
        </div>

        {/* desktop: tabs + panel */}
        <div className="mt-14 hidden gap-12 lg:grid lg:grid-cols-12">
          <div role="tablist" aria-orientation="vertical" aria-label="Services" className="col-span-5 border-t border-line">
            {services.map((s, i) => (
              <button
                key={s.slug}
                ref={(el) => void (tabRefs.current[i] = el)}
                role="tab"
                id={`${uid}-tab-${i}`}
                aria-selected={active === i}
                aria-controls={`${uid}-panel-${i}`}
                tabIndex={active === i ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                onPointerEnter={() => {
                  window.clearTimeout(hoverTimer.current);
                  hoverTimer.current = window.setTimeout(() => select(i), 140);
                }}
                onPointerLeave={() => window.clearTimeout(hoverTimer.current)}
                className="group/tab relative flex w-full items-center gap-5 border-b border-line py-5 text-left"
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute -left-4 top-0 h-full w-[3px] origin-top bg-amber transition-transform duration-500 ease-[var(--ease-out)]",
                    active === i ? "scale-y-100" : "scale-y-0",
                  )}
                />
                <span className="lettering w-7 text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span
                  className={cn(
                    "font-heading text-[clamp(1.25rem,0.9rem+0.9vw,1.9rem)] font-semibold leading-tight tracking-[-0.02em] transition-colors",
                    active === i ? "text-ink" : "text-ink/65 group-hover/tab:text-ink",
                  )}
                >
                  {s.name}
                </span>
                {s.qualifier && (
                  <span className="lettering ml-auto shrink-0 bg-amber px-2 py-1 text-[0.68rem] text-ink">Current work</span>
                )}
              </button>
            ))}
          </div>

          <div className="col-span-7">
            <div className="sticky top-28">
              <div className="relative aspect-[16/11] overflow-hidden bg-slate">
                {services.map((s, i) => (
                  <div
                    key={s.slug}
                    data-svc-visual
                    className="absolute inset-0"
                    style={{ clipPath: i === 0 ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)", zIndex: i === 0 ? 2 : 0 }}
                  >
                    <Visual service={s} />
                  </div>
                ))}
                {/* corner brackets */}
                <span aria-hidden className="pointer-events-none absolute left-3 top-3 z-10 size-6 border-l-2 border-t-2 border-white/70" />
                <span aria-hidden className="pointer-events-none absolute right-3 top-3 z-10 size-6 border-r-2 border-t-2 border-white/70" />
              </div>
              {services.map((s, i) => (
                <div
                  key={s.slug}
                  role="tabpanel"
                  id={`${uid}-panel-${i}`}
                  aria-labelledby={`${uid}-tab-${i}`}
                  data-svc-panel={i}
                  hidden={active !== i}
                  className="pt-8"
                >
                  <Details service={s} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* phones & tablets: accordion */}
        <ul className="mt-10 border-t border-line lg:hidden">
          {services.map((s, i) => {
            const open = openMobile === i;
            return (
              <li key={s.slug} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`${uid}-m-${i}`}
                    onClick={() => setOpenMobile(open ? null : i)}
                    className="flex min-h-16 w-full items-center gap-4 py-4 text-left"
                  >
                    <span className="lettering w-6 text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 font-heading text-xl font-semibold tracking-[-0.02em]">{s.name}</span>
                    <PlusIcon size={22} className={cn("shrink-0 transition-transform duration-300", open && "rotate-45")} />
                  </button>
                </h3>
                <div id={`${uid}-m-${i}`} hidden={!open} className="pb-8">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate">
                    <Visual service={s} />
                  </div>
                  <div className="mt-6">
                    <Details service={s} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

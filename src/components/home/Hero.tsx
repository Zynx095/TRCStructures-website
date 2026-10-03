"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, type PointerEvent } from "react";
import { heroAssemble, heroIntro, heroScroll } from "@/animations/hero";
import { TRCMark, Wordmark } from "@/components/brand/Logo";
import { Photo } from "@/components/media/Photo";
import { ButtonLink } from "@/components/ui/Button";
import { media } from "@/config/motion";
import { home } from "@/content/pages/home";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/cn";
import { gsap, queueRefresh, useGSAP } from "@/lib/gsap";
import { useSceneEnabled } from "@/three/support";
import type { MonolithState } from "@/three/TRCMonolith";

const MonolithScene = dynamic(() => import("@/three/TRCMonolith"), { ssr: false });

const GRID = ["A", "B", "C", "D", "E", "F"];

export function Hero() {
  const { hero } = home;
  const root = useRef<HTMLElement>(null);
  const state = useRef<MonolithState>({ intro: 0, explode: 0, px: 0, py: 0 });
  const sceneOn = useSceneEnabled();
  const hydrated = useHydrated();

  useGSAP(
    () => {
      const el = root.current!;
      const mm = gsap.matchMedia();
      mm.add(media.motionOk, () => {
        heroIntro(el);
      });
      mm.add(`${media.desktop} and ${media.motionOk}`, () => {
        heroScroll(el, state.current);
        queueRefresh();
      });
      mm.add(media.reduce, () => {
        state.current.intro = 1;
      });
    },
    { scope: root },
  );

  const onSceneReady = useCallback(() => {
    if (window.matchMedia(media.reduce).matches) state.current.intro = 1;
    else heroAssemble(state.current);
  }, []);

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!sceneOn) return;
    const r = e.currentTarget.getBoundingClientRect();
    state.current.px = ((e.clientX - r.left) / r.width) * 2 - 1;
    state.current.py = ((e.clientY - r.top) / r.height) * 2 - 1;
  };

  const svgMark = (
    <div data-hero-svgmark className="w-full">
      <TRCMark tone="reverse" className="h-auto w-full overflow-visible" />
    </div>
  );

  return (
    <section
      ref={root}
      data-tone="deep"
      aria-labelledby="hero-title"
      onPointerMove={onPointerMove}
      className="relative isolate flex min-h-[calc(100svh-3.875rem)] flex-col overflow-hidden lg:min-h-svh"
    >
      {/* photograph */}
      <div data-hero-photo className="absolute inset-0 -z-30 will-change-transform">
        <Photo image={hero.image} sizes="100vw" priority quality={75} />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgb(21_28_34/0.55)_0%,rgb(21_28_34/0.35)_30%,rgb(21_28_34/0.86)_68%,rgb(21_28_34/0.96)_100%)] lg:bg-[linear-gradient(90deg,rgb(21_28_34/0.95)_0%,rgb(21_28_34/0.84)_36%,rgb(21_28_34/0.45)_64%,rgb(21_28_34/0.38)_100%)]"
      />
      <div aria-hidden className="absolute inset-0 -z-20 hidden bg-[linear-gradient(0deg,rgb(21_28_34/0.92)_0%,transparent_32%)] lg:block" />
      <div data-hero-shade aria-hidden className="absolute inset-0 -z-20 bg-slate-deep opacity-0" />

      {/* structural grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="shell relative h-full">
          <div className="absolute inset-x-[clamp(1rem,4.2vw,4.5rem)] inset-y-0 grid grid-cols-3 lg:grid-cols-6">
            {GRID.map((g, i) => (
              <div key={g} className={cn("relative", i > 2 && "hidden lg:block")}>
                <span data-grid-line className="absolute inset-y-0 left-0 w-px origin-top bg-white/[0.13]" />
                <span
                  data-grid-bubble
                  className="lettering absolute left-0 top-28 hidden size-7 -translate-x-1/2 items-center justify-center rounded-full border border-white/30 text-[0.7rem] text-white/70 lg:flex"
                >
                  {g}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div data-datum className="absolute inset-x-0 bottom-10 h-px origin-left bg-white/25 sm:bottom-[4.5rem] lg:bottom-[5.25rem]">
          <span className="lettering absolute -top-6 left-[clamp(1rem,4.2vw,4.5rem)] text-[0.7rem] text-white/60">
            GL ±0.00
          </span>
        </div>
      </div>

      {/* identity: 3D monolith on capable desktops, SVG everywhere else */}
      <div className="pointer-events-none absolute inset-x-0 top-[5.5rem] lg:inset-y-0 lg:left-auto lg:right-0 lg:top-0 lg:w-[54%]">
        <div className="shell lg:hidden">
          <div className="w-[min(40vw,13rem)] pt-3">{svgMark}</div>
        </div>
        <div className="relative hidden h-full lg:block">
          {sceneOn ? (
            <MonolithScene
              state={state}
              onReady={onSceneReady}
              className="absolute inset-x-0 top-[24%] h-[58%] portrait:top-[11%] portrait:h-[34%]"
              fallback={<div className="absolute left-[18%] top-[40%] w-[52%] portrait:top-[16%]">{svgMark}</div>}
            />
          ) : (
            hydrated && <div className="absolute left-[18%] top-[40%] w-[52%] portrait:top-[16%]">{svgMark}</div>
          )}
          <div data-intro="wordmark" className="absolute bottom-[17%] left-[16%] flex w-[56%] items-center gap-4 portrait:bottom-auto portrait:top-[46%]">
            <span aria-hidden className="h-px flex-1 bg-white/35" />
            <Wordmark tone="reverse" className="h-3.5 w-auto shrink-0" />
            <span aria-hidden className="h-px flex-1 bg-white/35" />
          </div>
          <p
            data-hero-explain
            className="absolute bottom-[13%] left-[16%] w-[56%] text-center text-sm leading-relaxed text-white/80 opacity-0 portrait:bottom-auto portrait:top-[49%]"
          >
            The TRC mark is drawn from structure: a beam on a column, a braced frame and a channel section.
          </p>
        </div>
      </div>

      {/* copy */}
      <div data-hero-copy className="shell relative mt-auto pb-20 pt-[min(44vw,15rem)] lg:pb-36 lg:pt-40">
        <p data-intro="kicker" className="lettering text-amber">
          {hero.kicker}
        </p>
        <h1 id="hero-title" className="display-type mt-4 text-mega">
          {hero.headline.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.04em]">
              <span data-hero-line data-intro="line" className="block">
                {line}
              </span>
            </span>
          ))}
        </h1>
        <p data-intro="lede" className="mt-5 max-w-[34rem] text-white/85 lg:mt-8 lg:text-lede">
          {hero.lede}
        </p>
        <div data-intro="cta" className="mt-7 flex flex-wrap gap-3 lg:mt-10">
          <ButtonLink href={hero.primaryCta.href} magnetic>
            {hero.primaryCta.label}
          </ButtonLink>
          <ButtonLink href={hero.secondaryCta.href} variant="secondary" magnetic>
            {hero.secondaryCta.label}
          </ButtonLink>
        </div>
      </div>

      {/* title block */}
      <div data-intro="titleblock" className="absolute inset-x-0 bottom-0 hidden border-t border-white/15 bg-slate-deep/40 sm:block">
        <div className="shell grid h-[4.5rem] grid-cols-2 items-center gap-4 lg:h-[5.25rem] lg:grid-cols-[1fr_1fr_1fr_1.6fr_auto]">
          {hero.titleBlock.map((item, i) => (
            <div key={item.label} className={cn("min-w-0", i > 1 && "hidden lg:block")}>
              <p className="lettering text-[0.68rem] text-white/55">{item.label}</p>
              <p className="truncate font-heading text-sm text-white/90">{item.value}</p>
            </div>
          ))}
          <div className="hidden min-w-0 lg:block">
            <p className="lettering text-[0.68rem] text-white/55">Photograph</p>
            <p className="truncate font-heading text-sm text-white/90">{hero.image.caption}</p>
          </div>
          <div data-intro="cue" className="hidden items-center gap-3 lg:flex" aria-hidden>
            <span className="lettering text-[0.68rem] text-white/55">Scroll</span>
            <span className="relative block h-9 w-px overflow-hidden bg-white/15">
              <span data-cue-line className="absolute inset-0 origin-top bg-amber" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Drawing } from "@/components/media/Drawing";
import { media } from "@/config/motion";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";
import { useSceneEnabled } from "@/three/support";
import type { TankState } from "@/three/TankStructure";

const TankScene = dynamic(() => import("@/three/TankStructure"), { ssr: false });

/**
 * Interactive version of the sump/OHT model for the service page: plays through once
 * when it comes into view, then each step can be selected (tap or click).
 */
export function TankExplainer({ steps }: { steps: { id: string; title: string; text: string }[] }) {
  const root = useRef<HTMLDivElement>(null);
  const state = useRef<TankState>({ progress: 0, orbit: -0.4 });
  const [active, setActive] = useState(steps.length - 1);
  const sceneOn = useSceneEnabled("(min-width: 768px)");

  const [touched, setTouched] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.motionOk, () => {
        gsap.fromTo(
          state.current,
          { progress: 0, orbit: -0.5 },
          {
            progress: steps.length + 0.05,
            orbit: 0.3,
            duration: 6,
            ease: "power1.inOut",
            scrollTrigger: { trigger: root.current, start: "top 65%", once: true },
          },
        );
      });
      mm.add(media.reduce, () => {
        state.current.progress = steps.length;
      });
    },
    { scope: root, dependencies: [sceneOn], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (!touched) return;
      gsap.to(state.current, {
        progress: active + 1.02,
        orbit: -0.4 + (active / (steps.length - 1)) * 0.8,
        duration: window.matchMedia(media.reduce).matches ? 0 : 1.2,
        ease: "power2.inOut",
        overwrite: true,
      });
    },
    { scope: root, dependencies: [active, touched], revertOnUpdate: false },
  );

  const go = (i: number) => {
    setTouched(true);
    setActive(i);
  };

  return (
    <div ref={root} data-tone="deep" className="grid overflow-hidden lg:grid-cols-12">
      <div className="relative min-h-[22rem] lg:col-span-7 lg:min-h-[36rem]">
        {sceneOn ? (
          <TankScene
            state={state}
            className="absolute inset-0"
            fallback={
              <div className="absolute inset-0">
                <Drawing kind="tank" label={false} />
              </div>
            }
          />
        ) : (
          <div className="absolute inset-0">
            <Drawing kind="tank" label={false} />
          </div>
        )}
      </div>
      <div className="p-6 lg:col-span-5 lg:p-10">
        <h2 className="font-heading text-h3 font-semibold">How a sump and OHT system is built</h2>
        <ol className="mt-6">
          {steps.map((s, i) => (
            <li key={s.id} className="border-t border-slate-line last:border-b">
              <button
                type="button"
                onClick={() => go(i)}
                aria-pressed={active === i}
                className={cn("flex w-full gap-4 py-4 text-left transition-opacity", sceneOn && active !== i ? "opacity-80 hover:opacity-100" : "")}
              >
                <span className="lettering w-6 pt-1 text-amber">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-heading text-lg font-semibold">{s.title}</span>
                  <span className="mt-1 block text-[0.95rem] text-white/70">{s.text}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

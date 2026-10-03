"use client";

import { useRef } from "react";
import { scrubWords } from "@/animations/reveal";
import { TitleBlock } from "@/components/ui/TitleBlock";
import { media } from "@/config/motion";
import { home } from "@/content/pages/home";
import { gsap, useGSAP } from "@/lib/gsap";

export interface GroundFacts {
  total: number;
  current: number;
  states: string[];
  updateLabel: string;
}

/** Statement + ground line. The facts below the statement are counted from project data. */
export function GroundStatement({ facts }: { facts: GroundFacts }) {
  const root = useRef<HTMLElement>(null);
  const statement = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.motionOk, () => {
        scrubWords(statement.current!, root.current!);
        gsap.from("[data-ground-line]", {
          scaleX: 0,
          duration: 1.6,
          ease: "power4.inOut",
          scrollTrigger: { trigger: "[data-ground]", start: "top 88%", once: true },
        });
        gsap.from("[data-ground-hatch]", {
          clipPath: "inset(0 100% 0 0)",
          duration: 1.8,
          ease: "power4.inOut",
          scrollTrigger: { trigger: "[data-ground]", start: "top 88%", once: true },
        });
      });
    },
    { scope: root },
  );

  const statesLabel = facts.states.join(" and ");

  return (
    <section ref={root} aria-label="What we do" className="section-y relative overflow-hidden">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12">
          <p className="sr-only">{home.ground.statement}</p>
          <p
            ref={statement}
            aria-hidden
            className="font-heading text-[clamp(1.75rem,1.1rem+2.4vw,3.6rem)] font-medium leading-[1.08] tracking-[-0.02em] lg:col-span-10"
          >
            {home.ground.statement}
          </p>
          <p className="max-w-[38rem] text-lede text-muted lg:col-span-6 lg:col-start-6">{home.ground.note}</p>
        </div>
      </div>

      <div data-ground className="relative mt-16 lg:mt-24">
        <div className="shell">
          <TitleBlock
            columns={4}
            items={[
              { label: "Project register", value: `${facts.total} projects` },
              { label: `Under way (${facts.updateLabel})`, value: `${facts.current} sites` },
              { label: "Working across", value: statesLabel },
              { label: "Registered", value: "GST and MSME (Udyam), 2021" },
            ]}
            className="bg-paper"
          />
        </div>
        {/* ground line: GL ±0.00 with soil hatch below */}
        <div aria-hidden className="relative mt-0">
          <div data-ground-line className="h-[2px] origin-left bg-ink" />
          <div className="shell relative">
            <span className="lettering absolute -top-7 right-[clamp(1rem,4.2vw,4.5rem)] text-muted">GL ±0.00</span>
          </div>
          <svg data-ground-hatch className="block h-14 w-full text-ink/35 lg:h-20" preserveAspectRatio="none">
            <defs>
              <pattern id="soil" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="18" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#soil)" />
          </svg>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { CompactLockup } from "@/components/brand/Logo";
import { media } from "@/config/motion";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Footer identity. On desktop the footer sits under the page and is revealed as the
 * page lifts away; the TRC parts are lowered into place in step with that reveal.
 */
export function FooterMark() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(ref);
      const build = (tl: gsap.core.Timeline) =>
        tl
          .from(q('[data-part="beam"]'), { yPercent: -260, rotate: -4, transformOrigin: "50% 50%" }, 0)
          .from(q('[data-part="column"]'), { yPercent: 120 }, 0.05)
          .from(q('[data-part="brace"]'), { yPercent: 110 }, 0.1)
          .from(q('[data-part="channel"]'), { xPercent: 40, opacity: 0 }, 0.15)
          .from(q('[data-part="wordmark"]'), { opacity: 0, yPercent: 40 }, 0.25);

      mm.add(`${media.desktop} and ${media.motionOk} and (min-height: 680px)`, () => {
        const surface = document.querySelector("[data-page-surface]");
        const footer = ref.current?.closest("footer");
        if (!surface || !footer) return;
        build(
          gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: surface,
              start: "bottom bottom",
              end: () => `+=${Math.min(footer.offsetHeight, window.innerHeight) * 0.75}`,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          }),
        );
      });

      mm.add(`${media.mobile} and ${media.motionOk}`, () => {
        build(
          gsap.timeline({
            defaults: { ease: "power3.out", duration: 0.9 },
            scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
          }),
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="w-full max-w-[26rem] overflow-hidden pb-1 lg:max-w-[30rem]">
      <CompactLockup tone="reverse" title="T R Constructions" className="h-auto w-full overflow-visible" />
    </div>
  );
}

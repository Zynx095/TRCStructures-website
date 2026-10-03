/**
 * Single GSAP entry point for the core + ScrollTrigger + SplitText (used site-wide).
 * Page-specific plugins are registered where they are used, so they stay out of the
 * shared bundle: Flip → components/projects/ProjectExplorer, DrawSVG → animations/sequence.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 0.6 });
  // mobile URL-bar show/hide should not cause layout jumps in pinned scenes
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

/** true when the visitor asked for reduced motion (client only) */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** marks the intro gate as handled so CSS stops hiding [data-intro] elements */
export function markAnimationReady(): void {
  if (typeof document !== "undefined") document.documentElement.classList.add("anim-ready");
}

let refreshFrame = 0;
/**
 * Pinned sections add scroll space, so every trigger below them depends on them.
 * When a section creates (or re-creates) its triggers after others, re-sort all
 * triggers by page position and recalculate. Debounced to one frame.
 */
export function queueRefresh(): void {
  if (typeof window === "undefined") return;
  cancelAnimationFrame(refreshFrame);
  refreshFrame = requestAnimationFrame(() => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });
}

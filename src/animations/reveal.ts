import { ease } from "@/config/motion";
import { gsap, SplitText } from "@/lib/gsap";

/**
 * Words darken from muted to full ink as the reader scrolls through a statement.
 * Colour (not opacity) is animated so every state keeps readable contrast.
 * The element should be aria-hidden with an sr-only copy of the text beside it.
 */
export function scrubWords(el: HTMLElement, trigger: Element = el, from = "#7a838a", to = "#1b1f23") {
  const split = SplitText.create(el, { type: "words", aria: "none" });
  gsap.fromTo(
    split.words,
    { color: from },
    {
      color: to,
      ease: "none",
      stagger: 0.12,
      scrollTrigger: { trigger, start: "top 78%", end: "bottom 55%", scrub: 0.6 },
    },
  );
  return split;
}

/** Image/media reveal: a clip rising from the bottom, like a wall going up. */
export function riseIn(targets: gsap.TweenTarget, trigger: Element, opts: { start?: string; stagger?: number } = {}) {
  return gsap.fromTo(
    targets,
    { clipPath: "inset(100% 0% 0% 0%)" },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.2,
      ease: ease.structural,
      stagger: opts.stagger ?? 0.12,
      scrollTrigger: { trigger, start: opts.start ?? "top 82%", once: true },
    },
  );
}

/** Simple entrance for supporting blocks (used sparingly). */
export function liftIn(targets: gsap.TweenTarget, trigger: Element, opts: { start?: string; stagger?: number } = {}) {
  return gsap.fromTo(
    targets,
    { opacity: 0, y: 28 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: ease.out,
      stagger: opts.stagger ?? 0.08,
      scrollTrigger: { trigger, start: opts.start ?? "top 85%", once: true },
    },
  );
}

import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ease } from "@/config/motion";
import { gsap } from "@/lib/gsap";

if (typeof window !== "undefined") gsap.registerPlugin(DrawSVGPlugin);

/**
 * WOW 02 — "From ground to finish". Desktop: the scene pins and each stage's
 * photograph rises over the previous one while the section drawing gains a stage.
 * Expects [data-stage] rows, [data-stage-media], [data-stage-text], [data-draw-stage]
 * groups and [data-progress-step] markers inside `root`.
 */
export function buildSequence(root: HTMLElement, frame: HTMLElement) {
  const q = gsap.utils.selector(root);
  const rows = q("[data-stage]");
  const media = q("[data-stage-media]");
  const texts = q("[data-stage-text]");
  const draw = q("[data-seq-overlay] [data-draw-stage]");
  const steps = q("[data-progress-step]");
  const n = rows.length;

  root.setAttribute("data-enhanced", "");

  gsap.set(media.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
  gsap.set(texts.slice(1), { autoAlpha: 0, y: 40 });
  draw.forEach((g) => gsap.set(g.querySelectorAll("path, line"), { drawSVG: "0%" }));
  draw.forEach((g) => gsap.set(g.querySelectorAll("[data-fill], text"), { opacity: 0 }));

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: frame,
      start: "top top",
      end: () => `+=${(n - 1) * window.innerHeight * 1.05}`,
      pin: true,
      scrub: 0.7,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      snap: { snapTo: "labels", duration: { min: 0.25, max: 0.7 }, delay: 0.08, ease: "power1.inOut" },
    },
  });

  const drawStage = (i: number, at: number | string) => {
    const g = draw[i];
    if (!g) return;
    tl.to(g.querySelectorAll("path, line"), { drawSVG: "100%", duration: 0.45, stagger: 0.015 }, at).to(
      g.querySelectorAll("[data-fill], text"),
      { opacity: 1, duration: 0.25 },
      typeof at === "number" ? at + 0.25 : `${at}+=0.25`,
    );
  };

  tl.addLabel("s0", 0);
  drawStage(0, 0);
  tl.to(steps[0], { "--fill": 1, duration: 0.3 }, 0);

  for (let i = 1; i < n; i++) {
    const at = i;
    tl.to(texts[i - 1], { autoAlpha: 0, y: -40, duration: 0.3 }, at - 0.55)
      .to(media[i], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power2.inOut" }, at - 0.5)
      .to(media[i - 1], { scale: 0.96, opacity: 0.4, duration: 0.55 }, at - 0.5)
      .to(texts[i], { autoAlpha: 1, y: 0, duration: 0.35 }, at - 0.25)
      .to(steps[i], { "--fill": 1, duration: 0.3 }, at - 0.4);
    drawStage(i, at - 0.45);
    tl.addLabel(`s${i}`, at);
  }
  tl.to({}, { duration: 0.15 });
  return tl;
}

/** Draw SVG strokes (linework) when they enter. */
export function drawIn(targets: gsap.TweenTarget, trigger: Element, opts: { start?: string; stagger?: number } = {}) {
  return gsap.fromTo(
    targets,
    { drawSVG: "0%" },
    {
      drawSVG: "100%",
      duration: 1.4,
      ease: ease.structural,
      stagger: opts.stagger ?? 0.05,
      scrollTrigger: { trigger, start: opts.start ?? "top 80%", once: true },
    },
  );
}

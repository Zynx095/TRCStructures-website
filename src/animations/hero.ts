import { duration, ease } from "@/config/motion";
import { gsap } from "@/lib/gsap";
import type { MonolithState } from "@/three/TRCMonolith";

/**
 * WOW 01 — hero entrance. Order: photo settles → structural grid draws →
 * TRC mark assembles → headline → supporting text → CTAs → scroll cue.
 * Fast by design: the headline is readable within ~0.9s.
 */
export function heroIntro(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ defaults: { ease: ease.out } });

  tl.from(q("[data-hero-photo]"), { scale: 1.1, duration: 2.4, ease: "power2.out" }, 0)
    .from(q("[data-grid-line]"), { scaleY: 0, duration: 1.3, stagger: 0.06, ease: ease.structural }, 0.05)
    .from(q("[data-datum]"), { scaleX: 0, duration: 1.4, ease: ease.structural }, 0.15)
    .from(q("[data-grid-bubble]"), { opacity: 0, scale: 0.5, duration: 0.45, stagger: 0.06 }, 0.45)
    // SVG mark (phones, tablets and devices without WebGL)
    .from(q("[data-hero-svgmark] [data-part='column']"), { yPercent: 130, duration: 0.8 }, 0.2)
    .from(q("[data-hero-svgmark] [data-part='brace']"), { xPercent: 50, opacity: 0, duration: 0.8 }, 0.3)
    .from(q("[data-hero-svgmark] [data-part='channel']"), { xPercent: 70, opacity: 0, duration: 0.8 }, 0.4)
    .from(q("[data-hero-svgmark] [data-part='beam']"), { yPercent: -320, duration: 0.95, ease: "back.out(1.3)" }, 0.6)
    .fromTo(
      q("[data-hero-line]"),
      { yPercent: 108, opacity: 1 },
      { yPercent: 0, duration: 1.15, stagger: 0.09, ease: ease.expo },
      0.35,
    )
    .fromTo(q("[data-intro='kicker']"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: duration.base }, 0.3)
    .fromTo(q("[data-intro='wordmark']"), { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: duration.slow }, 0.9)
    .fromTo(q("[data-intro='lede']"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: duration.slow }, 0.75)
    .fromTo(q("[data-intro='cta']"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: duration.slow }, 0.9)
    .fromTo(q("[data-intro='titleblock']"), { opacity: 0 }, { opacity: 1, duration: duration.slow }, 1.0)
    .fromTo(q("[data-intro='cue']"), { opacity: 0 }, { opacity: 1, duration: duration.base }, 1.3)
    .fromTo(q("[data-cue-line]"), { scaleY: 0 }, { scaleY: 1, duration: 1.2, ease: ease.structural, repeat: -1, repeatDelay: 0.6 }, 1.4);

  return tl;
}

/** 3D assembly, started once the WebGL scene reports it is ready. */
export function heroAssemble(state: MonolithState) {
  return gsap.to(state, { intro: 1, duration: 2, ease: "power2.inOut" });
}

/**
 * Desktop only: the hero pins and the monolith opens into an exploded axonometric
 * that labels each structural part, while the photo deepens and the copy lifts away.
 */
export function heroScroll(root: HTMLElement, state: MonolithState) {
  const q = gsap.utils.selector(root);
  return gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "+=90%",
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })
    .to(q("[data-hero-copy]"), { yPercent: -14, opacity: 0, duration: 0.5, ease: "power1.in" }, 0)
    .to(q("[data-hero-photo]"), { scale: 1.1, duration: 1 }, 0)
    .to(q("[data-hero-shade]"), { opacity: 0.5, duration: 1 }, 0)
    .to(q("[data-intro='wordmark']"), { opacity: 0, duration: 0.25 }, 0)
    .to(state, { explode: 1, duration: 0.75, ease: "power1.inOut" }, 0.1)
    .fromTo(q("[data-hero-explain]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.3 }, 0.55)
    .to(q("[data-intro='titleblock']"), { opacity: 0, duration: 0.3 }, 0.6);
}

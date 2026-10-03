/**
 * Motion tokens for GSAP. CSS transitions use the matching tokens in globals.css
 * (--ease-*, --duration-*). Keep both in sync.
 */
export const duration = {
  instant: 0.15,
  fast: 0.3,
  base: 0.6,
  slow: 0.9,
  slower: 1.4,
} as const;

export const ease = {
  /** default for entrances */
  out: "power3.out",
  /** large, decisive moves (panels, pinned scenes) */
  expo: "expo.out",
  /** symmetric moves (wipes, structural assembly) */
  structural: "power4.inOut",
  /** scroll-scrubbed timelines must stay linear */
  none: "none",
} as const;

export const stagger = {
  tight: 0.04,
  base: 0.08,
  loose: 0.14,
} as const;

/** shared gsap.matchMedia conditions */
export const media = {
  desktop: "(min-width: 1024px)",
  mobile: "(max-width: 1023.98px)",
  reduce: "(prefers-reduced-motion: reduce)",
  motionOk: "(prefers-reduced-motion: no-preference)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;

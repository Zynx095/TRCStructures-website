"use client";

import { useSyncExternalStore } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/** Can this device create a WebGL context without obvious performance red flags? */
function detect(): boolean {
  try {
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    if (nav.connection?.saveData) return false;
    if ((nav.hardwareConcurrency ?? 4) < 4) return false;
    if ((nav.deviceMemory ?? 8) < 4) return false;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return false;
    (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

let cached: boolean | undefined;
const getSnapshot = () => (cached ??= detect());
const noopSubscribe = () => () => {};

export function useWebGLCapable(): boolean {
  return useSyncExternalStore(noopSubscribe, getSnapshot, () => false);
}

/**
 * Whether a decorative 3D scene should mount: capable device, wide enough screen,
 * and the visitor has not asked for reduced motion.
 */
export function useSceneEnabled(minWidth = "(min-width: 1024px)"): boolean {
  const capable = useWebGLCapable();
  const wide = useMediaQuery(minWidth);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  return capable && wide && !reduce;
}

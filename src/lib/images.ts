import manifest from "@/content/generated/image-manifest.json";
import type { FocalPoint } from "@/content/types";

export interface ImageMeta {
  w: number;
  h: number;
  blur: string;
}

const data = manifest as Record<string, ImageMeta>;

/** intrinsic size + blur placeholder for a /public image (undefined if not yet in the manifest) */
export function imageMeta(src: string): ImageMeta | undefined {
  return data[src];
}

export function aspectOf(src: string, fallback = 4 / 3): number {
  const m = data[src];
  return m ? m.w / m.h : fallback;
}

export function isPortrait(src: string): boolean {
  return aspectOf(src) < 0.95;
}

export function objectPosition(f?: FocalPoint): string {
  return f ? `${f.x}% ${f.y}%` : "50% 50%";
}

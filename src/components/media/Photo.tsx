import Image from "next/image";
import type { CSSProperties } from "react";
import type { MediaImage } from "@/content/types";
import { cn } from "@/lib/cn";
import { imageMeta, objectPosition } from "@/lib/images";

export interface PhotoProps {
  image: MediaImage;
  /** responsive sizes hint — always pass a realistic value */
  sizes: string;
  /** the LCP image: loads eagerly with high fetch priority */
  priority?: boolean;
  /** load immediately (above the fold) */
  eager?: boolean;
  quality?: 60 | 75 | 85;
  fit?: "cover" | "contain";
  className?: string;
}

/**
 * Fills its positioned parent. Crop focus comes from the content (focal / focalMobile),
 * blur placeholder + dimensions from the generated image manifest.
 */
export function Photo({ image, sizes, priority, eager, quality = 75, fit = "cover", className }: PhotoProps) {
  const meta = imageMeta(image.src);
  const style = {
    "--pos": objectPosition(image.focal),
    "--pos-m": objectPosition(image.focalMobile ?? image.focal),
  } as CSSProperties;

  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      quality={quality}
      loading={priority || eager ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      placeholder={meta ? "blur" : "empty"}
      blurDataURL={meta?.blur}
      draggable={false}
      className={cn(
        fit === "cover" ? "object-cover" : "object-contain",
        "object-[var(--pos-m)] lg:object-[var(--pos)]",
        className,
      )}
      style={style}
    />
  );
}

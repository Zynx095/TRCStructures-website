"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { riseIn } from "@/animations/reveal";
import { Photo } from "@/components/media/Photo";
import { ArrowIcon, CloseIcon } from "@/components/ui/Icons";
import { media } from "@/config/motion";
import type { MediaImage } from "@/content/types";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";
import { aspectOf, imageMeta } from "@/lib/images";

/**
 * The project's photographs as a sequence of plates. Portrait photos pair up,
 * landscapes run wide. Every plate opens a full-screen viewer (native <dialog>).
 */
export function ImageStory({ images, title }: { images: MediaImage[]; title: string }) {
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [index, setIndex] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.motionOk, () => {
        gsap.utils.toArray<HTMLElement>("[data-plate]").forEach((plate) => riseIn(plate, plate, { start: "top 88%" }));
      });
    },
    { scope: root },
  );

  const open = (i: number, el: HTMLButtonElement) => {
    opener.current = el;
    setIndex(i);
    dialog.current?.showModal();
  };
  const close = () => {
    dialog.current?.close();
  };
  const step = (d: number) => setIndex((i) => (i + d + images.length) % images.length);

  // group into rows: consecutive portraits pair up
  const rows: number[][] = [];
  for (let i = 0; i < images.length; i++) {
    const portrait = aspectOf(images[i].src) < 0.95;
    const prev = rows[rows.length - 1];
    if (portrait && prev && prev.length === 1 && aspectOf(images[prev[0]].src) < 0.95) prev.push(i);
    else rows.push([i]);
  }

  const current = images[index];
  const meta = current ? imageMeta(current.src) : undefined;

  return (
    <div ref={root}>
      <ol className="space-y-6 lg:space-y-10">
        {rows.map((row, r) => (
          <li key={r} className={cn("grid gap-6 lg:gap-10", row.length === 2 ? "sm:grid-cols-2" : "")}>
            {row.map((i) => {
              const img = images[i];
              const portrait = aspectOf(img.src) < 0.95;
              const single = row.length === 1;
              return (
                <figure key={img.src} className={cn(single && portrait && "mx-auto w-full max-w-xl", single && !portrait && "lg:w-[86%]", r % 2 === 1 && single && !portrait && "lg:ml-auto")}>
                  <button
                    type="button"
                    data-plate
                    onClick={(e) => open(i, e.currentTarget)}
                    className="group/plate relative block w-full overflow-hidden bg-slate"
                    style={{ aspectRatio: String(aspectOf(img.src)) }}
                    aria-label={`Open photograph ${i + 1} of ${images.length}: ${img.alt}`}
                    data-cursor="Enlarge"
                  >
                    <Photo
                      image={img}
                      sizes={single && !portrait ? "(min-width: 1024px) 76vw, 100vw" : "(min-width: 640px) 45vw, 100vw"}
                      className="transition-transform duration-700 ease-[var(--ease-out)] group-hover/plate:scale-[1.02]"
                    />
                  </button>
                  <figcaption className="mt-3 flex gap-4 text-sm text-muted">
                    <span className="lettering pt-0.5 text-ink">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      {img.alt}
                      {img.attribution === "inferred" && <em className="not-italic text-muted"> Attributed by portfolio page order.</em>}
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </li>
        ))}
      </ol>

      <dialog
        ref={dialog}
        aria-label={`${title} — photographs`}
        onClose={() => opener.current?.focus()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-slate-deep/97 p-0 text-white [--focus-ring:var(--color-amber)] backdrop:bg-black/70"
      >
        {current && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 lg:px-8">
              <p className="lettering text-white/70">
                {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </p>
              <button type="button" onClick={close} className="inline-flex size-12 items-center justify-center" aria-label="Close photographs" autoFocus>
                <CloseIcon size={26} />
              </button>
            </div>
            <div className="relative flex-1">
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                quality={85}
                className="object-contain"
                placeholder={meta ? "blur" : "empty"}
                blurDataURL={meta?.blur}
              />
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-8">
              <button type="button" onClick={() => step(-1)} className="inline-flex size-12 items-center justify-center border border-white/25" aria-label="Previous photograph">
                <ArrowIcon direction="left" size={20} />
              </button>
              <p className="max-w-2xl text-center text-sm text-white/80">{current.alt}</p>
              <button type="button" onClick={() => step(1)} className="inline-flex size-12 items-center justify-center border border-white/25" aria-label="Next photograph">
                <ArrowIcon size={20} />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}

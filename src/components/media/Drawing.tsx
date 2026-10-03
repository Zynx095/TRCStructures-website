import type { ReactNode } from "react";
import type { DrawingKind } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * Illustrative line drawings used where no site photographs are published yet.
 * Always labelled as illustrations so they are never mistaken for project evidence.
 */
export function Drawing({
  kind,
  className,
  label = true,
}: {
  kind: DrawingKind;
  className?: string;
  label?: boolean;
}) {
  return (
    <div className={cn("relative flex h-full w-full items-center justify-center bg-slate text-white/80", className)}>
      {/* drawing-sheet grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:2rem_2rem]"
      />
      <svg
        viewBox="0 0 400 300"
        className="relative h-[78%] w-[78%]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        role="img"
        aria-label={ALT[kind]}
      >
        {SHAPES[kind]}
      </svg>
      {label && (
        <span className="lettering absolute bottom-3 left-3 right-3 text-[0.66rem] text-white/55">
          Illustrative drawing. No site photographs published yet.
        </span>
      )}
    </div>
  );
}

const ALT: Record<DrawingKind, string> = {
  tank: "Illustrative drawing of an underground sump connected by a rising main to an overhead tank on staging.",
  residential: "Illustrative elevation of a two-storey residential building.",
  villa: "Illustrative elevation of a duplex villa.",
  "portal-frame": "Illustrative drawing of a pre-engineered steel portal frame.",
};

const ground = (
  <>
    <line x1="10" y1="230" x2="390" y2="230" strokeWidth="2" />
    <path d="M10 240L30 230M40 240L60 230M70 240L90 230M100 240L120 230M130 240L150 230M160 240L180 230M190 240L210 230M220 240L240 230M250 240L270 230M280 240L300 230M310 240L330 230M340 240L360 230M370 240L390 230" strokeWidth="0.8" opacity="0.5" />
  </>
);

const SHAPES: Record<DrawingKind, ReactNode> = {
  tank: (
    <>
      {ground}
      {/* sump below ground */}
      <path d="M40 232V282H150V232" />
      <path d="M48 232V274H142V232" strokeWidth="0.8" opacity="0.6" />
      <path d="M48 258H142" strokeDasharray="4 3" opacity="0.7" />
      {/* staging */}
      <path d="M232 230L242 92M338 230L328 92" />
      <path d="M236 184H334M239 138H331" />
      <path d="M236 184L331 138M334 184L239 138M234 230L334 184M336 230L236 184" strokeWidth="0.9" opacity="0.7" />
      {/* tank */}
      <path d="M218 92H352V40H218Z" />
      <path d="M218 54H352" strokeWidth="0.8" opacity="0.6" />
      {/* rising main */}
      <path d="M120 250V214H206V100H226" strokeWidth="2.2" />
      <circle cx="120" cy="256" r="6" />
      <text x="62" y="296" fill="currentColor" stroke="none" fontSize="11" opacity="0.7">SUMP</text>
      <text x="262" y="30" fill="currentColor" stroke="none" fontSize="11" opacity="0.7">OHT</text>
    </>
  ),
  residential: (
    <>
      {ground}
      <path d="M70 230V70H330V230" />
      <path d="M62 70H338V58H62Z" />
      <path d="M70 150H330" />
      <path d="M100 96H160V130H100ZM190 96H250V130H190ZM270 96H310V130H270Z" strokeWidth="1.1" />
      <path d="M100 176H160V210H100ZM270 176H310V210H270Z" strokeWidth="1.1" />
      <path d="M200 230V176H236V230" />
    </>
  ),
  villa: (
    <>
      {ground}
      <path d="M90 230V110H250V230" />
      <path d="M250 230V150H320V230" />
      <path d="M82 110H258V98H82Z" />
      <path d="M244 150H326V140H244Z" />
      <path d="M90 170H250" />
      <path d="M112 128H170V156H112ZM190 128H232V156H190Z" strokeWidth="1.1" />
      <path d="M266 170H304V200H266Z" strokeWidth="1.1" />
      <path d="M150 230V188H182V230" />
    </>
  ),
  "portal-frame": (
    <>
      {ground}
      <path d="M70 230V120L200 70L330 120V230" strokeWidth="2.2" />
      <path d="M82 230V126L200 82L318 126V230" strokeWidth="0.9" opacity="0.6" />
      <path d="M70 120L82 126M330 120L318 126" />
      <path d="M135 95V230M265 95V230" strokeDasharray="4 4" opacity="0.5" />
      <path d="M60 230H90M310 230H340" strokeWidth="2.5" />
    </>
  ),
};

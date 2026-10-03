import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Building cross-section that is drawn stage by stage (01 ground → 04 finish).
 * Groups are tagged data-draw-stage="0..3" for the build-sequence timeline.
 * Pure line drawing — no claims, just the vocabulary of construction.
 */
export function SectionDrawing({ className }: { className?: string }) {
  const stroke = "currentColor";
  const uid = useId().replace(/:/g, "");
  const soil = `soil-${uid}`;
  const block = `block-${uid}`;
  const cols = [70, 200, 330];
  return (
    <svg
      viewBox="0 0 400 270"
      className={cn("h-auto w-full overflow-visible", className)}
      fill="none"
      stroke={stroke}
      strokeWidth="1.5"
      role="img"
      aria-label="Building section drawn in four stages: footings below ground, the concrete frame, block walls, then finishes."
    >
      <defs>
        <pattern id={soil} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="9" stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
        </pattern>
        <pattern id={block} width="16" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 0H16M0 8H16M8 0V8" stroke="currentColor" strokeWidth="0.6" opacity="0.55" />
        </pattern>
      </defs>

      {/* 01 — ground: grade line, soil, footings, column starters */}
      <g data-draw-stage="0">
        <line x1="0" y1="200" x2="400" y2="200" strokeWidth="2" />
        <rect data-fill x="0" y="201" width="400" height="44" fill={`url(#${soil})`} stroke="none" />
        {cols.map((x) => (
          <g key={x}>
            <path d={`M${x - 28} 236H${x + 28}V222H${x - 28}Z`} />
            <path d={`M${x - 16} 222V210H${x + 16}V222`} />
            <path d={`M${x - 5} 210V200M${x + 5} 210V200`} />
          </g>
        ))}
        <text x="2" y="194" fill="currentColor" stroke="none" fontSize="9" className="lettering" opacity="0.7">
          GL ±0.00
        </text>
      </g>

      {/* 02 — structure: columns, first-floor slab, roof slab */}
      <g data-draw-stage="1">
        {cols.map((x) => (
          <path key={x} d={`M${x - 5} 200V58M${x + 5} 200V58`} />
        ))}
        <path d="M40 130H360V138H40Z" />
        <path d="M40 58H360V66H40Z" />
        <path d="M58 138V146H82M188 138V146H212M318 138V146H342" opacity="0.6" />
      </g>

      {/* 03 — walls: block infill with openings */}
      <g data-draw-stage="2">
        <rect data-fill x="75" y="66" width="120" height="64" fill={`url(#${block})`} stroke="none" />
        <rect data-fill x="205" y="66" width="120" height="64" fill={`url(#${block})`} stroke="none" />
        <rect data-fill x="75" y="138" width="120" height="62" fill={`url(#${block})`} stroke="none" />
        <rect data-fill x="205" y="138" width="120" height="62" fill={`url(#${block})`} stroke="none" />
        <path d="M110 84H160V112H110Z" />
        <path d="M240 84H290V112H240Z" />
        <path d="M120 158H150V200" />
        <path d="M245 152H285V180H245Z" />
      </g>

      {/* 04 — finish: floor finishes, parapet, partition, door swing */}
      <g data-draw-stage="3">
        <path d="M75 127H325M75 197H325" strokeWidth="2.5" opacity="0.9" />
        <path d="M36 58V46H364V58" />
        <path d="M150 158V200" />
        <path d="M150 158A42 42 0 0 1 120 170" strokeDasharray="3 3" opacity="0.7" />
        <path d="M262 66V130" strokeDasharray="5 3" />
      </g>
    </svg>
  );
}

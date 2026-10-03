import type { SVGProps } from "react";
import { MARK_HEIGHT, MARK_PARTS, MARK_WIDTH, T_SOLID, partPath, toPath } from "@/lib/brand/geometry";

/**
 * TRC Monolith identity, rendered from the shared geometry.
 * The mark is geometry; the wordmark is live text set in Barlow Condensed SemiBold and
 * fitted with textLength, so it is light, crisp and matches the outlined brand files.
 * tone:
 *  - "color"   slate letters, amber beam (on light backgrounds)
 *  - "reverse" white letters, amber beam (on slate / photos)
 *  - "mono"    one colour = currentColor (stamps, documents, single-colour print)
 */
export type LogoTone = "color" | "reverse" | "mono";

const INK = "#1F2A33";
const AMBER = "#E8A317";
const WHITE = "#FFFFFF";

interface BaseProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  tone?: LogoTone;
  /** accessible name; omit for decorative use (aria-hidden) */
  title?: string;
}

function a11y(title?: string) {
  return title ? ({ role: "img", "aria-label": title } as const) : ({ "aria-hidden": true, focusable: false } as const);
}

function letterFill(tone: LogoTone) {
  return tone === "color" ? INK : tone === "reverse" ? WHITE : "currentColor";
}

/** The parts of the mark, each tagged with data-part for animation. */
export function MarkParts({ tone = "color" }: { tone?: LogoTone }) {
  if (tone === "mono") {
    return (
      <g fill="currentColor">
        <path data-part="t" d={toPath(T_SOLID)} />
        {MARK_PARTS.filter((p) => p.letter !== "T").map((p) => (
          <path key={p.id} data-part={p.id} d={partPath(p)} fillRule="evenodd" />
        ))}
      </g>
    );
  }
  return (
    <g>
      {MARK_PARTS.map((p) => (
        <path
          key={p.id}
          data-part={p.id}
          d={partPath(p)}
          fillRule="evenodd"
          fill={p.tone === "accent" ? AMBER : letterFill(tone)}
        />
      ))}
    </g>
  );
}

export function TRCMark({ tone = "color", title, ...rest }: BaseProps) {
  return (
    <svg viewBox={`0 0 ${MARK_WIDTH} ${MARK_HEIGHT}`} {...a11y(title)} {...rest}>
      <MarkParts tone={tone} />
    </svg>
  );
}

/** Text set in the display face; textLength keeps the lockup proportions exact. */
function FittedText({
  text,
  x,
  baseline,
  capHeight,
  width,
  fill,
  part,
}: {
  text: string;
  x: number;
  baseline: number;
  capHeight: number;
  width: number;
  fill: string;
  part?: string;
}) {
  // Barlow Condensed: cap height = 0.7 em
  return (
    <text
      data-part={part}
      x={x}
      y={baseline}
      fill={fill}
      fontSize={capHeight / 0.7}
      textLength={width}
      lengthAdjust="spacing"
      style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
    >
      {text}
    </text>
  );
}

// widths measured from the outlined wordmarks (cap height 100 → width)
const FULL_RATIO = 11.903; // "T R CONSTRUCTIONS", tracking +0.08em
const CONS_RATIO = 8.693; // "CONSTRUCTIONS", tracking +0.03em

export function Wordmark({ tone = "color", title, ...rest }: BaseProps) {
  const cap = 14;
  const w = cap * FULL_RATIO;
  return (
    <svg viewBox={`0 0 ${w} ${cap + 1}`} {...a11y(title)} {...rest}>
      <FittedText text="T R CONSTRUCTIONS" x={0} baseline={cap} capHeight={cap} width={w} fill={letterFill(tone)} />
    </svg>
  );
}

/** Horizontal lockup: mark | rule | T R CONSTRUCTIONS */
export function Lockup({ tone = "color", title, ...rest }: BaseProps) {
  const cap = 14;
  const gap = 12;
  const ruleX = MARK_WIDTH + gap;
  const wordX = ruleX + 1.25 + gap;
  const wordW = cap * FULL_RATIO;
  const baseline = (MARK_HEIGHT + cap) / 2;
  return (
    <svg viewBox={`0 0 ${wordX + wordW} ${MARK_HEIGHT}`} {...a11y(title)} {...rest}>
      <MarkParts tone={tone} />
      <rect x={ruleX} y={4} width={1.25} height={MARK_HEIGHT - 8} fill={letterFill(tone)} opacity={0.35} />
      <FittedText text="T R CONSTRUCTIONS" x={wordX} baseline={baseline} capHeight={cap} width={wordW} fill={letterFill(tone)} part="wordmark" />
    </svg>
  );
}

/** Stacked compact lockup: TRC over CONSTRUCTIONS, justified to the mark width (signage, social, footer). */
export function CompactLockup({ tone = "color", title, ...rest }: BaseProps) {
  const cap = MARK_WIDTH / CONS_RATIO;
  const gap = 7;
  const total = MARK_HEIGHT + gap + cap;
  return (
    <svg viewBox={`0 0 ${MARK_WIDTH} ${total.toFixed(2)}`} {...a11y(title)} {...rest}>
      <MarkParts tone={tone} />
      <FittedText
        text="CONSTRUCTIONS"
        x={0}
        baseline={total}
        capHeight={cap}
        width={MARK_WIDTH}
        fill={letterFill(tone)}
        part="wordmark"
      />
    </svg>
  );
}

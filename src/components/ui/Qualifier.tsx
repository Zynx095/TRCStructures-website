import { cn } from "@/lib/cn";

/** Honest framing for a claim: a short label chip plus one plain sentence. */
export function Qualifier({ label, text, className }: { label: string; text: string; className?: string }) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}>
      <span className="lettering inline-flex items-center gap-2 bg-amber px-2.5 py-1.5 text-ink">
        <span aria-hidden className="size-2 bg-ink" />
        {label}
      </span>
      <span className="text-[0.95rem]">{text}</span>
    </p>
  );
}

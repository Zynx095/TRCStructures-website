import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface TitleBlockItem {
  label: string;
  value: ReactNode;
}

/**
 * Drawing-sheet title block: labelled cells separated by hairlines.
 * Used wherever we present facts (project data, company data, contact data).
 */
export function TitleBlock({
  items,
  columns = 2,
  className,
  dense,
}: {
  items: TitleBlockItem[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  dense?: boolean;
}) {
  const cols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  }[columns];
  return (
    <dl className={cn("hairline grid border-l border-t", cols, className)}>
      {items.map((item) => (
        <div key={item.label} className={cn("hairline min-w-0 border-b border-r", dense ? "px-3 py-2.5" : "px-4 py-3.5")}>
          <dt className="lettering text-muted-auto">{item.label}</dt>
          <dd className={cn("mt-1 font-heading font-medium leading-snug", dense ? "text-[0.95rem]" : "text-base")}>
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

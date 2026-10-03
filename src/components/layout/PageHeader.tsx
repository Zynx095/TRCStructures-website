import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { cn } from "@/lib/cn";

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className={cn("lettering", className)}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((c, i) => {
            const last = i === items.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-current">
                    {c.name}
                  </span>
                ) : (
                  <>
                    <Link href={c.path} className="text-current/60 underline-offset-4 hover:text-current hover:underline">
                      {c.name}
                    </Link>
                    <span aria-hidden className="text-current/40">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(items)} />
    </>
  );
}

/** Dark title band for inner pages (sits under the fixed header). */
export function PageHeader({
  title,
  intro,
  crumbs,
  aside,
  children,
}: {
  title: string;
  intro?: ReactNode;
  crumbs: Crumb[];
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header data-tone="deep" className="relative overflow-hidden pb-14 pt-32 lg:pb-20 lg:pt-44">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="shell grid h-full grid-cols-4 lg:grid-cols-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={cn("border-l border-white/[0.06]", i > 3 && "hidden lg:block")} />
          ))}
        </div>
      </div>
      <div className="shell relative">
        <Breadcrumbs items={crumbs} className="text-white" />
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
          <h1 className="display-type text-display lg:col-span-8">{title}</h1>
          {aside && <div className="lg:col-span-4">{aside}</div>}
        </div>
        {intro && <div className="mt-6 max-w-2xl text-lede text-white/75">{intro}</div>}
        {children}
      </div>
    </header>
  );
}

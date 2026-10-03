import Link from "next/link";
import type { Testimonial } from "@/content/types";

/** Renders only approved testimonials (none exist yet — see content/testimonials/data.ts). */
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;
  return (
    <div className="shell mt-20">
      <h3 className="font-heading text-h3 font-semibold">From our clients</h3>
      <ul className="mt-6 grid gap-6 lg:grid-cols-2">
        {items.map((t) => (
          <li key={`${t.name}-${t.quote.slice(0, 12)}`} className="border-l-[3px] border-amber bg-concrete p-6">
            <blockquote>
              <p className="text-lede">“{t.quote}”</p>
            </blockquote>
            <p className="mt-4 font-heading font-semibold">
              {t.name}
              {t.role || t.organisation ? (
                <span className="block text-sm font-normal text-muted">{[t.role, t.organisation].filter(Boolean).join(", ")}</span>
              ) : null}
            </p>
            {t.projectSlug && (
              <Link href={`/projects/${t.projectSlug}`} className="mt-2 inline-block text-sm underline underline-offset-4">
                See the project
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

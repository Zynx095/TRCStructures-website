import Image from "next/image";
import type { Affiliation } from "@/content/types";

/**
 * Renders ONLY affiliations the client has approved (approved && visible).
 * Wording is deliberately neutral: organisations we have worked for or with,
 * never "trusted by" or any endorsement.
 */
export function Affiliations({ items }: { items: Affiliation[] }) {
  if (items.length === 0) return null;
  return (
    <div className="shell mt-20">
      <h3 className="font-heading text-h3 font-semibold">Organisations we have worked for or with</h3>
      <ul className="mt-6 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
        {items.map((a) => (
          <li key={a.name} className="flex min-h-28 flex-col items-center justify-center gap-2 bg-paper p-5 text-center">
            {a.logo ? (
              <Image src={a.logo} alt={a.name} width={160} height={64} className="h-12 w-auto object-contain" />
            ) : (
              <span className="font-heading font-semibold">{a.name}</span>
            )}
            {a.relationship && <span className="text-xs text-muted">{a.relationship}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

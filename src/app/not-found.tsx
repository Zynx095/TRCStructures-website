import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { mainNav } from "@/config/navigation";

export default function NotFound() {
  return (
    <section data-tone="deep" className="relative flex min-h-[80svh] items-end overflow-hidden pb-20 pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="shell grid h-full grid-cols-4 lg:grid-cols-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`border-l border-white/[0.06] ${i > 3 ? "hidden lg:block" : ""}`} />
          ))}
        </div>
      </div>
      <div className="shell relative">
        <p className="lettering text-amber">Error 404</p>
        <h1 className="display-type mt-4 text-display">This sheet is not in the set.</h1>
        <p className="mt-6 max-w-lg text-lede text-white/75">
          The page you asked for does not exist or has moved. These pages do:
        </p>
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-heading text-lg font-semibold">
          {mainNav.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="underline-offset-4 hover:underline">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <ButtonLink href="/projects">View projects</ButtonLink>
        </div>
      </div>
    </section>
  );
}

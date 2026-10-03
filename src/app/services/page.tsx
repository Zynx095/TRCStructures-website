import type { Metadata } from "next";
import Link from "next/link";
import { ContactBand } from "@/components/home/ContactBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { Drawing } from "@/components/media/Drawing";
import { Photo } from "@/components/media/Photo";
import { ButtonLink } from "@/components/ui/Button";
import { ScopeChip, StatusChip } from "@/components/ui/Chips";
import { Qualifier } from "@/components/ui/Qualifier";
import { getProjectsForService } from "@/content/projects";
import { getServices } from "@/content/services";
import { cn } from "@/lib/cn";

const description =
  "Residential construction, commercial and institutional civil works, sump and OHT construction, interiors and fit-outs, renovation, PEB structures and layout works — T R Constructions, Bengaluru.";

export const metadata: Metadata = {
  title: "Services",
  description,
  alternates: { canonical: "/services" },
  openGraph: { title: "Services | T R Constructions", description, url: "/services" },
};

export default function ServicesPage() {
  const services = getServices();
  return (
    <>
      <PageHeader
        title="Services"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
        intro={<p>The work we take on. Where we have done it, the projects are linked — with their status and our scope.</p>}
      >
        <nav aria-label="Services on this page" className="mt-10">
          <ul className="flex flex-wrap gap-2">
            {services.map((s) => (
              <li key={s.slug}>
                <a href={`#${s.slug}`} className="lettering inline-flex min-h-11 items-center border border-white/25 px-3.5 hover:border-white">
                  {s.shortName}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <div>
        {services.map((s, i) => {
          const projects = getProjectsForService(s.slug);
          return (
            <section
              key={s.slug}
              id={s.slug}
              aria-labelledby={`${s.slug}-title`}
              className={cn("section-y scroll-mt-20", i % 2 === 1 && "bg-concrete")}
            >
              <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-12">
                <div className={cn("lg:col-span-6", i % 2 === 1 ? "lg:order-2 lg:col-start-7" : "")}>
                  <p className="lettering text-muted">{String(i + 1).padStart(2, "0")}</p>
                  <h2 id={`${s.slug}-title`} className="mt-3 font-heading text-h2 font-semibold">
                    {s.name}
                  </h2>
                  {s.qualifier && <Qualifier label={s.qualifier.label} text={s.qualifier.text} className="mt-4" />}
                  <p className="mt-5 max-w-xl text-lede">{s.summary}</p>
                  <ul className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                    {s.includes.map((item) => (
                      <li key={item} className="flex items-baseline gap-3 text-[0.95rem]">
                        <span aria-hidden className="mt-[0.35em] size-1.5 shrink-0 bg-amber" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {projects.length > 0 && (
                    <div className="mt-8">
                      <h3 className="lettering text-muted">Projects</h3>
                      <ul className="mt-2 divide-y divide-line border-y border-line">
                        {projects.slice(0, 5).map((p) => (
                          <li key={p.slug}>
                            <Link href={`/projects/${p.slug}`} className="group/ref flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2.5">
                              <span className="font-heading font-medium underline-offset-4 group-hover/ref:underline">{p.title}</span>
                              <span className="flex gap-2">
                                <StatusChip status={p.status} source={p.statusSource} />
                                <ScopeChip scope={p.scope} />
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-8">
                    <ButtonLink href={`/services/${s.slug}`}>
                      {s.shortName} in detail
                    </ButtonLink>
                  </div>
                </div>
                <div className={cn("lg:col-span-6", i % 2 === 1 ? "lg:order-1 lg:col-start-1" : "")}>
                  <figure>
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate">
                      {s.image ? (
                        <Photo image={s.image} sizes="(min-width: 1024px) 48vw, 100vw" eager={i === 0} />
                      ) : (
                        <Drawing kind={s.drawing ?? "portal-frame"} />
                      )}
                    </div>
                    {s.image?.caption && <figcaption className="mt-3 text-sm text-muted">{s.image.caption}</figcaption>}
                  </figure>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <ContactBand
        title="Need a contractor on site?"
        text="Tell us where the site is and what needs building. We will get back to you to arrange a site visit."
        primary={{ label: "Request a site visit", href: "/contact#enquiry" }}
      />
    </>
  );
}

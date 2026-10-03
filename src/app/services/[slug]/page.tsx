import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactBand } from "@/components/home/ContactBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { Drawing } from "@/components/media/Drawing";
import { Photo } from "@/components/media/Photo";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { TankExplainer } from "@/components/services/TankExplainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { ScopeChip, StatusChip } from "@/components/ui/Chips";
import { Qualifier } from "@/components/ui/Qualifier";
import { home } from "@/content/pages/home";
import { CLIENT_UPDATE_LABEL, formatLocation, getCurrentWorks, getProjectsForService } from "@/content/projects";
import { getService, getServices } from "@/content/services";
import { serviceSchema } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return getServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.seo.title,
    description: service.seo.description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: `${service.seo.title} | T R Constructions`, description: service.seo.description, url: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const projects = getProjectsForService(service.slug);
  const listed = service.feature === "tank-structure" ? projects.filter((p) => p.images.length > 0) : projects;
  const current = service.feature === "tank-structure" ? getCurrentWorks().filter((p) => p.services.includes(service.slug)) : [];

  return (
    <>
      <PageHeader
        title={service.name}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ]}
        intro={<p>{service.summary}</p>}
        aside={service.qualifier ? <Qualifier label={service.qualifier.label} text={service.qualifier.text} className="text-white/85" /> : undefined}
      />

      <section aria-label="About this service" className="section-y">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <figure className="lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden bg-slate">
              {service.image ? (
                <Photo image={service.image} sizes="(min-width: 1024px) 56vw, 100vw" eager />
              ) : (
                <Drawing kind={service.drawing ?? "portal-frame"} />
              )}
            </div>
            {service.image?.caption && <figcaption className="mt-3 text-sm text-muted">{service.image.caption}</figcaption>}
          </figure>
          <div className="lg:col-span-5">
            <div className="prose-trc text-lede text-muted">
              {service.description.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <h2 className="lettering mt-10 text-muted">Typical work</h2>
            <ul className="mt-3 border-t border-line">
              {service.includes.map((item) => (
                <li key={item} className="flex items-baseline gap-3 border-b border-line py-3 font-heading font-medium">
                  <span aria-hidden className="size-1.5 shrink-0 bg-amber" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {service.feature === "tank-structure" && (
        <section aria-label="Sump and overhead tank model" className="pb-20 lg:pb-28">
          <div className="shell">
            <TankExplainer steps={home.water.steps} />
          </div>
          {current.length > 0 && (
            <div className="shell mt-16">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="font-heading text-h2 font-semibold">Under way now</h2>
                <p className="text-sm text-muted">Client project update, {CLIENT_UPDATE_LABEL}</p>
              </div>
              <ul className="mt-8 border-t border-ink">
                {current.map((p) => (
                  <li key={p.slug} className="border-b border-line">
                    <Link href={`/projects/${p.slug}`} className="group/site grid gap-2 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                      <span>
                        <span className="display-type block text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)] leading-none group-hover/site:text-amber-deep">
                          {formatLocation(p)}
                        </span>
                        <span className="mt-1.5 block text-sm text-muted">{p.title}</span>
                      </span>
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
        </section>
      )}

      {listed.length > 0 && (
        <section aria-labelledby="svc-projects" className="section-y bg-concrete">
          <div className="shell">
            <h2 id="svc-projects" className="font-heading text-h2 font-semibold">
              {service.feature === "tank-structure" ? "Related completed work" : "Projects"}
            </h2>
            <ul className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {listed.map((p) => (
                <li key={p.slug}>
                  <ProjectCard project={p} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <ContactBand
        title="Discuss this work"
        text="Tell us where the site is and what needs building. We will get back to you to arrange a site visit."
        primary={{ label: "Request a site visit", href: "/contact#enquiry" }}
      />
      <JsonLd data={serviceSchema(service)} />
    </>
  );
}

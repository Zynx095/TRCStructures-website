import type { Metadata } from "next";
import Link from "next/link";
import { ContactBand } from "@/components/home/ContactBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScopeChip } from "@/components/ui/Chips";
import { TitleBlock } from "@/components/ui/TitleBlock";
import { addressLines } from "@/config/contact";
import { site } from "@/config/site";
import { about } from "@/content/pages/about";
import { getProjects, scopeDescriptions } from "@/content/projects";
import { getServices } from "@/content/services";
import type { ProjectScope } from "@/content/types";

export const metadata: Metadata = {
  title: "About",
  description: about.description,
  alternates: { canonical: "/about" },
  openGraph: { title: "About | T R Constructions", description: about.description, url: "/about" },
};

export default function AboutPage() {
  const projects = getProjects();
  const scopes = (["full-contract", "execution", "labour-only", "partnership"] as ProjectScope[])
    .map((scope) => ({ scope, count: projects.filter((p) => p.scope === scope).length }))
    .filter((s) => s.count > 0);

  const byState = new Map<string, Set<string>>();
  for (const p of projects) {
    const state = p.location?.state;
    const place = p.location?.area ?? p.location?.city;
    if (!state || !place) continue;
    if (!byState.has(state)) byState.set(state, new Set());
    byState.get(state)!.add(place);
  }
  const undisclosed = projects.filter((p) => !p.location).length;

  return (
    <>
      <PageHeader
        title="About"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
        intro={<p>{about.heading}</p>}
      />

      <section aria-label="The company" className="section-y">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="prose-trc text-lede lg:col-span-6">
            {about.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <TitleBlock
              columns={1}
              items={[
                { label: about.proprietor.role, value: about.proprietor.name },
                { label: "Constitution", value: site.constitution },
                { label: "Office", value: addressLines().join(", ") },
                { label: "Registered", value: "GST and MSME (Udyam), April 2021" },
              ]}
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="engagement-title" className="section-y bg-concrete">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="engagement-title" className="font-heading text-h2 font-semibold">
              {about.engagement.title}
            </h2>
            <p className="mt-5 max-w-md text-lede text-muted">{about.engagement.text}</p>
          </div>
          <ul className={`grid gap-px border border-line bg-line lg:col-span-7 ${scopes.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {scopes.map(({ scope, count }) => (
              <li key={scope} className="flex flex-col gap-3 bg-concrete p-6">
                <ScopeChip scope={scope} className="self-start" />
                <p className="text-[0.95rem]">{scopeDescriptions[scope]}</p>
                <p className="mt-auto text-sm text-muted">
                  {count} {count === 1 ? "project" : "projects"} in the register
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="reach-title" className="section-y">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="reach-title" className="font-heading text-h2 font-semibold">
              {about.reach.title}
            </h2>
            <p className="mt-5 max-w-md text-lede text-muted">{about.reach.text}</p>
            {undisclosed > 0 && (
              <p className="mt-4 text-sm text-muted">
                {undisclosed} portfolio projects do not state a location and are not counted here.
              </p>
            )}
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7">
            {[...byState.entries()].map(([state, places]) => (
              <div key={state}>
                <h3 className="lettering border-b border-ink pb-2 text-muted">{state}</h3>
                <ul className="mt-2">
                  {[...places].map((place) => (
                    <li key={place} className="display-type border-b border-line py-2 text-[clamp(1.6rem,1.2rem+1.2vw,2.3rem)] leading-tight">
                      {place}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="reg-title" className="section-y bg-slate text-white" data-tone="dark">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="reg-title" className="font-heading text-h2 font-semibold">
              {about.registrations.title}
            </h2>
            <p className="mt-5 text-white/70">{about.registrations.text}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            {site.registrations.map((r) => (
              <div key={r.id} className="border border-slate-line p-6">
                <p className="font-heading text-xl font-semibold">{r.label}</p>
                <p className="mt-2 text-white/70">{r.detail}</p>
              </div>
            ))}
            <div className="border border-slate-line p-6 sm:col-span-2">
              <p className="lettering text-white/60">Registered activities include</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {site.registeredActivities.map((a) => (
                  <li key={a} className="lettering border border-white/20 px-3 py-2">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="work-title" className="section-y">
        <div className="shell">
          <h2 id="work-title" className="font-heading text-h2 font-semibold">
            What we take on
          </h2>
          <ul className="mt-8 grid border-t border-ink sm:grid-cols-2 lg:grid-cols-3">
            {getServices().map((s) => (
              <li key={s.slug} className="border-b border-line">
                <Link href={`/services/${s.slug}`} className="group/svc flex items-baseline justify-between gap-4 py-5 pr-6">
                  <span className="font-heading text-xl font-semibold underline-offset-4 group-hover/svc:underline">{s.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactBand
        title="Talk to us about your site"
        text="Tell us where it is and what needs building. We will get back to you to arrange a site visit."
        primary={{ label: "Request a site visit", href: "/contact#enquiry" }}
      />
    </>
  );
}

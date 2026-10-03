import { ButtonLink } from "@/components/ui/Button";
import { TitleBlock } from "@/components/ui/TitleBlock";
import { contact } from "@/config/contact";
import { site } from "@/config/site";
import { getPublishedAffiliations } from "@/content/affiliations";
import { home } from "@/content/pages/home";
import { getPublishedTestimonials } from "@/content/testimonials/data";
import { Affiliations } from "@/components/company/Affiliations";
import { Testimonials } from "@/components/company/Testimonials";

export function CompanySection({ states }: { states: string[] }) {
  const { company } = home;
  const affiliations = getPublishedAffiliations();
  const testimonials = getPublishedTestimonials();
  return (
    <section aria-labelledby="company-title" className="section-y">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="company-title" className="font-heading text-h2 font-semibold">
            {company.title}
          </h2>
          <div className="mt-6 space-y-4 text-lede text-muted">
            {company.text.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink href={company.cta.href} variant="ghost">
              {company.cta.label}
            </ButtonLink>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <TitleBlock
            items={[
              { label: "Proprietor", value: site.proprietor },
              { label: "Constitution", value: site.constitution },
              { label: "Office", value: `Devasandra, New BEL Road, ${contact.address.locality}` },
              { label: "Registered", value: "April 2021" },
              { label: "Engaged as", value: "Contractor, labour contractor, partner" },
              { label: "Working across", value: states.join(", ") },
            ]}
          />
          <ul className="mt-6 flex flex-wrap gap-3" aria-label="Registrations">
            {site.registrations.map((r) => (
              <li key={r.id} className="flex items-center gap-3 border border-ink/20 px-4 py-3">
                <span aria-hidden className="grid size-8 place-items-center bg-slate text-amber">
                  <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8.5 6.5 12 13 4.5" />
                  </svg>
                </span>
                <span>
                  <span className="block font-heading font-semibold leading-tight">{r.label}</span>
                  <span className="block text-sm text-muted">{r.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Affiliations items={affiliations} />
      <Testimonials items={testimonials} />
    </section>
  );
}

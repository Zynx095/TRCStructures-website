import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { privacy } from "@/content/pages/privacy";

export const metadata: Metadata = {
  title: privacy.title,
  description: privacy.description,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const updated = new Date(privacy.updated).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  return (
    <>
      <PageHeader
        title={privacy.title}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Privacy", path: "/privacy" },
        ]}
        intro={<p>{privacy.description}</p>}
      />
      <section className="section-y">
        <div className="shell max-w-3xl">
          <p className="text-sm text-muted">Last updated {updated}</p>
          {privacy.sections.map((s) => (
            <div key={s.heading} className="mt-10">
              <h2 className="font-heading text-h3 font-semibold">{s.heading}</h2>
              <div className="prose-trc mt-4 text-muted">
                {s.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

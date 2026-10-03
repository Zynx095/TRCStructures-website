import type { Metadata } from "next";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { MapFacade } from "@/components/contact/MapFacade";
import { PageHeader } from "@/components/layout/PageHeader";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { contact, mailtoHref, telHref, whatsappHref } from "@/config/contact";
import { contactPage } from "@/content/pages/contact";

export const metadata: Metadata = {
  title: contactPage.title,
  description: contactPage.description,
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact | T R Constructions", description: contactPage.description, url: "/contact" },
};

export default function ContactPage() {
  const wa = whatsappHref();
  const methods = [
    ...contact.phones.map((p) => ({
      key: p.e164,
      label: p.label === "Primary" ? "Call" : "Call (alternate)",
      value: p.display,
      href: telHref(p),
      icon: <PhoneIcon size={22} />,
      external: false,
    })),
    ...(wa ? [{ key: "wa", label: "WhatsApp", value: "Message us", href: wa, icon: <WhatsAppIcon size={22} />, external: true }] : []),
    { key: "mail", label: "Email", value: contact.email.public, href: mailtoHref(), icon: <MailIcon size={22} />, external: false },
  ];

  return (
    <>
      <PageHeader
        title={contactPage.heading}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
        intro={<p>{contactPage.intro}</p>}
      />

      <section aria-label="Ways to reach us" className="border-b border-line">
        <ul className="shell grid sm:grid-cols-2 lg:grid-cols-4">
          {methods.map((m) => (
            <li key={m.key} className="border-b border-line sm:border-r lg:border-b-0 lg:first:border-l">
              <a
                href={m.href}
                {...(m.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group/m flex h-full items-center gap-4 px-1 py-6 sm:px-6"
              >
                <span className="grid size-12 shrink-0 place-items-center bg-slate text-amber transition-colors group-hover/m:bg-amber group-hover/m:text-ink">
                  {m.icon}
                </span>
                <span className="min-w-0">
                  <span className="lettering block text-muted">{m.label}</span>
                  <span className="block break-words font-heading text-lg font-semibold">{m.value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section id="enquiry" aria-labelledby="enquiry-title" className="section-y scroll-mt-16">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="enquiry-title" className="font-heading text-h2 font-semibold">
              {contactPage.form.title}
            </h2>
            <div className="mt-8">
              <EnquiryForm />
            </div>
          </div>
          <div className="lg:col-span-5">
            <h2 className="font-heading text-h3 font-semibold">{contactPage.map.title}</h2>
            <div className="mt-6 lg:h-[calc(100%-3.5rem)]">
              <MapFacade />
            </div>
            {contact.hours && <p className="mt-4 text-sm text-muted">Hours: {contact.hours}</p>}
          </div>
        </div>
      </section>
    </>
  );
}

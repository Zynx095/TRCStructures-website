import Link from "next/link";
import { ArrowIcon } from "@/components/ui/Icons";
import { addressLines, contact, mailtoHref, mapsDirectionsHref, telHref, whatsappHref } from "@/config/contact";
import { footerNav, legalNav } from "@/config/navigation";
import { site } from "@/config/site";
import { FooterMark } from "./FooterMark";

export function Footer() {
  const wa = whatsappHref();
  const year = new Date().getFullYear();
  return (
    <footer data-site-footer data-tone="deep" className="relative overflow-hidden">
      {/* structural grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="shell grid h-full grid-cols-4 lg:grid-cols-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`border-l border-white/[0.05] ${i > 3 ? "hidden lg:block" : ""}`} />
          ))}
        </div>
      </div>

      <div className="shell relative pb-10 pt-16 lg:pb-12 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <FooterMark />
            <p className="mt-8 max-w-md text-[0.95rem] leading-relaxed text-muted-dark">{site.description}</p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3 lg:gap-8">
            <div>
              <h2 className="lettering text-muted-dark">Contact</h2>
              <ul className="mt-4 space-y-3 font-heading text-base">
                {contact.phones.map((p) => (
                  <li key={p.e164}>
                    <a href={telHref(p)} className="underline-offset-4 hover:underline">
                      {p.display}
                    </a>
                  </li>
                ))}
                {wa && (
                  <li>
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                      WhatsApp
                    </a>
                  </li>
                )}
                <li>
                  <a href={mailtoHref()} className="break-all underline-offset-4 hover:underline">
                    {contact.email.public}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lettering text-muted-dark">Office</h2>
              <address className="mt-4 font-heading text-base not-italic leading-relaxed">
                {addressLines().map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
              <a
                href={mapsDirectionsHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 font-heading text-sm text-amber underline-offset-4 hover:underline"
              >
                Directions <ArrowIcon size={14} />
                <span className="sr-only"> (opens Google Maps)</span>
              </a>
            </div>

            <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:col-span-2 lg:col-span-1 lg:grid-cols-1">
              {footerNav.map((group) => (
                <div key={group.title}>
                  <h2 className="lettering text-muted-dark">{group.title}</h2>
                  <ul className="mt-4 space-y-3 font-heading text-base">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className="underline-offset-4 hover:underline">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-slate-line pt-6 text-sm text-muted-dark lg:mt-24 lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {year} {site.name}. Proprietor: {site.proprietor}.
          </p>
          <p>{site.registrations.map((r) => r.label).join(" and ")}.</p>
          <ul className="flex gap-6">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="underline-offset-4 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

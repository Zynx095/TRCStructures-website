import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { primaryPhone, telHref, whatsappHref } from "@/config/contact";

/** Closing call to action — the one large amber surface on the site. */
export function ContactBand({
  title,
  text,
  primary,
}: {
  title: string;
  text: string;
  primary: { label: string; href: string };
}) {
  const wa = whatsappHref();
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden bg-amber text-ink">
      {/* the beam: a slate slab across the top edge */}
      <div aria-hidden className="h-3 bg-slate-deep" />
      <div className="shell grid gap-10 py-20 lg:grid-cols-12 lg:py-28">
        <h2 id="cta-title" className="display-type text-display lg:col-span-7">
          {title}
        </h2>
        <div className="self-end lg:col-span-5 lg:col-start-8">
          <p className="max-w-md text-lede">{text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={primary.href} variant="dark" magnetic>
              {primary.label}
            </ButtonLink>
            <ButtonAnchor href={telHref()} variant="secondary">
              <PhoneIcon size={18} />
              {primaryPhone.display}
            </ButtonAnchor>
            {wa && (
              <ButtonAnchor href={wa} target="_blank" rel="noopener noreferrer" variant="secondary">
                <WhatsAppIcon size={18} />
                WhatsApp
              </ButtonAnchor>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { telHref, whatsappHref } from "@/config/contact";
import { primaryCta } from "@/config/navigation";

/** Sticky contact bar for phones and tablets: Call · WhatsApp · Quote. */
export function MobileActionBar() {
  const wa = whatsappHref();
  const item =
    "flex h-[3.875rem] flex-1 flex-col items-center justify-center gap-1 font-heading text-[0.8rem] font-semibold tracking-wide";
  return (
    <nav
      data-action-bar
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-40 bg-slate-deep pb-[env(safe-area-inset-bottom)] text-white [--focus-ring:var(--color-amber)] lg:hidden"
    >
      <div className="flex divide-x divide-white/10">
        <a href={telHref()} className={item}>
          <PhoneIcon size={20} />
          Call
        </a>
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className={item}>
            <WhatsAppIcon size={20} />
            WhatsApp
          </a>
        )}
        <Link href={primaryCta.href} className={`${item} bg-amber text-ink`}>
          <span aria-hidden className="block h-[3px] w-5 bg-ink" />
          Quote
        </Link>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { TRCMark } from "@/components/brand/Logo";
import { CloseIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { contact, telHref, whatsappHref } from "@/config/contact";
import { mainNav, primaryCta } from "@/config/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { duration, ease } from "@/config/motion";

interface Props {
  open: boolean;
  pathname: string;
  onClose: () => void;
}

/**
 * Full-screen mobile menu. GSAP opens it like a panel being lowered into place;
 * links rise line by line. Focus is trapped while open, Escape closes it.
 */
export function MobileMenu({ open, pathname, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const wa = whatsappHref();

  useGSAP(
    () => {
      const el = root.current!;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      tl.current = gsap
        .timeline({
          paused: true,
          defaults: { ease: ease.expo },
          // fully hide again once the closing animation has run
          onReverseComplete: () => gsap.set(el, { visibility: "hidden" }),
        })
        .set(el, { visibility: "visible" })
        .fromTo(
          el,
          { clipPath: reduce ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)", opacity: reduce ? 0 : 1 },
          { clipPath: "inset(0 0 0% 0)", opacity: 1, duration: reduce ? duration.fast : duration.slow, ease: ease.structural },
        )
        .from(
          "[data-menu-line]",
          { yPercent: reduce ? 0 : 110, opacity: reduce ? 0 : 1, duration: duration.slow, stagger: 0.06 },
          reduce ? 0 : "-=0.35",
        )
        .from("[data-menu-foot]", { opacity: 0, y: reduce ? 0 : 16, duration: duration.base }, "-=0.5");
    },
    { scope: root },
  );

  useEffect(() => {
    const el = root.current;
    const html = document.documentElement;
    if (!el || !tl.current) return;
    if (open) {
      html.classList.add("menu-open");
      gsap.set(el, { visibility: "visible" });
      tl.current.timeScale(1).play();
      const first = el.querySelector<HTMLElement>("[data-autofocus]");
      requestAnimationFrame(() => first?.focus({ preventScroll: true }));
    } else {
      html.classList.remove("menu-open");
      tl.current.timeScale(1.6).reverse();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = root.current!;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={root}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
      data-tone="deep"
      className="invisible fixed inset-0 z-[60] flex flex-col overflow-y-auto lg:hidden"
    >
      <div className="shell flex h-16 shrink-0 items-center justify-between">
        <TRCMark tone="reverse" className="h-6 w-auto" />
        <button
          type="button"
          onClick={onClose}
          className="-mr-2 inline-flex size-12 items-center justify-center"
          aria-label="Close menu"
        >
          <CloseIcon size={26} />
        </button>
      </div>

      {/* structural grid backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div className="shell grid h-full grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-l border-white last:border-r" />
          ))}
        </div>
      </div>

      <nav aria-label="Mobile" className="shell relative mt-6 flex-1">
        <ul>
          {mainNav.map((item, i) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href} className="overflow-hidden border-b border-slate-line">
                <Link
                  href={item.href}
                  data-menu-line
                  data-autofocus={i === 0 ? "" : undefined}
                  aria-current={active ? "page" : undefined}
                  onClick={onClose}
                  className="display-type flex items-baseline justify-between py-3 text-[clamp(2.6rem,11vw,4.5rem)] leading-[0.95] aria-[current=page]:text-amber"
                >
                  {item.label}
                  <span className="lettering text-muted-dark">{String(i + 1).padStart(2, "0")}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div data-menu-foot className="shell relative grid gap-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-8">
        <Link
          href={primaryCta.href}
          onClick={onClose}
          className="inline-flex min-h-14 items-center justify-center bg-amber px-6 font-heading font-semibold text-ink"
        >
          {primaryCta.label}
        </Link>
        <div className="grid grid-cols-2 gap-3">
          <a
            href={telHref()}
            className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/30 font-heading font-medium"
          >
            <PhoneIcon size={18} /> Call
          </a>
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/30 font-heading font-medium"
            >
              <WhatsAppIcon size={18} /> WhatsApp
            </a>
          ) : (
            <a
              href={`mailto:${contact.email.public}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/30 font-heading font-medium"
            >
              Email
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

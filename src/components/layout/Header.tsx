"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Lockup } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { MenuIcon } from "@/components/ui/Icons";
import { mainNav, primaryCta } from "@/config/navigation";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import { MobileMenu } from "./MobileMenu";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Fixed header. Transparent over the home hero, solid slate everywhere else.
 * Hides while scrolling down, returns on scroll up (never hidden for keyboard focus).
 */
export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    lastY.current = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        const delta = y - lastY.current;
        if (Math.abs(delta) > 6) {
          setHidden(delta > 0 && y > 480);
          lastY.current = y;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const transparent = isHome && !scrolled && !menuOpen;

  return (
    <>
      <header
        data-site-header
        className={cn(
          "fixed inset-x-0 top-0 z-50 text-white transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-out)] [--focus-ring:var(--color-amber)]",
          transparent ? "border-b border-white/0 bg-transparent" : "border-b border-white/10 bg-slate-deep",
          hidden && !menuOpen ? "-translate-y-full focus-within:translate-y-0" : "translate-y-0",
        )}
      >
        <div className="shell flex h-16 items-center justify-between gap-6 lg:h-20">
          <Link href="/" className="-m-2 p-2" aria-label={`${site.name} — home`}>
            <Lockup tone="reverse" className="h-7 w-auto lg:h-8" />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="group relative inline-flex h-12 items-center px-3.5 font-heading text-[0.95rem] font-medium text-white/80 transition-colors hover:text-white aria-[current=page]:text-white"
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-x-3.5 bottom-2 h-[3px] origin-left bg-amber transition-transform duration-500 ease-[var(--ease-out)]",
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <ButtonLink href={primaryCta.href} magnetic>
                {primaryCta.label}
              </ButtonLink>
            </div>
            <button
              ref={menuButton}
              type="button"
              className="-mr-2 inline-flex size-12 items-center justify-center lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon size={26} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu
        open={menuOpen}
        pathname={pathname}
        onClose={() => {
          setMenuOpen(false);
          menuButton.current?.focus();
        }}
      />
    </>
  );
}

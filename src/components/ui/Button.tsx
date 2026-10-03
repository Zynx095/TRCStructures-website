import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse" | "dark";

const base =
  "group/btn relative isolate inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden font-heading text-[0.95rem] font-semibold leading-none tracking-[-0.005em] transition-colors duration-300 ease-[var(--ease-out)] select-none";

const variants: Record<ButtonVariant, string> = {
  // amber CTA; hover lays a dark "beam" across from the left
  primary: "bg-amber px-6 text-ink hover:text-white focus-visible:text-white",
  // outlined, adapts to the surrounding tone via currentColor
  secondary: "border border-current px-6 text-current hover:text-ink",
  ghost: "text-current",
  // white CTA for dark photo backgrounds
  inverse: "bg-white px-6 text-ink hover:text-white",
  // slate CTA for amber backgrounds
  dark: "bg-slate-deep px-6 text-white hover:text-ink focus-visible:text-ink",
};

const fills: Record<ButtonVariant, string> = {
  primary: "bg-slate-deep",
  secondary: "bg-amber",
  ghost: "",
  inverse: "bg-slate-deep",
  dark: "bg-white",
};

function Inner({ variant, children }: { variant: ButtonVariant; children: ReactNode }) {
  if (variant === "ghost") {
    return (
      <>
        <span className="relative">
          {children}
          <span
            aria-hidden
            className="absolute -bottom-1.5 left-0 h-[3px] w-full origin-left scale-x-[0.35] bg-amber transition-transform duration-500 ease-[var(--ease-out)] group-hover/btn:scale-x-100 group-focus-visible/btn:scale-x-100"
          />
        </span>
      </>
    );
  }
  return (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease-out)] group-hover/btn:scale-x-100 group-focus-visible/btn:scale-x-100",
          fills[variant],
        )}
      />
      {children}
    </>
  );
}

type LinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
  /** enables the desktop magnetic cursor effect */
  magnetic?: boolean;
};

export function ButtonLink({ variant = "primary", className, children, magnetic, ...rest }: LinkProps) {
  return (
    <Link {...rest} data-magnetic={magnetic ? "" : undefined} className={cn(base, variants[variant], className)}>
      <Inner variant={variant}>{children}</Inner>
    </Link>
  );
}

type AnchorProps = ComponentProps<"a"> & { variant?: ButtonVariant; magnetic?: boolean };

/** for tel:, mailto:, wa.me and other non-route links */
export function ButtonAnchor({ variant = "primary", className, children, magnetic, ...rest }: AnchorProps) {
  return (
    <a {...rest} data-magnetic={magnetic ? "" : undefined} className={cn(base, variants[variant], className)}>
      <Inner variant={variant}>{children}</Inner>
    </a>
  );
}

type NativeButtonProps = ComponentProps<"button"> & { variant?: ButtonVariant };

export function Button({ variant = "primary", className, children, type = "button", ...rest }: NativeButtonProps) {
  return (
    <button type={type} {...rest} className={cn(base, variants[variant], "disabled:cursor-not-allowed disabled:opacity-60", className)}>
      <Inner variant={variant}>{children}</Inner>
    </button>
  );
}

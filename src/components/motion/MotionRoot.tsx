"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ScrollTrigger, markAnimationReady } from "@/lib/gsap";

/**
 * Global motion housekeeping:
 * - releases the CSS intro gate once page-level timelines have set their start states
 * - recalculates ScrollTrigger positions after route changes and font loading
 */
export function MotionRoot({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    markAnimationReady();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return <>{children}</>;
}

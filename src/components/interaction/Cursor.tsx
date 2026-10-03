"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { media } from "@/config/motion";
import { gsap } from "@/lib/gsap";

/**
 * Desktop-only cursor companion. The system cursor stays visible; this adds
 * - a small amber marker that trails the pointer,
 * - a label over elements with data-cursor="…" (e.g. "View project", "Drag"),
 * - a gentle magnetic pull on elements with data-magnetic.
 * Disabled for touch, coarse pointers and reduced motion.
 */
export function Cursor() {
  const enabled = useMediaQuery(`${media.finePointer} and ${media.motionOk}`);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!enabled || !dot.current || !label.current) return;
    const el = dot.current;
    const text = label.current;
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    let magnetic: HTMLElement | null = null;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!visible) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.2 });
        visible = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
      if (magnetic) {
        const r = magnetic.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        gsap.to(magnetic, { x: dx * 0.18, y: dy * 0.28, duration: 0.4, ease: "power3.out" });
      }
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      const value = labelled?.dataset.cursor;
      if (value) {
        text.textContent = value;
        el.dataset.state = "label";
      } else {
        el.dataset.state = target?.closest("a, button, [role='button'], input, select, textarea, label")
          ? "link"
          : "idle";
      }
      const m = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (m !== magnetic) {
        if (magnetic) gsap.to(magnetic, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
        magnetic = m;
      }
    };

    const onLeave = () => {
      gsap.to(el, { autoAlpha: 0, duration: 0.2 });
      visible = false;
      if (magnetic) gsap.to(magnetic, { x: 0, y: 0, duration: 0.4 });
      magnetic = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (magnetic) gsap.set(magnetic, { x: 0, y: 0 });
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dot}
      aria-hidden
      data-state="idle"
      className="group/cursor pointer-events-none invisible fixed left-0 top-0 z-[90] opacity-0"
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <span className="block size-2 bg-amber transition-[transform,opacity] duration-300 group-data-[state=label]/cursor:scale-0 group-data-[state=link]/cursor:scale-[2.2] group-data-[state=link]/cursor:opacity-60" />
        <span
          ref={label}
          className="lettering absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-50 whitespace-nowrap bg-amber px-3 py-2 text-ink opacity-0 transition-[transform,opacity] duration-300 ease-[var(--ease-out)] group-data-[state=label]/cursor:scale-100 group-data-[state=label]/cursor:opacity-100"
        />
      </div>
    </div>
  );
}

"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";

class SceneErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("3D scene disabled, showing fallback:", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

interface SceneCanvasProps extends Omit<CanvasProps, "children" | "frameloop"> {
  children: ReactNode;
  /** rendered if WebGL fails or the context is lost */
  fallback: ReactNode;
  className?: string;
  /** extra margin around the viewport in which the scene keeps rendering */
  rootMargin?: string;
  /** DOM layer drawn over the canvas (labels etc.), positioned by the scene */
  overlay?: ReactNode;
}

/**
 * Shared wrapper for every R3F scene:
 * - renders only while on screen (frameloop "never" when off screen),
 * - caps device pixel ratio,
 * - falls back to the SVG/static version on errors or context loss.
 */
export function SceneCanvas({ children, fallback, className, rootMargin = "160px", overlay, ...canvasProps }: SceneCanvasProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [lost, setLost] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={wrap} className={className}>
      {lost ? (
        fallback
      ) : (
        <SceneErrorBoundary fallback={fallback}>
          <Canvas
            frameloop={inView ? "always" : "never"}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener("webglcontextlost", (e) => {
                e.preventDefault();
                setLost(true);
              });
            }}
            aria-hidden
            {...canvasProps}
          >
            {children}
          </Canvas>
          {overlay && <div className="pointer-events-none absolute inset-0 overflow-hidden">{overlay}</div>}
        </SceneErrorBoundary>
      )}
    </div>
  );
}

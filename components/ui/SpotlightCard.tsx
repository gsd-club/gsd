"use client";

import { useRef, useCallback, useState } from "react";

/* ------------------------------------------------------------------ */
/*  SpotlightGrid                                                      */
/* ------------------------------------------------------------------ */

interface SpotlightGridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Container that tracks the mouse and exposes CSS custom properties
 * (`--mouse-x`, `--mouse-y`, `--spotlight-opacity`) so every child
 * SpotlightCard can render a unified radial-gradient spotlight that
 * bleeds across card boundaries.
 */
export function SpotlightGrid({
  children,
  className = "",
}: SpotlightGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [vars, setVars] = useState<React.CSSProperties | undefined>(undefined);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!gridRef.current) return;

      // Throttle to one update per animation frame
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        if (!gridRef.current) return;
        const rect = gridRef.current.getBoundingClientRect();
        setVars({
          "--mouse-x": `${e.clientX - rect.left}px`,
          "--mouse-y": `${e.clientY - rect.top}px`,
          "--spotlight-opacity": "1",
        } as React.CSSProperties);
        rafRef.current = null;
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setVars({
      "--spotlight-opacity": "0",
    } as React.CSSProperties);
  }, []);

  return (
    <div
      ref={gridRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={vars}
      className={`grid gap-4 ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SpotlightCard                                                      */
/* ------------------------------------------------------------------ */

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  /** Enable or disable the spotlight effect. Default `true`. */
  spotlight?: boolean;
}

/**
 * Individual card intended to be placed inside a `<SpotlightGrid>`.
 *
 * Renders an inner absolutely-positioned div (`pointer-events-none`)
 * whose background is a large radial gradient positioned at the
 * grid-relative mouse coordinates. Because the gradient radius (400px)
 * exceeds the card size, it naturally bleeds into adjacent cards,
 * creating a unified spotlight that follows the cursor across the
 * whole grid -- the same technique used by Linear.app and Vercel.
 *
 * A second overlay handles the border-glow effect: a slightly stronger
 * gradient sits behind the card content and peeks through the 1px
 * translucent border on hover, giving the border a living glow.
 */
export default function SpotlightCard({
  children,
  className = "",
  spotlight = true,
}: SpotlightCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-xl bg-card-bg border transition-colors duration-300 ${
        isHovered ? "border-white/15" : "border-card-border"
      } ${className}`}
    >
      {/* ---- spotlight fill (visible whenever mouse is over the grid) ---- */}
      {spotlight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-xl transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(0,102,255,0.15), transparent 60%)",
            opacity: "var(--spotlight-opacity, 0)" as unknown as number,
          }}
        />
      )}

      {/* ---- border glow (only visible on the hovered card) ---- */}
      {spotlight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-xl transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(0,102,255,0.4), transparent 60%)",
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}

      {/* ---- card content ---- */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

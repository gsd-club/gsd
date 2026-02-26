"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// ---------------------------------------------------------------------------
// Polymorphic HTML attribute maps for each supported element type
// ---------------------------------------------------------------------------
type ElementMap = {
  div: React.HTMLAttributes<HTMLDivElement>;
  a: React.AnchorHTMLAttributes<HTMLAnchorElement>;
  button: React.ButtonHTMLAttributes<HTMLButtonElement>;
};

type ValidAs = keyof ElementMap;

// ---------------------------------------------------------------------------
// Props: base fields + forwarded HTML attributes for the chosen element
// ---------------------------------------------------------------------------
type MagneticButtonProps<T extends ValidAs = "div"> = {
  children: React.ReactNode;
  className?: string;
  /** How strongly the element follows the cursor (0 = none, 1 = 1:1). */
  strength?: number;
  /** Which HTML element to render. */
  as?: T;
  /** Shorthand for anchor href — also accepted via spread attrs. */
  href?: string;
} & Omit<ElementMap[T], "children" | "className">;

// ---------------------------------------------------------------------------
// Framer Motion component map (typed)
// ---------------------------------------------------------------------------
const motionComponents = {
  div: motion.div,
  a: motion.a,
  button: motion.button,
} as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function MagneticButton<T extends ValidAs = "div">({
  children,
  className = "",
  strength = 0.35,
  as,
  href,
  ...rest
}: MagneticButtonProps<T>) {
  const ref = useRef<HTMLElement>(null);

  // Raw motion values — updated instantly on every mouse move
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring-wrapped values that create the elastic, premium feel
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // -------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // -------------------------------------------------------------------
  // Resolve which element to render
  // -------------------------------------------------------------------
  const tag: ValidAs = as ?? (href ? "a" : "div");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MotionComponent = motionComponents[tag] as any;

  return (
    <MotionComponent
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
      {...(href ? { href } : {})}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}

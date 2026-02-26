"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Animation direction */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Delay in seconds */
  delay?: number;
  /** Duration in seconds */
  duration?: number;
  /** Distance to travel in pixels */
  distance?: number;
  /** Whether to use stagger for direct children */
  stagger?: number;
  /** Whether element should only animate once */
  once?: boolean;
}

export default function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.8,
  distance = 60,
  stagger = 0,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const targets = stagger > 0 ? el.children : el;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      ...(direction === "up" && { y: distance }),
      ...(direction === "down" && { y: -distance }),
      ...(direction === "left" && { x: distance }),
      ...(direction === "right" && { x: -distance }),
    };

    const toVars: gsap.TweenVars = {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      ease: "power3.out",
      ...(stagger > 0 && { stagger }),
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: once ? "play none none none" : "play reverse play reverse",
      },
    };

    gsap.fromTo(targets, fromVars, toVars);

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [direction, delay, duration, distance, stagger, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

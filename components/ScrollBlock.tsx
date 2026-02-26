"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollBlockProps {
  children: React.ReactNode;
  /** Background color of the block */
  bg?: string;
  /** Extra scroll distance in vh (kept for API compat) */
  scrollDistance?: number;
}

/**
 * Scroll-reveal wrapper with impact.
 *
 * Each section slides up from below with a blur-to-focus transition
 * and inner content parallax that creates a sense of depth.
 * No scaling from small — just clean, strong entrance.
 */
export default function ScrollBlock({
  children,
  bg = "#0a0a0a",
}: ScrollBlockProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || !blockRef.current || !contentRef.current) return;

    const wrapper = wrapperRef.current;
    const block = blockRef.current;
    const content = contentRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top 92%",
          end: "top 12%",
          scrub: 0.4,
        },
      });

      // Phase 1 (0 → 0.6): Block slides up and fades in
      tl.fromTo(
        block,
        {
          y: 120,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          duration: 0.6,
        },
        0
      );

      // Phase 2 (0.15 → 0.7): Content parallax — rises slightly delayed for depth
      tl.fromTo(
        content,
        {
          y: 60,
          opacity: 0.3,
        },
        {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          duration: 0.55,
        },
        0.15
      );

      // Phase 3 (0 → 0.4): Focus effect — blur clears as section enters
      tl.fromTo(
        block,
        { filter: "blur(4px) brightness(0.8)" },
        {
          filter: "blur(0px) brightness(1)",
          ease: "power2.out",
          duration: 0.4,
        },
        0
      );
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div
        ref={blockRef}
        className="relative min-h-screen will-change-transform overflow-hidden"
        style={{
          backgroundColor: bg,
          transformOrigin: "center top",
        }}
      >
        <div ref={contentRef} className="will-change-transform">
          {children}
        </div>
      </div>
    </div>
  );
}

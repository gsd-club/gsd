"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type RevealType = "circle" | "inset" | "wipe-up";

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  /** Reveal animation type */
  reveal?: RevealType;
  /** Background color for the reveal container */
  bg?: string;
}

function getClipPaths(reveal: RevealType) {
  switch (reveal) {
    case "circle":
      return {
        start: "circle(0% at 50% 50%)",
        end: "circle(150% at 50% 50%)",
      };
    case "inset":
      return {
        start: "inset(30% round 24px)",
        end: "inset(0% round 0px)",
      };
    case "wipe-up":
      return {
        start: "inset(100% 0 0 0)",
        end: "inset(0% 0 0 0)",
      };
  }
}

export default function RevealSection({
  children,
  className = "",
  reveal = "circle",
  bg = "#0a0a0a",
}: RevealSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;
    const { start, end } = getClipPaths(reveal);

    // Set initial clipped state
    gsap.set(content, { clipPath: start });

    // Scroll-driven reveal
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 85%",
        end: "top 15%",
        scrub: 0.6,
      },
    });

    tl.to(content, {
      clipPath: end,
      ease: "none",
      duration: 1,
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [reveal]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        ref={contentRef}
        style={{ backgroundColor: bg }}
        className="will-change-[clip-path]"
      >
        {children}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroScrollExitProps {
  children: React.ReactNode;
}

export default function HeroScrollExit({ children }: HeroScrollExitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !containerRef.current ||
      !innerRef.current ||
      !overlayRef.current ||
      !sweepRef.current ||
      !flashRef.current
    )
      return;

    const container = containerRef.current;
    const inner = innerRef.current;
    const overlay = overlayRef.current;
    const sweep = sweepRef.current;
    const flash = flashRef.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top+=55% top",
        end: "bottom top",
        scrub: 0.5,
        pin: false,
      },
    });

    // Phase 1 (0 → 0.6): Hero scales down and darkens
    tl.to(
      inner,
      {
        scale: 0.85,
        opacity: 0.2,
        borderRadius: "24px",
        ease: "none",
        duration: 0.6,
      },
      0
    );

    tl.to(
      overlay,
      {
        opacity: 0.7,
        ease: "none",
        duration: 0.6,
      },
      0
    );

    // Phase 2 (0.4 → 0.8): Light sweep line travels top to bottom
    tl.fromTo(
      sweep,
      { yPercent: -100, opacity: 0 },
      {
        yPercent: 200,
        opacity: 1,
        ease: "power2.inOut",
        duration: 0.4,
      },
      0.4
    );

    // Phase 3 (0.5 → 0.7): Brief bright flash at center
    tl.fromTo(
      flash,
      { opacity: 0 },
      {
        opacity: 1,
        ease: "power2.in",
        duration: 0.15,
      },
      0.55
    );
    tl.to(
      flash,
      {
        opacity: 0,
        ease: "power2.out",
        duration: 0.2,
      },
      0.7
    );

    // Phase 4 (0.7 → 1.0): Full dark — screen goes completely dark before next section
    tl.to(
      overlay,
      {
        opacity: 0.95,
        ease: "power2.in",
        duration: 0.3,
      },
      0.7
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative bg-[#0a0a0a]"
      style={{ marginBottom: "-100vh" }}
    >
      <div
        ref={innerRef}
        className="sticky top-0 z-0 overflow-hidden"
        style={{
          transformOrigin: "center center",
          willChange: "transform, opacity",
        }}
      >
        {children}

        {/* Dark overlay — progressive darkening */}
        <div
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none z-50"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(6,6,17,0.6) 0%, rgba(6,6,17,0.95) 100%)",
            opacity: 0,
          }}
        />

        {/* Light sweep — horizontal bright line that wipes down */}
        <div
          ref={sweepRef}
          className="absolute left-0 right-0 pointer-events-none z-[51]"
          style={{
            top: 0,
            height: "3px",
            opacity: 0,
            background:
              "linear-gradient(90deg, transparent 5%, rgba(0,150,255,0.6) 30%, rgba(0,212,255,0.9) 50%, rgba(0,150,255,0.6) 70%, transparent 95%)",
            boxShadow:
              "0 0 40px 15px rgba(0,150,255,0.3), 0 0 80px 30px rgba(0,102,255,0.15)",
          }}
        />

        {/* Center flash — brief light pulse during transition */}
        <div
          ref={flashRef}
          className="absolute inset-0 pointer-events-none z-[52]"
          style={{
            opacity: 0,
            background:
              "radial-gradient(circle at 50% 50%, rgba(0,150,255,0.15) 0%, rgba(0,102,255,0.05) 30%, transparent 60%)",
          }}
        />
      </div>

      {/* Spacer that creates scroll distance for the exit animation */}
      <div className="h-screen pointer-events-none" aria-hidden="true" />
    </div>
  );
}

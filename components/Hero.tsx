"use client";

import { useCallback, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring, useScroll } from "framer-motion";
import FloatingParticles from "./ui/FloatingParticles";
import AuroraBackground from "./ui/AuroraBackground";
import AIBot from "./AIBot";

/* ═══════════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════════ */

/**
 * Delay (seconds) before hero entrance — synced with Preloader exit.
 * Preloader: ~2.5s count → 0.3s pause → circle-shrink starts at ~3.05s.
 * Boom fires as the center of the hero becomes visible through the shrinking circle.
 */
const BOOM = 3.2;


/* Pre-computed boom particles — deterministic to avoid hydration mismatch */
const BOOM_PARTICLES = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * 360;
  const rad = (angle * Math.PI) / 180;
  // Deterministic pseudo-random per particle using golden ratio
  const seed = ((i * 0.618033988749895) % 1);
  const distance = 600 + seed * 400;
  return {
    id: `boom-p-${i}`,
    endX: Math.cos(rad) * distance,
    endY: Math.sin(rad) * distance,
    size: 3 + ((i * 7 + 3) % 5) * 0.6,
    color: i % 2 === 0 ? "rgba(0,150,255,0.8)" : "rgba(0,212,255,0.6)",
    duration: 0.8 + ((i * 3 + 1) % 5) * 0.08,
  };
});

/* 3D floating shapes: decorative elements that orbit around the content */
const FLOATING_SHAPES: FloatingShape[] = [
  // ── Cubes ──
  {
    id: "cube-1",
    type: "cube",
    size: 40,
    x: "12%",
    y: "20%",
    z: 80,
    rotateSpeed: 12,
    floatRange: 30,
    floatDuration: 6,
    color: "rgba(0,102,255,0.35)",
    blur: 0,
    delay: 0,
  },
  // ── Spheres ──
  {
    id: "sphere-1",
    type: "sphere",
    size: 50,
    x: "8%",
    y: "60%",
    z: -40,
    rotateSpeed: 0,
    floatRange: 35,
    floatDuration: 9,
    color: "rgba(0,212,255,0.2)",
    blur: 3,
    delay: 2,
  },
  // ── Code brackets ──
  {
    id: "bracket-1",
    type: "bracket",
    size: 36,
    x: "18%",
    y: "40%",
    z: 50,
    rotateSpeed: 20,
    floatRange: 28,
    floatDuration: 8,
    color: "rgba(0,212,255,0.3)",
    blur: 0,
    delay: 0.8,
  },
  // ── Diamond ──
  {
    id: "diamond-1",
    type: "diamond",
    size: 32,
    x: "85%",
    y: "30%",
    z: -60,
    rotateSpeed: 10,
    floatRange: 25,
    floatDuration: 9,
    color: "rgba(0,102,255,0.3)",
    blur: 0,
    delay: 1.2,
  },
  // ── Ring ──
  {
    id: "ring-1",
    type: "ring",
    size: 44,
    x: "60%",
    y: "78%",
    z: 20,
    rotateSpeed: 8,
    floatRange: 30,
    floatDuration: 10,
    color: "rgba(0,212,255,0.2)",
    blur: 1,
    delay: 1.8,
  },
  {
    id: "ring-2",
    type: "ring",
    size: 24,
    x: "75%",
    y: "15%",
    z: -30,
    rotateSpeed: 16,
    floatRange: 20,
    floatDuration: 7,
    color: "rgba(0,102,255,0.2)",
    blur: 3,
    delay: 2.2,
  },
];

/* ═══════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════ */

interface FloatingShape {
  id: string;
  type: "cube" | "sphere" | "bracket" | "diamond" | "ring";
  size: number;
  x: string;
  y: string;
  z: number;
  rotateSpeed: number;
  floatRange: number;
  floatDuration: number;
  color: string;
  blur: number;
  delay: number;
}


/* ═══════════════════════════════════════════════════════════
   Shape renderer — returns JSX for each 3D shape type
   ═══════════════════════════════════════════════════════════ */

function ShapeVisual({ type, size, color }: { type: FloatingShape["type"]; size: number; color: string }) {
  switch (type) {
    case "cube":
      return (
        <div
          style={{
            width: size,
            height: size,
            border: `1.5px solid ${color}`,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${color}, transparent)`,
          }}
        />
      );

    case "sphere":
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            border: `1.5px solid ${color}`,
            background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
          }}
        />
      );

    case "bracket":
      return (
        <span
          style={{
            fontSize: size,
            fontFamily: "monospace",
            fontWeight: 700,
            color,
            lineHeight: 1,
          }}
        >
          {"</>"}
        </span>
      );

    case "diamond":
      return (
        <div
          style={{
            width: size * 0.7,
            height: size * 0.7,
            border: `1.5px solid ${color}`,
            background: `linear-gradient(135deg, ${color}, transparent)`,
            transform: "rotate(45deg)",
            borderRadius: 3,
          }}
        />
      );

    case "ring":
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            border: `2px solid ${color}`,
            background: "transparent",
          }}
        />
      );

    default:
      return null;
  }
}

/* ═══════════════════════════════════════════════════════════
   Boom Effect — energy flash + expanding shockwave rings.
   Fires when the Preloader circle-shrink reveals the hero center.
   ═══════════════════════════════════════════════════════════ */

function BoomEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[20] overflow-hidden">
      {/* Central energy flash — bright glow that rapidly scales up and fades */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,150,255,0.9) 0%, rgba(0,212,255,0.4) 35%, rgba(0,102,255,0.15) 60%, transparent 80%)",
          filter: "blur(40px)",
        }}
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: [0.2, 2.5, 3.5], opacity: [0, 0.9, 0] }}
        transition={{
          duration: 1,
          delay: BOOM,
          ease: [0.25, 0.4, 0.25, 1],
          times: [0, 0.25, 1],
        }}
      />

      {/* Screen flash — brief radial brightening from center */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,150,255,0.2) 0%, rgba(0,102,255,0.05) 40%, transparent 70%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 0.6,
          delay: BOOM,
          ease: "easeOut",
          times: [0, 0.15, 1],
        }}
      />

      {/* Shockwave ring 1 — fast expanding bright ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
        style={{
          width: 80,
          height: 80,
          border: "2px solid rgba(0,150,255,0.6)",
          boxShadow:
            "0 0 30px rgba(0,150,255,0.3), inset 0 0 20px rgba(0,150,255,0.1)",
        }}
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ scale: 18, opacity: 0 }}
        transition={{
          duration: 1.2,
          delay: BOOM + 0.05,
          ease: [0.22, 0.61, 0.36, 1],
        }}
      />

      {/* Shockwave ring 2 — slower, wider, follows behind */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
        style={{
          width: 60,
          height: 60,
          border: "1px solid rgba(0,212,255,0.35)",
          boxShadow: "0 0 15px rgba(0,212,255,0.15)",
        }}
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 24, opacity: 0 }}
        transition={{
          duration: 1.6,
          delay: BOOM + 0.2,
          ease: [0.22, 0.61, 0.36, 1],
        }}
      />

      {/* Micro particles — tiny dots that shoot outward with the shockwave */}
      {BOOM_PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-1/2 left-1/2 rounded-full will-change-transform"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: "0 0 6px rgba(0,150,255,0.4)",
          }}
          initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
          animate={{ x: p.endX, y: p.endY, opacity: 0, scale: 0.2 }}
          transition={{
            duration: p.duration,
            delay: BOOM + 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Perspective Grid Floor (Tron-style)
   ═══════════════════════════════════════════════════════════ */

function PerspectiveGrid() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[30vh] sm:h-[40vh] md:h-[50vh] overflow-hidden pointer-events-none">
      {/* Perspective container */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "-50%",
          right: "-50%",
          height: "100%",
          perspective: "600px",
          perspectiveOrigin: "50% 0%",
        }}
      >
        {/* The grid plane */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: BOOM + 0.3, ease: "easeOut" as const }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "200%",
            transform: "rotateX(75deg)",
            transformOrigin: "bottom center",
            backgroundImage: `
              linear-gradient(to right, rgba(0,102,255,0.12) 1px, transparent 1px),
              linear-gradient(to top, rgba(0,102,255,0.12) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            maskImage: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 40%, transparent 80%)",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 40%, transparent 80%)",
          }}
        />
        {/* Horizon glow line */}
        <div
          style={{
            position: "absolute",
            bottom: "50%",
            left: "10%",
            right: "10%",
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(0,102,255,0.3) 20%, rgba(0,212,255,0.4) 50%, rgba(0,102,255,0.3) 80%, transparent)",
            filter: "blur(1px)",
            transform: "rotateX(75deg)",
            transformOrigin: "bottom center",
          }}
        />
      </div>
      {/* Bottom fade into background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{
          background: "linear-gradient(to top, #0a0a0a, transparent)",
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Scroll Indicator — bouncing arrow that fades on scroll
   ═══════════════════════════════════════════════════════════ */

function ScrollIndicator() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 80], [1, 0]);

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: BOOM + 2, duration: 0.8 }}
      style={{ opacity }}
    >
      <span className="text-foreground/30 text-xs font-mono tracking-widest uppercase">Scroll</span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent/50">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Hero Text Overlays — igloo.inc-inspired layout
   Top-left: Logo + copyright    Top-right: Manifesto
   Bottom-left: Scroll prompt
   ═══════════════════════════════════════════════════════════ */

function HeroOverlays() {
  const { scrollY } = useScroll();
  const overlayOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      <div className="relative w-full h-full max-w-[1400px] mx-auto px-6 sm:px-10 py-8 sm:py-12">

        {/* ── Top Left: Logo + Info ── */}
        <motion.div
          className="absolute top-8 sm:top-12 left-6 sm:left-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: BOOM + 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ opacity: overlayOpacity }}
        >
          <div className="font-mono text-foreground/90 font-bold text-lg sm:text-xl tracking-[0.15em] uppercase mb-2">
            GSD <span className="text-accent">CLUB</span>
          </div>
          <div className="font-mono text-foreground/25 text-[10px] sm:text-xs leading-relaxed">
            <div>// Copyright &copy; 2026</div>
            <div className="mt-1">GSD Club, Inc.</div>
            <div>All Rights Reserved.</div>
          </div>
        </motion.div>

        {/* ── Top Right: Manifesto ── */}
        <motion.div
          className="absolute top-8 sm:top-12 right-6 sm:right-10 text-right max-w-[240px] sm:max-w-[280px]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: BOOM + 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ opacity: overlayOpacity }}
        >
          <div className="font-mono text-foreground/30 text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2">
            ///// Manifesto
          </div>
          <p className="font-mono text-foreground/25 text-[10px] sm:text-xs leading-[1.7]">
            We build products with AI — websites, apps, and automations that ship fast and scale hard.
          </p>
        </motion.div>

        {/* ── Bottom Left: Scroll prompt ── */}
        <motion.div
          className="absolute bottom-8 sm:bottom-12 left-6 sm:left-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: BOOM + 1.5, ease: "easeOut" }}
          style={{ opacity: overlayOpacity }}
        >
          <div className="font-mono text-foreground/20 text-[10px] sm:text-xs leading-relaxed">
            <div>Scroll down to</div>
            <div>discover.</div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main Hero Component
   ═══════════════════════════════════════════════════════════ */

export default function Hero() {
  /* ── Mouse parallax state ── */
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 50, damping: 30, mass: 1 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  /* Parallax transform values — different layers get different multipliers */
  const parallaxX1 = useTransform(smoothMouseX, [-0.5, 0.5], [-20, 20]);
  const parallaxY1 = useTransform(smoothMouseY, [-0.5, 0.5], [-20, 20]);
  const parallaxX2 = useTransform(smoothMouseX, [-0.5, 0.5], [-35, 35]);
  const parallaxY2 = useTransform(smoothMouseY, [-0.5, 0.5], [-35, 35]);
  const parallaxX3 = useTransform(smoothMouseX, [-0.5, 0.5], [-12, 12]);
  const parallaxY3 = useTransform(smoothMouseY, [-0.5, 0.5], [-12, 12]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(nx);
      mouseY.set(ny);
    },
    [mouseX, mouseY]
  );

  const { scrollY } = useScroll();

  /* ── Parallax layers for shapes (cycle through 3 depth levels) ── */
  const parallaxLayers = [
    { x: parallaxX1, y: parallaxY1 },
    { x: parallaxX2, y: parallaxY2 },
    { x: parallaxX3, y: parallaxY3 },
  ];

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen h-screen flex flex-col items-center justify-center overflow-hidden animated-gradient"
    >
      {/* Aurora background effect */}
      <AuroraBackground intensity="subtle" />

      {/* ────────────── Background layers (kept minimal) ────────────── */}

      {/* Floating Particles — reduced count */}
      <FloatingParticles count={6} className="z-0" />

      {/* Perspective grid floor */}
      <PerspectiveGrid />

      {/* Single subtle glow orb */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] rounded-full bg-accent/[0.05] blur-[200px]" />
      </div>

      {/* Radial vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0a0a_70%)] pointer-events-none z-[2]" />

      {/* ────────────── BOOM EFFECT ────────────── */}
      <BoomEffect />

      {/* ────────────── 3D floating shapes layer — burst in with overshoot (hidden on mobile) ────────────── */}
      <div className="absolute inset-0 pointer-events-none z-[3] hidden sm:block">
        {FLOATING_SHAPES.map((shape, index) => {
          const layer = parallaxLayers[index % parallaxLayers.length];

          return (
            <motion.div
              key={shape.id}
              className="absolute"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 1,
                delay: BOOM + 0.12 + index * 0.08,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              style={{
                left: shape.x,
                top: shape.y,
                x: layer.x,
                y: layer.y,
                filter: shape.blur > 0 ? `blur(${shape.blur}px)` : undefined,
                zIndex: shape.z > 0 ? 1 : 0,
              }}
            >
              {/* Orbit / float animation wrapper */}
              <motion.div
                animate={{
                  y: [-shape.floatRange, shape.floatRange, -shape.floatRange],
                  rotateX: shape.rotateSpeed > 0 ? [0, 360] : 0,
                  rotateY: shape.rotateSpeed > 0 ? [0, 360] : 0,
                }}
                transition={{
                  y: {
                    duration: shape.floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut" as const,
                    delay: shape.delay,
                  },
                  rotateX: {
                    duration: shape.rotateSpeed,
                    repeat: Infinity,
                    ease: "linear" as const,
                    delay: shape.delay,
                  },
                  rotateY: {
                    duration: shape.rotateSpeed * 1.3,
                    repeat: Infinity,
                    ease: "linear" as const,
                    delay: shape.delay,
                  },
                }}
                style={{
                  transformStyle: "preserve-3d",
                  perspective: 1000,
                }}
              >
                <div
                  style={{
                    transform: `perspective(1000px) translateZ(${shape.z}px)`,
                  }}
                >
                  <ShapeVisual type={shape.type} size={shape.size} color={shape.color} />
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* ────────────── AI Bot — fills the viewport ────────────── */}
      <motion.div
        className="relative z-10 w-full h-full absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: BOOM,
          ease: "easeOut",
        }}
      >
        <div className="w-full h-[70vh] sm:h-[80vh] md:h-[85vh] max-h-full">
          <AIBot mouseX={mouseX} mouseY={mouseY} entranceDelay={BOOM + 0.25} />
        </div>
      </motion.div>

      {/* ────────────── Text overlays (igloo-style) ────────────── */}
      <HeroOverlays />

      {/* Scroll affordance */}
      <ScrollIndicator />
    </section>
  );
}

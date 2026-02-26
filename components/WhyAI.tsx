"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import SectionHeading from "./ui/SectionHeading";
import TiltCard from "./ui/TiltCard";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const traditionalItems = [
  "4-8 week timelines",
  "$15,000 - $50,000+ budgets",
  "Endless back-and-forth revisions",
  "Bloated team overhead",
  "Outdated tech stacks",
];

const gsdItems = [
  "1-2 week delivery",
  "60-80% more affordable",
  "AI-accelerated iterations",
  "Lean, expert team",
  "Cutting-edge AI stack",
];

const metrics: { value: number; suffix: string; label: string }[] = [
  { value: 3, suffix: "x", label: "Faster" },
  { value: 60, suffix: "%", label: "Cost Savings" },
  { value: 10, suffix: "x", label: "More Iterations" },
];

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function XIcon() {
  return (
    <svg
      className="w-5 h-5 text-red-500 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 text-emerald-400 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1] as const,
      onUpdate(v) {
        setDisplayed(Math.round(v));
      },
    });

    return () => controls.stop();
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {displayed}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Framer Motion variants                                             */
/* ------------------------------------------------------------------ */

const cardLeftVariant = {
  hidden: {
    opacity: 0,
    x: -80,
    rotateY: 15,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const cardRightVariant = {
  hidden: {
    opacity: 0,
    x: 80,
    rotateY: -15,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

const itemVariant = {
  hidden: { opacity: 0, x: -16, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

const vsBadgeVariant = {
  hidden: { opacity: 0, scale: 0, rotateY: 180 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: 0.5,
    },
  },
};

const metricCardVariant = {
  hidden: { opacity: 0, y: 50, rotateX: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut" as const,
      delay: 0.15 * i,
    },
  }),
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function WhyAI() {
  return (
    <section id="why-ai" className="py-24 md:py-32 bg-card-bg/50 relative overflow-hidden">
      {/* Subtle top/bottom divider lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-card-border to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-card-border to-transparent" />

      {/* Ambient depth glow behind the cards */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/[0.04] blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-[420px] w-[420px] translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.06] blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why AI-Powered"
          title="The Unfair Advantage"
          description="Traditional agencies are slow and expensive. We use AI to deliver better results in a fraction of the time."
        />

        {/* -------------------------------------------------------- */}
        {/*  3D Comparison Cards                                      */}
        {/* -------------------------------------------------------- */}
        <div
          className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 mb-20"
          style={{ perspective: "1200px" }}
        >
          {/* --- Traditional Agency Card --- */}
          <motion.div
            variants={cardLeftVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <TiltCard
              tiltAmount={8}
              glare
              className="h-full border-red-500/20 hover:border-red-500/30 p-6 md:p-8"
            >
              {/* Red tint overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-red-500/[0.04]" />

              <div className="relative" style={{ transformStyle: "preserve-3d" }}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="inline-flex p-2 rounded-lg bg-red-500/10"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3
                    className="text-xl font-bold text-red-400"
                    style={{ transform: "translateZ(16px)" }}
                  >
                    Traditional Agency
                  </h3>
                </div>

                {/* List items with stagger */}
                <ul className="space-y-4">
                  {traditionalItems.map((item) => (
                    <motion.li
                      key={item}
                      variants={itemVariant}
                      className="flex items-center gap-3"
                      style={{ transform: "translateZ(10px)" }}
                    >
                      <XIcon />
                      <span className="text-muted">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          </motion.div>

          {/* --- 3D Floating VS Badge (desktop only) --- */}
          <motion.div
            variants={vsBadgeVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ perspective: "600px" }}
          >
            <motion.div
              animate={{
                rotateY: [0, 10, -10, 0],
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut" as const,
              }}
              className="relative flex items-center justify-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Pulsing glow rings */}
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" as const }}
                className="absolute h-20 w-20 rounded-full bg-accent/20 blur-md"
              />
              <motion.div
                animate={{ scale: [1, 1.9, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" as const, delay: 0.4 }}
                className="absolute h-20 w-20 rounded-full bg-accent-glow/15 blur-lg"
              />

              {/* VS circle */}
              <div
                className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent/50 bg-background shadow-[0_0_30px_rgba(0,102,255,0.3),0_0_60px_rgba(0,212,255,0.15)]"
                style={{ transform: "translateZ(40px)" }}
              >
                <span className="text-sm font-extrabold tracking-widest gradient-text">
                  VS
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* --- GSD Club Card --- */}
          <motion.div
            variants={cardRightVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <TiltCard
              tiltAmount={10}
              glare
              className="h-full border-accent/30 hover:border-accent/50 p-6 md:p-8 shadow-[0_0_50px_-12px_rgba(0,102,255,0.2)]"
            >
              {/* Accent tint overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-accent/[0.04]" />
              {/* Glow border highlight */}
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-accent-glow/10" />

              <div className="relative" style={{ transformStyle: "preserve-3d" }}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="inline-flex p-2 rounded-lg bg-accent/10"
                    style={{ transform: "translateZ(24px)" }}
                  >
                    <svg
                      className="w-5 h-5 text-accent"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3
                    className="text-xl font-bold gradient-text"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    GSD Club
                  </h3>
                </div>

                {/* List items with stagger */}
                <ul className="space-y-4">
                  {gsdItems.map((item) => (
                    <motion.li
                      key={item}
                      variants={itemVariant}
                      className="flex items-center gap-3"
                      style={{ transform: "translateZ(14px)" }}
                    >
                      <CheckIcon />
                      <span className="text-foreground">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          </motion.div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Key Metrics                                              */}
        {/* -------------------------------------------------------- */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          style={{ perspective: "1000px" }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              custom={index}
              variants={metricCardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <TiltCard
                tiltAmount={6}
                glare
                className="text-center py-10 px-6"
              >
                <div className="relative" style={{ transformStyle: "preserve-3d" }}>
                  {/* 3D extruded number */}
                  <span
                    className="text-4xl md:text-5xl font-bold gradient-text block mb-2"
                    style={{
                      transform: "translateZ(30px)",
                      textShadow:
                        "0 1px 0 rgba(0,102,255,0.4), 0 2px 0 rgba(0,102,255,0.3), 0 3px 0 rgba(0,102,255,0.2), 0 4px 0 rgba(0,102,255,0.1), 0 6px 20px rgba(0,102,255,0.15)",
                    }}
                  >
                    <AnimatedNumber value={metric.value} suffix={metric.suffix} />
                  </span>
                  <span
                    className="text-muted text-sm font-medium uppercase tracking-wider"
                    style={{ transform: "translateZ(16px)" }}
                  >
                    {metric.label}
                  </span>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

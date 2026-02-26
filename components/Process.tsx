"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "./ui/SectionHeading";
import TiltCard from "./ui/TiltCard";

/* ------------------------------------------------------------------ */
/*  Step data                                                          */
/* ------------------------------------------------------------------ */

const steps = [
  {
    number: 1,
    title: "Discovery Call",
    description:
      "We learn about your project, goals, and timeline. 30-minute call, no obligations.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20.25 3.75v4.5m0-4.5h-4.5m4.5 0l-6 6m3 6v6a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V5.25A.75.75 0 016 4.5h6"
        />
      </svg>
    ),
  },
  {
    number: 2,
    title: "Proposal & Scope",
    description:
      "You get a clear proposal with timeline, cost, and deliverables within 24 hours.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
    ),
  },
  {
    number: 3,
    title: "AI-Powered Build",
    description:
      "Our team + AI tools build your product with daily progress updates.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 01-1.59.659H9.06a2.25 2.25 0 01-1.59-.659L5 14.5m14 0V5.846a4.483 4.483 0 00-3.75-.896M5 14.5V5.846A4.483 4.483 0 018.75 4.95"
        />
      </svg>
    ),
  },
  {
    number: 4,
    title: "Launch & Support",
    description:
      "We deploy, test, and hand off. Plus 30 days of free support.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
        />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const cardVariants = {
  hidden: {
    opacity: 0,
    rotateX: 12,
    rotateY: -6,
    y: 60,
    scale: 0.92,
  },
  visible: (i: number) => ({
    opacity: 1,
    rotateX: 0,
    rotateY: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: i * 0.18,
      ease: [0.215, 0.61, 0.355, 1] as const,
    },
  }),
};

const numberVariants = {
  hidden: { scale: 0, rotateY: 180 },
  visible: (i: number) => ({
    scale: 1,
    rotateY: 0,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 18,
      delay: i * 0.18 + 0.15,
    },
  }),
};

const ctaVariants = {
  hidden: { opacity: 0, y: 40, rotateX: 8 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.7,
      delay: 0.25,
      ease: "easeOut" as const,
    },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Process() {
  const timelineRef = useRef<HTMLDivElement>(null);

  /* Scroll-driven progress for the timeline fill */
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.85", "end 0.45"],
  });

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const lineOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <section id="process" className="py-24 md:py-32 relative overflow-hidden bg-card-bg/30">
      {/* ---- Gradient divider lines ---- */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-card-border to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-card-border to-transparent" />
      {/* Subtle background depth grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          eyebrow="How It Works"
          title="Simple. Fast. Effective."
          description="Our streamlined process gets you from idea to launch in record time."
        />

        {/* -------------------------------------------------------- */}
        {/*  3D Timeline                                              */}
        {/* -------------------------------------------------------- */}
        <div ref={timelineRef} className="relative max-w-3xl mx-auto">
          {/* ---- Background track (static) ---- */}
          <div
            aria-hidden="true"
            className="absolute left-6 md:left-8 top-0 bottom-0 w-px"
          >
            {/* Faint dashed track */}
            <div className="absolute inset-0 w-full bg-card-border" />

            {/* Animated flowing gradient behind the fill */}
            <div
              className="absolute inset-0 w-full opacity-20"
              style={{
                background:
                  "linear-gradient(180deg, #0066ff 0%, #00d4ff 40%, #0066ff 80%, #00d4ff 100%)",
                backgroundSize: "100% 200%",
                animation: "timeline-flow 3s linear infinite",
              }}
            />
          </div>

          {/* ---- Scroll-driven fill line ---- */}
          <motion.div
            aria-hidden="true"
            className="absolute left-6 md:left-8 top-0 bottom-0 w-px origin-top"
            style={{
              scaleY: lineScaleY,
              opacity: lineOpacity,
              background:
                "linear-gradient(180deg, #0066ff 0%, #00d4ff 60%, transparent 100%)",
            }}
          />

          {/* ---- Step cards ---- */}
          <div className="space-y-14 md:space-y-20" style={{ perspective: "1200px" }}>
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="relative flex items-start gap-6 md:gap-10"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* ---- 3D Number sphere ---- */}
                <motion.div
                  custom={index}
                  variants={numberVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  className="relative z-10 flex-shrink-0"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className="relative w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "radial-gradient(ellipse at 35% 25%, #1a3a6b 0%, #0066ff 45%, #003399 100%)",
                      boxShadow: `
                        0 2px 4px rgba(0, 102, 255, 0.3),
                        0 6px 12px rgba(0, 102, 255, 0.2),
                        0 12px 24px rgba(0, 0, 0, 0.4),
                        inset 0 -3px 6px rgba(0, 0, 0, 0.35),
                        inset 0 2px 4px rgba(0, 212, 255, 0.25)
                      `,
                    }}
                  >
                    {/* Highlight arc for 3D sphere illusion */}
                    <div
                      aria-hidden="true"
                      className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[60%] h-[30%] rounded-full opacity-30"
                      style={{
                        background:
                          "radial-gradient(ellipse, rgba(255,255,255,0.7) 0%, transparent 70%)",
                      }}
                    />
                    <span className="relative z-10 font-bold text-lg md:text-xl font-mono text-white drop-shadow-md">
                      {step.number}
                    </span>
                  </div>

                  {/* Glow behind sphere */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full blur-xl -z-10"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(0,102,255,0.35) 0%, transparent 70%)",
                      transform: "scale(1.8)",
                    }}
                  />
                </motion.div>

                {/* ---- Step content inside TiltCard ---- */}
                <TiltCard
                  tiltAmount={8}
                  className="flex-1 p-6 md:p-8"
                  glare
                >
                  <div
                    style={{
                      boxShadow:
                        "0 8px 32px rgba(0, 0, 0, 0.35), 0 2px 8px rgba(0, 0, 0, 0.25)",
                    }}
                    className="absolute inset-0 rounded-xl pointer-events-none -z-10"
                  />

                  {/* Step label + icon */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-xs tracking-widest text-accent uppercase">
                      Step {String(step.number).padStart(2, "0")}
                    </span>
                    <span className="text-accent opacity-60">{step.icon}</span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold mb-2 text-foreground">
                    {step.title}
                  </h3>

                  <p className="text-muted text-base md:text-lg leading-relaxed max-w-lg">
                    {step.description}
                  </p>

                  {/* Bottom accent bar */}
                  <div
                    aria-hidden="true"
                    className="mt-5 h-px w-full opacity-30"
                    style={{
                      background:
                        "linear-gradient(90deg, #0066ff 0%, #00d4ff 50%, transparent 100%)",
                    }}
                  />
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  CTA                                                       */}
        {/* -------------------------------------------------------- */}
        <motion.div
          variants={ctaVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mt-24"
          style={{ perspective: "800px" }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
            Ready to Start?
          </h3>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 cursor-pointer bg-accent text-white hover:bg-blue-600 glow px-8 py-4 text-lg"
            style={{
              boxShadow:
                "0 4px 14px rgba(0, 102, 255, 0.4), 0 1px 3px rgba(0, 0, 0, 0.3)",
            }}
          >
            Book Your Discovery Call
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </motion.a>
        </motion.div>
      </div>

    </section>
  );
}

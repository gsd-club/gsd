"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const projects = [
  {
    title: "FinFlow Dashboard",
    type: "Web App",
    description:
      "AI-powered financial analytics dashboard with real-time data visualization and predictive insights.",
    techStack: ["Next.js", "Python", "AI", "Charts"],
    gradient: "from-blue-600/40 via-indigo-500/25 to-cyan-400/40",
    accentColor: "from-blue-500 to-cyan-400",
    glowColor: "rgba(0,102,255,0.35)",
  },
  {
    title: "Bloom Marketplace",
    type: "E-Commerce",
    description:
      "Modern marketplace platform with AI-driven product recommendations and seamless checkout.",
    techStack: ["React", "Node.js", "Stripe", "AI"],
    gradient: "from-purple-600/40 via-fuchsia-500/25 to-pink-400/40",
    accentColor: "from-purple-500 to-pink-400",
    glowColor: "rgba(168,85,247,0.35)",
  },
  {
    title: "SwiftHealth",
    type: "Mobile App",
    description:
      "Health tracking app with AI insights, personalized recommendations, and real-time monitoring.",
    techStack: ["React Native", "Firebase", "AI", "ML"],
    gradient: "from-cyan-600/40 via-teal-500/25 to-emerald-400/40",
    accentColor: "from-cyan-500 to-emerald-400",
    glowColor: "rgba(0,212,255,0.35)",
  },
];

/* ------------------------------------------------------------------ */
/*  ProjectCard                                                        */
/* ------------------------------------------------------------------ */

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const numberLabel = String(index + 1).padStart(2, "0");

  return (
    <div className="group relative flex-shrink-0 w-[80vw] md:w-[65vw] h-[65vh] md:h-[70vh]">
      {/* Glassmorphism card */}
      <div className="relative h-full rounded-2xl bg-card-bg/60 backdrop-blur-xl border border-card-border/80 overflow-hidden transition-all duration-500 hover:border-white/[0.12] hover:bg-card-bg/80">
        {/* Ambient glow behind card on hover */}
        <div
          className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-2xl -z-10"
          style={{ background: project.glowColor }}
        />

        {/* Mobile: vertical stack / Desktop: side-by-side */}
        <div className="h-full flex flex-col md:flex-row">
          {/* ── Left side: Gradient / UI mockup area ───────────────── */}
          <div className="flex-1 md:w-[55%] md:flex-none min-h-0 p-4 md:p-6">
            <div
              className={`h-full rounded-xl bg-gradient-to-br ${project.gradient} relative overflow-hidden border border-white/[0.06] transition-transform duration-500 group-hover:scale-[1.01]`}
            >
              {/* Background glow orb */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-40 h-40 md:w-56 md:h-56 rounded-full blur-3xl opacity-20 group-hover:opacity-50 transition-opacity duration-700"
                  style={{ background: project.glowColor }}
                />
              </div>

              {/* Simulated UI chrome */}
              <div className="absolute inset-0 flex flex-col p-4 md:p-6 gap-3">
                {/* Browser bar */}
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/30" />
                  <div className="ml-4 h-3 w-32 md:w-48 rounded-full bg-white/[0.08]" />
                </div>

                {/* Content layout */}
                <div className="flex-1 flex gap-3 mt-2">
                  {/* Sidebar */}
                  <div className="w-[25%] flex flex-col gap-2">
                    <div className="h-3 w-full rounded-full bg-white/[0.1]" />
                    <div className="h-3 w-3/4 rounded-full bg-white/[0.07]" />
                    <div className="h-3 w-5/6 rounded-full bg-white/[0.05]" />
                    <div className="flex-1 rounded-lg bg-white/[0.04] mt-2 border border-white/[0.04]" />
                  </div>

                  {/* Main content */}
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex-1 rounded-lg bg-white/[0.06] border border-white/[0.05] relative overflow-hidden">
                      <div
                        className={`absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t ${project.accentColor} rounded-b-lg opacity-[0.06] group-hover:opacity-[0.15] transition-opacity duration-500`}
                      />
                    </div>
                    <div className="h-[35%] flex gap-2">
                      <div className="flex-1 rounded-lg bg-white/[0.07] border border-white/[0.05]" />
                      <div className="flex-1 rounded-lg bg-white/[0.05] border border-white/[0.04]" />
                      <div className="flex-1 rounded-lg bg-white/[0.06] border border-white/[0.04]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Corner glow accent */}
              <div
                className={`absolute -bottom-8 -right-8 w-36 h-36 rounded-full bg-gradient-to-br ${project.accentColor} blur-3xl pointer-events-none opacity-10 group-hover:opacity-40 transition-opacity duration-700`}
              />
            </div>
          </div>

          {/* ── Right side: Project info ────────────────────────────── */}
          <div className="md:w-[45%] md:flex-none flex flex-col justify-between p-4 pt-0 md:p-8 md:pl-2">
            <div>
              {/* Number + type badge */}
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <span className="font-mono text-3xl md:text-4xl font-bold text-white/[0.08] select-none leading-none">
                  {numberLabel}
                </span>
                <span className="px-3 py-1 text-[11px] font-semibold tracking-wider uppercase bg-accent/15 text-accent rounded-full border border-accent/20">
                  {project.type}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 leading-tight group-hover:text-white transition-colors duration-300">
                {project.title}
              </h3>

              {/* Description */}
              <p className="text-muted text-sm md:text-base leading-relaxed mb-5">
                {project.description}
              </p>

              {/* Tech stack tags */}
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs font-mono bg-white/[0.04] text-muted border border-white/[0.08] rounded-md group-hover:border-accent/30 group-hover:text-accent/80 transition-all duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-5 md:mt-0">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-muted group-hover:text-accent transition-colors duration-300 cursor-pointer">
                View Project
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Work Section — Horizontal Scroll                                   */
/* ------------------------------------------------------------------ */

export default function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !triggerRef.current || !trackRef.current) return;

    const track = trackRef.current;
    const progress = progressRef.current;

    // Calculate how far the track needs to scroll horizontally
    // (total track width minus one viewport width)
    const getScrollAmount = () => {
      return -(track.scrollWidth - window.innerWidth);
    };

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: () => `+=${Math.abs(getScrollAmount())}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progress) {
              progress.style.width = `${self.progress * 100}%`;
            }
          },
        },
      });

      // Handle resize
      ScrollTrigger.addEventListener("refreshInit", () => {
        gsap.set(track, { x: 0 });
      });

      return () => {
        tween.kill();
      };
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section id="work" ref={sectionRef} className="relative">
      {/* Scroll-triggered wrapper — GSAP pins this */}
      <div ref={triggerRef} className="relative overflow-hidden bg-background">
        {/* Subtle ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-accent/[0.03] blur-[120px] pointer-events-none" />

        {/* Viewport-height container */}
        <div className="h-screen flex flex-col">
          {/* ── Fixed header area ──────────────────────────────────── */}
          <div className="flex-shrink-0 pt-16 md:pt-20 pb-6 md:pb-8 px-6 md:px-12 lg:px-20 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" as const }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <span className="font-mono text-sm tracking-widest text-accent uppercase mb-3 block">
                Our Work
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Selected Work
              </h2>
            </motion.div>
          </div>

          {/* ── Horizontal scroll track ────────────────────────────── */}
          <div className="flex-1 min-h-0 flex items-center">
            <div
              ref={trackRef}
              className="flex gap-6 md:gap-10 pl-6 md:pl-12 lg:pl-20 pr-[15vw] will-change-transform"
            >
              {projects.map((project, i) => (
                <ProjectCard key={project.title} project={project} index={i} />
              ))}
            </div>
          </div>

          {/* ── Progress bar ───────────────────────────────────────── */}
          <div className="flex-shrink-0 px-6 md:px-12 lg:px-20 pb-8 md:pb-10 relative z-10">
            <div className="w-full h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
              <div
                ref={progressRef}
                className="h-full w-0 bg-gradient-to-r from-accent to-accent-glow rounded-full transition-none"
              />
            </div>
            {/* Progress labels */}
            <div className="flex justify-between mt-3">
              <span className="font-mono text-xs text-muted/50">01</span>
              <span className="font-mono text-xs text-muted/50">
                {String(projects.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

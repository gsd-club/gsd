"use client";

import { motion } from "framer-motion";
import SectionHeading from "./ui/SectionHeading";
import SpotlightCard, { SpotlightGrid } from "./ui/SpotlightCard";

/* ------------------------------------------------------------------ */
/*  Service data                                                       */
/* ------------------------------------------------------------------ */

const services = [
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    title: "Websites & Landing Pages",
    description:
      "High-converting marketing sites and landing pages built with modern frameworks. Pixel-perfect design with blazing-fast performance and SEO baked in.",
    gradient: {
      line: "from-blue-500 to-blue-400",
      iconBg: "from-blue-500/20 to-blue-400/10",
      overlay: "rgba(59,130,246,0.06)",
      text: "text-blue-400",
    },
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Web Applications",
    description:
      "Full-stack web apps with authentication, dashboards, and real-time features. Scalable architecture that grows with your user base.",
    gradient: {
      line: "from-indigo-500 to-purple-500",
      iconBg: "from-indigo-500/20 to-purple-500/10",
      overlay: "rgba(99,102,241,0.06)",
      text: "text-indigo-400",
    },
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "Mobile Apps",
    description:
      "Cross-platform mobile applications for iOS and Android. Native feel with shared codebase for faster delivery and lower costs.",
    gradient: {
      line: "from-cyan-500 to-teal-400",
      iconBg: "from-cyan-500/20 to-teal-400/10",
      overlay: "rgba(6,182,212,0.06)",
      text: "text-cyan-400",
    },
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "AI Automations",
    description:
      "Custom AI workflows, chatbots, and intelligent process automation. Turn repetitive tasks into hands-free, self-running systems.",
    gradient: {
      line: "from-purple-500 to-pink-500",
      iconBg: "from-purple-500/20 to-pink-500/10",
      overlay: "rgba(168,85,247,0.06)",
      text: "text-purple-400",
    },
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    title: "Internal Tools",
    description:
      "Admin panels, CRMs, and operational dashboards for your team. Streamline workflows so your people focus on what matters.",
    gradient: {
      line: "from-emerald-500 to-green-400",
      iconBg: "from-emerald-500/20 to-green-400/10",
      overlay: "rgba(16,185,129,0.06)",
      text: "text-emerald-400",
    },
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "API Development",
    description:
      "Robust APIs and backend services that scale with your business. Clean contracts, thorough docs, and rock-solid reliability.",
    gradient: {
      line: "from-orange-500 to-amber-400",
      iconBg: "from-orange-500/20 to-amber-400/10",
      overlay: "rgba(249,115,22,0.06)",
      text: "text-orange-400",
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const floatTransition = {
  y: {
    duration: 3,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut" as const,
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Services() {
  return (
    <section id="services" className="relative py-24 md:py-32 overflow-hidden bg-[#060611]">
      {/* ---- Gradient divider lines ---- */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-card-border to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-card-border to-transparent" />

      {/* ---- Floating accent glow orb for depth ---- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <motion.div
          className="absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] rounded-full opacity-[0.07]"
          style={{
            background:
              "radial-gradient(circle, #00d4ff 0%, #0066ff 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ---- Hero headline — reveals as this section scrolls in ---- */}
        <motion.div
          className="text-center mb-20 md:mb-28"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight mb-6">
            <span className="block text-foreground">We Build Your Product</span>
            <span className="block gradient-text">With AI</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
            Websites. Apps. Automations. — Faster, sharper, and more affordable than traditional agencies.
          </p>
          <div
            className="w-36 h-px mx-auto"
            style={{
              background: "linear-gradient(90deg, transparent, #0066ff, #00d4ff, transparent)",
            }}
          />
        </motion.div>

        <SectionHeading
          eyebrow="What We Build"
          title="Services That Ship"
          description="From landing pages to full-stack platforms — we deliver production-ready products powered by AI."
          center
        />

        <SpotlightGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={i}
            >
              <SpotlightCard className="h-full p-8 group relative">
                {/* ---- Top accent gradient line ---- */}
                <div
                  aria-hidden="true"
                  className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${service.gradient.line} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* ---- Subtle radial gradient overlay ---- */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-xl opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(ellipse at 10% 0%, ${service.gradient.overlay} 0%, transparent 60%)`,
                  }}
                />

                {/* ---- Content (relative z-10 to sit above overlays) ---- */}
                <div className="relative z-10">
                  {/* --- Floating Icon with gradient background --- */}
                  <div className="relative inline-flex mb-6">
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 rounded-xl bg-accent/0 blur-xl transition-all duration-500 group-hover:bg-accent/30 group-hover:scale-125"
                    />

                    <motion.div
                      className={`relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient.iconBg} ${service.gradient.text} transition-all duration-300 group-hover:scale-110`}
                      animate={{ y: [0, -6, 0] }}
                      transition={floatTransition}
                    >
                      {service.icon}
                    </motion.div>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-foreground">
                    {service.title}
                  </h3>

                  <p className="text-muted text-sm leading-relaxed mb-5">
                    {service.description}
                  </p>

                  {/* ---- Learn more link ---- */}
                  <span
                    className={`inline-flex items-center gap-1.5 text-sm font-medium ${service.gradient.text} opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:gap-2.5`}
                  >
                    Learn more
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </SpotlightGrid>
      </div>
    </section>
  );
}

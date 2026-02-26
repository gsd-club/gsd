"use client";

import { motion } from "framer-motion";
import SectionHeading from "./ui/SectionHeading";
import TiltCard from "./ui/TiltCard";
import Button from "./ui/Button";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const contactInfo = [
  {
    label: "Email",
    value: "hello@gsdclub.com",
    href: "mailto:hello@gsdclub.com",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
      </svg>
    ),
  },
  {
    label: "Response Time",
    value: "We respond within 2 hours",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    label: "Location",
    value: "Remote \u2014 Worldwide",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
        />
      </svg>
    ),
  },
];

const socials = [
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
];

const projectTypes = [
  { value: "", label: "Select project type" },
  { value: "website", label: "Website" },
  { value: "web-app", label: "Web App" },
  { value: "mobile-app", label: "Mobile App" },
  { value: "ai-automation", label: "AI Automation" },
  { value: "other", label: "Other" },
];

const budgetRanges = [
  { value: "", label: "Select budget range" },
  { value: "1k-3k", label: "$1k \u2013 $3k" },
  { value: "3k-5k", label: "$3k \u2013 $5k" },
  { value: "5k-10k", label: "$5k \u2013 $10k" },
  { value: "10k+", label: "$10k+" },
];

/* ------------------------------------------------------------------ */
/*  3D Floating decorative shapes                                      */
/* ------------------------------------------------------------------ */

interface FloatingShapeProps {
  type: "cube" | "ring" | "diamond";
  size: number;
  top: string;
  left: string;
  duration: number;
  delay: number;
}

const floatingShapes: FloatingShapeProps[] = [
  { type: "cube", size: 24, top: "8%", left: "5%", duration: 18, delay: 0 },
  { type: "ring", size: 32, top: "15%", left: "90%", duration: 22, delay: 2 },
  { type: "diamond", size: 20, top: "75%", left: "8%", duration: 20, delay: 4 },
  { type: "cube", size: 18, top: "85%", left: "92%", duration: 24, delay: 1 },
  { type: "ring", size: 28, top: "45%", left: "3%", duration: 19, delay: 3 },
  { type: "diamond", size: 22, top: "30%", left: "95%", duration: 21, delay: 5 },
];

function FloatingShape({ type, size, top, left, duration, delay }: FloatingShapeProps) {
  const rotateVariants = {
    animate: {
      rotateX: [0, 360],
      rotateY: [0, 360],
      rotateZ: [0, 180],
      y: [0, -20, 0],
      transition: {
        rotateX: { duration, repeat: Infinity, ease: [0.37, 0, 0.63, 1] as const },
        rotateY: { duration: duration * 1.2, repeat: Infinity, ease: [0.37, 0, 0.63, 1] as const },
        rotateZ: { duration: duration * 0.8, repeat: Infinity, ease: [0.37, 0, 0.63, 1] as const },
        y: { duration: duration * 0.5, repeat: Infinity, ease: "easeInOut" as const },
      },
    },
  };

  const shapeElement = () => {
    switch (type) {
      case "cube":
        return (
          <div
            style={{
              width: size,
              height: size,
              transformStyle: "preserve-3d",
            }}
            className="relative"
          >
            {/* Cube faces */}
            <div
              className="absolute inset-0 border border-accent/20 bg-accent/5"
              style={{ transform: `translateZ(${size / 2}px)` }}
            />
            <div
              className="absolute inset-0 border border-accent/20 bg-accent/5"
              style={{ transform: `rotateY(180deg) translateZ(${size / 2}px)` }}
            />
            <div
              className="absolute inset-0 border border-accent/20 bg-accent/5"
              style={{ transform: `rotateY(90deg) translateZ(${size / 2}px)` }}
            />
            <div
              className="absolute inset-0 border border-accent/20 bg-accent/5"
              style={{ transform: `rotateY(-90deg) translateZ(${size / 2}px)` }}
            />
          </div>
        );
      case "ring":
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-full border-2 border-accent/15"
          />
        );
      case "diamond":
        return (
          <div
            style={{ width: size * 0.7, height: size * 0.7 }}
            className="border border-accent/20 bg-accent/5 rotate-45"
          />
        );
    }
  };

  return (
    <motion.div
      className="absolute pointer-events-none z-0"
      style={{
        top,
        left,
        perspective: 600,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay }}
    >
      <motion.div
        variants={rotateVariants}
        animate="animate"
        style={{ transformStyle: "preserve-3d" }}
      >
        {shapeElement()}
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const infoItemVariants = {
  hidden: { opacity: 0, x: -40, rotateY: -8 },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const socialVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

/* ------------------------------------------------------------------ */
/*  Input styles with focus glow                                       */
/* ------------------------------------------------------------------ */

const inputBaseStyles = [
  "w-full bg-background border border-card-border rounded-lg px-4 py-3 text-white",
  "placeholder:text-muted/50",
  "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40",
  "focus:shadow-[0_0_15px_rgba(0,102,255,0.15),0_0_30px_rgba(0,102,255,0.05)]",
  "transition-all duration-300 ease-out",
].join(" ");

const selectStyles = `${inputBaseStyles} text-muted appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2020%2020%27%3E%3Cpath%20stroke%3D%27%23a1a1aa%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%271.5%27%20d%3D%27m6%208%204%204%204-4%27%2F%3E%3C%2Fsvg%3E")] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`;

/* ------------------------------------------------------------------ */
/*  Contact Component                                                  */
/* ------------------------------------------------------------------ */

export default function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      {/* Large subtle background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] md:w-[1000px] md:h-[1000px] pointer-events-none">
        <div className="absolute inset-0 bg-accent/[0.04] rounded-full blur-[250px]" />
        <div className="absolute inset-[15%] bg-[#00d4ff]/[0.03] rounded-full blur-[200px]" />
      </div>

      {/* 3D Floating decorative elements (hidden on mobile) */}
      <div className="hidden sm:block">
        {floatingShapes.map((shape, i) => (
          <FloatingShape key={i} {...shape} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          eyebrow="Get In Touch"
          title="Let's Build Something Great"
          description="Ready to start your project? Book a free consultation call."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 max-w-5xl mx-auto">
          {/* -------------------------------------------------------- */}
          {/*  Left Column — Contact Info                              */}
          {/* -------------------------------------------------------- */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col justify-between"
            style={{ perspective: 800 }}
          >
            <div className="space-y-8">
              {contactInfo.map((item) => (
                <motion.div
                  key={item.label}
                  variants={infoItemVariants}
                  className="flex items-start gap-4 group"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Icon box with 3D pop */}
                  <motion.div
                    className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shadow-[0_0_20px_rgba(0,102,255,0.08)]"
                    whileHover={{
                      scale: 1.1,
                      rotateY: 15,
                      boxShadow: "0 0 30px rgba(0,102,255,0.2)",
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" as const }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {item.icon}
                  </motion.div>

                  <div>
                    <p className="text-sm text-muted mb-1">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-white font-medium hover:text-accent transition-colors duration-300"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-white font-medium">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.45,
                    ease: "easeOut" as const,
                    staggerChildren: 0.08,
                    delayChildren: 0.55,
                  },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-12"
            >
              <p className="text-sm font-semibold text-muted uppercase tracking-widest mb-4">
                Follow us
              </p>
              <div className="flex gap-3">
                {socials.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    variants={socialVariants}
                    whileHover={{
                      scale: 1.15,
                      rotateY: 12,
                      boxShadow: "0 0 20px rgba(0,102,255,0.15)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.25, ease: "easeOut" as const }}
                    className="w-10 h-10 rounded-lg bg-card-bg border border-card-border flex items-center justify-center text-muted hover:text-accent hover:border-accent/30 transition-colors duration-300"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* -------------------------------------------------------- */}
          {/*  Right Column — Form inside TiltCard                     */}
          {/* -------------------------------------------------------- */}
          <div style={{ perspective: 1200 }}>
            <TiltCard tiltAmount={5} glare={true} className="p-5 sm:p-8">
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                {/* Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium text-muted mb-1.5"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    placeholder="Your name"
                    className={inputBaseStyles}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium text-muted mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    placeholder="you@company.com"
                    className={inputBaseStyles}
                  />
                </div>

                {/* Project Type */}
                <div>
                  <label
                    htmlFor="contact-project"
                    className="block text-sm font-medium text-muted mb-1.5"
                  >
                    Project Type
                  </label>
                  <select id="contact-project" className={selectStyles}>
                    {projectTypes.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget Range */}
                <div>
                  <label
                    htmlFor="contact-budget"
                    className="block text-sm font-medium text-muted mb-1.5"
                  >
                    Budget Range
                  </label>
                  <select id="contact-budget" className={selectStyles}>
                    {budgetRanges.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-medium text-muted mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Tell us about your project..."
                    className={`${inputBaseStyles} resize-none`}
                  />
                </div>

                {/* Submit */}
                <Button variant="primary" className="w-full">
                  Send Message
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                </Button>
              </form>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}

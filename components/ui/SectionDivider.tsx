"use client";

import { motion } from "framer-motion";

interface SectionDividerProps {
  variant?: "gradient" | "glow" | "fade";
  className?: string;
}

export default function SectionDivider({ variant = "gradient", className = "" }: SectionDividerProps) {
  if (variant === "fade") {
    return (
      <div className={`relative h-32 -my-16 ${className}`}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(0,102,255,0.03) 50%, transparent 100%)",
          }}
        />
      </div>
    );
  }

  if (variant === "glow") {
    return (
      <div className={`relative py-8 ${className}`}>
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.25, 0.4, 0.25, 1] as const }}
          className="mx-auto max-w-xs h-px origin-center"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(0,102,255,0.4), rgba(0,212,255,0.5), rgba(0,102,255,0.4), transparent)",
            boxShadow: "0 0 20px rgba(0,102,255,0.2), 0 0 60px rgba(0,102,255,0.1)",
          }}
        />
      </div>
    );
  }

  // Default: gradient
  return (
    <div className={`relative py-4 ${className}`}>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] as const }}
        className="mx-auto w-full max-w-7xl h-px origin-center"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(30,30,30,1) 20%, rgba(30,30,30,1) 80%, transparent)",
        }}
      />
    </div>
  );
}

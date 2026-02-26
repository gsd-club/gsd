"use client";

import { motion } from "framer-motion";
import TextReveal from "./TextReveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  center = true,
}: SectionHeadingProps) {
  return (
    <div className={`mb-16 ${center ? "text-center" : ""}`}>
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="font-mono text-sm tracking-widest text-accent uppercase mb-4 block"
        >
          {eyebrow}
        </motion.span>
      )}
      <TextReveal
        tag="h2"
        animation="fade-up"
        type="words"
        trigger="scroll"
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
      >
        {title}
      </TextReveal>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-muted text-lg max-w-2xl mx-auto"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

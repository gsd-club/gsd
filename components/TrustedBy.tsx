"use client";

import { motion } from "framer-motion";

export default function TrustedBy() {
  return (
    <section className="py-16 border-y border-card-border bg-card-bg/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-mono text-muted/60 tracking-widest uppercase mb-8">
            Trusted by teams building the future
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-16 opacity-40">
            {/* Placeholder logos - replace with real client logos */}
            {["Startup Co", "TechFlow", "BuildLab", "ScaleAI", "DevForge"].map(
              (name) => (
                <span
                  key={name}
                  className="text-base sm:text-lg font-semibold text-white/50 tracking-wide"
                >
                  {name}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

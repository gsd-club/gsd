"use client";

import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = true,
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={hover ? { y: -5, borderColor: "rgba(0, 102, 255, 0.3)" } : {}}
      className={`bg-card-bg border border-card-border rounded-xl p-6 transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";

interface MeshGradientProps {
  className?: string;
  animate?: boolean;
}

// Each layer defines a radial gradient that slowly shifts position over time
const layers = [
  {
    color: "rgba(0, 102, 255, 0.25)",
    initialX: "20%",
    initialY: "30%",
    animateX: ["20%", "60%", "40%", "80%", "20%"],
    animateY: ["30%", "70%", "20%", "50%", "30%"],
    size: "50%",
    opacity: 0.2,
  },
  {
    color: "rgba(0, 212, 255, 0.2)",
    initialX: "70%",
    initialY: "20%",
    animateX: ["70%", "30%", "80%", "50%", "70%"],
    animateY: ["20%", "60%", "40%", "80%", "20%"],
    size: "45%",
    opacity: 0.18,
  },
  {
    color: "rgba(102, 0, 255, 0.15)",
    initialX: "50%",
    initialY: "70%",
    animateX: ["50%", "20%", "70%", "40%", "50%"],
    animateY: ["70%", "30%", "60%", "20%", "70%"],
    size: "55%",
    opacity: 0.15,
  },
  {
    color: "rgba(0, 255, 170, 0.1)",
    initialX: "80%",
    initialY: "60%",
    animateX: ["80%", "40%", "20%", "60%", "80%"],
    animateY: ["60%", "20%", "70%", "40%", "60%"],
    size: "40%",
    opacity: 0.15,
  },
  {
    color: "rgba(0, 150, 255, 0.18)",
    initialX: "30%",
    initialY: "50%",
    animateX: ["30%", "70%", "50%", "20%", "30%"],
    animateY: ["50%", "80%", "30%", "60%", "50%"],
    size: "48%",
    opacity: 0.2,
  },
];

export default function MeshGradient({
  className = "",
  animate = true,
}: MeshGradientProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {layers.map((layer, i) => {
        // Build the radial gradient background string for the initial state
        const bgInitial = `radial-gradient(circle at ${layer.initialX} ${layer.initialY}, ${layer.color} 0%, transparent ${layer.size})`;

        if (!animate) {
          return (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                background: bgInitial,
                opacity: layer.opacity,
              }}
            />
          );
        }

        // Build an array of background strings for each keyframe position
        const backgrounds = layer.animateX.map(
          (x, j) =>
            `radial-gradient(circle at ${x} ${layer.animateY[j]}, ${layer.color} 0%, transparent ${layer.size})`
        );

        return (
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={{ background: bgInitial, opacity: layer.opacity }}
            animate={{ background: backgrounds }}
            transition={{
              repeat: Infinity,
              duration: 20 + i * 3,
              ease: "linear" as const,
            }}
            style={{ opacity: layer.opacity }}
          />
        );
      })}
    </div>
  );
}

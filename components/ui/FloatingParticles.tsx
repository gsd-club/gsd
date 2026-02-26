"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

// Simple seeded pseudo-random number generator for deterministic output
function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function lerp(min: number, max: number, t: number) {
  return min + (max - min) * t;
}

const COLORS = ["#0066ff", "#00d4ff", "#0066ff", "#00d4ff", "#ffffff"];

interface Particle {
  id: number;
  x: number; // percent
  y: number; // percent
  size: number; // px
  opacity: number;
  color: string;
  blur: number; // px
  yRange: number; // px to float up/down
  xDrift: number; // px to drift left/right
  duration: number; // seconds
  delay: number; // seconds
  isBokeh: boolean;
}

interface ConnectionLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
}

function generateParticles(count: number): Particle[] {
  const rand = createSeededRandom(42);
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    // Roughly 15% of particles are bokeh (larger, blurred)
    const isBokeh = rand() < 0.15;

    const size = isBokeh
      ? lerp(8, 15, rand())
      : lerp(2, 6, rand());

    const opacity = isBokeh
      ? lerp(0.08, 0.25, rand())
      : lerp(0.1, 0.5, rand());

    const blur = isBokeh
      ? lerp(4, 10, rand())
      : lerp(0, 1, rand());

    particles.push({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      size,
      opacity,
      color: COLORS[Math.floor(rand() * COLORS.length)],
      blur,
      yRange: lerp(20, 80, rand()),
      xDrift: lerp(-20, 20, rand()),
      duration: lerp(8, 20, rand()),
      delay: lerp(0, 5, rand()),
      isBokeh,
    });
  }

  return particles;
}

function generateConnections(particles: Particle[]): ConnectionLine[] {
  const lines: ConnectionLine[] = [];
  const maxDistance = 18; // percent units
  const maxLines = 8;

  for (let i = 0; i < particles.length && lines.length < maxLines; i++) {
    for (let j = i + 1; j < particles.length && lines.length < maxLines; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxDistance && dist > 5) {
        const opacity = lerp(0.04, 0.1, 1 - dist / maxDistance);
        lines.push({
          id: `${i}-${j}`,
          x1: particles[i].x,
          y1: particles[i].y,
          x2: particles[j].x,
          y2: particles[j].y,
          opacity,
        });
      }
    }
  }

  return lines;
}

export default function FloatingParticles({
  count = 30,
  className = "",
}: FloatingParticlesProps) {
  const particles = useMemo(() => generateParticles(count), [count]);
  const connections = useMemo(() => generateConnections(particles), [particles]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {/* SVG layer for connecting lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {connections.map((line) => (
          <motion.line
            key={line.id}
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke="#0066ff"
            strokeWidth={0.5}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, line.opacity, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {/* Particle layer */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            filter: particle.blur > 0 ? `blur(${particle.blur}px)` : undefined,
            boxShadow: particle.isBokeh
              ? `0 0 ${particle.size * 2}px ${particle.color}`
              : undefined,
          }}
          animate={{
            y: [0, -particle.yRange, 0],
            x: [0, particle.xDrift, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            repeatType: "reverse",
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

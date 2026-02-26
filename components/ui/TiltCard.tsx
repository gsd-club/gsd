"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltAmount?: number;
  glare?: boolean;
}

interface TiltState {
  rotateX: number;
  rotateY: number;
  mouseX: number;
  mouseY: number;
}

const initialTilt: TiltState = {
  rotateX: 0,
  rotateY: 0,
  mouseX: 0.5,
  mouseY: 0.5,
};

export default function TiltCard({
  children,
  className = "",
  tiltAmount = 15,
  glare = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [tilt, setTilt] = useState<TiltState>(initialTilt);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      // Cancel any pending rAF to avoid stacking
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const rect = cardRef.current!.getBoundingClientRect();

        // Normalized position from 0 to 1
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // Center-relative position from -0.5 to 0.5
        const centerX = x - 0.5;
        const centerY = y - 0.5;

        // Tilt angles: rotateX is driven by vertical position (inverted),
        // rotateY is driven by horizontal position
        const rotateX = -centerY * tiltAmount * 2;
        const rotateY = centerX * tiltAmount * 2;

        setTilt({
          rotateX,
          rotateY,
          mouseX: x,
          mouseY: y,
        });

        rafRef.current = null;
      });
    },
    [tiltAmount]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setTilt(initialTilt);
  }, []);

  const cardTransform = `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${isHovering ? 1.02 : 1}, ${isHovering ? 1.02 : 1}, 1)`;

  const glareBackground = `radial-gradient(
    circle at ${tilt.mouseX * 100}% ${tilt.mouseY * 100}%,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.05) 40%,
    transparent 70%
  )`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-50px" }}
      className="will-change-transform"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: cardTransform,
          transition: isHovering
            ? "transform 0.1s ease-out"
            : "transform 0.4s ease-out",
        }}
        className={`relative overflow-hidden bg-card-bg border border-card-border rounded-xl ${className}`}
      >
        {/* Glare / spotlight overlay */}
        {glare && (
          <div
            aria-hidden="true"
            style={{
              background: glareBackground,
              opacity: isHovering ? 1 : 0,
              transition: "opacity 0.3s ease-out",
            }}
            className="pointer-events-none absolute inset-0 z-10 rounded-xl"
          />
        )}

        {/* Content wrapper with 3D depth preservation */}
        <div style={{ transformStyle: "preserve-3d" }}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

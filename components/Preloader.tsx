"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const countRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Counting animation — uses requestAnimationFrame for smooth updates
  // over ~2.5 seconds, eased so it starts fast and decelerates toward 100
  useEffect(() => {
    const duration = 2500; // ms
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const linearProgress = Math.min(elapsed / duration, 1);

      // Ease-out cubic: fast start, gentle arrival at 100
      const eased = 1 - Math.pow(1 - linearProgress, 3);
      const value = Math.round(eased * 100);

      if (value !== countRef.current) {
        countRef.current = value;
        setCount(value);
      }

      if (linearProgress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Ensure we land exactly on 100
        countRef.current = 100;
        setCount(100);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // GSAP exit animation — fires when counter reaches 100
  const handleExit = useCallback(() => {
    if (!preloaderRef.current || isExiting) return;
    setIsExiting(true);

    const el = preloaderRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsDone(true);
        onComplete?.();
      },
    });

    // Phase 1: Fade the inner content (counter, brand, corners) quickly
    tl.to(el.querySelectorAll(".preloader-content"), {
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.in",
    });

    // Phase 2: Circle-shrink clip-path — the preloader collapses inward
    // from full coverage to nothing, revealing the site underneath
    tl.fromTo(
      el,
      { clipPath: "circle(100% at 50% 50%)" },
      {
        clipPath: "circle(0% at 50% 50%)",
        duration: 0.9,
        ease: "power3.inOut",
      },
      "-=0.05"
    );
  }, [isExiting, onComplete]);

  // Trigger exit when count hits 100
  useEffect(() => {
    if (count === 100) {
      // Small pause at 100 before exit so users register the number
      const timer = setTimeout(handleExit, 300);
      return () => clearTimeout(timer);
    }
  }, [count, handleExit]);

  // Once done, remove from DOM entirely
  if (isDone) return null;

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0a0a0a]"
      style={{ clipPath: "circle(100% at 50% 50%)" }}
      aria-hidden="true"
    >
      {/* Subtle radial gradient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,102,255,0.06)_0%,_transparent_70%)]" />

      {/* Brand name — fades in early and sits above the counter */}
      <motion.div
        className="preloader-content absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
      >
        {/* GSD brand */}
        <motion.span
          className="font-mono text-sm tracking-[0.3em] uppercase text-accent-glow/60"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" as const }}
        >
          GSD CLUB
        </motion.span>

        {/* Counter */}
        <div className="relative">
          <span className="font-mono text-8xl md:text-9xl font-bold tabular-nums text-foreground leading-none">
            {String(count).padStart(3, "0")}
          </span>

          {/* Subtle glow behind the number */}
          <div
            className="absolute inset-0 blur-3xl opacity-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(0,102,255,0.4) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Progress bar */}
        <div className="w-48 md:w-64 h-[1px] bg-white/10 rounded-full overflow-hidden mt-2">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #0066ff, #00d4ff)",
              width: `${count}%`,
            }}
            transition={{ duration: 0.05, ease: "linear" as const }}
          />
        </div>

        {/* Minimal tagline that fades in mid-way */}
        <AnimatePresence>
          {count > 30 && (
            <motion.p
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted/50 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: "easeOut" as const,
              }}
            >
              Loading experience
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Corner markers for cinematic framing */}
      <div className="preloader-content absolute top-6 left-6 w-4 h-4 border-l border-t border-white/10" />
      <div className="preloader-content absolute top-6 right-6 w-4 h-4 border-r border-t border-white/10" />
      <div className="preloader-content absolute bottom-6 left-6 w-4 h-4 border-l border-b border-white/10" />
      <div className="preloader-content absolute bottom-6 right-6 w-4 h-4 border-r border-b border-white/10" />
    </div>
  );
}

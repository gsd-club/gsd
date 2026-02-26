"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";

// Interactive element selectors for hover detection
const INTERACTIVE_SELECTORS = ["a", "button", '[role="button"]'];

function isInteractiveElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return INTERACTIVE_SELECTORS.some(
    (selector) => target.matches(selector) || target.closest(selector) !== null
  );
}

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Raw mouse position tracked with motion values for performance
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring-animated values for the ring (lagging follow)
  const ringX = useSpring(cursorX, { stiffness: 150, damping: 20, mass: 0.5 });
  const ringY = useSpring(cursorY, { stiffness: 150, damping: 20, mass: 0.5 });

  // Spring-animated values for the dot (snappy follow)
  const dotX = useSpring(cursorX, { stiffness: 800, damping: 35, mass: 0.2 });
  const dotY = useSpring(cursorY, { stiffness: 800, damping: 35, mass: 0.2 });

  // Check if device is desktop (no touch + wide enough viewport)
  useEffect(() => {
    const checkDesktop = () => {
      const isWide = window.innerWidth >= 768;
      const hasNoTouch = !window.matchMedia("(pointer: coarse)").matches;
      setIsDesktop(isWide && hasNoTouch);
    };

    checkDesktop();

    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const handlePointerChange = () => checkDesktop();
    mediaQuery.addEventListener("change", handlePointerChange);

    window.addEventListener("resize", checkDesktop);

    return () => {
      mediaQuery.removeEventListener("change", handlePointerChange);
      window.removeEventListener("resize", checkDesktop);
    };
  }, []);

  // Inject cursor: none on the body when active
  useEffect(() => {
    if (!isDesktop) return;

    document.body.style.cursor = "none";

    // Also hide cursor on all interactive elements
    const style = document.createElement("style");
    style.id = "custom-cursor-style";
    style.textContent = `
      *, *::before, *::after {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.body.style.cursor = "";
      const injectedStyle = document.getElementById("custom-cursor-style");
      if (injectedStyle) injectedStyle.remove();
    };
  }, [isDesktop]);

  // Mouse move handler
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      // Check if hovering over an interactive element
      setIsHovering(isInteractiveElement(e.target));
    },
    [cursorX, cursorY, isVisible]
  );

  // Mouse down/up handlers for click pulse
  const handleMouseDown = useCallback(() => {
    setIsClicking(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    // Keep the click state briefly for the pulse animation
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      setIsClicking(false);
    }, 150);
  }, []);

  // Mouse leave handler — hide cursor when it leaves the viewport
  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  // Mouseover delegation for hover detection (more efficient than per-element listeners)
  const handleMouseOver = useCallback((e: MouseEvent) => {
    setIsHovering(isInteractiveElement(e.target));
  }, []);

  // Attach global listeners
  useEffect(() => {
    if (!isDesktop) return;

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
      document.documentElement.removeEventListener(
        "mouseenter",
        handleMouseEnter
      );
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, [
    isDesktop,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleMouseOver,
    handleMouseLeave,
    handleMouseEnter,
  ]);

  // Don't render on mobile/touch devices
  if (!isDesktop) return null;

  const dotSize = 8;
  const ringSize = isHovering ? 60 : 40;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Dot - follows mouse precisely */}
          <motion.div
            className="fixed top-0 left-0 z-[9999] pointer-events-none"
            style={{
              x: dotX,
              y: dotY,
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: isClicking ? 0.5 : 1,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              opacity: { duration: 0.2 },
              scale: { type: "spring", stiffness: 500, damping: 25 },
            }}
          >
            <div
              style={{
                width: dotSize,
                height: dotSize,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0066ff, #00d4ff)",
                boxShadow:
                  "0 0 8px rgba(0, 102, 255, 0.6), 0 0 20px rgba(0, 212, 255, 0.3)",
              }}
            />
          </motion.div>

          {/* Ring - follows with spring lag */}
          <motion.div
            className="fixed top-0 left-0 z-[9999] pointer-events-none"
            style={{
              x: ringX,
              y: ringY,
              translateX: "-50%",
              translateY: "-50%",
              mixBlendMode: "difference",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: isHovering ? 0.9 : 0.6,
              scale: isClicking ? 0.75 : 1,
              width: ringSize,
              height: ringSize,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              opacity: { duration: 0.2 },
              scale: {
                type: "spring",
                stiffness: 400,
                damping: 20,
              },
              width: {
                type: "spring",
                stiffness: 300,
                damping: 20,
              },
              height: {
                type: "spring",
                stiffness: 300,
                damping: 20,
              },
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: "1.5px solid rgba(0, 102, 255, 0.5)",
                boxShadow:
                  "0 0 10px rgba(0, 102, 255, 0.15), inset 0 0 10px rgba(0, 212, 255, 0.05)",
                background: isHovering
                  ? "radial-gradient(circle, rgba(0, 102, 255, 0.08) 0%, transparent 70%)"
                  : "transparent",
                transition: "background 0.3s ease",
              }}
            />
          </motion.div>

          {/* Click pulse ring - appears briefly on click */}
          {isClicking && (
            <motion.div
              className="fixed top-0 left-0 z-[9998] pointer-events-none"
              style={{
                x: dotX,
                y: dotY,
                translateX: "-50%",
                translateY: "-50%",
              }}
              initial={{ opacity: 0.6, scale: 0.5 }}
              animate={{ opacity: 0, scale: 2.5 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "1px solid rgba(0, 212, 255, 0.4)",
                  boxShadow: "0 0 15px rgba(0, 102, 255, 0.2)",
                }}
              />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

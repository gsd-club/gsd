"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type AnimationStyle = "fade-up" | "blur-in" | "slide-left" | "typewriter";
type SplitType = "chars" | "words";
type TriggerType = "mount" | "scroll";
type TagType = "h1" | "h2" | "h3" | "p" | "span";

interface TextRevealProps {
  children: string;
  /** Split text by characters or words */
  type?: SplitType;
  /** Animate on mount or when scrolled into view */
  trigger?: TriggerType;
  /** Delay between each element in seconds */
  stagger?: number;
  /** Animation style */
  animation?: AnimationStyle;
  /** Additional CSS classes */
  className?: string;
  /** Wrapper HTML element */
  tag?: TagType;
  /** Initial delay in seconds */
  delay?: number;
}

export default function TextReveal({
  children,
  type = "words",
  trigger = "scroll",
  stagger,
  animation = "fade-up",
  className = "",
  tag: Tag = "p",
  delay = 0,
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const defaultStagger = stagger ?? (type === "chars" ? 0.03 : 0.08);

  const splitText = useCallback((): string[] => {
    if (type === "chars") {
      return children.split("");
    }
    return children.split(/\s+/).filter(Boolean);
  }, [children, type]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const elements = container.querySelectorAll<HTMLSpanElement>("[data-reveal-el]");

    if (elements.length === 0) return;

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline({
      paused: trigger === "scroll",
      delay,
    });

    timelineRef.current = tl;

    // Set up initial states and animation based on style
    switch (animation) {
      case "fade-up": {
        gsap.set(elements, { y: "100%", opacity: 0 });
        tl.to(elements, {
          y: "0%",
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: defaultStagger,
        });
        break;
      }
      case "blur-in": {
        gsap.set(elements, { filter: "blur(8px)", opacity: 0 });
        tl.to(elements, {
          filter: "blur(0px)",
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: defaultStagger,
        });
        break;
      }
      case "slide-left": {
        gsap.set(elements, { x: 40, opacity: 0 });
        tl.to(elements, {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: defaultStagger,
        });
        break;
      }
      case "typewriter": {
        gsap.set(elements, { opacity: 0 });
        tl.to(elements, {
          opacity: 1,
          duration: 0.05,
          ease: "none",
          stagger: defaultStagger,
        });
        // Animate the cursor: visible during typing, blink after
        const cursor = container.querySelector<HTMLSpanElement>("[data-cursor]");
        if (cursor) {
          // Keep cursor visible during typing
          gsap.set(cursor, { opacity: 1 });
          // After typing finishes, blink the cursor
          tl.to(
            cursor,
            {
              opacity: 0,
              repeat: -1,
              yoyo: true,
              duration: 0.5,
              ease: "steps(1)",
            },
            ">"
          );
        }
        break;
      }
    }

    // ScrollTrigger setup
    let scrollTriggerInstance: ScrollTrigger | null = null;

    if (trigger === "scroll") {
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: container,
        start: "top 85%",
        onEnter: () => tl.play(),
        once: true,
      });
    } else {
      tl.play();
    }

    return () => {
      tl.kill();
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
    };
  }, [children, type, trigger, defaultStagger, animation, delay]);

  const pieces = splitText();

  // Determine if we need overflow hidden wrappers (for fade-up)
  const needsOverflowHidden = animation === "fade-up";

  return (
    <Tag ref={containerRef as React.RefObject<never>} className={className}>
      {pieces.map((piece, i) => {
        const isSpace = type === "chars" && piece === " ";

        if (isSpace) {
          return (
            <span key={i} style={{ display: "inline-block", width: "0.3em" }}>
              &nbsp;
            </span>
          );
        }

        const inner = (
          <span
            data-reveal-el=""
            style={{
              display: "inline-block",
              willChange: "transform, opacity, filter",
            }}
          >
            {piece}
          </span>
        );

        if (needsOverflowHidden) {
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                overflow: "hidden",
                verticalAlign: "bottom",
              }}
            >
              {inner}
              {type === "words" && i < pieces.length - 1 ? (
                <span style={{ display: "inline-block", width: "0.3em" }}>&nbsp;</span>
              ) : null}
            </span>
          );
        }

        return (
          <span key={i} style={{ display: "inline-block" }}>
            {inner}
            {type === "words" && i < pieces.length - 1 ? (
              <span style={{ display: "inline-block", width: "0.3em" }}>&nbsp;</span>
            ) : null}
          </span>
        );
      })}
      {animation === "typewriter" && (
        <span
          data-cursor=""
          style={{
            display: "inline-block",
            width: "2px",
            height: "1em",
            backgroundColor: "currentColor",
            marginLeft: "2px",
            verticalAlign: "text-bottom",
            opacity: 0,
          }}
        />
      )}
    </Tag>
  );
}

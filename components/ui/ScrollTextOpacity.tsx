"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type TagType = "p" | "h2" | "h3";

interface ScrollTextOpacityProps {
  children: string;
  /** Additional CSS classes */
  className?: string;
  /** Wrapper HTML element */
  tag?: TagType;
}

export default function ScrollTextOpacity({
  children,
  className = "",
  tag: Tag = "p",
}: ScrollTextOpacityProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const words = children.split(/\s+/).filter(Boolean);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const wordElements = container.querySelectorAll<HTMLSpanElement>("[data-word]");

    if (wordElements.length === 0) return;

    // Set all words to the dim starting opacity
    gsap.set(wordElements, { opacity: 0.15 });

    // Create a timeline that scrubs with scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 0.5,
      },
    });

    // Stagger each word's opacity from 0.15 → 1 across the scroll duration
    wordElements.forEach((word, i) => {
      const startPos = i / wordElements.length;
      const endPos = startPos + 1 / wordElements.length;

      tl.to(
        word,
        {
          opacity: 1,
          duration: endPos - startPos,
          ease: "none",
        },
        startPos
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === container) t.kill();
      });
    };
  }, [children]);

  return (
    <div ref={containerRef} className={`min-h-[50vh] ${className}`}>
      <Tag
        className="sticky top-1/3"
        style={{ lineHeight: 1.6 }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            data-word=""
            style={{
              display: "inline-block",
              opacity: 0.15,
              willChange: "opacity",
              transition: "none",
            }}
          >
            {word}
            {i < words.length - 1 && (
              <span style={{ display: "inline-block", width: "0.3em" }}>&nbsp;</span>
            )}
          </span>
        ))}
      </Tag>
    </div>
  );
}

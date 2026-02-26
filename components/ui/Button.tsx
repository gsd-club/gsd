"use client";

import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
  magnetic?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  magnetic = true,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 cursor-pointer";

  const variants = {
    primary:
      "bg-accent text-white hover:bg-blue-600 glow",
    secondary:
      "bg-white/10 text-white hover:bg-white/20 border border-white/10",
    outline:
      "border border-accent text-accent hover:bg-accent/10",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const inner = href ? (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={combinedClassName}
    >
      {children}
    </motion.a>
  ) : (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={combinedClassName}
    >
      {children}
    </motion.button>
  );

  if (magnetic) {
    return <MagneticButton strength={0.25}>{inner}</MagneticButton>;
  }

  return inner;
}

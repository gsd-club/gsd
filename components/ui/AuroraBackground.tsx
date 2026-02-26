"use client";

interface AuroraBackgroundProps {
  className?: string;
  intensity?: "subtle" | "medium" | "strong";
  colors?: string[];
}

const intensityOpacity = {
  subtle: 0.3,
  medium: 0.5,
  strong: 0.7,
} as const;

const defaultColors = ["#0066ff", "#00d4ff", "#6600ff", "#00ffaa"];

export default function AuroraBackground({
  className = "",
  intensity = "subtle",
  colors = defaultColors,
}: AuroraBackgroundProps) {
  const opacity = intensityOpacity[intensity];

  // Each blob has its own animation, size, position, blur, and color
  const blobs = [
    {
      animation: "aurora-drift-1",
      color: colors[0] ?? defaultColors[0],
      size: "60%",
      blur: "120px",
      top: "-20%",
      left: "-10%",
      borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
    },
    {
      animation: "aurora-drift-2",
      color: colors[1] ?? defaultColors[1],
      size: "50%",
      blur: "100px",
      top: "10%",
      right: "-15%",
      borderRadius: "60% 40% 30% 70% / 50% 60% 40% 50%",
    },
    {
      animation: "aurora-drift-3",
      color: colors[2] ?? defaultColors[2],
      size: "45%",
      blur: "90px",
      bottom: "-10%",
      left: "20%",
      borderRadius: "50% 60% 40% 60% / 60% 40% 60% 40%",
    },
    {
      animation: "aurora-drift-4",
      color: colors[3] ?? defaultColors[3],
      size: "40%",
      blur: "80px",
      bottom: "5%",
      right: "10%",
      borderRadius: "70% 30% 50% 50% / 30% 60% 40% 70%",
    },
  ];

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {blobs.map((blob, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: blob.size,
            height: blob.size,
            top: blob.top,
            left: blob.left,
            right: blob.right,
            bottom: blob.bottom,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            borderRadius: blob.borderRadius,
            filter: `blur(${blob.blur})`,
            opacity,
            mixBlendMode: "screen",
            animation: `${blob.animation} ${18 + i * 4}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

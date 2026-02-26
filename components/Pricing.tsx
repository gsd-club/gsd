"use client";

import { motion } from "framer-motion";
import SectionHeading from "./ui/SectionHeading";
import TiltCard from "./ui/TiltCard";
import Button from "./ui/Button";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const tiers = [
  {
    name: "Starter",
    price: "$2,499",
    period: "/project",
    description: "Perfect for landing pages and simple websites",
    features: [
      "Custom design",
      "Up to 5 pages",
      "Mobile responsive",
      "Basic SEO",
      "1 round of revisions",
      "2-week delivery",
    ],
    cta: "Get Started",
    variant: "outline" as const,
    popular: false,
    tilt: 8,
  },
  {
    name: "Professional",
    price: "$4,999",
    period: "/project",
    description: "For web apps and complex projects",
    features: [
      "Everything in Starter",
      "Up to 15 pages/screens",
      "Authentication & database",
      "API integrations",
      "AI features included",
      "3 rounds of revisions",
      "30-day support",
    ],
    cta: "Get Started",
    variant: "primary" as const,
    popular: true,
    tilt: 12,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large-scale platforms and ongoing work",
    features: [
      "Everything in Professional",
      "Unlimited pages/screens",
      "Custom AI workflows",
      "Priority support",
      "Dedicated team",
      "Ongoing maintenance",
    ],
    cta: "Contact Us",
    variant: "outline" as const,
    popular: false,
    tilt: 8,
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const popularCardVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const featureVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

const featureListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.2,
    },
  },
};

/* ------------------------------------------------------------------ */
/*  Subcomponents                                                      */
/* ------------------------------------------------------------------ */

function CheckIcon({ popular }: { popular?: boolean }) {
  return (
    <svg
      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
        popular ? "text-[#00d4ff]" : "text-accent"
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

/**
 * Animated rotating conic-gradient border wrapper.
 * A container div carries the rotating gradient background;
 * the inner div uses bg-card-bg and a 1.5 px inset to create
 * the illusion of a glowing animated border.
 */
function AnimatedBorderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl p-[1.5px] overflow-hidden">
      {/* Rotating conic-gradient layer */}
      <div
        aria-hidden="true"
        className="absolute inset-0 animate-[border-spin_4s_linear_infinite]"
        style={{
          background:
            "conic-gradient(from 0deg, #0066ff, #00d4ff, #0066ff, #00d4ff, #0066ff)",
        }}
      />

      {/* Ambient glow behind the card */}
      <div
        aria-hidden="true"
        className="absolute inset-0 blur-xl opacity-40 animate-[border-spin_4s_linear_infinite]"
        style={{
          background:
            "conic-gradient(from 0deg, #0066ff, #00d4ff, #0066ff, #00d4ff, #0066ff)",
        }}
      />

      {/* Inner card surface */}
      <div className="relative bg-card-bg rounded-2xl overflow-hidden">
        {children}
      </div>

    </div>
  );
}

function PopularBadge() {
  return (
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
      <span
        className="px-5 py-1.5 text-xs font-mono font-bold tracking-widest bg-accent text-white rounded-full uppercase whitespace-nowrap animate-[glow-pulse_2s_ease-in-out_infinite]"
        style={{
          boxShadow:
            "0 0 10px 2px rgba(0,212,255,0.5), 0 0 24px 6px rgba(0,102,255,0.3)",
        }}
      >
        Most Popular
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card renderers                                                     */
/* ------------------------------------------------------------------ */

function PricingCardContent({
  tier,
}: {
  tier: (typeof tiers)[number];
}) {
  return (
    <div className="p-6 lg:p-8 flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <h3
          className={`text-xl font-bold mb-1 ${
            tier.popular ? "gradient-text" : ""
          }`}
        >
          {tier.name}
        </h3>
        <p className="text-muted text-sm">{tier.description}</p>
      </div>

      {/* Price */}
      <div className="mb-8">
        <span
          className={`text-5xl font-extrabold tracking-tight ${
            tier.popular ? "gradient-text" : ""
          }`}
        >
          {tier.price}
        </span>
        {tier.period && (
          <span className="text-muted text-sm ml-1">{tier.period}</span>
        )}
      </div>

      {/* Features */}
      <motion.ul
        variants={featureListVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-3 mb-8 flex-1"
      >
        {tier.features.map((feature) => (
          <motion.li
            key={feature}
            variants={featureVariants}
            className="flex items-start gap-3 text-sm"
          >
            <CheckIcon popular={tier.popular} />
            <span className={tier.popular ? "text-foreground" : "text-muted"}>
              {feature}
            </span>
          </motion.li>
        ))}
      </motion.ul>

      {/* CTA */}
      <Button
        href="#contact"
        variant={tier.variant}
        size="lg"
        className="w-full"
      >
        {tier.cta}
      </Button>
    </div>
  );
}

function StandardCard({ tier }: { tier: (typeof tiers)[number] }) {
  return (
    <motion.div variants={cardVariants}>
      <TiltCard
        tiltAmount={tier.tilt}
        glare
        className="h-full"
      >
        <PricingCardContent tier={tier} />
      </TiltCard>
    </motion.div>
  );
}

function PopularCard({ tier }: { tier: (typeof tiers)[number] }) {
  return (
    <motion.div
      variants={popularCardVariants}
      className="lg:-my-6 lg:scale-105 relative z-10"
    >
      <AnimatedBorderWrapper>
        <TiltCard
          tiltAmount={tier.tilt}
          glare
          className="h-full !border-0 !rounded-2xl"
        >
          <PopularBadge />

          {/* Subtle top-edge accent glow inside card */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, #00d4ff, transparent)",
            }}
          />

          {/* Background radial highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, #00d4ff 0%, transparent 60%)",
            }}
          />

          <PricingCardContent tier={tier} />
        </TiltCard>
      </AnimatedBorderWrapper>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 relative overflow-hidden bg-[#060611]">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-[0.04]"
        style={{
          background:
            "radial-gradient(ellipse, #0066ff 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Transparent Pricing"
          description="No hidden fees. No surprises. Choose the plan that fits your project."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 max-w-5xl mx-auto items-center"
        >
          {tiers.map((tier) =>
            tier.popular ? (
              <PopularCard key={tier.name} tier={tier} />
            ) : (
              <StandardCard key={tier.name} tier={tier} />
            )
          )}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" as const }}
          viewport={{ once: true }}
          className="text-center text-muted text-sm mt-16"
        >
          All plans include:{" "}
          <span className="text-foreground font-medium">
            Free consultation
          </span>
          {" | "}
          <span className="text-foreground font-medium">
            Source code ownership
          </span>
          {" | "}
          <span className="text-foreground font-medium">
            Deployment assistance
          </span>
        </motion.p>
      </div>
    </section>
  );
}

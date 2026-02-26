"use client";

import { motion } from "framer-motion";
import SectionHeading from "./ui/SectionHeading";
import Card from "./ui/Card";

const projects = [
  {
    title: "Client Dashboard",
    description:
      "Full-stack admin dashboard with real-time analytics, user management, and automated reporting.",
    tags: ["Web App", "React", "AI Integration"],
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "E-Commerce Platform",
    description:
      "High-performance online store with AI-powered product recommendations and automated inventory.",
    tags: ["Web App", "Mobile", "Automation"],
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "AI Chatbot System",
    description:
      "Custom AI chatbot trained on client data, integrated with existing support workflow and CRM.",
    tags: ["AI Integration", "Automation"],
    gradient: "from-green-500/20 to-emerald-500/20",
  },
];

export default function Portfolio() {
  return (
    <section id="work" className="py-24 md:py-32 bg-card-bg/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Portfolio"
          title="Selected work"
          description="A glimpse of what we build. Every project is shipped with precision."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <Card className="h-full group overflow-hidden">
                {/* Placeholder image area */}
                <div
                  className={`h-48 rounded-lg bg-gradient-to-br ${project.gradient} mb-6 flex items-center justify-center border border-white/5`}
                >
                  <span className="text-white/20 font-mono text-sm">
                    Coming Soon
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                <p className="text-muted text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-mono bg-accent/10 text-accent rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

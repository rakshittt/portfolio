"use client";

import { motion, type Variants } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { techStack } from "@/lib/data";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const tagVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
};

export default function TechArsenal() {
  return (
    <SectionWrapper id="arsenal" label="04 — technical arsenal" title="Tools of the Trade">
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {techStack.map((category, i) => (
          <motion.div
            key={category.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "180px 1fr",
                gap: "1rem",
                alignItems: "flex-start",
              }}
            >
              {/* Category label */}
              <p
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  paddingTop: "4px",
                }}
              >
                {category.label}
              </p>

              {/* Tags */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
              >
                {category.items.map((item) => (
                  <motion.span
                    key={item}
                    variants={tagVariants}
                    whileHover={{
                      borderColor: "rgba(0,255,136,0.4)",
                      color: "var(--accent-green)",
                      backgroundColor: "rgba(0,255,136,0.05)",
                    }}
                    style={{
                      fontFamily: "var(--font-jetbrains)",
                      fontSize: "0.72rem",
                      letterSpacing: "0.04em",
                      padding: "4px 11px",
                      borderRadius: "4px",
                      border: "1px solid var(--border-accent)",
                      backgroundColor: "var(--bg-elevated)",
                      color: "var(--text-secondary)",
                      cursor: "default",
                      transition: "border-color 0.15s, color 0.15s, background-color 0.15s",
                      display: "inline-block",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* Divider */}
            {i < techStack.length - 1 && (
              <div
                style={{
                  height: "1px",
                  backgroundColor: "var(--border-subtle)",
                  marginTop: "1.5rem",
                }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

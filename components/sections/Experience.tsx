"use client";

import { motion } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";
import GlowBadge from "@/components/ui/GlowBadge";
import { experience } from "@/lib/data";

export default function Experience() {
  return (
    <SectionWrapper id="experience" label="02 — experience" title="Where I've Worked">
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {experience.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderLeft: "2px solid transparent",
              borderRadius: "6px",
              padding: "1.75rem",
              transition: "border-color 0.25s, background-color 0.25s",
              cursor: "default",
            }}
            whileHover={{
              borderLeftColor: "var(--accent-green)",
            } as Record<string, string>}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--border-accent)";
              el.style.borderLeftColor = "var(--accent-green)";
              el.style.backgroundColor = "var(--bg-elevated)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--border-subtle)";
              el.style.borderLeftColor = "transparent";
              el.style.backgroundColor = "var(--bg-surface)";
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {entry.role}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: "0.8rem",
                    color: "var(--accent-green)",
                    marginTop: "0.2rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  {entry.company}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {entry.period}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: "0.72rem",
                    color: "var(--text-muted)",
                    marginTop: "0.15rem",
                  }}
                >
                  {entry.location}
                </p>
              </div>
            </div>

            {/* Description */}
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.875rem",
                lineHeight: 1.65,
                marginBottom: "1rem",
              }}
            >
              {entry.description}
            </p>

            {/* Bullets */}
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.25rem 0" }}>
              {entry.bullets.map((b, j) => (
                <li
                  key={j}
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    fontSize: "0.855rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.65,
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={{ color: "var(--accent-green)", flexShrink: 0, marginTop: "1px" }}>›</span>
                  <span dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.*?)\*\*/g, "<strong style=\"color:var(--text-primary);font-weight:500\">$1</strong>") }} />
                </li>
              ))}
            </ul>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {entry.tags.map((tag) => (
                <GlowBadge key={tag} label={tag} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

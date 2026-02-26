"use client";

import { motion } from "framer-motion";

const metrics = [
  { value: "10M+", label: "Annual users served" },
  { value: "50%", label: "Latency reduction" },
  { value: "3", label: "Live SaaS products" },
  { value: "99%", label: "Uptime SLA" },
];

export default function MetricsStrip() {
  return (
    <div
      style={{
        maxWidth: "900px",
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        paddingBottom: "2rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0",
          border: "1px solid var(--border-subtle)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            style={{
              padding: "1.5rem 1.25rem",
              borderRight: i < metrics.length - 1 ? "1px solid var(--border-subtle)" : "none",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                fontWeight: 700,
                color: "var(--accent-green)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                marginBottom: "0.4rem",
              }}
            >
              {m.value}
            </p>
            <p
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "0.68rem",
                color: "var(--text-muted)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                lineHeight: 1.3,
              }}
            >
              {m.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

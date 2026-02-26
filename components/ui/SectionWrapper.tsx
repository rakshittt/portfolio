"use client";

import { motion } from "framer-motion";

interface SectionWrapperProps {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
}

export default function SectionWrapper({ id, label, title, children }: SectionWrapperProps) {
  return (
    <section
      id={id}
      style={{
        paddingTop: "6rem",
        paddingBottom: "6rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        maxWidth: "900px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <p
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--accent-green)",
            marginBottom: "0.75rem",
          }}
        >
          // {label}
        </p>
        <h2
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: "3rem",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h2>
      </motion.div>
      {children}
    </section>
  );
}

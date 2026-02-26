"use client";

import { motion } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";
import GlowBadge from "@/components/ui/GlowBadge";
import { projects } from "@/lib/data";

const statusConfig = {
  live: { label: "Live", color: "#00ff88" },
  beta: { label: "Beta", color: "#ffaa00" },
  building: { label: "Building", color: "#666" },
};

export default function Projects() {
  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <SectionWrapper id="projects" label="03 — selected shipments" title="Things I've Shipped">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Featured project */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <ProjectCard project={featured} size="large" />
          </motion.div>
        )}

        {/* Grid for the rest */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {rest.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <ProjectCard project={project} size="normal" />
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

function ProjectCard({
  project,
  size,
}: {
  project: (typeof projects)[0];
  size: "large" | "normal";
}) {
  const status = statusConfig[project.status];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "8px",
        padding: size === "large" ? "2rem" : "1.5rem",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        cursor: "default",
        transition: "border-color 0.25s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-green-border)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)";
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3
            style={{
              fontSize: size === "large" ? "1.35rem" : "1.1rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "0.3rem",
            }}
          >
            {project.name}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "0.72rem",
              color: "var(--accent-green)",
              letterSpacing: "0.04em",
              marginBottom: "0.15rem",
            }}
          >
            {project.role}
          </p>
          <p
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "0.78rem",
              color: "var(--text-secondary)",
              letterSpacing: "0.02em",
            }}
          >
            {project.tagline}
          </p>
        </div>

        {/* Status badge */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            fontFamily: "var(--font-jetbrains)",
            fontSize: "0.7rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: status.color,
            backgroundColor: `${status.color}14`,
            border: `1px solid ${status.color}30`,
            padding: "3px 10px",
            borderRadius: "3px",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: status.color,
            }}
          />
          {status.label}
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--text-secondary)",
          lineHeight: 1.65,
        }}
      >
        {project.description}
      </p>

      {/* Bullets */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
        {project.bullets.map((b, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              gap: "0.65rem",
              fontSize: "0.84rem",
              color: "var(--text-secondary)",
              lineHeight: 1.65,
              marginBottom: "0.45rem",
            }}
          >
            <span style={{ color: "var(--accent-green)", flexShrink: 0 }}>›</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {/* Tech tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {project.tech.map((t) => (
          <GlowBadge key={t} label={t} />
        ))}
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem" }}>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "0.78rem",
              color: "var(--accent-green)",
              textDecoration: "none",
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            → View project
          </a>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              textDecoration: "none",
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            GitHub ↗
          </a>
        )}
      </div>
    </motion.div>
  );
}

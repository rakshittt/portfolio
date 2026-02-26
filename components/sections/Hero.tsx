"use client";

import { motion } from "framer-motion";
import TerminalText from "@/components/ui/TerminalText";
import { socials } from "@/lib/data";

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        paddingTop: "6rem",
        paddingBottom: "4rem",
        maxWidth: "900px",
        marginLeft: "auto",
        marginRight: "auto",
        position: "relative",
      }}
    >
      {/* Radial gradient background glow */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,255,136,0.04) 0%, transparent 60%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--accent-green)",
            marginBottom: "1.25rem",
          }}
        >
          // platform engineer & Builder
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: "clamp(3rem, 9vw, 7rem)",
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            marginBottom: "1.5rem",
          }}
        >
          Rakshit Jain.
        </motion.h1>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.35rem)",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            maxWidth: "560px",
            marginBottom: "2.5rem",
            fontWeight: 300,
          }}
        >
          <TerminalText text="Building systems that don't wake you at 3am." />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            color: "var(--text-muted)",
            fontSize: "0.9rem",
            maxWidth: "480px",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
            fontFamily: "var(--font-jetbrains)",
          }}
        >
          I architect production-grade cloud systems serving millions — and build AI-native
          SaaS products focused on speed, scale, and intelligent automation.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "4rem" }}
        >
          <a
            href="#projects"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.65rem 1.5rem",
              backgroundColor: "var(--accent-green)",
              color: "#0a0a0a",
              fontFamily: "var(--font-jetbrains)",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "4px",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            View my work ↓
          </a>
          <a
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.65rem 1.5rem",
              backgroundColor: "transparent",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-jetbrains)",
              fontSize: "0.8rem",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "4px",
              border: "1px solid var(--border-accent)",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-green-border)";
              e.currentTarget.style.color = "var(--accent-green)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-accent)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            GitHub ↗
          </a>
          <a
            href="/resume.pdf"
            download
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.65rem 1.5rem",
              backgroundColor: "transparent",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-jetbrains)",
              fontSize: "0.8rem",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "4px",
              border: "1px solid var(--border-accent)",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-green-border)";
              e.currentTarget.style.color = "var(--accent-green)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-accent)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            Resume ↓
          </a>
        </motion.div>

        {/* Status bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: "var(--accent-green)",
              boxShadow: "0 0 8px var(--accent-green)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
            }}
          >
            Platform Engineer @ Quantiphi &nbsp;·&nbsp; Builder, ScrollOS &amp; AskMitra &nbsp;·&nbsp; Open to interesting problems
          </span>
        </motion.div>
      </div>
    </section>
  );
}

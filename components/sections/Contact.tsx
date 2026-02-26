"use client";

import { motion } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { socials } from "@/lib/data";

const links = [
  { label: "Email", value: socials.email, href: `mailto:${socials.email}`, external: false },
  { label: "GitHub", value: "github.com/rakshittt", href: socials.github, external: true },
  { label: "LinkedIn", value: "rakshitbuilds", href: socials.linkedin, external: true },
  { label: "X / Twitter", value: "@RakshitBuilds", href: socials.twitter, external: true },
];

export default function Contact() {
  return (
    <SectionWrapper id="contact" label="06 — get in touch" title="Let's Build.">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: "1rem",
            color: "var(--text-secondary)",
            lineHeight: 1.8,
            maxWidth: "520px",
            marginBottom: "3rem",
          }}
        >
          If you&apos;re working on infrastructure problems, developer tools, or have something
          interesting to discuss — I&apos;m all ears. Open to technical collaborations and product
          conversations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0",
          }}
        >
          {links.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.1rem 0.75rem",
                borderBottom: i < links.length - 1 ? "1px solid var(--border-subtle)" : "none",
                textDecoration: "none",
                color: "inherit",
                transition: "background-color 0.2s",
                borderRadius: "4px",
                margin: "0 -0.75rem",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-surface)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingLeft: "0.75rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    width: "80px",
                    flexShrink: 0,
                  }}
                >
                  {link.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: "0.875rem",
                    color: "var(--text-primary)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {link.value}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "0.8rem",
                  color: "var(--accent-green)",
                  paddingRight: "0.75rem",
                  transition: "transform 0.2s",
                }}
              >
                ↗
              </span>
            </a>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            marginTop: "4rem",
            letterSpacing: "0.06em",
            paddingBottom: "2rem",
          }}
        >
          Built with Next.js 15 · Framer Motion · Deployed on Vercel
        </motion.p>
      </div>
    </SectionWrapper>
  );
}

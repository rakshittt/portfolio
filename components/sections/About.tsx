"use client";

import { motion } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";

const certifications = [
  {
    name: "Associate Cloud Engineer",
    issuer: "Google Cloud",
    status: "certified" as const,
    color: "#4285F4",
  },
  {
    name: "Solutions Architect",
    issuer: "AWS",
    status: "pursuing" as const,
    color: "#FF9900",
  },
];

export default function About() {
  return (
    <SectionWrapper id="about" label="05 — behind the code" title="The Philosophy">
      <div style={{ display: "flex", flexDirection: "column", gap: "3.5rem" }}>

        {/* Philosophy prose */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          style={{ maxWidth: "640px" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              lineHeight: 1.85,
            }}
          >
            <p>
              I studied Electronics & Telecom — not Computer Science. Everything I know about
              systems, I built from first principles.{" "}
              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                That turned out to be an advantage.
              </span>{" "}
              I don&apos;t reach for abstractions I don&apos;t understand. I read source code
              before documentation.
            </p>
            <p>
              By day I&apos;m a Platform Engineer at Quantiphi — building infrastructure that
              handles millions of users with strict SLAs. By night I ship AI-native SaaS
              products. The gap between{" "}
              <span style={{ color: "var(--accent-green)", fontFamily: "var(--font-jetbrains)", fontSize: "0.88rem" }}>
                &quot;it works on my machine&quot;
              </span>{" "}
              and &quot;it works for 10M people&quot; is where I live.
            </p>
            <p>
              Most performance problems are data structure problems. Most reliability problems
              are assumptions that weren&apos;t written down. I try to be explicit about both.
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Based in Indore, India. Building for the internet.
            </p>
          </div>
        </motion.div>

        {/* Education + Certifications + Status grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "2rem",
          }}
        >
          {/* Education block */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent-green)",
                marginBottom: "0.75rem",
              }}
            >
              Education
            </p>
            <div style={{ height: "1px", backgroundColor: "var(--border-subtle)", marginBottom: "1rem" }} />
            <div
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "6px",
                padding: "1rem 1.1rem",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "0.75rem",
                  color: "var(--text-primary)",
                  fontWeight: 500,
                  marginBottom: "0.25rem",
                }}
              >
                B.Tech — Electronics & Telecom
              </p>
              <p
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "0.72rem",
                  color: "var(--text-secondary)",
                  marginBottom: "0.15rem",
                }}
              >
                SGSITS, Indore
              </p>
              <p
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                }}
              >
                Graduated May 2024
              </p>
            </div>
          </div>

          {/* Certifications block */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent-green)",
                marginBottom: "0.75rem",
              }}
            >
              Certifications
            </p>
            <div style={{ height: "1px", backgroundColor: "var(--border-subtle)", marginBottom: "1rem" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {certifications.map((cert) => (
                <div
                  key={cert.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid var(--border-subtle)",
                    borderLeft: `2px solid ${cert.color}`,
                    borderRadius: "6px",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-jetbrains)",
                        fontSize: "0.75rem",
                        color: "var(--text-primary)",
                        fontWeight: 500,
                        marginBottom: "0.1rem",
                      }}
                    >
                      {cert.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-jetbrains)",
                        fontSize: "0.68rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {cert.issuer}
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains)",
                      fontSize: "0.62rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: cert.status === "certified" ? cert.color : "var(--text-muted)",
                      backgroundColor: cert.status === "certified" ? `${cert.color}18` : "var(--bg-elevated)",
                      border: `1px solid ${cert.status === "certified" ? cert.color + "40" : "var(--border-accent)"}`,
                      padding: "2px 8px",
                      borderRadius: "3px",
                      flexShrink: 0,
                    }}
                  >
                    {cert.status === "certified" ? "Certified" : "Pursuing"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Currently block */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent-green)",
                marginBottom: "0.75rem",
              }}
            >
              Currently
            </p>
            <div style={{ height: "1px", backgroundColor: "var(--border-subtle)", marginBottom: "1rem" }} />
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                "Platform Engineer @ Quantiphi",
                "Building ScrollOS & AskMitra",
                "TalentSync in beta",
                "Open to interesting problems",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.6rem",
                    fontSize: "0.84rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                    fontFamily: "var(--font-jetbrains)",
                  }}
                >
                  <span style={{ color: "var(--accent-green)", flexShrink: 0, marginTop: "1px" }}>›</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

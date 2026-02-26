"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { articles, type Article } from "@/lib/data";

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: "1.25rem 0",
  textDecoration: "none",
  color: "inherit",
  gap: "1.5rem",
  transition: "opacity 0.2s",
} as const;

function RowContent({ article }: { article: Article }) {
  return (
    <>
      {/* Left: content */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "0.4rem",
            flexWrap: "wrap",
          }}
        >
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 500,
              color: article.status === "draft" ? "var(--text-secondary)" : "var(--text-primary)",
              letterSpacing: "-0.01em",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            {article.title}
          </h3>
          {article.status === "draft" && (
            <span
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "0.62rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                border: "1px solid var(--border-accent)",
                padding: "1px 7px",
                borderRadius: "3px",
                flexShrink: 0,
              }}
            >
              Draft
            </span>
          )}
        </div>

        <p
          style={{
            fontSize: "0.84rem",
            color: "var(--text-muted)",
            lineHeight: 1.65,
            marginBottom: "0.75rem",
          }}
        >
          {article.description}
        </p>

        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {article.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "0.68rem",
                letterSpacing: "0.04em",
                padding: "2px 8px",
                borderRadius: "3px",
                border: "1px solid var(--border-accent)",
                backgroundColor: "var(--bg-elevated)",
                color: "var(--text-muted)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right: meta */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "0.25rem",
          flexShrink: 0,
          paddingTop: "2px",
        }}
      >
        {article.readingTime && (
          <span
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
            }}
          >
            {article.readingTime}
          </span>
        )}
        <span
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          {article.date}
        </span>
        {article.status !== "draft" && (
          <span
            style={{
              fontSize: "0.8rem",
              color: "var(--accent-green)",
              marginTop: "0.2rem",
            }}
          >
            ↗
          </span>
        )}
      </div>
    </>
  );
}

function hoverIn(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.style.opacity = "0.75";
}
function hoverOut(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.style.opacity = "1";
}

export default function Writing() {
  return (
    <SectionWrapper id="writing" label="06 — writing" title="Notes & Writing">
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {articles.map((article, i) => {
          const isDraft = article.status === "draft";
          const borderBottom = i < articles.length - 1 ? "1px solid var(--border-subtle)" : "none";

          return (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              {isDraft ? (
                <div
                  style={{
                    ...rowStyle,
                    borderBottom,
                    cursor: "default",
                  }}
                >
                  <RowContent article={article} />
                </div>
              ) : article.url ? (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...rowStyle, borderBottom, cursor: "pointer" }}
                  onMouseEnter={hoverIn}
                  onMouseLeave={hoverOut}
                >
                  <RowContent article={article} />
                </a>
              ) : (
                <Link
                  href={`/writing/${article.slug}`}
                  style={{ ...rowStyle, borderBottom, cursor: "pointer" }}
                  onMouseEnter={hoverIn}
                  onMouseLeave={hoverOut}
                >
                  <RowContent article={article} />
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

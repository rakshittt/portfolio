"use client";

import Link from "next/link";
import type { Article } from "@/lib/data";

interface ArticleNavProps {
  article: Article;
}

export default function ArticleNav({ article }: ArticleNavProps) {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--border-subtle)",
        marginBottom: "2.5rem",
        paddingBottom: "2rem",
      }}
    >
      {/* Back link */}
      <div style={{ marginBottom: "2rem" }}>
        <Link
          href="/#writing"
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            textDecoration: "none",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-green)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          ← Writing
        </Link>
      </div>

      {/* Tags */}
      <div
        style={{
          display: "flex",
          gap: "0.4rem",
          flexWrap: "wrap",
          marginBottom: "1.25rem",
        }}
      >
        {article.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "0.68rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "2px 8px",
              borderRadius: "3px",
              border: "1px solid var(--border-accent)",
              backgroundColor: "var(--bg-elevated)",
              color: "var(--accent-green)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
          fontWeight: 700,
          color: "var(--text-primary)",
          letterSpacing: "-0.03em",
          lineHeight: 1.2,
          margin: "0 0 1rem",
        }}
      >
        {article.title}
      </h1>

      {/* Description */}
      <p
        style={{
          fontSize: "1rem",
          color: "var(--text-muted)",
          lineHeight: 1.7,
          margin: "0 0 1.25rem",
          maxWidth: "600px",
        }}
      >
        {article.description}
      </p>

      {/* Meta row */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          {article.date}
        </span>
        {article.readingTime && (
          <>
            <span style={{ color: "var(--border-accent)", fontSize: "0.72rem" }}>·</span>
            <span
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                letterSpacing: "0.04em",
              }}
            >
              {article.readingTime}
            </span>
          </>
        )}
        <span style={{ color: "var(--border-accent)", fontSize: "0.72rem" }}>·</span>
        <span
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          Rakshit Jain
        </span>
      </div>
    </header>
  );
}

"use client";

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

export default function CodeBlock({ code, language, filename }: CodeBlockProps) {
  return (
    <div
      style={{
        margin: "1.75rem 0",
        borderRadius: "6px",
        border: "1px solid var(--border-subtle)",
        overflow: "hidden",
        backgroundColor: "#0d0d0d",
      }}
    >
      {filename && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.5rem 1rem",
            borderBottom: "1px solid var(--border-subtle)",
            backgroundColor: "#111",
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
            {filename}
          </span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "0.68rem",
              color: "var(--border-accent)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {language}
          </span>
        </div>
      )}
      <pre
        style={{
          margin: 0,
          padding: "1.25rem 1.5rem",
          overflowX: "auto",
          lineHeight: 1.65,
        }}
      >
        <code
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "0.8rem",
            color: "#e2e8f0",
            whiteSpace: "pre",
          }}
        >
          {code}
        </code>
      </pre>
    </div>
  );
}

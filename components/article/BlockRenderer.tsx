import type { Block } from "@/lib/blocks";
import CodeBlock from "./CodeBlock";

const CALLOUT_STYLES = {
  info: {
    border: "1px solid rgba(59, 130, 246, 0.3)",
    backgroundColor: "rgba(59, 130, 246, 0.06)",
    color: "rgba(147, 197, 253, 0.9)",
    icon: "//",
  },
  warning: {
    border: "1px solid rgba(245, 158, 11, 0.3)",
    backgroundColor: "rgba(245, 158, 11, 0.06)",
    color: "rgba(252, 211, 77, 0.9)",
    icon: "!",
  },
  insight: {
    border: "1px solid rgba(0, 255, 136, 0.25)",
    backgroundColor: "rgba(0, 255, 136, 0.05)",
    color: "var(--accent-green)",
    icon: "→",
  },
};

function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          key={index}
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
            margin: "2.5rem 0 1rem",
            paddingBottom: "0.6rem",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          {block.text}
        </h2>
      );

    case "h3":
      return (
        <h3
          key={index}
          style={{
            fontSize: "1.05rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
            lineHeight: 1.4,
            margin: "2rem 0 0.75rem",
          }}
        >
          {block.text}
        </h3>
      );

    case "paragraph":
      return (
        <p
          key={index}
          style={{
            fontSize: "0.97rem",
            color: "var(--text-secondary)",
            lineHeight: 1.8,
            margin: "1rem 0",
          }}
        >
          {block.text}
        </p>
      );

    case "code":
      return (
        <CodeBlock
          key={index}
          code={block.code}
          language={block.language}
          filename={block.filename}
        />
      );

    case "callout": {
      const style = CALLOUT_STYLES[block.variant];
      return (
        <div
          key={index}
          style={{
            display: "flex",
            gap: "0.75rem",
            margin: "1.75rem 0",
            padding: "1rem 1.25rem",
            borderRadius: "6px",
            border: style.border,
            backgroundColor: style.backgroundColor,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "0.8rem",
              color: style.color,
              flexShrink: 0,
              paddingTop: "0.1rem",
              fontWeight: 700,
            }}
          >
            {style.icon}
          </span>
          <p
            style={{
              fontSize: "0.93rem",
              color: style.color,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {block.text}
          </p>
        </div>
      );
    }

    case "metrics":
      return (
        <div
          key={index}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(block.items.length, 4)}, 1fr)`,
            gap: "1px",
            margin: "1.75rem 0",
            border: "1px solid var(--border-subtle)",
            borderRadius: "6px",
            overflow: "hidden",
            backgroundColor: "var(--border-subtle)",
          }}
        >
          {block.items.map((item, i) => (
            <div
              key={i}
              style={{
                padding: "1.25rem",
                backgroundColor: "var(--bg-surface)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "var(--accent-green)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  marginBottom: "0.4rem",
                }}
              >
                {item.value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "0.72rem",
                  color: "var(--text-secondary)",
                  letterSpacing: "0.04em",
                  marginBottom: item.description ? "0.25rem" : 0,
                }}
              >
                {item.label}
              </div>
              {item.description && (
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: "0.67rem",
                    color: "var(--text-muted)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {item.description}
                </div>
              )}
            </div>
          ))}
        </div>
      );

    case "list":
      return (
        <ul
          key={index}
          style={{
            margin: "1rem 0",
            paddingLeft: "0",
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
          }}
        >
          {block.items.map((item, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
                fontSize: "0.97rem",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  color: "var(--accent-green)",
                  flexShrink: 0,
                  paddingTop: "0.15rem",
                  fontSize: "0.8rem",
                }}
              >
                {block.ordered ? `${i + 1}.` : "—"}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "divider":
      return (
        <hr
          key={index}
          style={{
            border: "none",
            borderTop: "1px solid var(--border-subtle)",
            margin: "2.5rem 0",
          }}
        />
      );

    case "quote":
      return (
        <blockquote
          key={index}
          style={{
            margin: "1.75rem 0",
            paddingLeft: "1.25rem",
            borderLeft: "3px solid var(--accent-green)",
          }}
        >
          <p
            style={{
              fontSize: "1.05rem",
              fontStyle: "italic",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {block.text}
          </p>
          {block.attribution && (
            <footer
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                marginTop: "0.5rem",
                letterSpacing: "0.04em",
              }}
            >
              — {block.attribution}
            </footer>
          )}
        </blockquote>
      );

    default:
      return null;
  }
}

interface BlockRendererProps {
  blocks: Block[];
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  return <>{blocks.map((block, i) => renderBlock(block, i))}</>;
}

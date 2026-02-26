import { ImageResponse } from "next/og";
import { articles } from "@/lib/data";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);

  const title = article?.title ?? "Article";
  const description = article?.description ?? "";
  const tags = article?.tags ?? [];
  const readingTime = article?.readingTime ?? "";

  // Truncate title for display
  const displayTitle = title.length > 80 ? title.slice(0, 77) + "…" : title;
  const displayDesc = description.length > 120 ? description.slice(0, 117) + "…" : description;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 72px",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* Top: label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span style={{ color: "#00ff88", fontSize: 14, letterSpacing: "0.16em" }}>
            RAKSHIT JAIN
          </span>
          <span style={{ color: "#333", fontSize: 14 }}>·</span>
          <span style={{ color: "#444", fontSize: 14, letterSpacing: "0.12em" }}>
            WRITING
          </span>
        </div>

        {/* Middle: title + description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", flex: 1, justifyContent: "center" }}>
          <div
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: "#f0f0f0",
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
              maxWidth: 960,
            }}
          >
            {displayTitle}
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#666",
              lineHeight: 1.6,
              maxWidth: 900,
            }}
          >
            {displayDesc}
          </div>
        </div>

        {/* Bottom: tags + reading time */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #1a1a1a",
            paddingTop: "28px",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            {tags.slice(0, 4).map((tag) => (
              <div
                key={tag}
                style={{
                  fontSize: 13,
                  color: "#555",
                  border: "1px solid #222",
                  padding: "4px 12px",
                  borderRadius: "4px",
                  letterSpacing: "0.06em",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <span style={{ fontSize: 14, color: "#444", letterSpacing: "0.06em" }}>
            {readingTime}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

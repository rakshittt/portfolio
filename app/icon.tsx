import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
          border: "1px solid #1e1e1e",
        }}
      >
        <span
          style={{
            color: "#00ff88",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "monospace",
            letterSpacing: "-0.5px",
            lineHeight: 1,
          }}
        >
          rj.
        </span>
      </div>
    ),
    { ...size }
  );
}

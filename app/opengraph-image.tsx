import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Rakshit Jain — Platform Engineer & Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          position: "relative",
          fontFamily: "monospace",
        }}
      >
        {/* Top green glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "#00ff88",
          }}
        />

        {/* Subtle grid dots */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, #1e1e1e 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.4,
          }}
        />

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
          {/* Label */}
          <p
            style={{
              color: "#00ff88",
              fontSize: 16,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              margin: "0 0 24px 0",
              fontFamily: "monospace",
            }}
          >
            // platform engineer & builder
          </p>

          {/* Name */}
          <h1
            style={{
              color: "#f0f0f0",
              fontSize: 80,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              margin: "0 0 20px 0",
              fontFamily: "monospace",
            }}
          >
            Rakshit Jain.
          </h1>

          {/* Role */}
          <p
            style={{
              color: "#888888",
              fontSize: 26,
              margin: "0 0 48px 0",
              fontFamily: "monospace",
              letterSpacing: "-0.01em",
            }}
          >
            Platform Engineer @ Quantiphi · Founder, ScrollOS & AskMitra
          </p>

          {/* Divider */}
          <div
            style={{
              width: 600,
              height: 1,
              background: "#1e1e1e",
              margin: "0 0 40px 0",
            }}
          />

          {/* Metrics row */}
          <div style={{ display: "flex", gap: 48 }}>
            {[
              { value: "10M+", label: "Annual users" },
              { value: "50%", label: "Latency cut" },
              { value: "3", label: "Live products" },
              { value: "99%", label: "Uptime SLA" },
            ].map((m) => (
              <div key={m.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span
                  style={{
                    color: "#00ff88",
                    fontSize: 32,
                    fontWeight: 700,
                    fontFamily: "monospace",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {m.value}
                </span>
                <span
                  style={{
                    color: "#444444",
                    fontSize: 13,
                    fontFamily: "monospace",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
          }}
        >
          <span
            style={{
              color: "#333333",
              fontSize: 15,
              fontFamily: "monospace",
              letterSpacing: "0.04em",
            }}
          >
            Node.js · TypeScript · Kubernetes · AWS · PostgreSQL · Redis
          </span>
          <span
            style={{
              color: "#00ff88",
              fontSize: 18,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            rj.
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { socials } from "@/lib/data";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

const LEVEL_COLORS: Record<number, string> = {
  0: "#161616",
  1: "rgba(0, 255, 136, 0.18)",
  2: "rgba(0, 255, 136, 0.42)",
  3: "rgba(0, 255, 136, 0.68)",
  4: "#00ff88",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const CELL = 11;
const GAP = 3;
const UNIT = CELL + GAP;

function groupIntoWeeks(days: ContributionDay[]): (ContributionDay | null)[][] {
  const last364 = days.slice(-364);
  if (!last364.length) return [];
  const startPad = new Date(last364[0].date).getDay();
  const padded: (ContributionDay | null)[] = [...Array(startPad).fill(null), ...last364];
  const weeks: (ContributionDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    const week = padded.slice(i, i + 7);
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

function getMonthLabels(weeks: (ContributionDay | null)[][]): Record<number, string> {
  const labels: Record<number, string> = {};
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const first = week.find(Boolean);
    if (first) {
      const m = new Date(first.date).getMonth();
      if (m !== lastMonth) { labels[i] = MONTHS[m]; lastMonth = m; }
    }
  });
  return labels;
}

export default function GitHubActivity() {
  const [days, setDays] = useState<ContributionDay[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("https://github-contributions-api.jogruber.de/v4/rakshittt?y=last")
      .then((r) => r.json())
      .then((data) => {
        setDays(data.contributions ?? []);
        const t = Object.values(data.total as Record<string, number>).reduce(
          (a: number, b) => a + (b as number),
          0
        );
        setTotal(t);
        setLoading(false);
      })
      .catch(() => { setFailed(true); setLoading(false); });
  }, []);

  const weeks = days.length ? groupIntoWeeks(days) : [];
  const monthLabels = getMonthLabels(weeks);

  return (
    <div
      style={{
        maxWidth: "900px",
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        paddingBottom: "5rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "1.25rem",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--accent-green)",
                marginBottom: "0.4rem",
              }}
            >
              // github activity
            </p>
            <p
              style={{
                fontFamily: "var(--font-jetbrains)",
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                letterSpacing: "0.02em",
                minHeight: "1.1em",
              }}
            >
              {!loading && !failed && `${total.toLocaleString()} contributions in the last year`}
              {loading && "loading..."}
            </p>
          </div>
          <a
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              textDecoration: "none",
              letterSpacing: "0.04em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-green)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            View profile ↗
          </a>
        </div>

        {/* Calendar card */}
        <div
          style={{
            border: "1px solid var(--border-subtle)",
            borderRadius: "8px",
            padding: "1.25rem 1.5rem 1rem",
            backgroundColor: "var(--bg-surface)",
            overflowX: "auto",
          }}
        >
          {(loading || failed || !weeks.length) && (
            <div
              style={{
                height: 108,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  letterSpacing: "0.08em",
                }}
              >
                {failed ? "— see github.com/rakshittt —" : "loading contributions..."}
              </p>
            </div>
          )}

          {!loading && !failed && weeks.length > 0 && (
            <div>
              {/* Month labels */}
              <div style={{ display: "flex", marginBottom: 6, paddingLeft: 28 }}>
                {weeks.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: UNIT,
                      flexShrink: 0,
                      fontFamily: "var(--font-jetbrains)",
                      fontSize: 9,
                      color: monthLabels[i] ? "var(--text-muted)" : "transparent",
                      letterSpacing: "0.04em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {monthLabels[i] ?? ""}
                  </div>
                ))}
              </div>

              {/* Day labels + Grid */}
              <div style={{ display: "flex" }}>
                {/* Day labels column */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: GAP,
                    marginRight: 6,
                    paddingTop: 1,
                  }}
                >
                  {DAY_LABELS.map((label, i) => (
                    <div
                      key={i}
                      style={{
                        height: CELL,
                        width: 22,
                        fontFamily: "var(--font-jetbrains)",
                        fontSize: 9,
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        letterSpacing: "0.02em",
                        opacity: label ? 1 : 0,
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>

                {/* Contribution squares */}
                <div style={{ display: "flex", gap: GAP }}>
                  {weeks.map((week, wi) => (
                    <div
                      key={wi}
                      style={{ display: "flex", flexDirection: "column", gap: GAP }}
                    >
                      {week.map((day, di) => (
                        <div
                          key={di}
                          title={
                            day
                              ? `${day.date} · ${day.count} contribution${day.count !== 1 ? "s" : ""}`
                              : ""
                          }
                          style={{
                            width: CELL,
                            height: CELL,
                            borderRadius: 2,
                            backgroundColor: day ? LEVEL_COLORS[day.level] : "transparent",
                            flexShrink: 0,
                            transition: "transform 0.1s, opacity 0.1s",
                            cursor: day ? "default" : "default",
                          }}
                          onMouseEnter={(e) => {
                            if (day) (e.currentTarget as HTMLElement).style.transform = "scale(1.4)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 5,
                  marginTop: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: 9,
                    color: "var(--text-muted)",
                    letterSpacing: "0.04em",
                  }}
                >
                  Less
                </span>
                {([0, 1, 2, 3, 4] as const).map((level) => (
                  <div
                    key={level}
                    style={{
                      width: CELL,
                      height: CELL,
                      borderRadius: 2,
                      backgroundColor: LEVEL_COLORS[level],
                    }}
                  />
                ))}
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    fontSize: 9,
                    color: "var(--text-muted)",
                    letterSpacing: "0.04em",
                  }}
                >
                  More
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

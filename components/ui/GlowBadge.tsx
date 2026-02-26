interface GlowBadgeProps {
  label: string;
  variant?: "default" | "accent";
}

export default function GlowBadge({ label, variant = "default" }: GlowBadgeProps) {
  return (
    <span
      style={{
        fontFamily: "var(--font-jetbrains)",
        fontSize: "0.7rem",
        letterSpacing: "0.04em",
        padding: "3px 10px",
        borderRadius: "4px",
        border: variant === "accent"
          ? "1px solid var(--accent-green-border)"
          : "1px solid var(--border-accent)",
        backgroundColor: variant === "accent"
          ? "var(--accent-green-dim)"
          : "var(--bg-elevated)",
        color: variant === "accent" ? "var(--accent-green)" : "var(--text-secondary)",
        whiteSpace: "nowrap" as const,
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}

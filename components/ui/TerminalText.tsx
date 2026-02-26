"use client";

import { motion } from "framer-motion";

interface TerminalTextProps {
  text: string;
  className?: string;
}

export default function TerminalText({ text, className = "" }: TerminalTextProps) {
  return (
    <span className={className}>
      {text}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        style={{
          display: "inline-block",
          width: "2px",
          height: "1.1em",
          backgroundColor: "var(--accent-green)",
          marginLeft: "3px",
          verticalAlign: "text-bottom",
          borderRadius: "1px",
        }}
      />
    </span>
  );
}

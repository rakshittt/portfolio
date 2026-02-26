export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; language: string; filename?: string; code: string }
  | { type: "callout"; variant: "info" | "warning" | "insight"; text: string }
  | { type: "metrics"; items: Array<{ label: string; value: string; description?: string }> }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "divider" }
  | { type: "quote"; text: string; attribution?: string };

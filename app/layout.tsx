import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Rakshit Jain — Platform Engineer & Builder",
  description:
    "Platform Engineer at Quantiphi architecting production-grade cloud systems serving millions. Builder of ScrollOS and AskMitra.",
  keywords: [
    "Rakshit Jain",
    "Platform Engineer",
    "Software Engineer",
    "Node.js",
    "TypeScript",
    "AWS",
    "Kubernetes",
    "Next.js",
  ],
  authors: [{ name: "Rakshit Jain" }],
  openGraph: {
    title: "Rakshit Jain — Platform Engineer & Builder",
    description:
      "Platform Engineer at Quantiphi. Building ScrollOS & AskMitra. Distributed systems, cloud infrastructure, and AI tooling.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rakshit Jain — Platform Engineer & Builder",
    description: "Platform Engineer at Quantiphi. Building ScrollOS & AskMitra.",
    creator: "@RakshitBuilds",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}

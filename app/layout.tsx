import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { articles } from "@/lib/data";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rakshit.askmitra.com";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rakshit Jain — Platform Engineer & Builder",
    template: "%s | Rakshit Jain",
  },
  description:
    "Rakshit Jain is a Platform Engineer at Quantiphi building production-grade distributed systems serving 10M+ annual users. Founder of ScrollOS and AskMitra. Expert in Node.js, TypeScript, Kubernetes, AWS, and AI-native SaaS.",
  keywords: [
    "Rakshit Jain",
    "Platform Engineer",
    "Software Engineer India",
    "Backend Engineer",
    "Distributed Systems Engineer",
    "Node.js Developer",
    "TypeScript Engineer",
    "Kubernetes Engineer",
    "AWS Engineer",
    "Next.js Developer",
    "SaaS Founder",
    "ScrollOS",
    "AskMitra",
    "TalentSync",
    "Quantiphi",
    "SGSITS",
    "Indore",
    "Google Cloud Engineer",
    "Python Developer",
    "FastAPI Developer",
    "Redis",
    "PostgreSQL",
  ],
  authors: [{ name: "Rakshit Jain", url: SITE_URL }],
  creator: "Rakshit Jain",
  publisher: "Rakshit Jain",
  category: "Technology",
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    title: "Rakshit Jain — Platform Engineer & Builder",
    description:
      "Platform Engineer at Quantiphi serving 10M+ users. Building ScrollOS & AskMitra. Expert in distributed systems, cloud infrastructure, and AI tooling.",
    siteName: "Rakshit Jain",
    locale: "en_US",
    firstName: "Rakshit",
    lastName: "Jain",
    username: "RakshitBuilds",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Rakshit Jain — Platform Engineer & Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@RakshitBuilds",
    creator: "@RakshitBuilds",
    title: "Rakshit Jain — Platform Engineer & Builder",
    description:
      "Platform Engineer at Quantiphi serving 10M+ users. Founder of ScrollOS & AskMitra.",
    images: ["/opengraph-image"],
  },
};

const articleGraph = articles
  .filter((a) => a.status === "published")
  .map((a) => ({
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/writing/${a.slug}`,
    headline: a.title,
    description: a.description,
    url: `${SITE_URL}/writing/${a.slug}`,
    keywords: a.tags.join(", "),
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  }));

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Rakshit Jain",
      url: SITE_URL,
      jobTitle: "Platform Engineer",
      worksFor: {
        "@type": "Organization",
        name: "Quantiphi",
        url: "https://quantiphi.com",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Shri Govindram Seksaria Institute of Technology and Science",
        alternateName: "SGSITS",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Indore",
          addressCountry: "IN",
        },
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Indore",
        addressCountry: "IN",
      },
      email: "itsrakshitsjain@gmail.com",
      sameAs: [
        "https://github.com/rakshittt",
        "https://linkedin.com/in/rakshitbuilds",
        "https://x.com/RakshitBuilds",
      ],
      knowsAbout: [
        "Distributed Systems",
        "Cloud Infrastructure",
        "Kubernetes",
        "AWS",
        "Node.js",
        "TypeScript",
        "Python",
        "FastAPI",
        "PostgreSQL",
        "Redis",
        "Next.js",
        "System Design",
        "AI Integration",
        "LLM APIs",
        "Microservices",
        "GitLab CI/CD",
        "Real-time Video Analytics",
        "Bayesian Classification",
        "Performance Optimization",
      ],
      hasCredential: [
        {
          "@type": "EducationalOccupationalCredential",
          name: "Google Cloud Certified Associate Cloud Engineer",
          credentialCategory: "Professional Certification",
          recognizedBy: { "@type": "Organization", name: "Google Cloud" },
        },
      ],
      description:
        "Rakshit Jain is a Platform Engineer at Quantiphi where he architects production-grade distributed systems serving 10M+ annual users with 99% uptime SLA. He reduced production video processing latency by 50% using optimized data structures and Kubernetes resource tuning. He is the founder of ScrollOS (AI-native email newsletter platform) and AskMitra (AI sales assistant for e-commerce). He graduated from SGSITS Indore with a B.Tech in Electronics and Telecommunication in 2024.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Rakshit Jain",
      description: "Portfolio, projects, and technical writing by Rakshit Jain — Platform Engineer and SaaS founder.",
      author: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en-US",
    },
    {
      "@type": "ItemList",
      name: "Projects by Rakshit Jain",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "SoftwareApplication",
            name: "ScrollOS",
            url: "https://scrollos.co.in",
            description:
              "AI-native SaaS platform that intelligently organizes and classifies high-volume email newsletters using n-gram analysis and Bayesian probability, achieving 90% accuracy across 1,000+ newsletters per user.",
            applicationCategory: "ProductivityApplication",
            author: { "@id": `${SITE_URL}/#person` },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "SoftwareApplication",
            name: "AskMitra",
            url: "https://askmitra.com",
            description:
              "AI-powered sales assistant for e-commerce storefronts with full AI pipeline: catalog ingestion, embedding, retrieval, and conversational response.",
            applicationCategory: "BusinessApplication",
            author: { "@id": `${SITE_URL}/#person` },
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@type": "SoftwareApplication",
            name: "TalentSync",
            url: "https://github.com/rakshittt/TalentSync",
            description:
              "AI-powered resume-job fit optimization engine with multi-model fallback (GPT-4o primary, GPT-4o-mini fallback) and Zod schema validation for type-safe structured outputs.",
            applicationCategory: "BusinessApplication",
            author: { "@id": `${SITE_URL}/#person` },
          },
        },
      ],
    },
    ...articleGraph,
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

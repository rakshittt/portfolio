export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  bullets: string[];
  tags: string[];
}

export interface ProjectEntry {
  name: string;
  role: string;
  tagline: string;
  description: string;
  bullets: string[];
  tech: string[];
  url?: string;
  github?: string;
  status: "live" | "beta" | "building";
  featured?: boolean;
}

export interface TechCategory {
  label: string;
  items: string[];
}

export interface Article {
  title: string;
  description: string;
  publication: string;
  date: string;
  url?: string;
  slug: string;
  tags: string[];
  status: "published" | "draft";
  readingTime?: string;
}

export const articles: Article[] = [
  {
    title: "50% Latency in 30 Days: What Hash Maps and Priority Queues Did to Our Video Pipeline",
    description:
      "A deep-dive into how we reduced production video processing latency from 800ms to 400ms without touching the core algorithm. The fix wasn't clever — it was obvious in hindsight. Most performance wins are.",
    publication: "Personal",
    date: "Feb 2025",
    slug: "latency-hash-maps",
    tags: ["Python", "asyncio", "Performance", "Data Structures"],
    status: "published",
    readingTime: "12 min read",
  },
  {
    title: "I Built a Bayesian Email Classifier Without a Single ML Library",
    description:
      "ScrollOS classifies 1,000+ newsletters per user at 90% accuracy using n-gram frequency tables and Bayes' theorem — implemented from scratch in ~200 lines of TypeScript. Here's exactly how it works.",
    publication: "Personal",
    date: "Jan 2025",
    slug: "bayesian-email-classifier",
    tags: ["TypeScript", "Bayesian", "NLP", "SaaS"],
    status: "published",
    readingTime: "14 min read",
  },
  {
    title: "Kubernetes Resource Requests vs Limits: The Setting Nobody Explains Correctly",
    description:
      "After tuning CPU/memory for real-time frame processing at 60fps, I have strong opinions on requests vs limits. The docs tell you what they do — they don't tell you what happens when you get it wrong at 3am.",
    publication: "Personal",
    date: "Dec 2024",
    slug: "kubernetes-requests-limits",
    tags: ["Kubernetes", "DevOps", "Performance", "Infrastructure"],
    status: "published",
    readingTime: "11 min read",
  },
  {
    title: "GPT-4 Fallback Chains: Keeping Your AI Feature Alive When the Provider Isn't",
    description:
      "TalentSync uses a GPT-4 → GPT-4o-mini fallback with Zod-validated structured outputs. The pattern is simple but the failure modes aren't. A practical guide to LLM reliability in production.",
    publication: "Personal",
    date: "Nov 2024",
    slug: "gpt4-fallback-chains",
    tags: ["LLMs", "TypeScript", "Zod", "OpenAI"],
    status: "published",
    readingTime: "10 min read",
  },
  {
    title: "Redis Pub/Sub vs WebSockets: What I Learned Building Real-Time SaaS",
    description:
      "ScrollOS uses both — and they solve different problems. After shipping 40% throughput improvements by combining them with batched writes, here's the mental model I use to decide which tool to reach for.",
    publication: "Personal",
    date: "Oct 2024",
    slug: "redis-pubsub-websockets",
    tags: ["Redis", "WebSockets", "Node.js", "Architecture"],
    status: "published",
    readingTime: "13 min read",
  },
];

export const experience: ExperienceEntry[] = [
  {
    role: "Platform Engineer",
    company: "Quantiphi",
    period: "Aug 2024 — Present",
    location: "Mumbai, India",
    description:
      "Designing and operating production infrastructure for global-scale systems.",
    bullets: [
      "Architected a real-time safety video analytics pipeline serving 10M+ annual visitors across 5+ global attractions with 99% uptime SLA.",
      "Reduced production latency 50% (800ms → 400ms) via optimized data structures (hash maps, priority queues) and Kubernetes resource tuning.",
      "Built high-throughput Python asyncio microservices processing 60+ frames/sec per stream with zero downtime and automatic retry.",
      "Orchestrated CI/CD via GitLab + Helm, cutting deployment time 40% and improving team ramp-up time by 50%.",
    ],
    tags: ["Python", "Kubernetes", "Redis", "GitLab CI/CD", "asyncio"],
  },
  {
    role: "Framework Engineer Intern",
    company: "Quantiphi",
    period: "Feb 2024 — Aug 2024",
    location: "Mumbai, India",
    description:
      "Designed reusable cloud-native infrastructure templates and optimized data pipelines.",
    bullets: [
      "Designed cloud-native application templates across AWS & GCP using Docker and Kubernetes, reducing new service deployment time by 92%.",
      "Optimized automated ELT pipelines with Apache Airflow, improving data processing efficiency by 25% through parallelization and SQL query optimization.",
    ],
    tags: ["AWS", "GCP", "Docker", "Kubernetes", "Apache Airflow"],
  },
];

export const projects: ProjectEntry[] = [
    {
    name: "AskMitra",
    role: "Founder & Lead Engineer",
    tagline: "AI sales assistant for e-commerce",
    description:
      "An AI-powered sales assistant for e-commerce storefronts. Focused on revenue-driving automation — not generic chatbots.",
    bullets: [
      "Architected full AI pipeline: catalog ingestion → embedding → retrieval → conversational response.",
      "Designed low-latency product recommendation engine for conversion-focused interactions.",
      "Built merchant dashboard for monitoring AI performance and tuning responses.",
      "Implemented structured LLM outputs with schema validation for production reliability.",
    ],
    tech: ["Next.js", "OpenAI", "Gemini", "PostgreSQL", "Vector DB"],
    url: "https://askmitra.com",
    status: "live",
    featured: true,
  },
  {
    name: "ScrollOS",
    role: "Founder & Lead Engineer",
    tagline: "Intelligent email newsletter OS",
    description:
      "An end-to-end SaaS platform that intelligently organizes and classifies high-volume email newsletters. Not a CRUD app — a high-performance distributed system wrapped in clean UI.",
    bullets: [
      "Integrated Gmail/Outlook APIs via event-driven Node.js architecture; exponential backoff logic reduced inbox sync time 45% (10s → 5.5s).",
      "Built custom ML-inspired classification engine (n-grams + Bayesian probability) achieving 90% accuracy across 1,000+ newsletters per user.",
      "Improved system throughput 40% using Redis Pub/Sub, WebSockets, and batched DB writes (100+ records per flush).",
      "PostgreSQL tsvector full-text search with sub-200ms response times at scale.",
    ],
    tech: ["Next.js 15", "Node.js", "PostgreSQL", "Redis", "WebSockets"],
    url: "https://scrollos.co.in",
    github: "https://github.com/rakshittt/ScrollOS",
    status: "live",
  },
  {
    name: "TalentSync",
    role: "Creator",
    tagline: "AI-powered resume-job fit optimizer",
    description:
      "An AI-powered resume-job fit optimization engine. Engineered for reliability — not demo-ware.",
    bullets: [
      "Designed multi-model fallback system (GPT-4 primary → GPT-4o-mini fallback) ensuring resilience during rate limits and outages.",
      "Enforced strict type safety using Zod schema validation + OpenAI Structured Outputs, eliminating JSON parsing failures.",
      "Built intelligent resume-job matching logic optimized for ATS systems.",
    ],
    tech: ["Next.js 15", "TypeScript", "PostgreSQL", "AWS", "OpenAI"],
    github: "https://github.com/rakshittt/TalentSync",
    status: "beta",
  },
];

export const techStack: TechCategory[] = [
  {
    label: "Infrastructure & Cloud",
    items: ["AWS (EC2, Lambda, S3, RDS)", "GCP", "Docker", "Kubernetes", "Helm", "GitLab CI/CD", "Distributed Systems Design"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Express.js", "FastAPI", "Microservices", "REST APIs", "Event-driven architecture"],
  },
  {
    label: "Databases & Caching",
    items: ["PostgreSQL", "Redis", "MongoDB", "DynamoDB", "MySQL"],
  },
  {
    label: "Frontend",
    items: ["React", "Next.js 15", "TypeScript", "Tailwind CSS", "WebSockets", "Performance Optimization"],
  },
  {
    label: "Languages",
    items: ["TypeScript", "Python", "JavaScript", "C++", "SQL", "Bash"],
  },
  {
    label: "AI & Data",
    items: ["LLM API Integration", "Prompt Engineering", "Vector Search", "Structured Outputs", "n-gram & Bayesian Modeling"],
  },
  {
    label: "Core Foundations",
    items: ["Data Structures & Algorithms", "System Design", "Latency Optimization"],
  },
];

export const socials = {
  github: "https://github.com/rakshittt",
  linkedin: "https://linkedin.com/in/rakshitbuilds",
  twitter: "https://x.com/RakshitBuilds",
  email: "itsrakshitsjain@gmail.com",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rakshit.askmitra.com";

const content = `# Rakshit Jain — Platform Engineer & Builder

> Platform Engineer at Quantiphi building distributed systems for 10M+ users. Founder of ScrollOS and AskMitra. ECE graduate turned systems engineer. Based in Indore, India.

## About

Rakshit Jain is a Platform Engineer at Quantiphi (Mumbai, India) where he architects and operates production-grade infrastructure for real-time safety video analytics at global theme park attractions. He is also an independent SaaS founder, having built ScrollOS (email newsletter OS) and AskMitra (AI sales assistant for e-commerce).

He graduated from Shri Govindram Seksaria Institute of Technology and Science (SGSITS), Indore with a B.Tech in Electronics and Telecommunication Engineering in 2024. He is not a computer science graduate — he self-taught systems design, distributed computing, backend engineering, and cloud infrastructure while building production systems from scratch.

Key philosophy: systems should be designed for the failure case, not the happy path. Latency is a feature. Observability is not optional.

## Current Work — Quantiphi (Aug 2024 – Present)

Role: Platform Engineer

- Architected a real-time safety video analytics pipeline serving 10 million+ annual visitors across 5+ global attractions with 99% uptime SLA
- Reduced production alert latency 50% (800ms → 400ms) by replacing O(n²) post-processing loops with spatial hash maps and priority-queue frame scheduling — no hardware changes, no model changes
- Builds Python asyncio microservices processing 60+ frames/second per camera stream across 40+ simultaneous streams
- Manages CI/CD via GitLab + Helm, reducing deployment time 40% and team onboarding time 50%
- Stack: Python, Kubernetes, Redis, GitLab CI/CD, asyncio, GCP

Previous role: Framework Engineer Intern (Feb 2024 – Aug 2024)
- Designed cloud-native application templates across AWS & GCP with Docker and Kubernetes, reducing new service deployment time by 92%
- Optimized automated ELT pipelines with Apache Airflow, improving data processing efficiency 25% via parallelization and SQL query optimization

## Projects

### AskMitra — Live
- Role: Founder & Lead Engineer
- URL: ${SITE_URL.replace("rakshit.askmitra.com", "askmitra.com")} (https://askmitra.com)
- Description: AI-powered sales assistant for e-commerce storefronts. Full pipeline: catalog ingestion → vector embedding → retrieval → conversational response. Built for revenue-driving automation, not generic chatbots.
- Tech: Next.js, OpenAI, Gemini, PostgreSQL, Vector DB

### ScrollOS — Live
- Role: Founder & Lead Engineer
- URL: https://scrollos.co.in
- GitHub: https://github.com/rakshittt/ScrollOS
- Description: Intelligent email newsletter OS. Integrates Gmail/Outlook APIs with event-driven Node.js architecture. Built custom ML-inspired classification engine using n-gram frequency tables and Bayesian probability, achieving 90% accuracy across 1,000+ newsletters per user — with zero ML libraries. Improved throughput 40% via Redis Pub/Sub, WebSockets, and batched DB writes (100+ records per flush). Sub-200ms PostgreSQL full-text search at scale.
- Tech: Next.js 15, Node.js, PostgreSQL, Redis, WebSockets

### TalentSync — Beta
- Role: Creator
- GitHub: https://github.com/rakshittt/TalentSync
- Description: AI-powered resume-job fit optimizer. Multi-model fallback system (GPT-4o primary → GPT-4o-mini fallback) for reliability during provider outages. Zod schema validation + OpenAI Structured Outputs for type-safe, JSON-parsing-failure-free outputs.
- Tech: Next.js 15, TypeScript, PostgreSQL, AWS, OpenAI

## Technical Skills

Infrastructure & Cloud: AWS (EC2, Lambda, S3, RDS), GCP, Docker, Kubernetes, Helm, GitLab CI/CD, Distributed Systems Design

Backend: Node.js, Express.js, FastAPI, Python asyncio, Microservices, REST APIs, Event-driven Architecture

Databases & Caching: PostgreSQL (tsvector full-text search, UNNEST batch inserts), Redis (Pub/Sub, Streams, Lists), MongoDB, DynamoDB, MySQL

Frontend: React, Next.js 15, TypeScript, WebSockets, Performance Optimization

AI & Data: LLM API Integration (OpenAI, Gemini), Prompt Engineering, Vector Search, Structured Outputs, Zod Validation, Bayesian Modeling, n-gram Feature Extraction

Core Foundations: Data Structures & Algorithms, System Design, Latency Optimization, Kubernetes Resource Tuning

Languages: TypeScript, Python, JavaScript, C++, SQL, Bash

## Certifications

- Google Cloud Certified Associate Cloud Engineer (Google Cloud)
- AWS Solutions Architect Associate (pursuing)

## Writing & Technical Articles

All articles: ${SITE_URL}/writing

### 50% Latency in 30 Days: What Hash Maps and Priority Queues Did to Our Video Pipeline
- URL: ${SITE_URL}/writing/latency-hash-maps
- Tags: Python, asyncio, Performance, Data Structures
- Reading time: ~12 min
- Summary: Full post-mortem of reducing production video processing latency from 800ms to 400ms at Quantiphi. Root cause was O(n²) post-processing loops (zone lookup and deduplication) that grew from 40ms to 380ms as detection counts scaled from 12 to 200 per frame. Fix: spatial hash map for O(1) zone lookup, camera-indexed deduplication with precomputed overlap sets, and priority-queue frame scheduling. No hardware changes, no model changes.

### I Built a Bayesian Email Classifier Without a Single ML Library
- URL: ${SITE_URL}/writing/bayesian-email-classifier
- Tags: TypeScript, Bayesian, NLP, SaaS
- Reading time: ~14 min
- Summary: ScrollOS classifies 1,000+ newsletters/user at 90% accuracy using n-gram frequency tables and Bayes theorem in approximately 200 lines of TypeScript. Full implementation: tokenizer, n-gram extractor (unigrams + bigrams), Naive Bayes fit/predict with Laplace smoothing, JSON serialization, two-stage classification (domain heuristic → per-user model → global model). Classification latency under 2ms vs 200-800ms for LLM-based approaches.

### Kubernetes Resource Requests vs Limits: The Setting Nobody Explains Correctly
- URL: ${SITE_URL}/writing/kubernetes-requests-limits
- Tags: Kubernetes, DevOps, Performance, Infrastructure
- Reading time: ~11 min
- Summary: Practical guide to Kubernetes resource sizing from real-time 60fps frame processing experience. Covers: requests vs limits mental model, CPU throttling (invisible, checked via cgroup stats), OOMKill (hard restart, requires memory headroom), QoS classes (Guaranteed/Burstable/BestEffort), VPA in recommendation mode, and the controversial case for removing CPU limits on batch workloads.

### GPT-4 Fallback Chains: Keeping Your AI Feature Alive When the Provider Isn't
- URL: ${SITE_URL}/writing/gpt4-fallback-chains
- Tags: LLMs, TypeScript, Zod, OpenAI
- Reading time: ~10 min
- Summary: TalentSync uses a 3-level fallback: GPT-4o primary (2 attempts with backoff) → GPT-4o-mini (2 attempts) → degraded mode with minimal schema. Key insight: Zod validation turns silent quality failures into detectable errors. Different models have independent rate limit buckets — a key advantage of the two-model approach. Monitoring: alert when fallback rate exceeds 5% over 5 minutes.

### Redis Pub/Sub vs WebSockets: What I Learned Building Real-Time SaaS
- URL: ${SITE_URL}/writing/redis-pubsub-websockets
- Tags: Redis, WebSockets, Node.js, Architecture
- Reading time: ~13 min
- Summary: ScrollOS uses both. Mental model: WebSockets = server-to-client transport (one connection, one client). Redis Pub/Sub = server-to-server broker (decoupled, scales horizontally). The horizontal scaling trap: WebSockets alone means users connected to Server B don't receive events published on Server A. Solution: Redis Pub/Sub as fan-out layer. UNNEST batch inserts reduce DB round trips 99%. Combined: 40% throughput improvement.

## Education

- B.Tech, Electronics and Telecommunication Engineering
- Shri Govindram Seksaria Institute of Technology and Science (SGSITS), Indore
- 2020 – 2024

## Contact & Links

- Portfolio: ${SITE_URL}
- Email: itsrakshitsjain@gmail.com
- GitHub: https://github.com/rakshittt
- LinkedIn: https://linkedin.com/in/rakshitbuilds
- Twitter/X: https://x.com/RakshitBuilds
`;

export async function GET() {
  return new Response(content.trim(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}

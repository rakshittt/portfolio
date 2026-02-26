import type { Block } from "../blocks";

export const content: Block[] = [
  {
    type: "callout",
    variant: "insight",
    text: "OpenAI has 99.9% uptime SLA on their API. That's 8.7 hours of downtime per year. When your AI feature goes down, users don't see an SLA number — they see a broken product. Design for the 0.1%.",
  },
  {
    type: "paragraph",
    text: "TalentSync is a resume-job fit optimizer. Users paste a job description, upload their resume, and get an analysis of fit, gaps, and specific suggestions for tailoring their application. The core feature is entirely AI-powered: extract structure, compare competencies, generate suggestions. No AI = no product.",
  },
  {
    type: "paragraph",
    text: "That dependency is a risk. I designed a fallback chain from day one. Here's the complete implementation: GPT-4 primary, GPT-4o-mini fallback, Zod-validated outputs, retry logic with exponential backoff, and the monitoring that lets you know when things are degraded before users do.",
  },
  {
    type: "h2",
    text: "Why You Need a Fallback Chain",
  },
  {
    type: "paragraph",
    text: "LLM provider failures fall into four categories:",
  },
  {
    type: "list",
    ordered: true,
    items: [
      "Hard outages: the API returns 5xx errors. These are visible and rare (~4 hours/year for major providers).",
      "Rate limiting: you've exceeded your tier's RPM (requests per minute) or TPM (tokens per minute). This happens more often than you'd expect during traffic spikes.",
      "Timeout: the API hangs for 30+ seconds. This happens during high-load periods even when the API isn't fully down.",
      "Degraded quality: the API returns 200 but the response is malformed, truncated, or nonsensical. This is the hardest failure mode to catch because it looks like success.",
    ],
  },
  {
    type: "paragraph",
    text: "A simple retry handles cases 1 and 3. A fallback model handles case 2 (rate limits on the primary model don't affect rate limits on a different model). Zod validation handles case 4 — it turns a silent quality failure into a detectable error you can route around.",
  },
  {
    type: "h2",
    text: "The Output Schema: Start Here",
  },
  {
    type: "paragraph",
    text: "Before writing any LLM code, define what success looks like as a TypeScript type and a Zod schema. This forces clarity and gives you a validation layer that catches bad responses before they reach your users.",
  },
  {
    type: "code",
    language: "typescript",
    filename: "schemas.ts",
    code: `import { z } from "zod";

export const AnalysisResultSchema = z.object({
  fitScore: z.number().min(0).max(100),
  fitSummary: z.string().min(20).max(300),
  strengths: z.array(z.string().min(5)).min(1).max(6),
  gaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["critical", "moderate", "minor"]),
      suggestion: z.string().min(20),
    })
  ).max(8),
  tailoringTips: z.array(z.string().min(20)).min(2).max(5),
  keywordMatches: z.array(z.string()).max(20),
  atsOptimizations: z.array(z.string()).max(5),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

// Minimal fallback schema — used when the full schema fails
// This ensures we can always return something useful
export const MinimalAnalysisSchema = z.object({
  fitScore: z.number().min(0).max(100),
  fitSummary: z.string().min(10),
  strengths: z.array(z.string()).min(1),
  gaps: z.array(z.object({
    skill: z.string(),
    severity: z.enum(["critical", "moderate", "minor"]),
    suggestion: z.string(),
  })),
  tailoringTips: z.array(z.string()).min(1),
  keywordMatches: z.array(z.string()),
  atsOptimizations: z.array(z.string()),
});`,
  },
  {
    type: "h2",
    text: "Structured Outputs vs JSON Mode",
  },
  {
    type: "paragraph",
    text: "OpenAI offers two ways to get structured JSON: JSON mode (set response_format to json_object) and Structured Outputs (set response_format to json_schema with your schema). The difference matters:",
  },
  {
    type: "list",
    items: [
      "JSON mode: guarantees valid JSON syntax, but not your schema. You can still get {\"result\": null} instead of the full object.",
      "Structured Outputs: guarantees adherence to your exact schema. GPT-4o and GPT-4o-mini support this. GPT-4 (original) does not.",
      "Zod + Structured Outputs: belt and suspenders. Structured Outputs guarantees the schema; Zod validates the values (e.g., fitScore must be 0-100, not -5 or 200).",
    ],
  },
  {
    type: "code",
    language: "typescript",
    filename: "llm-client.ts",
    code: `import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { AnalysisResultSchema, MinimalAnalysisSchema } from "./schemas";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface CallOptions {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  schema: z.ZodSchema;
  maxTokens?: number;
  timeoutMs?: number;
}

async function callWithStructuredOutput<T>(options: CallOptions): Promise<T> {
  const { model, systemPrompt, userPrompt, schema, maxTokens = 2048, timeoutMs = 30_000 } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await openai.beta.chat.completions.parse(
      {
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: zodResponseFormat(schema, "analysis"),
        max_tokens: maxTokens,
      },
      { signal: controller.signal }
    );

    const parsed = response.choices[0].message.parsed;
    if (!parsed) {
      throw new Error("Model refused to generate a structured response");
    }

    // Validate with Zod (belt and suspenders after Structured Outputs)
    return schema.parse(parsed) as T;
  } finally {
    clearTimeout(timeout);
  }
}`,
  },
  {
    type: "h2",
    text: "The Fallback Chain Implementation",
  },
  {
    type: "paragraph",
    text: "The chain has three levels: GPT-4o primary (best quality), GPT-4o-mini fallback (cheaper, faster, still good), and a degraded mode that returns a partial result. Each level tries twice with exponential backoff before falling to the next.",
  },
  {
    type: "code",
    language: "typescript",
    filename: "analyze.ts",
    code: `import { AnalysisResultSchema, MinimalAnalysisSchema, type AnalysisResult } from "./schemas";
import { callWithStructuredOutput } from "./llm-client";

const SYSTEM_PROMPT = \`You are a resume analysis expert. Given a job description and resume,
provide a detailed fit analysis with specific, actionable recommendations.
Be concrete and specific — vague advice is worthless to job seekers.\`;

function buildUserPrompt(jobDescription: string, resumeText: string): string {
  return \`JOB DESCRIPTION:
\${jobDescription.slice(0, 3000)}

RESUME:
\${resumeText.slice(0, 3000)}

Analyze the fit between this resume and job description. Be specific about gaps and provide
concrete suggestions for how to address each gap in the resume.\`;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;

      // Don't retry on validation errors — bad output won't improve with retries
      if (err instanceof ZodError) throw err;

      // Don't retry on abort (timeout)
      if ((err as Error).name === "AbortError") throw err;

      if (attempt < maxAttempts) {
        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

export async function analyzeResumeFit(
  jobDescription: string,
  resumeText: string
): Promise<AnalysisResult & { model: string; degraded: boolean }> {
  const userPrompt = buildUserPrompt(jobDescription, resumeText);

  // Level 1: GPT-4o with full schema, 2 attempts
  try {
    const result = await withRetry(
      () => callWithStructuredOutput<AnalysisResult>({
        model: "gpt-4o",
        systemPrompt: SYSTEM_PROMPT,
        userPrompt,
        schema: AnalysisResultSchema,
        timeoutMs: 45_000,
      }),
      2,
      1000
    );
    return { ...result, model: "gpt-4o", degraded: false };
  } catch (primaryError) {
    console.error("[analyzeResumeFit] GPT-4o failed:", (primaryError as Error).message);
  }

  // Level 2: GPT-4o-mini fallback, 2 attempts
  try {
    const result = await withRetry(
      () => callWithStructuredOutput<AnalysisResult>({
        model: "gpt-4o-mini",
        systemPrompt: SYSTEM_PROMPT,
        userPrompt,
        schema: AnalysisResultSchema,
        timeoutMs: 30_000,
      }),
      2,
      500
    );
    return { ...result, model: "gpt-4o-mini", degraded: false };
  } catch (fallbackError) {
    console.error("[analyzeResumeFit] GPT-4o-mini failed:", (fallbackError as Error).message);
  }

  // Level 3: GPT-4o-mini with minimal schema — return partial result
  // This almost never fails unless OpenAI is completely down
  try {
    const result = await callWithStructuredOutput({
      model: "gpt-4o-mini",
      systemPrompt: SYSTEM_PROMPT,
      userPrompt,
      schema: MinimalAnalysisSchema,
      maxTokens: 1024,  // Shorter = more likely to succeed
      timeoutMs: 20_000,
    });
    return { ...result as AnalysisResult, model: "gpt-4o-mini", degraded: true };
  } catch {
    throw new Error("All LLM providers failed. This indicates a complete OpenAI outage.");
  }
}`,
  },
  {
    type: "h2",
    text: "The Failure Modes You Don't Expect",
  },
  {
    type: "paragraph",
    text: "After running this in production for several months, here are the failures I didn't anticipate:",
  },
  {
    type: "list",
    items: [
      "Rate limits on gpt-4o don't affect gpt-4o-mini rate limits. This is the biggest win of the two-model approach — different models have independent rate limit buckets.",
      "Structured Outputs occasionally returns null for a required field. The model 'refuses' to fill in a field it considers sensitive or inappropriate. Zod catches this; the fallback handles it.",
      "Long resumes (10+ pages) hit context window limits and produce truncated JSON. We now truncate inputs to 3,000 chars each before sending. For longer documents, we extract the most relevant sections first.",
      "The degraded mode (level 3) returns a result users can still act on. It's better than a generic error message. Tell users when they're getting a degraded response — they appreciate honesty.",
    ],
  },
  {
    type: "h2",
    text: "Monitoring: How You Know Before Users Do",
  },
  {
    type: "code",
    language: "typescript",
    filename: "monitoring.ts",
    code: `// Track model usage and fallback rates
export async function trackAnalysis(result: {
  model: string;
  degraded: boolean;
  durationMs: number;
  userId: string;
}) {
  await analytics.track({
    event: "resume_analysis_complete",
    properties: {
      model: result.model,
      degraded: result.degraded,
      duration_ms: result.durationMs,
      is_fallback: result.model === "gpt-4o-mini",
    },
  });

  // Alert if fallback rate > 5% over rolling 5 minutes
  await incrementCounter("llm_requests_total");
  if (result.model === "gpt-4o-mini") {
    await incrementCounter("llm_fallback_total");
  }
}

// In your monitoring system, alert on:
// llm_fallback_total / llm_requests_total > 0.05 over 5m
// llm_fallback_total / llm_requests_total > 0.20 over 1m (page someone)`,
  },
  {
    type: "metrics",
    items: [
      { label: "Primary model success rate", value: "99.2%", description: "GPT-4o in production" },
      { label: "Fallback trigger rate", value: "0.8%", description: "Routes to GPT-4o-mini" },
      { label: "Level 3 trigger rate", value: "<0.01%", description: "Degraded mode almost never needed" },
      { label: "User-visible errors", value: "0", description: "Since adding fallback chain" },
    ],
  },
  {
    type: "h2",
    text: "Cost Implications",
  },
  {
    type: "paragraph",
    text: "GPT-4o costs roughly 10x more per token than GPT-4o-mini. With a 0.8% fallback rate, the cost impact is negligible — you're paying for 0.8% of requests at 10x lower cost. The real cost saving is the avoided incident response and user churn from an outage.",
  },
  {
    type: "paragraph",
    text: "One tactical note: we do NOT use the fallback model for cost optimization. The fallback is strictly for reliability. If you start routing requests to the cheaper model for cost reasons, you've mixed two concerns and the reliability semantics break down.",
  },
  {
    type: "callout",
    variant: "insight",
    text: "Zod is the most underrated part of this architecture. Without it, a malformed LLM response is a runtime error somewhere deep in your rendering code with a confusing stack trace. With it, malformed responses fail fast at the boundary with a clear error you can route around. Always validate LLM outputs at the API boundary.",
  },
];

import type { Block } from "../blocks";
import { content as latencyHashMaps } from "./latency-hash-maps";
import { content as bayesianEmailClassifier } from "./bayesian-email-classifier";
import { content as kubernetesRequestsLimits } from "./kubernetes-requests-limits";
import { content as gpt4FallbackChains } from "./gpt4-fallback-chains";
import { content as redisPubsubWebsockets } from "./redis-pubsub-websockets";

const registry: Record<string, Block[]> = {
  "latency-hash-maps": latencyHashMaps,
  "bayesian-email-classifier": bayesianEmailClassifier,
  "kubernetes-requests-limits": kubernetesRequestsLimits,
  "gpt4-fallback-chains": gpt4FallbackChains,
  "redis-pubsub-websockets": redisPubsubWebsockets,
};

export function getArticleContent(slug: string): Block[] | null {
  return registry[slug] ?? null;
}

export function getAllSlugs(): string[] {
  return Object.keys(registry);
}

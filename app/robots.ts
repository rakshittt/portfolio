import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rakshit.askmitra.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow all
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      // Google
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Googlebot-Image", allow: "/" },
      { userAgent: "AdsBot-Google", allow: "/" },
      // Bing
      { userAgent: "Bingbot", allow: "/" },
      // OpenAI / ChatGPT
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      // Anthropic / Claude
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      // Perplexity
      { userAgent: "PerplexityBot", allow: "/" },
      // Common Crawl (training data)
      { userAgent: "CCBot", allow: "/" },
      // Apple
      { userAgent: "Applebot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      // ByteDance / TikTok
      { userAgent: "Bytespider", allow: "/" },
      // DuckDuckGo
      { userAgent: "DuckAssistBot", allow: "/" },
      // Meta
      { userAgent: "Meta-ExternalAgent", allow: "/" },
      { userAgent: "Meta-ExternalFetcher", allow: "/" },
      // Cohere
      { userAgent: "cohere-ai", allow: "/" },
      // You.com
      { userAgent: "YouBot", allow: "/" },
      // Diffbot (used by LinkedIn, others)
      { userAgent: "Diffbot", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

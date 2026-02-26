import type { MetadataRoute } from "next";
import { articles } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rakshit.askmitra.com";

const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseArticleDate(dateStr: string): Date {
  const [month, year] = dateStr.split(" ");
  const m = MONTH_MAP[month];
  const y = parseInt(year);
  if (!isNaN(y) && m !== undefined) return new Date(y, m, 1);
  return new Date();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const articleRoutes = articles
    .filter((a) => a.status === "published" && a.slug)
    .map((a) => ({
      url: `${SITE_URL}/writing/${a.slug}`,
      lastModified: parseArticleDate(a.date),
      changeFrequency: "never" as const,
      priority: 0.7,
    }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    ...articleRoutes,
  ];
}

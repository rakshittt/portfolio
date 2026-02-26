import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { articles } from "@/lib/data";
import { getArticleContent, getAllSlugs } from "@/lib/articles/index";
import BlockRenderer from "@/components/article/BlockRenderer";
import ArticleNav from "@/components/article/ArticleNav";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rakshit.askmitra.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) return { title: "Article Not Found" };

  const url = `${SITE_URL}/writing/${slug}`;

  return {
    title: article.title,
    description: article.description,
    keywords: article.tags,
    authors: [{ name: "Rakshit Jain", url: SITE_URL }],
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      type: "article",
      siteName: "Rakshit Jain",
      authors: ["Rakshit Jain"],
      publishedTime: article.date,
      tags: article.tags,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      site: "@RakshitBuilds",
      creator: "@RakshitBuilds",
      title: article.title,
      description: article.description,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  const article = articles.find((a) => a.slug === slug);
  const blocks = getArticleContent(slug);

  if (!article || !blocks) {
    notFound();
  }

  const url = `${SITE_URL}/writing/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": url,
        headline: article.title,
        description: article.description,
        url,
        datePublished: article.date,
        dateModified: article.date,
        inLanguage: "en-US",
        keywords: article.tags.join(", "),
        ...(article.readingTime ? { timeRequired: article.readingTime } : {}),
        author: {
          "@type": "Person",
          "@id": `${SITE_URL}/#person`,
          name: "Rakshit Jain",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Person",
          "@id": `${SITE_URL}/#person`,
          name: "Rakshit Jain",
        },
        isPartOf: {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          url: SITE_URL,
          name: "Rakshit Jain",
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Writing", item: `${SITE_URL}/#writing` },
          { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Fixed nav background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          zIndex: 100,
          backgroundColor: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      />

      {/* Article container */}
      <div
        style={{
          maxWidth: "720px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          paddingTop: "5rem",
          paddingBottom: "6rem",
        }}
      >
        <ArticleNav article={article} />

        <article>
          <BlockRenderer blocks={blocks} />
        </article>

        {/* Footer */}
        <footer
          style={{
            marginTop: "4rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <a
            href="/#writing"
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              textDecoration: "none",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transition: "color 0.2s",
            }}
            >
            ← All writing
          </a>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {article.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "var(--font-jetbrains)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.04em",
                  padding: "2px 8px",
                  borderRadius: "3px",
                  border: "1px solid var(--border-accent)",
                  backgroundColor: "var(--bg-elevated)",
                  color: "var(--text-muted)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </main>
  );
}

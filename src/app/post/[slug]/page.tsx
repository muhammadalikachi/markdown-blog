import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPublishedPosts } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Params) {
  const post = getPost(params.slug);
  if (!post || post.draft) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      url: `${SITE_URL}/post/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: `${SITE_URL}/post/${post.slug}`,
    },
  };
}

export default function PostPage({ params }: Params) {
  const post = getPost(params.slug);
  if (!post || post.draft) notFound();

  const html = renderMarkdown(post.content);
  const published = getPublishedPosts();
  const idx = published.findIndex((p) => p.slug === post.slug);
  const newer = idx > 0 ? published[idx - 1] : null;
  const older = idx >= 0 && idx < published.length - 1 ? published[idx + 1] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    keywords: post.tags.join(", "),
    mainEntityOfPage: `${SITE_URL}/post/${post.slug}`,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="article-header">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <time dateTime={post.date}>{post.date}</time>
          <span>
            <Link href="/">← All posts</Link>
          </span>
        </div>
        {post.tags.length > 0 && (
          <div className="article-tags">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`} className="tag-pill">
                {tag}
              </Link>
            ))}
          </div>
        )}
      </header>
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      <nav style={{ display: "flex", justifyContent: "space-between", marginTop: "3rem" }}>
        {older ? (
          <Link href={`/post/${older.slug}`}>← {older.title}</Link>
        ) : (
          <span />
        )}
        {newer && <Link href={`/post/${newer.slug}`}>{newer.title} →</Link>}
      </nav>
    </article>
  );
}

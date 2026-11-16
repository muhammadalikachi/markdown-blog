import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getPublishedPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const published = getPublishedPosts();

  const posts = published.map((post) => ({
    url: `${SITE_URL}/post/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  const tags = [...new Set(published.flatMap((p) => p.tags))].map((tag) => ({
    url: `${SITE_URL}/tag/${encodeURIComponent(tag)}`,
  }));

  return [
    { url: SITE_URL, lastModified: new Date() },
    ...posts,
    ...tags,
  ];
}

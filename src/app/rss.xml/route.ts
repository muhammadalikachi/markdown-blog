import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import { getPublishedPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

/** RSS 2.0 feed at /rss.xml */
export async function GET() {
  const posts = getPublishedPosts();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/post/${post.slug}`;
      const categories = post.tags
        .map((tag) => `<category><![CDATA[${tag}]]></category>`)
        .join("");
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      ${categories}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}

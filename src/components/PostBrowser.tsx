"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

interface Props {
  posts: PostMeta[];
  tags: { tag: string; count: number }[];
  initialTag?: string;
}

/**
 * Client-side instant search + tag filtering over the post list.
 * The full (small) list of post metadata is passed from the server,
 * so filtering happens with zero network round-trips.
 */
export default function PostBrowser({ posts, tags, initialTag }: Props) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState(initialTag ?? "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (activeTag && !p.tags.includes(activeTag)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [posts, query, activeTag]);

  return (
    <>
      <input
        className="search-bar"
        type="search"
        placeholder="Search posts…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search posts"
      />

      <nav className="tag-list" aria-label="Filter by tag">
        <Link
          href="/"
          className={`tag-pill ${activeTag === "" ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            setActiveTag("");
          }}
        >
          All ({posts.length})
        </Link>
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tag/${encodeURIComponent(tag)}`}
            className={`tag-pill ${activeTag === tag ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTag(tag);
            }}
          >
            {tag} ({count})
          </Link>
        ))}
      </nav>

      <div className="post-list">
        {filtered.length === 0 ? (
          <p className="empty-state">No posts match your search.</p>
        ) : (
          filtered.map((post) => (
            <Link key={post.slug} href={`/post/${post.slug}`} className="post-card">
              <h2>{post.title}</h2>
              <div className="post-meta">
                <time dateTime={post.date}>{post.date}</time>
                {post.tags.length > 0 && <span>#{post.tags.join(" #")}</span>}
              </div>
              <p className="post-excerpt">{post.excerpt}</p>
            </Link>
          ))
        )}
      </div>
    </>
  );
}

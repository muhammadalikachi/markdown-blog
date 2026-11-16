import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * File-based content layer.
 * Posts are plain .md files with YAML frontmatter, stored in POSTS_DIR.
 * No database - ever.
 */

export const POSTS_DIR = process.env.POSTS_DIR
  ? path.resolve(process.env.POSTS_DIR)
  : path.resolve(process.cwd(), "posts");

export const UPLOADS_DIR = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.resolve(process.cwd(), "uploads");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  draft: boolean;
  excerpt: string;
}

export interface Post extends PostMeta {
  content: string; // raw markdown (without frontmatter)
}

/** Ensure the storage folders exist (idempotent, safe at runtime). */
export function ensureDirs() {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function slugFromFile(filename: string): string {
  return filename.replace(/\.md$/i, "");
}

function toMeta(slug: string, data: Record<string, unknown>, content: string): PostMeta {
  const title = typeof data.title === "string" && data.title.trim() ? data.title.trim() : slug;
  const date =
    typeof data.date === "string" && data.date.trim()
      ? data.date.trim()
      : new Date().toISOString().slice(0, 10);
  const tags = Array.isArray(data.tags)
    ? data.tags.map(String)
    : typeof data.tags === "string"
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
  const draft = data.draft === true;
  // Excerpt: explicit frontmatter, else first ~160 chars of plain text.
  let excerpt = typeof data.excerpt === "string" ? data.excerpt.trim() : "";
  if (!excerpt) {
    const plain = content
      .replace(/```[\s\S]*?```/g, "")
      .replace(/[#>*_`~\-]+/g, " ")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/\s+/g, " ")
      .trim();
    excerpt = plain.slice(0, 160) + (plain.length > 160 ? "…" : "");
  }
  return { slug, title, date, tags, draft, excerpt };
}

function readPostFile(filePath: string, slug: string): Post | null {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = matter(raw);
    const meta = toMeta(slug, parsed.data, parsed.content);
    return { ...meta, slug, content: parsed.content };
  } catch {
    return null;
  }
}

/** All posts (including drafts). Sorted newest first. */
export function getAllPosts(): Post[] {
  ensureDirs();
  let files: string[] = [];
  try {
    files = fs.readdirSync(POSTS_DIR).filter((f) => f.toLowerCase().endsWith(".md"));
  } catch {
    return [];
  }
  const posts = files
    .map((f) => readPostFile(path.join(POSTS_DIR, f), slugFromFile(f)))
    .filter((p): p is Post => p !== null);
  return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** Published posts only - what the public site shows. */
export function getPublishedPosts(): Post[] {
  return getAllPosts().filter((p) => !p.draft);
}

export function getPost(slug: string): Post | null {
  if (!isSafeSlug(slug)) return null;
  return readPostFile(path.join(POSTS_DIR, `${slug}.md`), slug);
}

export function savePost(slug: string, frontmatter: Record<string, unknown>, content: string) {
  ensureDirs();
  if (!isSafeSlug(slug)) throw new Error("Invalid slug");
  const fm = matter.stringify(content, frontmatter);
  fs.writeFileSync(path.join(POSTS_DIR, `${slug}.md`), fm, "utf8");
}

export function deletePost(slug: string): boolean {
  if (!isSafeSlug(slug)) return false;
  const file = path.join(POSTS_DIR, `${slug}.md`);
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    return true;
  }
  return false;
}

export function slugExists(slug: string): boolean {
  return isSafeSlug(slug) && fs.existsSync(path.join(POSTS_DIR, `${slug}.md`));
}

/** Slugify a title: lowercase, ascii-ish, hyphenated. */
export function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "untitled"
  );
}

/** Prevent path traversal: slugs must be simple URL-safe strings. */
export function isSafeSlug(slug: string): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9-_]*$/.test(slug) && !slug.startsWith(".");
}

/** Every tag in use, with counts. */
export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getPublishedPosts()) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

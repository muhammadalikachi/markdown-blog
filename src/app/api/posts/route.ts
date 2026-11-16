import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getAllPosts,
  slugify,
  slugExists,
  savePost,
} from "@/lib/posts";

export const dynamic = "force-dynamic";

function requireAuth() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/** List all posts (including drafts) for the admin dashboard. */
export async function GET() {
  const denied = requireAuth();
  if (denied) return denied;
  return NextResponse.json({ posts: getAllPosts() });
}

/** Create a new post. Body: { slug?, title, date?, tags?, draft?, content } */
export async function POST(req: NextRequest) {
  const denied = requireAuth();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  if (!body || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (typeof body.content !== "string") {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  let slug: string =
    typeof body.slug === "string" && body.slug.trim()
      ? slugify(body.slug.trim())
      : slugify(body.title);

  // De-collide: my-post, my-post-2, my-post-3, ...
  if (slugExists(slug)) {
    let i = 2;
    while (slugExists(`${slug}-${i}`)) i++;
    slug = `${slug}-${i}`;
  }

  const post = {
    title: body.title.trim(),
    date:
      typeof body.date === "string" && body.date.trim()
        ? body.date.trim()
        : new Date().toISOString().slice(0, 10),
    tags: Array.isArray(body.tags)
      ? body.tags.map(String).filter(Boolean)
      : typeof body.tags === "string"
        ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [],
    draft: body.draft === true,
  };

  try {
    savePost(slug, post, body.content);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
  return NextResponse.json({ ok: true, slug }, { status: 201 });
}

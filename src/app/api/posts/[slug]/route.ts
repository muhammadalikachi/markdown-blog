import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPost, savePost, deletePost, slugify, slugExists } from "@/lib/posts";

export const dynamic = "force-dynamic";

interface Params {
  params: { slug: string };
}

function requireAuth() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/** Fetch a single post (including drafts) for editing. */
export async function GET(_req: NextRequest, { params }: Params) {
  const denied = requireAuth();
  if (denied) return denied;

  const post = getPost(params.slug);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

/** Update an existing post. Body: { title, date, tags, draft, content, slug? } */
export async function PUT(req: NextRequest, { params }: Params) {
  const denied = requireAuth();
  if (denied) return denied;

  const existing = getPost(params.slug);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (typeof body.content !== "string") {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  // Allow renaming the slug; de-collide if the new slug is taken by another post.
  let slug = params.slug;
  if (typeof body.slug === "string" && body.slug.trim()) {
    const wanted = slugify(body.slug.trim());
    if (wanted !== params.slug && slugExists(wanted)) {
      return NextResponse.json(
        { error: `A post with slug "${wanted}" already exists` },
        { status: 409 }
      );
    }
    slug = wanted;
  }

  const meta = {
    title: body.title.trim(),
    date:
      typeof body.date === "string" && body.date.trim()
        ? body.date.trim()
        : existing.date,
    tags: Array.isArray(body.tags)
      ? body.tags.map(String).filter(Boolean)
      : typeof body.tags === "string"
        ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : existing.tags,
    draft: body.draft === true,
  };

  try {
    if (slug !== params.slug) deletePost(params.slug);
    savePost(slug, meta, body.content);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
  return NextResponse.json({ ok: true, slug });
}

/** Delete a post. */
export async function DELETE(_req: NextRequest, { params }: Params) {
  const denied = requireAuth();
  if (denied) return denied;

  const ok = deletePost(params.slug);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

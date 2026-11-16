import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSession } from "@/lib/auth";
import { UPLOADS_DIR, ensureDirs } from "@/lib/posts";

export const dynamic = "force-dynamic";

const ALLOWED_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif", ".ico",
]);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/** Upload an image for use in posts. Returns its public URL (/uploads/<file>). */
export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json(
      { error: `File type not allowed. Allowed: ${[...ALLOWED_EXTENSIONS].join(", ")}` },
      { status: 400 }
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File is larger than 10 MB" }, { status: 400 });
  }

  ensureDirs();

  // Descriptive, collision-safe filename: my-photo_a1b2c3.png
  const base = path
    .basename(file.name, ext)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "image";
  const random = Math.random().toString(36).slice(2, 8);
  const filename = `${base}-${random}${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(UPLOADS_DIR, filename), buffer);

  return NextResponse.json({ ok: true, url: `/uploads/${filename}` }, { status: 201 });
}

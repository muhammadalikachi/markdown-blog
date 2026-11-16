import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { renderMarkdown } from "@/lib/markdown";

export const dynamic = "force-dynamic";

/** Server-side markdown rendering for the admin live preview. */
export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const md = typeof body?.markdown === "string" ? body.markdown : "";
  return NextResponse.json({ html: renderMarkdown(md) });
}

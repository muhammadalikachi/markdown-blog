"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Post } from "@/lib/posts";

type View = "loading" | "login" | "list" | "editor";

interface Draft {
  slug: string | null; // null = creating new
  title: string;
  slugInput: string;
  date: string;
  tags: string;
  draft: boolean;
  content: string;
}

const emptyDraft = (): Draft => ({
  slug: null,
  title: "",
  slugInput: "",
  date: new Date().toISOString().slice(0, 10),
  tags: "",
  draft: false,
  content: "",
});

export default function AdminPage() {
  const [view, setView] = useState<View>("loading");
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [previewHtml, setPreviewHtml] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const loadPosts = useCallback(async () => {
    const res = await fetch("/api/posts");
    if (res.status === 401) {
      setView("login");
      return;
    }
    const data = await res.json();
    setPosts(data.posts ?? []);
    setView("list");
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        setUser(data.user);
        loadPosts();
      })
      .catch(() => setView("login"));
  }, [loadPosts]);

  // ---- Live preview: debounced server-side render ----
  useEffect(() => {
    if (view !== "editor") return;
    if (previewTimer.current) clearTimeout(previewTimer.current);
    previewTimer.current = setTimeout(async () => {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown: draft.content }),
      });
      if (res.ok) {
        const data = await res.json();
        setPreviewHtml(data.html);
      }
    }, 350);
    return () => {
      if (previewTimer.current) clearTimeout(previewTimer.current);
    };
  }, [draft.content, view]);

  // ---- Auth ----
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: form.get("user"), password: form.get("password") }),
    });
    if (!res.ok) {
      setError("Invalid username or password.");
      return;
    }
    const data = await res.json();
    setUser(data.user);
    loadPosts();
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser("");
    setView("login");
  }

  // ---- Editor actions ----
  function startNew() {
    setDraft(emptyDraft());
    setPreviewHtml("");
    setMessage("");
    setError("");
    setView("editor");
  }

  function startEdit(post: Post) {
    setDraft({
      slug: post.slug,
      title: post.title,
      slugInput: post.slug,
      date: post.date,
      tags: post.tags.join(", "),
      draft: post.draft,
      content: post.content,
    });
    setPreviewHtml("");
    setMessage("");
    setError("");
    setView("editor");
  }

  async function handleSave(publish: boolean) {
    setSaving(true);
    setError("");
    const payload = {
      title: draft.title,
      slug: draft.slugInput,
      date: draft.date,
      tags: draft.tags,
      draft: !publish,
      content: draft.content,
    };
    const res = await fetch(draft.slug ? `/api/posts/${draft.slug}` : "/api/posts", {
      method: draft.slug ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }
    // If the slug changed during edit, drop the stale cached post copy.
    setDraft((d) => ({ ...d, slug: data.slug, slugInput: data.slug }));
    setMessage(publish ? "Published ✓" : "Saved as draft ✓");
    loadPosts();
  }

  async function handleDelete(slug: string) {
    if (!confirm(`Delete post "${slug}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
    if (res.ok) loadPosts();
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Upload failed.");
      return;
    }
    // Insert markdown image at the cursor position in the content textarea.
    const snippet = `![${file.name}](${data.url})\n`;
    const el = contentRef.current;
    if (el && typeof el.selectionStart === "number") {
      const pos = el.selectionStart;
      const next =
        draft.content.slice(0, pos) + snippet + draft.content.slice(pos);
      setDraft((d) => ({ ...d, content: next }));
    } else {
      setDraft((d) => ({ ...d, content: d.content + "\n" + snippet }));
    }
    setMessage(`Image uploaded: ${data.url}`);
    e.target.value = "";
  }

  // ---- Views ----
  if (view === "loading") {
    return <p className="empty-state">Loading…</p>;
  }

  if (view === "login") {
    return (
      <div style={{ maxWidth: 380, margin: "4rem auto" }}>
        <h1 style={{ textAlign: "center" }}>Admin Login</h1>
        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <input
            className="search-bar"
            name="user"
            placeholder="Username"
            autoComplete="username"
            required
          />
          <input
            className="search-bar"
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
          />
          {error && <p style={{ color: "#d73a49", margin: 0 }}>{error}</p>}
          <button
            type="submit"
            style={{
              padding: "0.75rem",
              borderRadius: 10,
              border: "none",
              background: "var(--accent)",
              color: "var(--accent-fg)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sign in
          </button>
        </form>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", textAlign: "center" }}>
          Credentials are set via <code>ADMIN_USER</code> / <code>ADMIN_PASSWORD</code>{" "}
          in your <code>.env</code> file.
        </p>
      </div>
    );
  }

  if (view === "editor") {
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
            padding: "1.5rem 0 1rem",
          }}
        >
          <h1 style={{ margin: 0 }}>
            {draft.slug ? `Edit: ${draft.slug}` : "New post"}
          </h1>
          <button className="theme-toggle" onClick={() => setView("list")} type="button">
            ← Back to list
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          <input
            className="search-bar"
            placeholder="Post title"
            value={draft.title}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                title: e.target.value,
                // Auto-suggest slug from title only when creating a new post
                slugInput:
                  !d.slug && (!d.slugInput || d.slugInput === slugifyClient(d.title))
                    ? slugifyClient(e.target.value)
                    : d.slugInput,
              }))
            }
          />
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <input
              className="search-bar"
              style={{ flex: 1, minWidth: 180 }}
              placeholder="slug (URL name)"
              value={draft.slugInput}
              onChange={(e) => setDraft((d) => ({ ...d, slugInput: e.target.value }))}
            />
            <input
              className="search-bar"
              style={{ width: 150 }}
              type="date"
              value={draft.date}
              onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
            />
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "var(--muted)",
                fontSize: "0.9rem",
              }}
            >
              <input
                type="checkbox"
                checked={draft.draft}
                onChange={(e) => setDraft((d) => ({ ...d, draft: e.target.checked }))}
              />
              Draft
            </label>
          </div>
          <input
            className="search-bar"
            placeholder="Tags (comma-separated)"
            value={draft.tags}
            onChange={(e) => setDraft((d) => ({ ...d, tags: e.target.value }))}
          />
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
            <label
              style={{
                fontSize: "0.85rem",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "0.3rem 0.7rem",
                cursor: "pointer",
                color: "var(--muted)",
              }}
            >
              📷 Upload image
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleUpload}
              />
            </label>
            <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
              Markdown supported. Uploaded images are inserted at the cursor.
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <textarea
            ref={contentRef}
            value={draft.content}
            onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
            placeholder="Write your post in Markdown…"
            spellCheck={false}
            style={{
              flex: 1,
              minWidth: 280,
              minHeight: 420,
              padding: "1rem",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--fg)",
              fontFamily: "ui-monospace, Menlo, Consolas, monospace",
              fontSize: "0.9rem",
              lineHeight: 1.6,
              resize: "vertical",
            }}
          />
          <div
            className="prose"
            style={{
              flex: 1,
              minWidth: 280,
              minHeight: 420,
              maxHeight: 640,
              overflowY: "auto",
              padding: "1rem 1.25rem",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg)",
            }}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>

        {error && <p style={{ color: "#d73a49" }}>{error}</p>}
        {message && <p style={{ color: "var(--accent)" }}>{message}</p>}

        <div style={{ display: "flex", gap: "0.75rem", margin: "1rem 0 2rem" }}>
          <button
            onClick={() => handleSave(true)}
            disabled={saving || !draft.title.trim()}
            className="admin-btn primary"
            type="button"
          >
            {saving ? "Saving…" : draft.draft ? "Publish" : "Update"}
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving || !draft.title.trim()}
            className="admin-btn"
            type="button"
          >
            Save as draft
          </button>
        </div>
      </div>
    );
  }

  // ---- List view ----
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem",
          padding: "1.5rem 0 1rem",
        }}
      >
        <h1 style={{ margin: 0 }}>Admin · {posts.length} posts</h1>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="admin-btn primary" onClick={startNew} type="button">
            + New post
          </button>
          <button className="theme-toggle" onClick={handleLogout} type="button">
            Log out
          </button>
        </div>
      </div>

      <div className="post-list">
        {posts.length === 0 ? (
          <p className="empty-state">No posts yet. Create your first one!</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.slug}
              className="post-card"
              style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}
            >
              <div style={{ minWidth: 0 }}>
                <h2 style={{ fontSize: "1.1rem" }}>
                  {post.title}{" "}
                  {post.draft && (
                    <span
                      style={{
                        fontSize: "0.7rem",
                        background: "var(--border)",
                        color: "var(--muted)",
                        padding: "0.1rem 0.5rem",
                        borderRadius: 999,
                        verticalAlign: "middle",
                      }}
                    >
                      DRAFT
                    </span>
                  )}
                </h2>
                <div className="post-meta">
                  <time>{post.date}</time>
                  <span>/{post.slug}</span>
                  {post.tags.length > 0 && <span>#{post.tags.join(" #")}</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                <a href={`/post/${post.slug}`} className="tag-pill" target="_blank" rel="noreferrer">
                  View
                </a>
                <button className="tag-pill" onClick={() => startEdit(post)} type="button">
                  Edit
                </button>
                <button
                  className="tag-pill"
                  onClick={() => handleDelete(post.slug)}
                  type="button"
                  style={{ color: "#d73a49", borderColor: "#d73a49" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/** Client-side slug preview (server slugifies again authoritatively). */
function slugifyClient(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "") || ""
  );
}

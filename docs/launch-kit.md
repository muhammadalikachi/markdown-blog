# Launch Kit — Markdown Blog

Ready-to-post copy for the launch. Repo: `https://github.com/muhammadalikachi/markdown-blog`

---

## 0. Positioning (the one-liners)

Use these everywhere — bio links, comments, replies:

- **Elevator pitch:** "A self-hosted blog engine with a real browser editor — and zero database. Your posts are just Markdown files."
- **One-liner:** "WordPress simplicity, static-site portability, no database."
- **Technical one-liner:** "Next.js 14 blog that reads `.md` files at runtime, ships as a ~180 MB Docker image, and has a built-in admin with live preview."

**Three differentiators (always mention at least two):**
1. **No database** — nothing to install, back up, or migrate; content survives every update.
2. **Browser editor + live preview** — not just a static generator; write and publish from anywhere.
3. **`docker compose up` and done** — persistent volumes for `posts/` and `uploads/`.

---

## 1. Reddit — r/selfhosted

**Title:**
> I built a self-hosted blog engine with no database — your posts are just .md files in a folder

**Body:**

Hey r/selfhosted 👋

I've been running blogs on various stacks for years, and the pattern I kept hitting: WordPress is heavy, static generators are great but you can't just open a browser and publish, and both make "your content" feel like a hostage situation.

So I built **Markdown Blog** — a small, self-hosted engine that treats a folder of Markdown files as the database.

**How it works**

- Posts are plain `.md` files with YAML frontmatter in `posts/`
- The app reads them at request time — no build step per post, no SQL
- A password-protected `/admin` panel lets you create/edit/delete posts with live preview and image uploads
- Images go to `uploads/`, both folders are Docker volumes → content survives rebuilds

**What you get**

- Clean reader UI, dark/light mode, instant search, tag filtering, syntax highlighting
- SEO: OpenGraph tags, `sitemap.xml`, `rss.xml`, `robots.txt`
- One-command deploy: `docker compose up -d --build`
- MIT licensed, no telemetry, no external services

**Quick start**

```bash
git clone https://github.com/muhammadalikachi/markdown-blog.git
cd markdown-blog
cp .env.example .env   # set ADMIN_PASSWORD, AUTH_SECRET, SITE_URL
docker compose up -d --build
```

Then `http://localhost:3000` for the blog and `/admin` for the dashboard.

It's intentionally small — Next.js + a few libraries, no database driver, no ORM. Happy to answer anything about the architecture, and genuinely open to feature requests from this community (what would you need to replace your current blog?).

Repo: https://github.com/muhammadalikachi/markdown-blog

---

## 2. Reddit — r/opensource

**Title:**
> Markdown Blog: an MIT-licensed, zero-database blog engine (Next.js + Docker) looking for first contributors

**Body:**

Hi all — I just open-sourced **Markdown Blog** under MIT and I'd love feedback and contributors.

**The idea:** your blog is a folder of `.md` files. No database, no CMS, no lock-in. A small Next.js app renders them, and a built-in admin panel (env-based login, no user tables) lets you write from the browser.

**Why it might be interesting to this sub**

- ~3k lines of TypeScript, small dependency surface, easy to read end-to-end
- No database = no migrations, no seed data, trivial to self-host and back up
- Dockerfile + compose with persistent volumes, plus a GitHub Actions workflow that builds and publishes the image to GHCR
- Issues/PRs templates and a CONTRIBUTING guide are in place

**Good first issues** (if you want to contribute):

- Keyboard shortcuts in the editor (Ctrl/Cmd+S to save)
- Optional "scheduled posts" via frontmatter date
- Pagination for large blogs
- Additional Markdown extensions

I'd especially appreciate feedback on the content-layer design (`src/lib/posts.ts`) and security review of the auth/upload endpoints.

Repo: https://github.com/muhammadalikachi/markdown-blog — stars and issues both help!

---

## 3. Reddit — r/nextjs (short version)

**Title:**
> Show r/nextjs: file-based Markdown blog with a browser admin — no database, standalone Docker output

**Body:**

Sharing a side project built with Next.js 14 (App Router): a blog engine where content is just Markdown files.

A few implementation details this sub might appreciate:

- `output: "standalone"` + multi-stage Dockerfile → small runtime image, non-root user
- Route Handlers for CRUD (`/api/posts`), with HMAC-signed httpOnly session cookies instead of a full auth library
- `force-dynamic` on content pages so new `.md` files appear instantly (no rebuild)
- Server-side markdown rendering for the admin's live preview (debounced) so preview matches production exactly
- `marked` + `highlight.js`, custom renderer for highlighted code blocks

Repo + screenshots: https://github.com/muhammadalikachi/markdown-blog

Feedback on the architecture is welcome — especially around the dynamic-vs-ISR tradeoff for file-based content.

---

## 4. X / Twitter

**Single post (main):**

> Most blogs need a database.
>
> Mine is a folder of .md files.
>
> I built Markdown Blog — self-hosted, with a browser editor + live preview:
>
> 🗂️ Zero database
> 🐳 docker compose up
> 🌙 Dark mode, search, tags, RSS
> 🔓 MIT
>
> https://github.com/muhammadalikachi/markdown-blog

**Thread (optional, 4 posts):**

1. > Your blog content shouldn't be trapped in a database.
   >
   > So I built an engine where posts are just .md files — and you can still write from the browser.
   >
   > Open source, MIT. 🧵

2. > How it works:
   >
   > • posts/*.md with YAML frontmatter
   > • read at request time — no rebuild per post
   > • /admin editor with live preview
   > • uploads → /uploads volume
   >
   > No MySQL. No Postgres. Nothing to migrate. Ever.

3. > Deploy:
   >
   > ```
   > docker compose up -d --build
   > ```
   >
   > Two volumes: posts/ and uploads/.
   > Update the image anytime — your content doesn't move.

4. > Built with Next.js 14, marked, highlight.js. ~97 kB First Load JS.
   >
   > Star it, fork it, break it — feedback welcome:
   > https://github.com/muhammadalikachi/markdown-blog

---

## 5. LinkedIn

> **I shipped a blog engine with no database. Here's why that matters.**
>
> Every blog platform I've used had the same hidden cost: your content lives in a database you have to maintain, back up, and eventually migrate.
>
> So I built Markdown Blog — an open-source, self-hosted engine where each post is a plain Markdown file.
>
> • Write from a built-in browser editor with live preview — or edit files in your favorite editor and commit them
> • No MySQL/Postgres: the filesystem *is* the database
> • Deploys with one Docker command, with persistent volumes so content survives every update
> • Dark/light mode, instant search, tags, RSS, sitemap, SEO meta tags
> • MIT licensed — free for personal and commercial use
>
> The interesting engineering constraint: keep the "write from anywhere" convenience of WordPress without inheriting its infrastructure weight. A small Next.js app, files on disk, and signed-cookie auth got us there.
>
> If you self-host anything, I'd love your feedback — and if your team has content that deserves to outlive its CMS, take a look.
>
> 👉 https://github.com/muhammadalikachi/markdown-blog
>
> #OpenSource #SelfHosted #Nextjs #Docker #WebDevelopment #Markdown

---

## 6. Show HN

**Title:**
> Show HN: Markdown Blog – a self-hosted blog engine with no database

**Text:**

Hi HN,

I built a small blog engine where the content layer is literally a folder of Markdown files. Posts are `.md` files with YAML frontmatter; the app reads them at request time (no per-post build step, no database).

The design goal was the middle ground between WordPress (browser editing, but a database and a platform to maintain) and static site generators (portable files, but no browser workflow):

- Browser admin at `/admin` with live preview, drafts and image uploads
- Auth is HMAC-signed httpOnly cookies against `ADMIN_USER`/`ADMIN_PASSWORD` from env — no user table
- Docker image via Next.js standalone output; `posts/` and `uploads/` are volumes so updates never touch content
- SEO: OpenGraph/Twitter meta, JSON-LD, sitemap.xml, rss.xml
- Reader UI: dark/light mode, instant client-side search, tag filtering, highlighted code

Stack: Next.js 14 (App Router), TypeScript, marked + highlight.js, gray-matter. MIT licensed.

Some tradeoffs I'm still thinking about:
- Files-at-request-time is simple, but won't scale to huge archives without pagination/caching
- A flat-file engine can't offer multi-user roles — deliberately out of scope for now
- Uploads are served through a route handler rather than a CDN

Happy to discuss the architecture, and feedback on what would make this genuinely useful for self-hosters is very welcome.

https://github.com/muhammadalikachi/markdown-blog

---

## 7. GitHub Release notes (v1.0.0)

> ## Markdown Blog v1.0.0
>
> The first stable release: a self-hosted blog engine where content is plain Markdown files.
>
> ### Highlights
> - **Zero database** — posts in `posts/`, images in `uploads/`, both Docker volumes
> - **Admin dashboard** — login via env credentials, create/edit/delete, live preview, image uploads, drafts
> - **Reader UI** — dark/light mode, instant search, tag filtering, syntax highlighting, responsive
> - **SEO & feeds** — OpenGraph/Twitter tags, JSON-LD, `sitemap.xml`, `rss.xml`, `robots.txt`
> - **Deployment** — multi-stage Dockerfile (standalone, non-root), docker-compose with persistent volumes, GHCR image via GitHub Actions
>
> ### Quick start
> ```bash
> git clone https://github.com/muhammadalikachi/markdown-blog.git
> cd markdown-blog
> cp .env.example .env
> docker compose up -d --build
> ```
>
> ### Notes
> Set `ADMIN_PASSWORD` and `AUTH_SECRET` before exposing the admin panel publicly. See README for all environment variables.
>
> **Full changelog:** https://github.com/muhammadalikachi/markdown-blog/commits/main

---

## 8. Launch checklist (order matters)

**Before posting (30 minutes):**
- [ ] Set repo description: *"Self-hosted blog engine with zero database — your posts are just Markdown files. Next.js + Docker, MIT."*
- [ ] Add topics: `blog`, `markdown`, `nextjs`, `docker`, `self-hosted`, `open-source`, `blog-engine`, `cms`, `typescript`, `markdown-blog`, `file-based`, `docker-compose`, `seo`, `rss`, `headless-cms`
- [ ] Upload `docs/social-preview.png` in **Settings → Social preview**
- [ ] Create the **v1.0.0 release** (use section 7) and tag it
- [ ] Enable **Discussions** (Settings → General → Features)
- [ ] Pin the repo on your profile
- [ ] Double-check a fresh clone works end-to-end (`docker compose up`)

**Posting schedule (stagger — don't blast everywhere at once):**
1. **Day 1 morning (US time):** Show HN — then stay available in comments for 2–3 hours.
2. **Day 1:** X thread + LinkedIn post (link in first reply on X, not in the main post).
3. **Day 2:** r/selfhosted — respond to every comment for the first 4–6 hours.
4. **Day 3:** r/opensource and r/nextjs (space them out; don't crosspost identically).
5. **Day 4–7:** follow-ups — a "how it was built" post, a feature based on launch feedback, or a small demo GIF.

**Etiquette that protects your account:**
- Read each subreddit's self-promotion rules first; some require karma/account age or a weekly thread.
- Don't ask for stars directly on Reddit/HN — say "feedback welcome"; people star when the project earns it.
- Reply to criticism with curiosity, not defensiveness. "Fair point — filed as an issue" wins more stars than arguing.
- Never buy stars or use vote rings; it gets repos flagged and can get the Hostinger application rejected.
- On HN, post the plain link + text; avoid marketing adjectives ("blazing", "revolutionary").

**Metrics to watch:** stars/day, `docker pull` count, unique visitors, issue quality. One thoughtful issue from a stranger beats 50 drive-by stars.

---

## 9. Ready-to-reply snippets

**"Why not just use Ghost/WordPress?"**
> Totally fair — if you want comments, multi-user roles and a plugin ecosystem, they're the right tool. This is for people who want browser editing without a database: the content is files, backups are `cp -r posts/`, and updates can never touch your content.

**"Why not a static site generator?"**
> Static generators are excellent. The gap I wanted to close: publishing from a browser on your phone, with live preview, without a rebuild pipeline. Files still work exactly like a static setup if you prefer git-based writing.

**"Is it production ready?"**
> It's v1.0.0 and runs as a single container behind a reverse proxy. Auth is env-based single-admin by design. I'd call it production-ready for personal/small-team blogs; multi-user auth is deliberately out of scope for now.

**"How do I back up?"**
> Back up the `posts/` and `uploads/` volumes (or the compose volumes). Restore is copying them back. No DB dump involved.

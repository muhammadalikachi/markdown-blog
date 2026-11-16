---
title: "Welcome to Markdown Blog"
date: "2026-11-10"
tags: ["announcements", "meta"]
draft: false
---

Welcome to **Markdown Blog** — a lightweight, open-source blog engine that reads plain `.md` files from a folder. No database, no lock-in, no fuss.

## Why a file-based blog?

- **Your content is yours.** Every post is a portable Markdown file you can edit in any editor.
- **Zero config.** Drop a `.md` file in the `posts/` folder and it's on your site.
- **Fast by design.** No database queries — just files on disk.

## Writing a post

Create a file like `posts/my-first-post.md`:

```markdown
---
title: "My First Post"
date: "2026-11-10"
tags: ["hello", "markdown"]
draft: false
---

Hello, world! This is my first post.
```

Or write and publish it from the built-in admin dashboard at `/admin` — complete with live preview, tag management, and image uploads.

## What's built in

- Dark / light mode
- Tag filtering and instant search
- Syntax highlighting for code blocks
- RSS feed, sitemap, and SEO-friendly meta tags
- Docker deployment with persistent volumes

Happy blogging! 🎉

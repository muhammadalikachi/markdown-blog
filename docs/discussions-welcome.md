# 👋 Welcome to Markdown Blog Discussions

**Markdown Blog** is a self-hosted blog engine where your content is just a folder of Markdown files — no database, no lock-in. This is the place to ask questions, share your deployment, and shape where the project goes.

## What to post here

- ❓ **Q&A** — setup help, Docker questions, environment variables, reverse-proxy setups
- 💡 **Ideas** — features you'd like to see; explain the problem, not just the solution
- 🚀 **Show your blog** — running Markdown Blog somewhere? Share the link and your stack
- 🐛 **Bug triage** — quick questions about behavior; use [Issues](https://github.com/muhammadalikachi/markdown-blog/issues/new/choose) for reproducible bugs

## A 60-second tour

```bash
git clone https://github.com/muhammadalikachi/markdown-blog.git
cd markdown-blog
cp .env.example .env        # set ADMIN_PASSWORD, AUTH_SECRET, SITE_URL
docker compose up -d --build
```

- Blog → http://localhost:3000
- Admin → http://localhost:3000/admin
- Posts live in the `posts/` volume; uploads in `uploads/`

Full details: [README](https://github.com/muhammadalikachi/markdown-blog#readme) · [CONTRIBUTING](https://github.com/muhammadalikachi/markdown-blog/blob/main/CONTRIBUTING.md)

## Ways to help (even without code)

- ⭐ **Star the repo** if it's useful — it's how other self-hosters find it
- 🧪 **Test it** on your NAS, VPS or Raspberry Pi and report what happened
- 📖 **Improve the docs** — clearer steps are always welcome
- 🗣️ **Answer questions** here — community help is the best kind

## House rules

1. Be kind and assume good intent.
2. Search before posting — your question may already be answered.
3. No spam, referral links, or unrelated promotion.
4. Security issues: please use [private vulnerability reporting](https://github.com/muhammadalikachi/markdown-blog/security/advisories/new), not a public post.

## Roadmap (community-driven)

- [ ] Pagination for large archives
- [ ] Editor keyboard shortcuts (Ctrl/Cmd+S)
- [ ] Scheduled publishing via frontmatter date
- [ ] Optional comments integration guide (giscus/utterances)
- [ ] Multi-language content support

Have an opinion on what comes first? Start a discussion — the roadmap will follow the votes and the use cases.

Thanks for being here! 🧡

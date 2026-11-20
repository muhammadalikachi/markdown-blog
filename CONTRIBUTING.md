# Contributing to Markdown Blog

Thanks for stopping by! This project is intentionally small and dependency-light, so it's a friendly place for a first contribution.

## Ways to help

- 🐛 **Report bugs** — open an issue with reproduction steps
- 💡 **Suggest features** — open an issue describing the problem first, not just the solution
- 📖 **Improve docs** — typos, clearer setup steps, screenshots
- 🧪 **Test deployments** — try it on your NAS/VPS/Raspberry Pi and report quirks
- ⭐ **Star the repo** — genuinely helps visibility

## Local development

Requirements: Node.js 18.17+ (Docker optional).

```bash
git clone https://github.com/muhammadalikachi/markdown-blog.git
cd markdown-blog
npm install
cp .env.example .env     # set ADMIN_USER / ADMIN_PASSWORD / AUTH_SECRET
npm run dev              # http://localhost:3000
```

The admin dashboard is at `/admin`. Posts are read from `posts/` on every request, so edits to `.md` files show up on refresh — no rebuild needed.

### Useful commands

```bash
npm run dev      # development server
npm run build    # production build (must pass before a PR)
npm start        # serve the production build
```

## Project map

| Path | What lives there |
| ---- | ---------------- |
| `src/lib/posts.ts` | Content layer: reading/writing Markdown, frontmatter, slugs |
| `src/lib/markdown.ts` | Markdown → HTML rendering + syntax highlighting |
| `src/lib/auth.ts` | Signed-cookie admin sessions |
| `src/app/api/` | Auth, post CRUD, preview and upload endpoints |
| `src/app/admin/` | Admin dashboard (client component) |
| `src/app/` | Reader pages, RSS, sitemap, robots |

## Before opening a PR

1. `npm run build` passes with no type errors.
2. Manually verify the flows you touched:
   - create → publish → view a post
   - edit → save, and delete
   - login/logout, and that `/admin` APIs return 401 when signed out
3. Keep the diff focused — one concern per PR.
4. Match the existing code style (TypeScript, no new heavy dependencies).
5. Update the README if behavior or configuration changes.

## Commit messages

Short, imperative summaries are enough:

```
Add tag filtering to the post list
Fix draft posts leaking into the RSS feed
```

## Security

Please **do not open public issues for security vulnerabilities**. Instead, email the maintainer or use GitHub's private vulnerability reporting (Security → Report a vulnerability).

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).

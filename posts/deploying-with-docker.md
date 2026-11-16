---
title: "Deploying Your Blog with Docker in 5 Minutes"
date: "2026-11-14"
tags: ["devops", "docker", "tutorial"]
draft: false
---

This blog ships with a production-ready Docker setup. Here's how to get it running locally or on a server.

## Quick start

```bash
# 1. Clone the repository
git clone https://github.com/your-org/markdown-blog.git
cd markdown-blog

# 2. Configure environment
cp .env.example .env
# edit .env: set ADMIN_USER, ADMIN_PASSWORD, AUTH_SECRET, SITE_URL

# 3. Build and run
docker compose up -d --build
```

Your blog is now live at `http://localhost:3000`, and the admin dashboard is at `/admin`.

## How persistence works

The `docker-compose.yml` mounts two named volumes:

```yaml
volumes:
  - posts_data:/app/posts     # your Markdown articles
  - uploads_data:/app/uploads # images uploaded via the admin panel
```

That means your content survives container rebuilds, image updates, and version upgrades — because it lives outside the container filesystem.

## Environment variables

| Variable            | Purpose                          | Example                 |
| ------------------- | -------------------------------- | ----------------------- |
| `ADMIN_USER`        | Admin dashboard username         | `admin`                 |
| `ADMIN_PASSWORD`    | Admin dashboard password         | a long random string    |
| `AUTH_SECRET`       | Signs the session cookie         | `openssl rand -hex 32`  |
| `SITE_URL`          | Public URL, used for SEO/feeds   | `https://blog.example`  |

## Updating without losing data

```bash
git pull
docker compose up -d --build
```

Posts and uploads are safe — they live on the volumes, not in the image.

# ---------- Stage 1: build the Next.js app ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies with a cached layer
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# Build the production bundle (output: "standalone")
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- Stage 2: minimal production runtime ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy the standalone server (includes server.js and node_modules subset)
COPY --from=builder /app/.next/standalone ./
# Static assets must be served from their original paths
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Content folders: create them as volumes so user data survives updates
RUN mkdir -p /app/posts /app/uploads \
  && chown -R nextjs:nodejs /app/posts /app/uploads /app/.next
USER nextjs

EXPOSE 3000

# Persistent volumes for user content are declared in docker-compose.yml
# (volumes: - ./posts:/app/posts, - ./uploads:/app/uploads)
CMD ["node", "server.js"]

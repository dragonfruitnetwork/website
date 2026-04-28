# syntax=docker/dockerfile:1.7

# ---------- builder stage ----------
FROM node:24-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npx prisma generate

# DATABASE_URL must be defined for `next build` because @/prisma is imported
# at module load. The placeholder is never connected to — no static page
# issues queries — and it stays in the builder stage only.
RUN DATABASE_URL="mysql://placeholder:placeholder@localhost/placeholder" \
    AUTH_URL="http://localhost:3000" \
    AUTH_SECRET="placeholder" \
    npm run build

# ---------- runner stage ----------
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

CMD ["node", "server.js"]

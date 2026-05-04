# syntax=docker/dockerfile:1.7

# ---------- builder stage ----------
FROM node:24-alpine AS builder
WORKDIR /app

ARG SENTRYURL
ARG SENTRYTOKEN

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ENV DATABASE_URL=mysql://placeholder:placeholder@localhost/placeholder
ENV AUTH_URL=http://localhost:3000
ENV AUTH_SECRET=placeholder
ENV CI=true

ENV SENTRY_URL=$SENTRYURL
ENV SENTRY_TOKEN=$SENTRYTOKEN

RUN npx prisma generate
RUN npm run build

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

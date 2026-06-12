FROM node:26 AS builder
WORKDIR /app

ARG SENTRYURL
ARG SENTRYTOKEN

COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# placeholder variables for prisma/nextjs build
ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost/placeholder
ENV AUTH_URL=http://localhost:3000
ENV AUTH_SECRET=placeholder
ENV CI=true

# needed to submit sourcemaps
ENV SENTRY_URL=$SENTRYURL
ENV SENTRY_TOKEN=$SENTRYTOKEN

RUN npx prisma generate
RUN npm run build

# runnable image generation
FROM gcr.io/distroless/nodejs26-debian13 AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["/app/server.js"]

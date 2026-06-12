-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext";

-- CreateEnum
CREATE TYPE "ChangelogEntryType" AS ENUM ('ADDITION', 'FIX', 'REMOVAL', 'DELAYED', 'INFO', 'BUG', 'SECURITY');

-- CreateEnum
CREATE TYPE "ChangelogAuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" TEXT DEFAULT 'user',
    "banned" BOOLEAN DEFAULT false,
    "banReason" TEXT,
    "banExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "impersonatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_verifications" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "changelog_apps" (
    "id" CITEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "color" CHAR(7),
    "order" INTEGER NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "changelog_apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "changelog_releases" (
    "id" SERIAL NOT NULL,
    "appId" CITEXT NOT NULL,
    "releaseName" TEXT NOT NULL,
    "releaseNote" TEXT,
    "releaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "previousReleaseId" INTEGER,

    CONSTRAINT "changelog_releases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "changelog_release_entries" (
    "id" SERIAL NOT NULL,
    "releaseId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "content" TEXT,
    "major" BOOLEAN NOT NULL DEFAULT false,
    "entryType" "ChangelogEntryType" DEFAULT 'FIX',

    CONSTRAINT "changelog_release_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "changelog_audit_log" (
    "id" SERIAL NOT NULL,
    "actorId" TEXT,
    "actorEmail" VARCHAR(255),
    "action" "ChangelogAuditAction" NOT NULL,
    "appId" CITEXT,
    "releaseId" INTEGER,
    "releaseName" TEXT,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "changelog_audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "user_accounts_userId_idx" ON "user_accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_accounts_providerId_accountId_key" ON "user_accounts"("providerId", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_token_key" ON "user_sessions"("token");

-- CreateIndex
CREATE INDEX "user_sessions_userId_idx" ON "user_sessions"("userId");

-- CreateIndex
CREATE INDEX "user_verifications_identifier_idx" ON "user_verifications"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "changelog_apps_name_key" ON "changelog_apps"("name");

-- CreateIndex
CREATE UNIQUE INDEX "changelog_apps_order_key" ON "changelog_apps"("order");

-- CreateIndex
CREATE INDEX "changelog_apps_public_order_idx" ON "changelog_apps"("public", "order");

-- CreateIndex
CREATE UNIQUE INDEX "changelog_releases_previousReleaseId_key" ON "changelog_releases"("previousReleaseId");

-- CreateIndex
CREATE INDEX "changelog_releases_appId_releaseName_idx" ON "changelog_releases"("appId", "releaseName");

-- CreateIndex
CREATE INDEX "changelog_releases_appId_releaseDate_idx" ON "changelog_releases"("appId", "releaseDate");

-- CreateIndex
CREATE UNIQUE INDEX "changelog_releases_appId_releaseName_key" ON "changelog_releases"("appId", "releaseName");

-- CreateIndex
CREATE INDEX "changelog_release_entries_releaseId_idx" ON "changelog_release_entries"("releaseId");

-- CreateIndex
CREATE INDEX "changelog_audit_log_releaseId_idx" ON "changelog_audit_log"("releaseId");

-- CreateIndex
CREATE INDEX "changelog_audit_log_appId_releaseName_idx" ON "changelog_audit_log"("appId", "releaseName");

-- CreateIndex
CREATE INDEX "changelog_audit_log_actorId_idx" ON "changelog_audit_log"("actorId");

-- CreateIndex
CREATE INDEX "changelog_audit_log_createdAt_idx" ON "changelog_audit_log"("createdAt");

-- AddForeignKey
ALTER TABLE "user_accounts" ADD CONSTRAINT "user_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "changelog_releases" ADD CONSTRAINT "changelog_releases_previousReleaseId_fkey" FOREIGN KEY ("previousReleaseId") REFERENCES "changelog_releases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "changelog_releases" ADD CONSTRAINT "changelog_releases_appId_fkey" FOREIGN KEY ("appId") REFERENCES "changelog_apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "changelog_release_entries" ADD CONSTRAINT "changelog_release_entries_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "changelog_releases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

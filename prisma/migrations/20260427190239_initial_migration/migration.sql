-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `image` VARCHAR(191) NULL,
    `role` VARCHAR(191) NULL DEFAULT 'user',
    `banned` BOOLEAN NULL DEFAULT false,
    `banReason` VARCHAR(191) NULL,
    `banExpires` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_accounts` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `providerId` VARCHAR(191) NOT NULL,
    `accessToken` TEXT NULL,
    `refreshToken` TEXT NULL,
    `idToken` TEXT NULL,
    `accessTokenExpiresAt` DATETIME(3) NULL,
    `refreshTokenExpiresAt` DATETIME(3) NULL,
    `scope` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `user_accounts_userId_idx`(`userId`),
    UNIQUE INDEX `user_accounts_providerId_accountId_key`(`providerId`, `accountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` TEXT NULL,
    `impersonatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_sessions_token_key`(`token`),
    INDEX `user_sessions_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_verifications` (
    `id` VARCHAR(191) NOT NULL,
    `identifier` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `user_verifications_identifier_idx`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `changelog_apps` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `color` CHAR(7) NULL,
    `order` INTEGER NOT NULL,
    `public` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `changelog_apps_name_key`(`name`),
    UNIQUE INDEX `changelog_apps_order_key`(`order`),
    INDEX `changelog_apps_public_order_idx`(`public`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `changelog_releases` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `appId` VARCHAR(191) NOT NULL,
    `releaseName` VARCHAR(191) NOT NULL,
    `releaseNote` LONGTEXT NULL,
    `releaseDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `previousReleaseId` INTEGER NULL,

    UNIQUE INDEX `changelog_releases_previousReleaseId_key`(`previousReleaseId`),
    INDEX `changelog_releases_appId_releaseName_idx`(`appId`, `releaseName`),
    INDEX `changelog_releases_appId_releaseDate_idx`(`appId`, `releaseDate`),
    UNIQUE INDEX `changelog_releases_appId_releaseName_key`(`appId`, `releaseName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `changelog_release_entries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `releaseId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NULL,
    `content` LONGTEXT NULL,
    `major` BOOLEAN NOT NULL DEFAULT false,
    `entryType` ENUM('ADDITION', 'FIX', 'REMOVAL', 'DELAYED', 'INFO', 'BUG', 'SECURITY') NULL DEFAULT 'FIX',

    INDEX `changelog_release_entries_releaseId_idx`(`releaseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `changelog_audit_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `actorId` VARCHAR(191) NULL,
    `actorEmail` VARCHAR(255) NULL,
    `action` ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
    `appId` VARCHAR(36) NULL,
    `releaseId` INTEGER NULL,
    `releaseName` VARCHAR(191) NULL,
    `payload` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `changelog_audit_log_releaseId_idx`(`releaseId`),
    INDEX `changelog_audit_log_appId_releaseName_idx`(`appId`, `releaseName`),
    INDEX `changelog_audit_log_actorId_idx`(`actorId`),
    INDEX `changelog_audit_log_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_accounts` ADD CONSTRAINT `user_accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `changelog_releases` ADD CONSTRAINT `changelog_releases_previousReleaseId_fkey` FOREIGN KEY (`previousReleaseId`) REFERENCES `changelog_releases`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `changelog_releases` ADD CONSTRAINT `changelog_releases_appId_fkey` FOREIGN KEY (`appId`) REFERENCES `changelog_apps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `changelog_release_entries` ADD CONSTRAINT `changelog_release_entries_releaseId_fkey` FOREIGN KEY (`releaseId`) REFERENCES `changelog_releases`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

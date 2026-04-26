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

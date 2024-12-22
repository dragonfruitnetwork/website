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

-- AddForeignKey
ALTER TABLE `changelog_releases` ADD CONSTRAINT `changelog_releases_previousReleaseId_fkey` FOREIGN KEY (`previousReleaseId`) REFERENCES `changelog_releases`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `changelog_releases` ADD CONSTRAINT `changelog_releases_appId_fkey` FOREIGN KEY (`appId`) REFERENCES `changelog_apps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `changelog_release_entries` ADD CONSTRAINT `changelog_release_entries_releaseId_fkey` FOREIGN KEY (`releaseId`) REFERENCES `changelog_releases`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

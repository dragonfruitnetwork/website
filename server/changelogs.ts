"use server";

import 'server-only';

import {z} from "zod";
import _ from "lodash";
import {prisma} from "@/prisma";
import {actionClient, adminActionClient} from "@/lib/safe-action";
import {ChangelogAuditAction, ChangelogEntryType, Prisma} from "@prisma/client";

import {
    changelogReleaseIdentifierSchema,
    changelogReleaseSchema,
    persistedChangelogReleaseSchema
} from "./changelogTypes";

import TransactionIsolationLevel = Prisma.TransactionIsolationLevel;

/**
 * Get a specific release for a given app.
 */
export const getChangelogRelease = actionClient
    .inputSchema(z.object({
        appId: z.string().nonempty(),
        releaseName: z.string().nonempty()
    }))
    .action(async ({parsedInput: args}) => {
        const release = await prisma.changelogRelease.findFirst({
            where: {
                appId: args.appId,
                releaseName: args.releaseName,
            },
            include: {
                entries: true,
                app: true
            }
        });

        return release ?? null;
    });

/**
 * Create a changelog release for an app.
 * A release must have either release notes or at least one entry.
 */
export const createChangelogRelease = adminActionClient
    .inputSchema(changelogReleaseSchema)
    .action(async ({parsedInput: args, ctx}) => prisma.$transaction(async tx => {
        const previousRelease = await tx.changelogRelease.findFirst({
            where: {
                AND: [
                    {appId: args.appId},
                    {releaseDate: {lt: args.releaseDate}}
                ]
            },
            orderBy: {
                releaseDate: 'desc'
            },
            include: {
                nextRelease: true
            }
        });

        const newRelease = await tx.changelogRelease.create({
            data: {
                appId: args.appId,
                releaseName: args.releaseName,
                releaseDate: args.releaseDate,
                releaseNote: args.releaseNote,
                entries: {
                    create: args.entries?.map(x => {
                        return {
                            title: x.title,
                            content: x.content,
                            category: x.category,
                            major: x.major,
                            entryType: x.entryType as ChangelogEntryType
                        }
                    }) ?? []
                }
            },
            include: {
                app: true,
                entries: true
            }
        });

        if (previousRelease?.nextRelease) {
            await tx.changelogRelease.update({
                where: {id: previousRelease.nextRelease.id},
                data: {previousReleaseId: newRelease.id}
            });
        }

        // must be done after the previousRelease.nextRelease is updated to ensure unique constraint
        if (previousRelease) {
            await tx.changelogRelease.update({
                where: {id: newRelease.id},
                data: {previousReleaseId: previousRelease.id}
            });
        }

        await tx.changelogAuditLog.create({
            data: {
                actorId: ctx.user.id,
                actorEmail: ctx.user.email,
                action: ChangelogAuditAction.CREATE,
                appId: args.appId,
                releaseId: newRelease.id,
                releaseName: args.releaseName,
                payload: JSON.parse(JSON.stringify(args)) as Prisma.InputJsonValue
            }
        });

        return newRelease;
    }, {isolationLevel: TransactionIsolationLevel.Serializable}));

/**
 * Remove a changelog release by id or app/release name.
 */
export const deleteChangelogRelease = adminActionClient
    .inputSchema(changelogReleaseIdentifierSchema)
    .action(async ({parsedInput: args, ctx}) => prisma.$transaction(async tx => {
        const release = await tx.changelogRelease.findFirst({
            where: 'id' in args ? {id: args.id} : {appId: args.appId, releaseName: args.releaseName},
            select: {
                id: true,
                appId: true,
                releaseName: true,
                previousReleaseId: true,
                nextRelease: {select: {id: true}}
            }
        });

        if (!release) {
            return null;
        }

        // fix the chain if the release is in the middle
        if (release.nextRelease) {
            await tx.changelogRelease.update({
                where: {id: release.nextRelease.id},
                data: {previousReleaseId: release.previousReleaseId}
            });
        }

        await tx.changelogRelease.delete({
            where: {id: release.id}
        });

        await tx.changelogAuditLog.create({
            data: {
                actorId: ctx.user.id,
                actorEmail: ctx.user.email,
                action: ChangelogAuditAction.DELETE,
                appId: release.appId,
                releaseId: release.id,
                releaseName: release.releaseName,
                payload: JSON.parse(JSON.stringify(release)) as Prisma.InputJsonValue
            }
        });

        return {removed: true};
    }));

/**
 * Updates a changelog release (id or app/release name).
 * Entries can be updated (by id) or created (no id) through this endpoint.
 *
 * @remarks
 * All entries should be provided regardless even if they're not being updated. Any entry not included in the request will be removed.
 */
export const updateChangelogRelease = adminActionClient
    .inputSchema(persistedChangelogReleaseSchema)
    .action(async ({parsedInput: args, ctx}) => prisma.$transaction(async tx => {
        const release = await tx.changelogRelease.findFirst({
            where: 'id' in args ? {id: args.id} : {appId: args.appId, releaseName: args.releaseName},
            include: {
                entries: true,
                nextRelease: true,
                previousRelease: true
            }
        });

        if (!release) {
            throw new Error("RELEASE_NOT_FOUND");
        }

        // perform entry updates
        for (const entry of args.entries ?? []) {
            const data = {
                title: entry.title,
                content: entry.content,
                category: entry.category,
                major: entry.major,
                entryType: entry.entryType as ChangelogEntryType
            };

            if (entry.id) {
                await tx.changelogReleaseEntry.update({
                    data,
                    where: {
                        id: entry.id,
                        releaseId: release.id // check against release id to prevent updating entries from other releases
                    }
                });
            } else {
                await tx.changelogReleaseEntry.create({
                    data: {
                        ...data,
                        release: {
                            connect: {id: release.id}
                        }
                    }
                });
            }
        }

        // remove any entries that were not included in the update
        const removedEntryIds: number[] = _.difference(release.entries.map(x => x.id), args.entries?.map(x => x.id) ?? []).filter((id): id is number => id !== undefined);

        if (removedEntryIds.length) {
            await tx.changelogReleaseEntry.deleteMany({where: {id: {in: removedEntryIds}}});
        }

        // check if updating the release will break the chain
        if (release.nextRelease && release.previousRelease && (args.releaseDate < release.previousRelease.releaseDate || args.releaseDate > release.nextRelease.releaseDate)) {
            // detach the release from the chain first so the @unique slot is free during re-link
            await tx.changelogRelease.update({
                where: {id: release.id},
                data: {previousReleaseId: null}
            });

            // close the gap left by the release
            await tx.changelogRelease.update({
                where: {id: release.nextRelease.id},
                data: {previousReleaseId: release.previousReleaseId}
            });

            // insert the release back into the chain (new, corrected location)
            const newPreviousRelease = await tx.changelogRelease.findFirst({
                where: {
                    appId: release.appId,
                    releaseDate: {lt: args.releaseDate}
                },
                select: {
                    id: true,
                    previousReleaseId: true,
                    nextRelease: {select: {id: true}},
                },
                orderBy: {
                    releaseDate: 'desc'
                }
            });

            if (newPreviousRelease) {
                await tx.changelogRelease.update({
                    where: {id: release.id},
                    data: {previousReleaseId: newPreviousRelease.id}
                });
            }

            if (newPreviousRelease?.nextRelease) {
                await tx.changelogRelease.update({
                    where: {id: newPreviousRelease.nextRelease.id},
                    data: {previousReleaseId: release.id}
                });
            }
        }

        const updated = await tx.changelogRelease.update({
            where: {id: release.id},
            data: {
                releaseName: args.releaseName,
                releaseDate: args.releaseDate,
                releaseNote: args.releaseNote
            },
            include: {
                app: true,
                entries: true
            }
        });

        await tx.changelogAuditLog.create({
            data: {
                actorId: ctx.user.id,
                actorEmail: ctx.user.email,
                action: ChangelogAuditAction.UPDATE,
                appId: updated.appId,
                releaseId: updated.id,
                releaseName: updated.releaseName,
                payload: JSON.parse(JSON.stringify(args)) as Prisma.InputJsonValue
            }
        });

        return updated;
    }, {isolationLevel: TransactionIsolationLevel.Serializable}));

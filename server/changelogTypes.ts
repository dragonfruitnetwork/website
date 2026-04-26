import {z} from "zod";

export const changelogReleaseIdentifierSchema = z.union([
    z.object({
        id: z.number().int('invalid release identifier')
    }),
    z.object({
        appId: z.string(),
        releaseName: z.string().nonempty().max(191)
    })
]);

export const changelogReleaseEntrySchema = z.object({
    id: z.number().int().optional(),

    title: z.string().nonempty('a title is required for a changelog entry').max(191),
    content: z.string().max(100_000).nullable(),
    category: z.string().max(191).nullable(),
    major: z.boolean(),

    entryType: z.enum(["ADDITION", "FIX", "REMOVAL", "DELAYED", "INFO", "BUG", "SECURITY"])
});

export const changelogReleaseSchema = z.object({
    appId: z.string(),

    releaseName: z.string().nonempty('a release name is required').max(191),
    releaseDate: z.date(),
    releaseNote: z.string().max(100_000).nullable().optional(),

    entries: z.array(changelogReleaseEntrySchema).optional(),
});

export const persistedChangelogReleaseSchema = z.intersection(changelogReleaseIdentifierSchema, changelogReleaseSchema);

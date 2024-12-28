import {z} from "zod";

export const changelogReleaseIdentifierSchema = z.union([
    z.object({
        id: z.number().int('invalid release identifier')
    }),
    z.object({
        appId: z.string().nonempty(),
        releaseName: z.string().nonempty()
    })
]);

export const changelogReleaseEntrySchema = z.object({
    id: z.number().int().optional(),

    title: z.string().nonempty('a title is required for a changelog entry'),
    content: z.string().nullable(),
    category: z.string().nullable(),
    major: z.boolean(),

    entryType: z.enum(["ADDITION", "FIX", "REMOVAL", "DELAYED", "INFO", "BUG", "SECURITY"])
});

export const changelogReleaseSchema = z.object({
    appId: z.string().nonempty(),

    releaseName: z.string().nonempty('a release name is required'),
    releaseDate: z.date(),
    releaseNote: z.string().nullable().optional(),

    entries: z.array(changelogReleaseEntrySchema).optional(),
});

export const persistedChangelogReleaseSchema = z.intersection(changelogReleaseIdentifierSchema, changelogReleaseSchema);

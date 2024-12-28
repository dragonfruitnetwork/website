import {z} from "zod";
import _ from "lodash";
import {action, computed, makeObservable, observable} from "mobx";

import {getChangelogRelease} from "@/server/changelogs";
import {changelogReleaseEntrySchema, persistedChangelogReleaseSchema} from "@/server/changelogTypes";

type ChangelogReleaseData = NonNullable<Awaited<ReturnType<typeof getChangelogRelease>>>['data'];
type ChangelogReleaseEntryData = NonNullable<ChangelogReleaseData>['entries'][number];

export class MutableChangelogRelease {

    id: number | null = null;

    constructor(appId: string) {
        this.appId = appId;
        this.releaseDate = new Date();
        this.releaseName = `${this.releaseDate.getFullYear()}.${this.releaseDate.getMonth() + 1}.${this.releaseDate.getDate().toFixed(2)}`;

        makeObservable(this);
    }

    @observable appId: string;
    @observable releaseDate: Date;
    @observable releaseName: string;
    @observable releaseNote: string | null = null;

    @observable
    private _entries: MutableChangelogReleaseEntry[] = [];

    get entries() {
        return this._entries;
    }

    @computed
    get categories() {
        return _.chain(this.entries)
            .map(x => x.category)
            .filter(x => x !== null)
            .uniq()
            .value();
    }

    @action
    importExistingRelease(release: ChangelogReleaseData) {
        if (!release) {
            return;
        }

        this.id = release.id;
        this.appId = release.appId;

        this.releaseDate = release.releaseDate;
        this.releaseName = release.releaseName;
        this.releaseNote = release.releaseNote;

        if (release.entries.length) {
            this.entries.push(...release.entries.map(x => new MutableChangelogReleaseEntry(x)));
        }
    }

    createObject(): z.infer<typeof persistedChangelogReleaseSchema> {
        return {
            id: this.id ?? undefined,
            appId: this.appId,
            releaseDate: this.releaseDate,
            releaseName: this.releaseName,
            releaseNote: this.releaseNote,
            entries: this.entries.map(x => x.createObject())
        }
    }
}

export class MutableChangelogReleaseEntry {

    id: number | null;
    readonly localId: string = Math.random().toString(36).substring(7);

    constructor(entry: ChangelogReleaseEntryData | null) {
        makeObservable(this);

        this.id = entry?.id ?? null;
        this.title = entry?.title ?? "Untitled Change";
        this.description = entry?.content ?? '';
        this.category = entry?.category ?? '';
        this.major = entry?.major ?? false;
        this.type = entry?.entryType ?? "FIX";
    }

    @observable title: string;
    @observable description: string | null;
    @observable category: string | null;

    @observable major: boolean;
    @observable type: "ADDITION" | "FIX" | "REMOVAL" | "DELAYED" | "INFO" | "BUG" | "SECURITY";

    createObject(): z.infer<typeof changelogReleaseEntrySchema> {
        return {
            id: this.id ?? undefined,
            title: this.title,
            content: this.description,
            category: this.category,
            major: this.major,
            entryType: this.type,
        }
    }
}
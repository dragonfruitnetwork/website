import {z} from "zod";
import _ from "lodash";
import {action, computed, makeObservable, observable} from "mobx";

import {getChangelogRelease} from "@/server/changelogs";
import {changelogReleaseEntrySchema, persistedChangelogReleaseSchema} from "@/server/changelogTypes";

type ChangelogReleaseData = NonNullable<Awaited<ReturnType<typeof getChangelogRelease>>>['data'];
type ChangelogReleaseEntryData = NonNullable<ChangelogReleaseData>['entries'][number];

export class MutableChangelogReleaseEntry {

    id: number | null;
    readonly localId: string = Math.random().toString(36).substring(7);

    constructor(entry: ChangelogReleaseEntryData | null) {
        this.id = entry?.id ?? null;
        this.title = entry?.title ?? "Untitled Change";
        this.description = entry?.content ?? '';
        this.category = entry?.category ?? '';
        this.major = entry?.major ?? false;
        this.type = entry?.entryType ?? "FIX";

        makeObservable(this, {
            title: observable,
            description: observable,
            category: observable,
            major: observable,
            type: observable,
        });
    }

    title: string;
    description: string | null;
    category: string | null;

    major: boolean;
    type: "ADDITION" | "FIX" | "REMOVAL" | "DELAYED" | "INFO" | "BUG" | "SECURITY";

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

export class MutableChangelogRelease {

    constructor(appId: string) {
        this.appId = appId;
        this.releaseDate = new Date();
        this.releaseName = `${this.releaseDate.getFullYear()}.${this.releaseDate.getMonth() + 1}${this.releaseDate.getDate().toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })}`;

        makeObservable<MutableChangelogRelease, "_entries">(this, {
            id: observable,
            appId: observable,
            releaseDate: observable,
            releaseName: observable,
            releaseNote: observable,
            _entries: observable,
            categories: computed,
            importExistingRelease: action,
            createNewReleaseEntry: action,
            removeReleaseEntry: action,
        });
    }

    id: number | null = null;
    appId: string;
    releaseDate: Date;
    releaseName: string;
    releaseNote: string | null = null;

    private _entries: MutableChangelogReleaseEntry[] = [];

    get entries(): ReadonlyArray<MutableChangelogReleaseEntry> {
        return this._entries;
    }

    get categories() {
        return _.chain(this.entries)
            .map(x => x.category)
            .filter(x => x !== null)
            .uniq()
            .value();
    }

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
            this._entries = [...release.entries.map(x => new MutableChangelogReleaseEntry(x))];
        }
    }

    createNewReleaseEntry() {
        const newChange = new MutableChangelogReleaseEntry(null);
        const untitledChangeCount = this._entries.filter(x => x.title.startsWith(newChange.title)).length;

        newChange.title = `${newChange.title} ${untitledChangeCount + 1}`;

        this._entries.push(newChange);
        return newChange;
    }

    removeReleaseEntry(entry: MutableChangelogReleaseEntry) {
        const ind = this._entries.indexOf(entry);

        if (ind !== -1) {
            this._entries.splice(ind, 1);
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

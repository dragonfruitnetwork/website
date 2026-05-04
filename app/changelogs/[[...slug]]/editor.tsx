"use client";

import {action} from "mobx";
import Link from "next/link";
import {observer} from "mobx-react-lite";
import {useRouter} from "next/navigation";
import {useCallback, useEffect, useMemo, useState} from "react";
import {LuBadgeAlert, LuChevronLeft, LuPlus, LuSave, LuTrash} from "react-icons/lu";

import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Card, CardContent} from "@/components/ui/card";
import {AutoComplete} from "@/components/ui/autocomplete";
import {DateTimePicker} from "@/components/ui/datetime-picker";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

import {EntryTypeIcon} from "./entry-type-icon";
import {MutableChangelogRelease, MutableChangelogReleaseEntry} from "./mutableChangelogRelease";

import {
    createChangelogRelease,
    deleteChangelogRelease,
    getChangelogRelease,
    updateChangelogRelease
} from "@/server/changelogs";

type ChangelogAppDto = {
    id: string;
    name: string;
    color: string | null;
};

interface EditorProps {
    app: ChangelogAppDto;
    release: NonNullable<Awaited<ReturnType<typeof getChangelogRelease>>>['data'] | null; // release only provided if in edit mode

    createReleaseAction: typeof createChangelogRelease;
    updateReleaseAction: typeof updateChangelogRelease;
    deleteReleaseAction: typeof deleteChangelogRelease;
}

export const Editor = observer((props: EditorProps) => {
    const router = useRouter();

    const [release, setRelease] = useState(() => new MutableChangelogRelease(props.app.id));
    const [errors, setErrors] = useState<string | null>(null);

    useEffect(() => {
        if (props.release) {
            release.importExistingRelease(props.release);
        }
    }, []);

    const saveCallback = useCallback(async () => {
        setErrors(null);

        const releaseObject = release.createObject();
        const serverResult = release.id ? await props.updateReleaseAction(releaseObject) : await props.createReleaseAction(releaseObject);

        console.log('save result', serverResult);

        if (!serverResult) {
            setErrors('An error occurred while saving the release.');
            return;
        }

        if (serverResult.serverError) {
            setErrors(serverResult.serverError);
            return;
        }

        if (serverResult.validationErrors) {
            setErrors(JSON.stringify(serverResult.validationErrors, null, 2));
            return;
        }

        if (!serverResult.data) {
            setErrors('Server returned no data.');
            return;
        }

        const newRelease = new MutableChangelogRelease(props.app.id);
        newRelease.importExistingRelease(serverResult.data);

        setRelease(newRelease);
    }, [release]);

    const deleteCallback = useCallback(async () => {
        setErrors(null);

        if (!confirm('Are you sure you want to delete this release?')) {
            return;
        }

        if (!release.id) {
            throw new Error('Cannot delete a release that has not been saved yet.');
        }

        let result = await props.deleteReleaseAction({id: release.id});

        if (!result) {
            setErrors('An error occurred while deleting the release.');
            return;
        }

        if (result?.serverError) {
            setErrors(result.serverError);
            return;
        }

        router.push(`/changelogs/${props.app.id}`);
    }, [release]);

    return (
        <div className="space-y-5">
            {errors?.length && (
                <Alert variant="destructive">
                    <LuBadgeAlert className="h-4 w-4"/>
                    <AlertTitle>Update Failed</AlertTitle>
                    <AlertDescription>{errors}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-row items-center gap-4">
                        <Button asChild variant="ghost">
                            <Link href={`/changelogs/${props.app.id}`}>
                                <LuChevronLeft className="h-5 w-5"/>
                            </Link>
                        </Button>

                        <div className="grid grid-cols-1">
                            <span className="text-xl font-semibold" style={{color: props.app.color ?? undefined}}>
                                {props.app.name}
                            </span>
                            {props.release
                                ? <span>Version {props.release?.releaseName}</span>
                                : <span>New Release</span>}
                        </div>

                        <div className="ms-auto flex gap-2">
                            <Button onClick={saveCallback} variant="ghost">
                                <LuSave className="mr-2 h-5 w-5"/>
                                <span>Save</span>
                            </Button>

                            <Button onClick={deleteCallback} variant="destructive" disabled={!release.id}>
                                <LuTrash className="mr-2 h-5 w-5"/>
                                <span>Delete</span>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <ReleaseEditor release={release}/>
        </div>
    );
});

const ReleaseEditor = observer((props: { release: MutableChangelogRelease }) => {
    return (<div className="space-y-5">
        <div className="grid gap-2">
            <Label>Release Name</Label>
            <Input required
                   type="text"
                   placeholder="Release Name"
                   value={props.release.releaseName}
                   onChange={action(c => props.release.releaseName = c.target.value)}/>
        </div>

        <div className="grid gap-2">
            <Label>Release Date</Label>
            <DateTimePicker value={props.release.releaseDate}
                            onChange={action(c => props.release.releaseDate = c)}/>
        </div>

        <div className="grid gap-2">
            <Label>Release Notes</Label>
            <Textarea value={props.release.releaseNote ?? undefined}
                      onChange={action(c => props.release.releaseNote = c.target.value)}/>
        </div>

        <div className="grid grid-cols-1 gap-3 w-full pt-5">
            <Label>Changes</Label>
            <Accordion type="multiple" className="w-full">
                {props.release.entries.map(x => (
                    <ReleaseEntryEditor entry={x}
                                        key={x.localId}
                                        onDeleteRequested={() => props.release.removeReleaseEntry(x)}
                                        loadSimilarCategories={q => props.release.categories.filter(x => x.includes(q))}/>
                ))}
            </Accordion>

            <Button variant="ghost"
                    className="mx-auto mt-5"
                    onClick={action(() => props.release.createNewReleaseEntry())}>
                <LuPlus className="mr-2 h-5 w-5"/>
                <span>Add Entry</span>
            </Button>
        </div>
    </div>)
});

const ReleaseEntryEditor = observer((props: {
    entry: MutableChangelogReleaseEntry,
    loadSimilarCategories: (q: string) => string[],
    onDeleteRequested: () => void
}) => {
    const [categorySearch, setCategorySearch] = useState(props.entry.category ?? '');
    const autofilledCategories = useMemo(() => {
        const suggestions = props.loadSimilarCategories(categorySearch);

        if (categorySearch.length > 0) {
            if (suggestions.indexOf(categorySearch) !== -1) {
                suggestions.splice(suggestions.indexOf(categorySearch), 1);
            }

            suggestions.unshift(categorySearch);
        }

        return suggestions.map(x => {
            return {value: x, label: x};
        });
    }, [categorySearch, props.loadSimilarCategories]);

    return (
        <AccordionItem value={props.entry.localId}>
            <AccordionTrigger>
                <div className={`flex flex-row items-center gap-3 ${props.entry.major ? "text-yellow-500" : ''}`}>
                    <EntryTypeIcon type={props.entry.type}/>
                    <h5 className="text-lg">{props.entry.title}</h5>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="grid grid-cols-1 gap-6 py-3">
                    <div className="grid gap-2">
                        <Label>Change Type</Label>
                        <Select value={props.entry.type}
                                onValueChange={action(a => props.entry.type = a as "ADDITION" | "FIX" | "REMOVAL" | "DELAYED" | "INFO" | "BUG" | "SECURITY")}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Change Type"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FIX">Fix</SelectItem>
                                <SelectItem value="ADDITION">Addition</SelectItem>
                                <SelectItem value="REMOVAL">Removal</SelectItem>
                                <SelectItem value="BUG">Bug</SelectItem>
                                <SelectItem value="DELAYED">Delayed Change</SelectItem>
                                <SelectItem value="INFO">Information</SelectItem>
                                <SelectItem value="SECURITY">Security Update</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Title</Label>
                        <Input type="text"
                               placeholder="Title"
                               value={props.entry.title}
                               onChange={action(c => props.entry.title = c.target.value)}/>
                    </div>

                    <div className="grid gap-2">
                        <Label>Category</Label>
                        <AutoComplete selectedValue={props.entry.category ?? ''}
                                      onSelectedValueChange={action((a: string) => props.entry.category = a)}
                                      items={autofilledCategories}
                                      searchValue={categorySearch}
                                      onSearchValueChange={setCategorySearch}/>
                    </div>

                    <div className="grid gap-2">
                        <Label>Description</Label>
                        <Textarea value={props.entry.description ?? undefined}
                                  onChange={action(c => props.entry.description = c.target.value)}/>
                    </div>

                    <div className="flex items-center gap-2">
                        <Switch id="major-change"
                                checked={props.entry.major}
                                onCheckedChange={action(c => props.entry.major = c)}/>
                        <Label htmlFor="major-change">Major Change</Label>
                    </div>

                    <Button onClick={props.onDeleteRequested} variant="destructive">
                        <LuTrash className="mr-2 h-5 w-5"/>
                        <span>Delete Entry</span>
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
});

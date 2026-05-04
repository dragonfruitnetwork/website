import "server-only";

import _ from "lodash";
import {auth} from "@/auth";
import {JSDOM} from "jsdom";
import Link from "next/link";
import {marked} from "marked";
import {prisma} from "@/prisma";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import createDomPurify, {DOMPurify} from "dompurify";
import React, {ReactElement, Suspense, use} from "react";
import {ChangelogRelease, ChangelogReleaseEntry, Prisma} from "@/prisma/generated/prisma/client";
import {LuBadgeAlert, LuChevronLeft, LuChevronRight, LuPencil, LuPlus, LuShield} from "react-icons/lu";

import Listing from "./listing";
import {Editor} from "./editor";
import {EntryTypeIcon} from "./entry-type-icon";

import {Button} from "@/components/ui/button";
import {IconBox} from "@/components/icon-box";
import {Separator} from "@/components/ui/separator";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

import {
    createChangelogRelease,
    deleteChangelogRelease,
    getChangelogRelease,
    updateChangelogRelease
} from "@/server/changelogs";
import {Metadata} from "next";

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
    title: "Changelogs | DragonFruit Network",
    description: "Stay up to date with the latest changes and updates to DragonFruit Products",
    openGraph: {
        title: "Changelogs",
        description: "Stay up to date with the latest changes and updates to DragonFruit Products"
    }
}

interface ChangelogSelectionCriteria {
    prismaQuery: Partial<Prisma.SelectSubset<Prisma.ChangelogReleaseFindFirstArgs, Prisma.ChangelogReleaseFindFirstArgs>>;
    redirectOnEmpty: string | null;
}

const DATE_FORMATTING_OPTIONS: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
};

function ReleaseEntry(props: { entry: ChangelogReleaseEntry, dompurify: DOMPurify }) {
    return (
        <div
            className={`grid grid-cols-[1rem_1fr] gap-x-3 gap-y-2 items-center ${props.entry.major ? "text-yellow-500" : ''}`}>
            <EntryTypeIcon type={props.entry.entryType}/>
            <h5 className="text-lg">{props.entry.title}</h5>

            <div className="col-start-2">
                {props.entry.content && (<div
                    dangerouslySetInnerHTML={{__html: props.dompurify.sanitize(marked.parse(props.entry.content) as string)}}
                    className="text-gray-400 text-base"></div>)}
            </div>
        </div>
    )
}

function ReleaseCategory(props: {
    category: string,
    entries: ReadonlyArray<ChangelogReleaseEntry>,
    dompurify: DOMPurify
}) {
    return (
        <div className="space-y-5">
            <h4 className="text-2xl font-semibold">{props.category}</h4>
            <div className="space-y-4">
                {props.entries.map(entry => <ReleaseEntry key={entry.id} entry={entry} dompurify={props.dompurify}/>)}
            </div>
        </div>
    );
}

function ReleaseNavigation(props: { icon: ReactElement<any>, side: "left" | "right", release: ChangelogRelease | null }) {
    if (!props.release) {
        return (
            <Button variant="ghost">
                {React.cloneElement(props.icon, {color: "gray"})}
            </Button>
        );
    }

    return (
        <Tooltip>
            <TooltipTrigger>
                <Button asChild variant="ghost">
                    <a href={`/changelogs/${props.release.appId}/${props.release.releaseName}`}>
                        {props.icon}
                    </a>
                </Button>
            </TooltipTrigger>
            <TooltipContent side={props.side}>
                {props.release.releaseName}
            </TooltipContent>
        </Tooltip>
    )
}

function EditorHost(props: { appId: string, releaseName: string | undefined, action: "new" | "edit" }) {
    switch (props.action) {
        case "new":
            const appInfo = use(prisma.changelogApp.findUnique({where: {id: props.appId}}));

            return (
                <Suspense>
                    {!appInfo
                        ? (
                            <Alert>
                                <LuBadgeAlert className="h-4 w-4"/>
                                <AlertTitle>App not found</AlertTitle>
                                <AlertDescription>
                                    The provided app ({props.appId}) was not found.
                                </AlertDescription>
                            </Alert>
                        )
                        : <Editor app={appInfo}
                                  release={null}
                                  createReleaseAction={createChangelogRelease}
                                  updateReleaseAction={updateChangelogRelease}
                                  deleteReleaseAction={deleteChangelogRelease}/>}
                </Suspense>
            );

        case "edit":
            const releaseInfo = props.releaseName?.length
                ? use(getChangelogRelease({appId: props.appId, releaseName: props.releaseName}))
                : use(Promise.resolve(null));

            return (
                <Suspense>
                    {!releaseInfo?.data
                        ? (
                            <Alert>
                                <LuBadgeAlert className="h-4 w-4"/>
                                <AlertTitle>Release not found</AlertTitle>
                                <AlertDescription>
                                    <strong>{props.releaseName}</strong> was not found. It may have been deleted or
                                    renamed.
                                </AlertDescription>
                            </Alert>
                        )
                        : <Editor app={releaseInfo.data.app}
                                  release={releaseInfo.data}
                                  createReleaseAction={createChangelogRelease}
                                  updateReleaseAction={updateChangelogRelease}
                                  deleteReleaseAction={deleteChangelogRelease}/>}
                </Suspense>
            );
    }
}

export default async function Changelogs({params}: { params: Promise<{ slug: string[] | null }> }) {
    const [appId, releaseName, releaseAction] = (await params).slug?.slice(0, 3) ?? [];
    const session = await auth.api.getSession({headers: await headers()});

    if (appId && (releaseAction === "edit" || releaseAction === "new") && session?.user?.role === "admin") {
        return <EditorHost appId={appId} releaseName={releaseName} action={releaseAction}/>;
    }

    const {prismaQuery, redirectOnEmpty} = buildReleaseSelectionCriteria(appId, releaseName);
    const release = await prisma.changelogRelease.findFirst({
        ...prismaQuery,
        include: {
            app: true,
            entries: true,
            nextRelease: true,
            previousRelease: true
        }
    });

    // handle release not found
    if (!release && redirectOnEmpty) {
        return redirect(`/changelogs/${redirectOnEmpty}`);
    } else if (!release) {
        return redirect('/');
    }

    const DOMPurify = createDomPurify(new JSDOM('').window);

    return (
        <>
            <Listing/>
            <Card>
                <CardHeader>
                    <CardTitle>
                        <div className="flex flex-row items-center justify-center gap-4">
                            <ReleaseNavigation icon={<LuChevronLeft/>} release={release.previousRelease} side="left"/>

                            <div className="flex flex-col justify-center gap-2 items-center">
                                <div className="text-3xl space-x-3 inline">
                                    <span className="font-semibold" style={release.app.color ? {color: release.app.color} : {}}>
                                        {release.app.name}
                                    </span>
                                    <span>{release.releaseName}</span>
                                </div>
                                <span className="text-gray-300 text-lg font-medium">
                                    {release.releaseDate.toLocaleDateString("en-GB", DATE_FORMATTING_OPTIONS)}
                                </span>
                            </div>

                            <ReleaseNavigation icon={<LuChevronRight/>} release={release.nextRelease} side="right"/>
                        </div>
                        <Separator className="mt-6"/>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {release.releaseNote && (
                        <>
                            <div className="text-center" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(marked.parse(release.releaseNote) as string)}}>
                            </div>
                            <Separator className="my-6"/>
                        </>
                    )}

                    <div className="grid grid-cols-1 gap-8">
                        {_.chain(release.entries)
                            .groupBy(x => x.category)
                            .map((entries, category) =>
                                <ReleaseCategory key={category}
                                                 entries={entries}
                                                 category={category}
                                                 dompurify={DOMPurify}/>)
                            .value()}
                    </div>
                </CardContent>
            </Card>

            {session?.user?.role === "admin" && (
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-row items-center gap-4">
                            <IconBox icon={<LuShield/>} color={release.app.color ?? '#e3e3e3'} size={40}/>
                            <span className="text-xl font-semibold">
                                Changelog Administration
                            </span>

                            <div className="ms-auto flex flex-wrap justify-end gap-2">
                                <Button asChild variant="ghost">
                                    <Link href={`/changelogs/${release.app.id}/${release.releaseName}/edit`}>
                                        <LuPencil className="mr-2 h-5 w-5"/>
                                        <span>Edit {release.releaseName}</span>
                                    </Link>
                                </Button>

                                <Button asChild variant="ghost">
                                    <Link href={`/changelogs/${release.app.id}/_/new`}>
                                        <LuPlus className="mr-2 h-5 w-5"/>
                                        <span>Create Release</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>)
}

function buildReleaseSelectionCriteria(appId: string | null, releaseName: string | null): ChangelogSelectionCriteria {
    if (appId && releaseName) {
        return {
            prismaQuery: {
                where: {AND: [{appId: {equals: appId}}, {releaseName: {equals: releaseName}}]}
            },
            redirectOnEmpty: `/${appId}`
        };
    }

    if (appId) {
        return {
            prismaQuery: {
                where: {appId: {equals: appId}},
                orderBy: {releaseDate: 'desc'}
            },
            redirectOnEmpty: '/'
        };
    }

    return {
        prismaQuery: {
            where: {app: {is: {public: {equals: true}}}},
            orderBy: {releaseDate: 'desc'}
        },
        redirectOnEmpty: null
    };
}

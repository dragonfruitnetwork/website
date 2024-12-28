import _ from "lodash";
import {JSDOM} from "jsdom";
import {marked} from "marked";
import {prisma} from "@/prisma";
import {redirect} from "next/navigation";
import React, {ReactElement} from "react";
import createDomPurify, {DOMPurify} from "dompurify";
import {DefaultArgs} from "@prisma/client/runtime/library";
import {LuChevronLeft, LuChevronRight} from "react-icons/lu";
import {ChangelogRelease, ChangelogReleaseEntry, Prisma} from "@prisma/client";

import Listing from "./listing";
import {EntryIcon} from "./entryType";

import {Separator} from "@/components/ui/separator";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

export const dynamic = 'force-dynamic';

interface ChangelogSelectionCriteria {
    prismaQuery: Partial<Prisma.SelectSubset<Prisma.ChangelogReleaseFindFirstArgs, Prisma.ChangelogReleaseFindFirstArgs<DefaultArgs>>>;
    redirectOnEmpty: string | null;
}

const DATE_FORMATTING_OPTIONS: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
};

export default async function Changelogs({params}: { params: Promise<{ slug: string[] | null }> }) {
    const [appId, releaseName] = (await params).slug?.slice(0, 2) ?? [];
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
                            <ReleaseNavigation icon={<LuChevronLeft/>} release={release.previousRelease}
                                               side="left"/>

                            <div className="flex flex-col justify-center gap-2 items-center">
                                <div className="text-3xl space-x-3 inline">
                                        <span className="font-semibold"
                                              style={release.app.color ? {color: release.app.color} : {}}>
                                            {release.app.name}
                                        </span>
                                    <span>{release.releaseName}</span>
                                </div>
                                <span className="text-gray-300 text-lg font-medium">
                                            {release.releaseDate.toLocaleDateString("en-GB", DATE_FORMATTING_OPTIONS)}
                                        </span>
                            </div>

                            <ReleaseNavigation icon={<LuChevronRight/>} release={release.nextRelease}
                                               side="right"/>
                        </div>
                        <Separator className="mt-6"/>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {release.releaseNote && (
                        <>
                            <div className="text-center"
                                 dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(marked.parse(release.releaseNote) as string)}}></div>
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
                                                 dompurify={DOMPurify}/>
                            )
                            .value()}
                    </div>
                </CardContent>
            </Card>
        </>)
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

function ReleaseEntry(props: { entry: ChangelogReleaseEntry, dompurify: DOMPurify }) {
    return (
        <div className={`grid grid-cols-[1rem,1fr] gap-x-3 gap-y-2 items-center ${props.entry.major ? "text-yellow-500" : ''}`}>
            <EntryIcon type={props.entry.entryType}/>
            <h5 className="text-lg">{props.entry.title}</h5>

            <div className="col-start-2">
                {props.entry.content && (<div
                    dangerouslySetInnerHTML={{__html: props.dompurify.sanitize(marked.parse(props.entry.content) as string)}}
                    className="text-gray-400 text-md"></div>)}
            </div>
        </div>
    )
}

function ReleaseNavigation(props: { icon: ReactElement, side: "left" | "right", release: ChangelogRelease | null }) {
    if (!props.release) {
        return React.cloneElement(props.icon, {color: "gray"});
    }

    return (
        <Tooltip>
            <TooltipTrigger>
                <a href={`/changelogs/${props.release.appId}/${props.release.releaseName}`}>
                    {props.icon}
                </a>
            </TooltipTrigger>
            <TooltipContent side={props.side}>
                v{props.release.releaseName}
            </TooltipContent>
        </Tooltip>
    )
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
"use client";

import useSWR from "swr";
import hljs from "highlight.js/lib/common";
import DOMPurify from "dompurify";
import React, {useEffect, useMemo, useRef} from "react";
import {useRouter} from "next/navigation";

import "highlight.js/styles/github-dark.css";

import {Separator} from "@/components/ui/separator";
import {Skeleton} from "@/components/ui/skeleton";

import {WikiBreadcrumb} from "./breadcrumb";

interface WikiResponse {
    languageCode: string;
    title: string | null;
    contentHtml: string;
    externalUrl: string | null;
    isOutdated: boolean;
    isStub: boolean;
    lastModified: string;
    path: string;
}

class WikiFetchError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

let purifyInstance: ReturnType<typeof DOMPurify> | null = null;

function getPurify() {
    if (purifyInstance) {
        return purifyInstance;
    }

    if (typeof window === "undefined") {
        return null;
    }

    purifyInstance = DOMPurify(window);
    purifyInstance.addHook("afterSanitizeAttributes", (node) => {
        const el = node as Element;
        if (el.tagName !== "A") {
            return;
        }

        const href = el.getAttribute("href") ?? "";
        const isExternal = /^https?:\/\//i.test(href) && !href.startsWith("/wiki");

        if (isExternal) {
            el.setAttribute("target", "_blank");
            el.setAttribute("rel", "noopener noreferrer");
        }
    });

    return purifyInstance;
}

const fetcher = async (url: string): Promise<WikiResponse> => {
    const res = await fetch(url);
    if (res.status === 404) {
        throw new WikiFetchError("not_found", 404);
    }

    if (!res.ok) {
        throw new WikiFetchError(`http_${res.status}`, res.status);
    }

    const data = await res.json();
    if (!data || typeof data.contentHtml !== "string") {
        throw new WikiFetchError("malformed", 500);
    }

    return data as WikiResponse;
};

export function WikiClient({slug}: { slug: string[] }) {
    const router = useRouter();

    const path = slug.filter(Boolean).map(encodeURIComponent).join("/");
    const url = `https://wiki.dragonfruit.network/contents/${path}`;

    const {data, error, isLoading} = useSWR<WikiResponse, WikiFetchError>(url, fetcher, {
        keepPreviousData: true,
        revalidateOnFocus: false,
        shouldRetryOnError: false
    });

    useEffect(() => {
        if (!error) return;
        if (slug.length > 0) router.replace("/wiki");
    }, [error, slug.length, router]);

    useEffect(() => {
        if (data?.title) document.title = `${data.title} | DragonFruit Wiki`;
    }, [data?.title]);

    const contentRef = useRef<HTMLDivElement>(null);
    const safeHtml = useMemo(() => {
        if (!data?.contentHtml) {
            return "";
        }

        const purify = getPurify();
        if (!purify) {
            return "";
        }

        return purify.sanitize(data.contentHtml, {
            ADD_ATTR: ["target", "rel"],
            ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[/#?]|$)/i,
            FORBID_ATTR: ["style", "onerror", "onload"]
        });
    }, [data?.contentHtml]);

    useEffect(() => {
        if (!contentRef.current) {
            return;
        }

        contentRef.current.querySelectorAll<HTMLElement>("pre code").forEach((block) => {
            hljs.highlightElement(block);
        });
    }, [safeHtml]);

    const onContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const a = (e.target as HTMLElement).closest("a");
        if (!a) {
            return;
        }

        const href = a.getAttribute("href");
        if (!href || !href.startsWith("/wiki")) {
            return;
        }

        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) {
            return;
        }

        if (a.getAttribute("target") && a.getAttribute("target") !== "_self") {
            return;
        }

        e.preventDefault();
        router.push(href);
    };

    if (isLoading && !data) {
        return <WikiSkeleton/>;
    }

    if (error && slug.length === 0) {
        return (
            <p className="text-sm text-muted-foreground w-full">
                The wiki is currently unavailable. Please try again later.
            </p>
        );
    }

    if (!data) return null;

    return (
        <article className="w-full">
            <WikiBreadcrumb slug={slug}/>
            <Separator className="my-6"/>
            {(data.isStub || data.isOutdated) && (
                <div className="flex flex-col gap-2 mb-6">
                    {data.isStub && (
                        <div
                            className="rounded-md border border-amber-500/40 bg-amber-950/20 px-4 py-2 text-sm text-amber-200">
                            This article is a stub.
                        </div>
                    )}
                    {data.isOutdated && (
                        <div
                            className="rounded-md border border-red-500/40 bg-red-950/20 px-4 py-2 text-sm text-red-200">
                            This article may be out of date.
                        </div>
                    )}
                </div>
            )}
            <div
                ref={contentRef}
                className="wiki-prose"
                onClick={onContentClick}
                dangerouslySetInnerHTML={{__html: safeHtml}}
            />
        </article>
    );
}

function WikiSkeleton() {
    return (
        <div className="w-full space-y-4">
            <Skeleton className="h-4 w-48"/>
            <Skeleton className="h-10 w-2/3"/>
            <Skeleton className="h-4 w-full"/>
            <Skeleton className="h-4 w-11/12"/>
            <Skeleton className="h-4 w-3/4"/>
            <Skeleton className="h-4 w-full"/>
            <Skeleton className="h-4 w-5/6"/>
        </div>
    );
}

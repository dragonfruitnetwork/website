import type {MetadataRoute} from "next";
import {prisma} from "@/prisma";

const BASE_URL = "https://dragonfruit.network";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        {url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1.0},
        {url: `${BASE_URL}/onionfruit`, changeFrequency: "monthly", priority: 0.9},
        {url: `${BASE_URL}/onionfruit/status`, changeFrequency: "daily", priority: 0.7},
        {url: `${BASE_URL}/onionfruit/countries`, changeFrequency: "weekly", priority: 0.7},
        {url: `${BASE_URL}/kaplan`, changeFrequency: "monthly", priority: 0.9},
        {url: `${BASE_URL}/changelogs`, changeFrequency: "weekly", priority: 0.6},
        {url: `${BASE_URL}/wiki`, changeFrequency: "monthly", priority: 0.6}
    ];

    const releases = await prisma.changelogRelease.findMany({
        where: {app: {is: {public: true}}},
        select: {releaseName: true, releaseDate: true, appId: true}
    });

    const changelogRoutes: MetadataRoute.Sitemap = releases.map(release => ({
        url: `${BASE_URL}/changelogs/${release.appId}/${release.releaseName}`,
        lastModified: release.releaseDate,
        changeFrequency: "yearly",
        priority: 0.5
    }));

    return [...staticRoutes, ...changelogRoutes];
}

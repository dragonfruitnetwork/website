import type {MetadataRoute} from "next";
import {prisma} from "@/prisma";

const BASE_URL = "https://dragonfruit.network";

// In-memory cache with 24-hour TTL
let cachedSitemap: MetadataRoute.Sitemap | null = null;
let cacheExpiry: number = 0;
let generatingPromise: Promise<MetadataRoute.Sitemap> | null = null;

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const dynamic = "force-dynamic";

async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
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

    const sitemap = [...staticRoutes, ...changelogRoutes];
    return sitemap;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = Date.now();

    if (cachedSitemap && now < cacheExpiry) {
        return cachedSitemap;
    }

    if (!generatingPromise) {
        generatingPromise = (async () => {
            try {
                const result = await generateSitemap();
                cachedSitemap = result;
                cacheExpiry = Date.now() + CACHE_TTL;
                return result;
            } finally {
                generatingPromise = null;
            }
        })();
    }

    return generatingPromise;
}

import {prisma} from "@/prisma";
import {Suspense, use} from "react";

interface AppReleaseInfo {
    id: number;
    name: string;
    color: string;
    releaseName: string;
}

export default function Listing() {
    const publicApps: AppReleaseInfo[] = use(prisma.$queryRaw`
        SELECT app.id, app.name, app.color, cr.releaseName
        FROM changelog_apps app
                 JOIN (SELECT appId, MAX(releaseDate) as latestReleaseDate
                       FROM changelog_releases
                       GROUP BY appId) AS latestReleases ON app.id = latestReleases.appId
                 JOIN changelog_releases cr
                      ON cr.appId = latestReleases.appId AND cr.releaseDate = latestReleases.latestReleaseDate
        WHERE app.public = true;
    `);

    return (
        <Suspense>
            <div className="flex flex-row flex-wrap" style={{maxWidth: "100%", width: "max-content"}}>
                {publicApps.map((x) => (
                    <a key={x.id} href={`/changelogs/${x.id}/${x.releaseName}`}
                       className="block p-1 text-decoration-none w-[125px] hover:w-[150px] lg:hover:w-[175px] transition-all select-none"
                       style={{willChange: "opacity"}}>
                        <div className="rounded-full block h-[4px] mb-1 w-100" style={{backgroundColor: x.color}}/>
                        <h6 className="text-xs font-semibold">{x.name}</h6>
                        <h4 className="text-md">{x.releaseName}</h4>
                    </a>
                ))}
            </div>
        </Suspense>
    );
}
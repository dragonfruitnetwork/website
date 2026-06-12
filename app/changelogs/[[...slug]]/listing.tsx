import "server-only";

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
        SELECT id, name, color, "releaseName"
        FROM (SELECT app.id,
                     app.name,
                     app.color,
                     app."order",
                     cr."releaseName",
                     ROW_NUMBER() OVER (PARTITION BY cr."appId" ORDER BY cr."releaseDate" DESC, cr.id DESC) AS rn
              FROM changelog_apps app
                       JOIN changelog_releases cr ON cr."appId" = app.id
              WHERE app.public = true) ranked
        WHERE rn = 1
        ORDER BY "order";
    `);

    return (
        <Suspense>
            <div className="flex flex-row flex-wrap gap-3" style={{maxWidth: "100%", width: "max-content"}}>
                {publicApps.map((x) => (
                    <a key={x.id}
                       href={`/changelogs/${x.id}/${x.releaseName}`}
                       className="block p-1 no-underline w-[150px] hover:w-[180px] lg:hover:w-[210px] transition-all select-none">
                        <div className="rounded-full block h-[4px] mb-1 w-full" style={{backgroundColor: x.color}}/>
                        <h6 className="text-xs font-semibold">{x.name}</h6>
                        <h4 className="text-base">{x.releaseName}</h4>
                    </a>
                ))}
            </div>
        </Suspense>
    );
}
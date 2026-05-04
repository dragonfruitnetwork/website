import Link from "next/link";
import {LuChevronRight} from "react-icons/lu";

export function WikiBreadcrumb({slug}: { slug: string[] }) {
    const segments = [
        {label: "Wiki", href: "/wiki"},
        ...slug.map((seg, i) => ({
            label: seg,
            href: `/wiki/${slug.slice(0, i + 1).join("/")}`
        }))
    ];

    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground lowercase">
                {segments.map((s, i) => {
                    const isLast = i === segments.length - 1;
                    return (
                        <li key={s.href} className="flex items-center gap-1">
                            {i > 0 && <LuChevronRight aria-hidden="true" className="h-4 w-4"/>}
                            {isLast
                                ? <span className="text-foreground font-medium" aria-current="page">{s.label}</span>
                                : <Link href={s.href}
                                        className="hover:text-foreground transition-colors">{s.label}</Link>}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

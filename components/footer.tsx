import Link from "next/link";
import {LuMail} from "react-icons/lu";
import {FaDiscord, FaGithub} from "react-icons/fa6";

import {Separator} from "@/components/ui/separator";

export default function Footer() {
    return (
        <footer className="px-[10vw] pb-10 pt-12">
            <Separator className="mb-8"/>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                    &copy; {new Date().getUTCFullYear()} DragonFruit Network
                </span>

                <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                    <Link href="/onionfruit"
                          className="text-muted-foreground hover:text-foreground transition-colors">
                        OnionFruit&trade;
                    </Link>
                    <Link href="/kaplan"
                          className="text-muted-foreground hover:text-foreground transition-colors">
                        Kaplan
                    </Link>
                    <Link href="/changelogs"
                          className="text-muted-foreground hover:text-foreground transition-colors">
                        Changelogs
                    </Link>
                    <Link href="https://github.com/dragonfruitnetwork" target="_blank" rel="noopener"
                          className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5">
                        <FaGithub/> GitHub
                    </Link>
                    <Link href="https://discord.gg/mcYJQNe" target="_blank" rel="noopener"
                          className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5">
                        <FaDiscord/> Discord
                    </Link>
                    <Link href="mailto:inbox@dragonfruit.network"
                          className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5">
                        <LuMail/> Email
                    </Link>
                </nav>
            </div>
        </footer>
    );
}

import React from "react";
import Link from "next/link";
import {darken} from "polished";
import {TbWiper} from "react-icons/tb";
import {FaGithub} from "react-icons/fa6";
import {MdSignalWifi4BarLock} from "react-icons/md";
import {LuChevronRight, LuUserCircle} from "react-icons/lu";

import {cn} from "@/lib/utils";
import {IconBox} from "@/components/icon-box";

interface HomePageIconProps {
    title: string;
    icon: React.ReactElement;
    children: React.ReactNode;
    color: string;
    spacerClass?: string;
    className?: string;
    small?: boolean;
}

export default function Home() {
    return (
        <div className="container mx-auto mb-10">
            <main className="flex flex-col gap-5">
                <HomePageCard color="#c71585" icon={<MdSignalWifi4BarLock/>} title="OnionFruit&trade;" spacerClass="lg:h-[35vh] h-[15vh]">
                    <p className="pt-2 text-muted-foreground">
                        The new, open-source Tor access client is now available.
                        Bring your own browser and connect to the Tor network effortlessly.
                    </p>

                    <Link href="/onionfruit" className="inline-flex items-center mt-4 text-sm">
                        Learn More <LuChevronRight className="ml-1 h-5 w-5"/>
                    </Link>
                </HomePageCard>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(500px,1fr))] gap-4">
                    <HomePageCard color="#795548" title="Kaplan" icon={<TbWiper/>}>
                        <p className="pt-2 text-muted-foreground">
                            Remove pre-installed software bundled with Windows 10/11.
                            <br/>
                            Fast, portable and leaves no trace on your system.
                        </p>

                        <Link href="/kaplan" className="inline-flex items-center mt-4 text-sm">
                            Learn More <LuChevronRight className="ml-2 h-5 w-5"/>
                        </Link>
                    </HomePageCard>

                    <div className="grid grid-rows-2 gap-5">
                        <HomePageCard color="#2194f3" title="Account" icon={<LuUserCircle/>} small>
                            <p className="pt-2 text-muted-foreground">
                                Manage accounts used to sign into DragonFruit Services.
                            </p>

                            <Link href="https://id.dragonfruit.network" target="_blank" className="inline-flex items-center mt-4 text-sm">
                                View <LuChevronRight className="ml-2 h-5 w-5"/>
                            </Link>
                        </HomePageCard>

                        <HomePageCard color="#9e9e9e" title="Open-source" icon={<FaGithub/>} small>
                            <p className="pt-2 text-muted-foreground">
                                View a range of our open-source projects on GitHub.
                            </p>

                            <Link href="https://github.com/dragonfruitnetwork" target="_blank" className="inline-flex items-center mt-4 text-sm">
                                View <LuChevronRight className="ml-2 h-5 w-5"/>
                            </Link>
                        </HomePageCard>
                    </div>
                </div>
            </main>
        </div>
    );
}

function HomePageCard(props: HomePageIconProps) {
    const darkenedBg = props.color ? darken(0.3, props.color) : "unset";
    return (
        <div className={cn("flex h-full w-full select-none flex-col rounded-md bg-muted p-6 outline-none", props.className ?? '')} style={{backgroundColor: darkenedBg}}>
            <div className={props.spacerClass ? props.spacerClass : "mt-auto"}></div>
            <IconBox icon={props.icon} size={props.small ? 48 : 64} color={props.color}/>
            <span className="text-xl pt-5 font-semibold">{props.title}</span>
            {props.children}
        </div>
    );
}

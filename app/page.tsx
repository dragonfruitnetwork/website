import React from "react";
import Link from "next/link";
import {darken} from "polished";
import {FaGithub, FaHatCowboySide} from "react-icons/fa6";
import {MdSignalWifi4BarLock} from "react-icons/md";
import {LuChevronRight, LuCircleUser} from "react-icons/lu";

import {cn} from "@/lib/utils";
import {IconBox} from "@/components/icon-box";
import {Metadata} from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface HomePageIconProps {
    icon: React.ReactElement<any>;
    children: React.ReactNode;
    title: string;
    color: string;
    spacerClass?: string;
    className?: string;
    small?: boolean;
}

export const metadata: Metadata = {
    title: 'Home | DragonFruit Network',
    description: 'The home of OnionFruit™, Kaplan and various open-source projects.',
    openGraph: {
        title: "Welcome to DragonFruit",
        description: "The home of OnionFruit™, Kaplan and various open-source projects."
    }
}

export default function Home() {
    return (<>
            <Header/>
            <main className="container mx-auto mb-10">
                <h1 className="sr-only">DragonFruit Network</h1>
                <div className="flex flex-col gap-4 mx-4">
                    <HomePageCard color="#c71585"
                                  title="OnionFruit&trade;"
                                  icon={<MdSignalWifi4BarLock/>}
                                  spacerClass="lg:h-[35vh] h-[12vh] sm:h-[15vh]">
                        <p className="pt-2 text-muted-foreground">
                            The new, open-source Tor access client is now available.
                            Bring your own browser and connect to the Tor network effortlessly.
                        </p>

                        <Link href="/onionfruit" className="inline-flex items-center mt-4 text-sm">
                            Learn More <LuChevronRight className="ml-1 h-5 w-5"/>
                        </Link>
                    </HomePageCard>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <HomePageCard color="#795548" title="Kaplan" icon={<FaHatCowboySide/>}>
                            <p className="pt-2 text-muted-foreground">
                                Remove pre-installed software bundled with Windows 10/11.
                                <br/>
                                Fast, portable and leaves no trace on your system.
                            </p>

                            <Link href="/kaplan" className="inline-flex items-center mt-4 text-sm">
                                Learn More <LuChevronRight className="ml-2 h-5 w-5"/>
                            </Link>
                        </HomePageCard>

                        <div className="grid grid-rows-2 gap-4">
                            <HomePageCard color="#2194f3" title="Account" icon={<LuCircleUser/>} small>
                                <p className="pt-2 text-muted-foreground">
                                    Manage accounts used to sign into DragonFruit Services.
                                </p>

                                <Link href="https://id.dragonfruit.network" target="_blank" rel="noopener noreferrer"
                                      className="inline-flex items-center mt-4 text-sm">
                                    View <LuChevronRight className="ml-2 h-5 w-5"/>
                                </Link>
                            </HomePageCard>

                            <HomePageCard color="#9e9e9e" title="Open-source" icon={<FaGithub/>} small>
                                <p className="pt-2 text-muted-foreground">
                                    View a range of our open-source projects on GitHub.
                                </p>

                                <Link href="https://github.com/dragonfruitnetwork" target="_blank" rel="noopener noreferrer"
                                      className="inline-flex items-center mt-4 text-sm">
                                    View <LuChevronRight className="ml-2 h-5 w-5"/>
                                </Link>
                            </HomePageCard>
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </>
    );
}

function HomePageCard(props: HomePageIconProps) {
    const darkenedBg = props.color ? darken(0.3, props.color) : "unset";
    return (
        <div
            className={cn("flex h-full w-full select-none flex-col rounded-md bg-muted p-5 sm:p-6 outline-hidden", props.className ?? '')}
            style={{backgroundColor: darkenedBg}}>
            <div className={props.spacerClass ? props.spacerClass : "mt-auto"}></div>
            <IconBox icon={props.icon} size={props.small ? 48 : 64} color={props.color}/>
            <h2 className="text-xl pt-5 font-semibold">{props.title}</h2>
            {props.children}
        </div>
    );
}

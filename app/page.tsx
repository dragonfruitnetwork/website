import Link from "next/link";
import {LuChevronRight} from "react-icons/lu";
import {MdSignalWifi4BarLock} from "react-icons/md";

import {IconBox} from "@/components/icon-box";

export default function Home() {
    return (
        <div className="container mx-auto">
            <main className="flex flex-col gap-5">


                <HomePageCard>
                    <IconBox icon={<MdSignalWifi4BarLock/>} color={"#c71585"}/>
                    <span className="text-xl pt-5 font-semibold">OnionFruit&trade;</span>
                    <p className="pt-2 text-muted-foreground">
                        The new, open-source Tor access client is now available.
                        Bring your own browser and connect to the Tor network effortlessly.
                    </p>

                    <Link href="/onionfruit" className="inline-flex items-center gap-2 mt-4 text-sm">
                        Learn More <LuChevronRight className="h-5 w-5"/>
                    </Link>
                </HomePageCard>
            </main>
        </div>
    );
}

function HomePageCard(props: { children: React.ReactNode }) {
    return (
        <div className="flex h-full w-full select-none flex-col rounded-md bg-muted p-6 outline-none">
            {props.children}
        </div>
    );
}

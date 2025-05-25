import {Metadata} from "next";
import {LuGlobeLock} from "react-icons/lu";

import Header from "@/components/header";
import Footer from "@/components/footer";

import {IconBox} from "@/components/icon-box";
import {OnionDbViewer} from "@/app/onionfruit/countries/oniondb-viewer";


export const metadata: Metadata = {
    title: "OnionFruit™ Countries | DragonFruit Network",
    description: "View server metrics and country information for the Tor network",
    openGraph: {
        title: "OnionFruit™ Countries",
        description: "View server metrics and country information for the Tor network",
    }
}

export default function Page() {
    return (
        <>
            <div className="space-y-10">
                <div className="flex flex-col">
                    <Header/>
                    <div className="flex flex-col gap-5 mt-[2.5rem] items-center">
                        <IconBox icon={<LuGlobeLock/>} color="#74ff03"/>
                        <div className="space-y-3">
                            <h1 className="font-semibold text-center text-4xl">OnionFruit™ Countries</h1>
                            <h4 className="text-center">
                                Our web services provide up-to-date information on countries accessible through Tor&reg; directly to OnionFruit™ clients.
                            </h4>
                        </div>
                    </div>
                </div>
                <main className="container mx-auto">
                    <OnionDbViewer/>
                </main>
            </div>
            <Footer/>
        </>
    )
}
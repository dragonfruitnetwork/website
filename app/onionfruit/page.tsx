import React from "react";
import {Metadata} from "next";

import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
    title: "OnionFruit™ - Tor Access Client | DragonFruit Network",
    description: "Connect to Tor in seconds. A free and no-fuss Tor client.",
    openGraph: {
        title: "OnionFruit™",
        description: "A Tor Access Client"
    }
};

export default function Page() {
    return (<>
        <div className="h-dvh flex flex-col onionfruit-gradient">
            <Header/>

            <div className="flex flex-col my-auto items-center gap-5">
                <img src="https://dragonfruit.network/assets/onionfruit-ui.png" alt="OnionFruit™ UI" className="object-contain mx-auto h-auto w-[min(600px,50dvw)]"/>

                <div className="flex flex-col items-center gap-3">
                    <h4 className="font-semibold text-4xl text-gray-300 mt-4">OnionFruit™</h4>
                    <p className="text-2xl">A free and no-fuss Tor client.</p>
                </div>
            </div>
        </div>
        <Footer/>
    </>);
}

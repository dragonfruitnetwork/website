import React from "react";
import {Metadata} from "next";

import Footer from "@/components/footer";
import Header from "@/components/header";

import {ClientConnectionStatus} from "./client-connection-check";

export const metadata: Metadata = {
    title: 'OnionFruit™ Connection Status | DragonFruit Network',
    description: 'Check if your browser is connected to Tor.',
    openGraph: {
        title: 'OnionFruit™ Connection Status',
        description: 'Check if your browser is connected to Tor.'
    }
}

export default function Page() {
    return (<>
        <Header/>
        <main>
            <h1 className="sr-only">OnionFruit™ Connection Status</h1>
            <ClientConnectionStatus/>
        </main>
        <Footer/>
    </>);
}

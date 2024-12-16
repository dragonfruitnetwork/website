import {Metadata} from "next";
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
    return <ClientConnectionStatus/>
}

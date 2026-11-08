"use client";

import useSWR from "swr";

import {capitalCityInfo} from "@/lib/capital-city-info";
import {DottedMap, type Marker} from "@/components/ui/dotted-map";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

const STATUS_URL = "https://onionfruit-api.dragonfruit.network/connectionstatus";

const CONNECTED_COLOUR = "#74ff03";
const DISCONNECTED_COLOUR = "#f44336";
const UNKNOWN_STATUS_COLOUR = "#607d8b";

interface OnionFruitConnectionStatusResponse {
    ipAddress: string;
    isTor: boolean | null;
    countryCode: string;
    countryName: string;
    asNumber: number;
    asName: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json() as Promise<OnionFruitConnectionStatusResponse>);

export function ClientConnectionStatus() {
    const { data: connectionStatus, isLoading } = useSWR<OnionFruitConnectionStatusResponse>(STATUS_URL, fetcher);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <span className="font-semibold text-2xl">Checking Connection Status...</span>
            </div>
        )
    }

    if (!connectionStatus) {
        return (
            <div className="flex flex-col gap-5 items-center justify-center">
                <div className="relative h-[500px] w-full">
                    <DottedMap markerColor={UNKNOWN_STATUS_COLOUR} pulse dotRadius={0.25}/>
                </div>

                <span className="font-semibold text-2xl">An error occurred while trying to check if you're connected to Tor.</span>
                <span className="text-xl">Please reload the page and try again.</span>
            </div>
        )
    }

    const isConnected = !!connectionStatus.isTor;
    const statusColour = isConnected ? CONNECTED_COLOUR : DISCONNECTED_COLOUR;

    const [lat, lng] = capitalCityInfo[connectionStatus.countryCode] ?? capitalCityInfo.US;
    const markers: Marker[] = [{ lat, lng, size: 0.5 }];

    return (
        <div className="flex flex-col gap-5 items-center justify-center">
            <div className="relative h-[500px] w-full">
                <DottedMap markers={markers} markerColor={statusColour} pulse dotRadius={0.25}/>
            </div>

            <Tooltip>
                <TooltipTrigger className="text-2xl md:text-3xl text-center cursor-help">
                    This browser is <span className="font-semibold" style={{color: statusColour}}>{isConnected ? "Connected to" : "Disconnected from"}</span> Tor.
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    <span className="text-center">IP: {connectionStatus.ipAddress ?? "Unknown IP"}</span>
                </TooltipContent>
            </Tooltip>

            <div className="inline-flex flex-wrap gap-3 items-center justify-center text-lg select-none px-5">
                <span className="text-center">
                    Country: <span className="font-semibold select-text">{connectionStatus.countryName}</span>
                </span>

                <span className="text-center">
                    ISP: <span className="font-semibold select-text">{connectionStatus.asName ?? "Unknown"}</span>
                </span>
            </div>
        </div>
    )
}

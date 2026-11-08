"use client";

import useSWR from "swr";
import {useMemo} from "react";

import {capitalCityInfo} from "@/lib/capital-city-info";

import { DottedMap, type Marker } from "@/components/ui/dotted-map";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

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

export function ClientConnectionStatus() {
    const { data: connectionStatus, error, isLoading } = useSWR<OnionFruitConnectionStatusResponse, any, string>('https://onionfruit-api.dragonfruit.network/connectionstatus', url => fetch(url).then((res) => res.json()));

    const [marker, colour]: [Marker | null, string] = useMemo(() => {
        if (error || !connectionStatus) {
            return [null, UNKNOWN_STATUS_COLOUR];
        }

        const [lat, lng] = capitalCityInfo[connectionStatus.countryCode ?? "US"];
        const marker: Marker = { lat, lng, size: 0.5 };

        return [marker, connectionStatus.isTor ? CONNECTED_COLOUR : DISCONNECTED_COLOUR];
    }, [connectionStatus, error]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <span className="font-semibold text-2xl">Checking Connection Status...</span>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-5 items-center justify-center">
            <div className="relative h-[500px] w-full">
                <DottedMap markers={marker ? [marker] : []} markerColor={colour} pulse dotRadius={0.25}/>
            </div>

            {error || !connectionStatus ? (
                <>
                    <span className="font-semibold text-2xl">An error occurred while trying to check if you're connected to Tor.</span>
                    <span className="text-xl">Please reload the page and try again.</span>
                </>
            ) : (
                <>
                    <span className="text-2xl md:text-3xl text-center">This browser is {connectionStatus.isTor
                        ? <><span className="font-semibold" style={{color: CONNECTED_COLOUR}}>Connected</span> to</>
                        : <><span className="font-semibold" style={{color: DISCONNECTED_COLOUR}}>Disconnected</span> from</>} Tor.
                    </span>

                    <div className="inline-flex flex-wrap gap-3 items-center justify-center text-lg select-none px-5">
                        <Tooltip>
                            <TooltipTrigger>
                                <span className="text-center">
                                    Country: <span className="font-semibold select-text">{connectionStatus.countryName}</span>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <span className="text-center">
                                    IP: {connectionStatus.ipAddress ?? "Unknown IP"}
                                </span>
                            </TooltipContent>
                        </Tooltip>

                        <span className="text-center">
                            ISP: <span className="font-semibold select-text">{connectionStatus.asName ?? "Unknown"}</span>
                        </span>
                    </div>
                </>
            )}
        </div>
    )
}
"use client";

import useSWR from "swr";
import {useMemo} from "react";
import {COBEOptions} from "cobe";

import {capitalCityInfo} from "@/lib/capital-city-info";

import Globe from "@/components/ui/globe";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

interface OnionFruitConnectionStatusResponse {
    ip_address: string;
    is_tor: boolean | null;
    country_code: string;
    country_name: string;
    as_number: number;
    as_name: string;
}

export function ClientConnectionStatus() {
    const { data: connectionStatus, error, isLoading } = useSWR<OnionFruitConnectionStatusResponse, any, string>('https://onionfruit-api.dragonfruit.network/connectionstatus', url => fetch(url).then((res) => res.json()));
    const globeOptions: COBEOptions | undefined = useMemo(() => {
        if (!connectionStatus) {
            return undefined;
        }

        let color: [number, number, number] = [0x60, 0x7d, 0x8b];
        let capitalLocation: [number, number] | null = null;

        if (!error && connectionStatus) {
            if (connectionStatus.is_tor) {
                color = [0x74, 0xff, 0x03];
            } else {
                color = [0xf4, 0x43, 0x36];
            }

            capitalLocation = capitalCityInfo[connectionStatus.country_code ?? "US"];
        }

        const props: COBEOptions = {
            width: 800,
            height: 800,
            onRender: () => {
            },
            devicePixelRatio: 2,
            dark: 1,
            diffuse: 0.4,
            mapSamples: 16000,
            mapBrightness: 1.2,
            glowColor: [0.5, 0.5, 0.5],
            baseColor: color.map(c => c / 255) as [number, number, number],
            markerColor: [1, 1, 1],
            phi: 0,
            theta: 0.3,
            markers: []
        };

        if (capitalLocation) {
            props.markers.push({location: capitalLocation, size: 0.05});
        }

        return props;
    }, [connectionStatus]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <span className="font-semibold text-2xl">Checking Connection Status...</span>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-5 items-center justify-center">
            <div className="relative flex h-[600px] w-[600px] md:scale-100 sm:scale-75 scale-50 overflow-hidden">
                <Globe config={globeOptions}/>
            </div>

            {error || !connectionStatus ? (
                <>
                    <span className="font-semibold text-2xl">An error occurred while trying to check if you're connected to Tor.</span>
                    <span className="text-xl">Please reload the page and try again.</span>
                </>
            ) : (
                <>
                    <span className="text-2xl md:text-3xl text-center">This browser is {connectionStatus.is_tor
                        ? <><span className="font-semibold" style={{color: "#74ff03"}}>Connected</span> to</>
                        : <><span className="font-semibold" style={{color: "#f44336"}}>Disconnected</span> from</>} Tor.
                    </span>

                    <div className="inline-flex flex-wrap gap-3 items-center justify-center text-lg select-none px-5">
                        <Tooltip>
                            <TooltipTrigger>
                                <span className="text-center">
                                    Country: <span className="font-semibold select-text">{connectionStatus.country_name}</span>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <span className="text-center">
                                    IP: {connectionStatus.ip_address ?? "Unknown IP"}
                                </span>
                            </TooltipContent>
                        </Tooltip>

                        <span className="text-center">
                            ISP: <span className="font-semibold select-text">{connectionStatus.as_name ?? "Unknown"}</span>
                        </span>
                    </div>
                </>
            )}
        </div>
    )
}
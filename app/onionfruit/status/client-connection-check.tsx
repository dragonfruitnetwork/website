"use client";

import useSWR from "swr";
import {useMemo} from "react";
import {COBEOptions} from "cobe";
import {LuGlobe} from "react-icons/lu";

import {capitalCityInfo} from "@/lib/capital-city-info";

import {GlobeWithFallback} from "@/components/ui/globe-with-fallback";
import {IconBox} from "@/components/icon-box";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

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

    const fallbackColor = useMemo(() => {
        if (error || !connectionStatus) {
            return "#607d8b";
        }

        return connectionStatus.isTor ? "#74ff03" : "#f44336";
    }, [connectionStatus, error]);

    const globeOptions: COBEOptions | undefined = useMemo(() => {
        if (!connectionStatus) {
            return undefined;
        }

        let color: [number, number, number] = [0x60, 0x7d, 0x8b];
        let capitalLocation: [number, number] | null = null;

        if (!error && connectionStatus) {
            if (connectionStatus.isTor) {
                color = [0x74, 0xff, 0x03];
            } else {
                color = [0xf4, 0x43, 0x36];
            }

            capitalLocation = capitalCityInfo[connectionStatus.countryCode ?? "US"];
        }

        return {
            width: 800,
            height: 800,
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
            markers: capitalLocation ? [{location: capitalLocation, size: 0.05}] : []
        };
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
            <div className="relative flex h-[600px] w-[600px] md:scale-100 sm:scale-75 scale-50 overflow-hidden">
                <GlobeWithFallback config={globeOptions} fallback={
                    <div className="flex size-full items-center justify-center">
                        <IconBox icon={<LuGlobe/>} color={fallbackColor}/>
                    </div>
                }/>
            </div>

            {error || !connectionStatus ? (
                <>
                    <span className="font-semibold text-2xl">An error occurred while trying to check if you're connected to Tor.</span>
                    <span className="text-xl">Please reload the page and try again.</span>
                </>
            ) : (
                <>
                    <span className="text-2xl md:text-3xl text-center">This browser is {connectionStatus.isTor
                        ? <><span className="font-semibold" style={{color: "#74ff03"}}>Connected</span> to</>
                        : <><span className="font-semibold" style={{color: "#f44336"}}>Disconnected</span> from</>} Tor.
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
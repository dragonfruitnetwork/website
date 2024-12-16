"use client";

import {useEffect, useMemo, useState} from "react";

import Globe from "@/components/ui/globe";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

import {capitalCityInfo} from "@/lib/capital-city-info";

interface OnionFruitConnectionStatusResponse {
    ip_address: string;
    is_tor: boolean | null;
    country_code: string;
    country_name: string;
    as_number: number;
    as_name: string;
}

export function ClientConnectionStatus() {
    const [connectionStatus, setConnectionStatus] = useState<OnionFruitConnectionStatusResponse | null>(null);
    const globeOptions = useMemo(() => {
        if (!connectionStatus) {
            return undefined;
        }

        const capitalLocation = capitalCityInfo[connectionStatus?.country_code ?? "US"];
        return {
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
            baseColor: connectionStatus?.is_tor ? [116 / 255, 1, 3 / 255] : [244 / 255, 67 / 255, 54 / 255],
            markerColor: [1, 1, 1],
            phi: 0,
            theta: 0.3,
            markers: [
                {location: capitalLocation, size: 0.05}
            ]
        };
    }, [connectionStatus]);

    useEffect(() => {
        fetch("https://onionfruit-api.dragonfruit.network/connectionstatus")
            .then(r => r.ok ? r.json() : null)
            .then(setConnectionStatus);
    }, []);

    if (!connectionStatus) {
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

            <span className="text-2xl md:text-3xl text-center">This browser is {connectionStatus?.is_tor
                ? <><span className="font-semibold" style={{color: "#74ff03"}}>Connected</span> to</>
                : <><span className="font-semibold" style={{color: "#f44336"}}>Disconnected</span> from</>} Tor.
            </span>

            <div className="inline-flex flex-wrap gap-3 items-center justify-center text-lg select-none px-5">
                <Tooltip>
                    <TooltipTrigger>
                        <span className="text-center">Country: <span className="font-semibold select-text">{connectionStatus.country_name}</span></span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <span className="text-center">IP: {connectionStatus.ip_address ?? "Unknown IP"}</span>
                    </TooltipContent>
                </Tooltip>
                <span className="text-center">ISP: <span className="font-semibold select-text">{connectionStatus.as_name ?? "Unknown"}</span></span>
            </div>
        </div>
    )
}
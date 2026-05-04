import {useMemo} from "react";
import {Card, CardContent} from "@/components/ui/card";

import {OnionDbCountry} from "@/lib/oniondb";
import {DonutChart} from "@/components/ui/donut-chart";

export function CountryCard(props: {
    country: OnionDbCountry,
    metrics: { totalNodes: number, totalEntryNodes: number, totalExitNodes: number }
}) {
    const cardCode = useMemo(() => toFlagCodepoint(props.country.countryCode), [props.country]);

    return (
        <Card>
            <CardContent className="pt-6 grid grid-cols-[64px_1fr] items-center gap-x-4 gap-y-2">
                <img src={`https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/${cardCode}.svg`} alt={`${props.country.countryName} flag`} className="w-full"/>
                <h2 className={`font-semibold text-xl ${props.country.entryNodeCount + props.country.exitNodeCount ? "" : "text-gray-500"}`}>{props.country.countryName}</h2>

                <div className="xl:col-start-2 xl:col-span-1 col-span-2 flex flex-wrap items-end gap-3">
                    <NodeStats totalNodes={props.metrics.totalNodes} countryNodes={props.country.totalNodeCount} color={"#03a9f4"} nodeType={"total"}/>
                    <NodeStats totalNodes={props.metrics.totalExitNodes} countryNodes={props.country.exitNodeCount} color={"#e91e63"} nodeType={"exit"}/>
                    <NodeStats totalNodes={props.metrics.totalEntryNodes} countryNodes={props.country.entryNodeCount} color={"#8bc34a"} nodeType={"entry"}/>
                </div>
            </CardContent>
        </Card>
    )
}

export function NodeStats(props: {totalNodes: number, countryNodes: number, color: string, nodeType: string, large?: boolean}) {
    const percentage = (props.countryNodes / props.totalNodes) * 100;

    return (
        <div className={`flex items-center ${props.large && "justify-center"} gap-2`} style={props.countryNodes ? undefined : {filter: "grayscale(100%)"}}>
            <DonutChart color={props.color} percentage={percentage} size={props.large ? 75 : 35} disabled={!props.countryNodes} />
            <div className={`${!props.countryNodes && "text-gray-400"}`}>
                <h6 className={props.large ? "text-lg" : undefined}>{props.countryNodes.toLocaleString()} {props.nodeType} node{props.countryNodes !== 1 && "s"}</h6>
                <p className={props.large ? undefined : "text-sm"}>{percentage.toFixed(2)}% global share</p>
            </div>
        </div>
    )
}

function toFlagCodepoint(countryCode: string) {
    return countryCode.toUpperCase()
        .split('')
        .map(char => (char.charCodeAt(0) + 127397).toString(16).toLowerCase())
        .join('-');
}
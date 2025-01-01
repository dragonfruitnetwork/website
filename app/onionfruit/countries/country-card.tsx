import {useMemo} from "react";
import {Card, CardContent} from "@/components/ui/card";

import {OnionDbCountry} from "@/lib/oniondb";

export function CountryCard(props: {country: OnionDbCountry}) {
    const cardCode = useMemo(() => toFlagCodepoint(props.country.countryCode), [props.country]);

    return (
        <Card>
            <CardContent className="pt-6 grid grid-cols-[64px,1fr] items-center gap-x-4 gap-y-2">
                <img src={`https://cdn.jsdelivr.net/gh/twitter/twemoji@master/assets/svg/${cardCode}.svg`} alt={`${props.country.countryName} flag`} className="w-100"/>
                <h2 className={`font-semibold text-xl ${props.country.entryNodeCount + props.country.exitNodeCount ? "" : "text-gray-500"}`}>{props.country.countryName}</h2>

                <div className="col-start-2 flex flex-wrap items-end gap-3">
                    <span className="text-lg"><strong>{props.country.totalNodeCount.toLocaleString()}</strong> total nodes</span>
                    <span>{props.country.entryNodeCount.toLocaleString()} entry</span>
                    <span>{props.country.exitNodeCount.toLocaleString()} exit</span>
                </div>
            </CardContent>
        </Card>
    )
}

function toFlagCodepoint(countryCode: string) {
    return countryCode.toUpperCase()
        .split('')
        .map(char => (char.charCodeAt(0)+127397).toString(16).toLowerCase())
        .join('-');
}
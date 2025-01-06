"use client";

import useSWR from "swr";
import _, {ListIteratee} from "lodash";
import {useMemo, useState} from "react";
import {LuArrowDown01, LuArrowDown10, LuArrowDownAZ, LuArrowDownZA} from "react-icons/lu";

import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Card, CardContent} from "@/components/ui/card";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {OnionDb, OnionDbCountry} from "@/lib/oniondb";
import {CountryCard, NodeStats} from "@/app/onionfruit/countries/country-card";

enum CountryOrderingCriteria {
    TotalNodes = 'totalNodes',
    EntryNodes = 'entryNodes',
    ExitNodes = 'exitNodes',
    Name = 'name'
}

export function OnionDbViewer() {
    const {data, error, isLoading} = useSWR('onion.lite.db', loadOnionDbFile, {
        loadingTimeout: 10000,
        revalidateOnFocus: false,
        revalidateOnReconnect: true
    });

    const [showNonEntryExitCountries, setShowNonEntryExitCountries] = useState(false);
    const [orderingCriteria, setOrderingCriteria] = useState<CountryOrderingCriteria>(CountryOrderingCriteria.TotalNodes);
    const [ascendingOrder, setAscendingOrder] = useState(false);

    const overallMetrics = useMemo(() => {
        if (!data?.countries.length) {
            return null;
        }

        return {
            totalNodes: _.sumBy(data.countries, x => x.totalNodeCount),
            totalEntryNodes: _.sumBy(data.countries, x => x.entryNodeCount),
            totalExitNodes: _.sumBy(data.countries, x => x.exitNodeCount),
            totalOnlineNodes: _.sumBy(data.countries, x => x.onlineNodeCount)
        };
    }, [data]);

    const displayedCountries = useMemo(() => {
        if (!data?.countries.length) {
            return null;
        }

        let orderingFunction: ListIteratee<OnionDbCountry> | null;

        switch (orderingCriteria) {
            case CountryOrderingCriteria.TotalNodes:
                orderingFunction = x => x.totalNodeCount;
                break;

            case CountryOrderingCriteria.EntryNodes:
                orderingFunction = x => x.entryNodeCount;
                break;

            case CountryOrderingCriteria.ExitNodes:
                orderingFunction = x => x.exitNodeCount;
                break;

            case CountryOrderingCriteria.Name:
                orderingFunction = x => x.countryName;
                break;
        }

        return _.chain(data.countries)
            .filter(x => showNonEntryExitCountries || x.entryNodeCount + x.exitNodeCount > 0)
            .orderBy(orderingFunction ?? (x => x.totalNodeCount), ascendingOrder ? 'asc' : 'desc')
            .value();
    }, [data, showNonEntryExitCountries, orderingCriteria, ascendingOrder]);

    if (error) {
        return <span className="text-xl text-center">There was an issue fetching country info. Please reload or try again later.</span>
    }

    if (isLoading) {
        return <span className="text-xl text-center">Loading country info...</span>
    }

    if (!displayedCountries?.length || !overallMetrics) {
        return <span className="text-xl text-center">No countries found.</span>
    }

    return (
        <div className="space-y-5 px-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4">
                <div className="flex items-center space-x-2">
                    <Switch checked={!showNonEntryExitCountries} onCheckedChange={s => setShowNonEntryExitCountries(!s)}/>
                    <Label>Hide unselectable countries</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setAscendingOrder(!ascendingOrder)}>
                                {orderingCriteria === CountryOrderingCriteria.Name
                                    ? (ascendingOrder ? <LuArrowDownAZ/> : <LuArrowDownZA/>)
                                    : (ascendingOrder ? <LuArrowDown01/> : <LuArrowDown10/>)}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            Sort by {ascendingOrder ? "descending" : "ascending"} order
                        </TooltipContent>
                    </Tooltip>

                    <Select value={orderingCriteria}
                            onValueChange={a => setOrderingCriteria(a as CountryOrderingCriteria)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value={CountryOrderingCriteria.TotalNodes}>Total Nodes</SelectItem>
                                <SelectItem value={CountryOrderingCriteria.EntryNodes}>Entry Nodes</SelectItem>
                                <SelectItem value={CountryOrderingCriteria.ExitNodes}>Exit Nodes</SelectItem>
                                <SelectItem value={CountryOrderingCriteria.Name}>Name</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Separator/>

            <Card>
                <CardContent className="pt-6 gap-4 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
                    <NodeStats totalNodes={overallMetrics.totalNodes}
                               countryNodes={overallMetrics.totalOnlineNodes}
                               color="#03a9f4"
                               nodeType="online"
                               large/>

                    <NodeStats totalNodes={overallMetrics.totalNodes}
                               countryNodes={overallMetrics.totalExitNodes}
                               color="#e91e63"
                               nodeType="exit"
                               large/>

                    <NodeStats totalNodes={overallMetrics.totalNodes}
                               countryNodes={overallMetrics.totalEntryNodes}
                               color="#8bc34a"
                               nodeType="entry"
                               large/>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {displayedCountries.map(country => <CountryCard country={country} key={country.countryCode} metrics={overallMetrics}/>)}
            </div>
        </div>
    );
}

async function loadOnionDbFile(urlStub: string) {
    const response = await fetch(`https://onionfruit-api.dragonfruit.network/assets/${urlStub}`);
    const buffer: Uint8Array = new Uint8Array(await response.arrayBuffer());

    if (!buffer) {
        throw new Error("Failed to load OnionDb file");
    }

    return OnionDb.decode(new Uint8Array(buffer), buffer.byteLength);
}
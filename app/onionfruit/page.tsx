import React from "react";
import Link from "next/link";
import {Metadata} from "next";
import {darken} from "polished";
import {FaDiscord, FaGithub, FaWindows} from "react-icons/fa6";
import {
    LuAppWindow,
    LuCheck,
    LuChevronRight,
    LuDownload,
    LuGlobe,
    LuLockOpen,
    LuRouter,
    LuShieldCheck,
    LuX
} from "react-icons/lu";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {IconBox} from "@/components/icon-box";
import {OnionFruitIcon} from "@/components/icons/onionfruit-icon";
import Header from "@/components/header";
import Footer from "@/components/footer";

const PRODUCT_COLOR = "#c71585";

const REPO_URL = "https://github.com/dragonfruitnetwork/onionfruit";
const RELEASES_URL = `${REPO_URL}/releases/latest`;
const LEGACY_RELEASES_URL = `${REPO_URL}/releases`;

const SCREENSHOT_URL = "https://dragonfruit.network/assets/onionfruit-ui.png";

export const metadata: Metadata = {
    title: "OnionFruit™ - Tor Access Client | DragonFruit Network",
    description: "Connect to the Tor network with minimal effort. A free, open-source Tor access client for Windows.",
    openGraph: {
        title: "OnionFruit™",
        description: "Connect to the Tor network with minimal effort."
    }
};

const features = [
    {
        title: "Pick your route",
        description: "Choose entry and exit countries from a regularly-updated relay database to shape your circuit.",
        icon: <LuGlobe/>,
        color: "#2194f3",
        href: "/onionfruit/countries",
        linkText: "Browse countries"
    },
    {
        title: "Bridges & pluggable transports",
        description: "Built-in support for plain, obfs4, snowflake and conjure bridges to circumvent network restrictions.",
        icon: <LuShieldCheck/>,
        color: "#22c55e"
    },
    {
        title: ".onion DNS resolution",
        description: "Resolve hidden services natively allowing any browser to reach onion addresses.",
        icon: <LuRouter/>,
        color: "#a855f7"
    },
    {
        title: "No admin required",
        description: "Most features run without elevation, including installation and updating.",
        icon: <LuLockOpen/>,
        color: "#f59e0b"
    },
    {
        title: "Custom launch pages",
        description: "Open straight into the browser of your choice with whatever start page suits you.",
        icon: <LuAppWindow/>,
        color: PRODUCT_COLOR
    },
    {
        title: "Discord rich presence",
        description: "Optionally surface your connection state in Discord while you browse.",
        icon: <FaDiscord/>,
        color: "#6366f1"
    }
];

export default function Page() {
    return (<>
        <Header/>
        <main className="container mx-auto mb-10 flex flex-col gap-4">
            <Hero/>

            <SectionHeading title="Under the hood"
                            subtitle="Bringing the full experience to your browser"/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-4">
                {features.map(f => (
                    <FeatureCard key={f.title} {...f} />
                ))}
            </div>

            <SectionHeading title="Fully open-source"
                            subtitle="OnionFruit&trade; has been rebuilt from the ground up under LGPL-3.0, with the source available on GitHub. The original closed-source Connect build is still available below for those who prefer it."/>
            <VersionComparison/>

            <DownloadSection/>
        </main>
        <Footer/>
    </>);
}

function Hero() {
    return (
        <section className="flex flex-col rounded-md mx-4 p-8 lg:p-12 select-none"
                 style={{backgroundColor: darken(0.3, PRODUCT_COLOR)}}>
            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
                <div className="flex flex-col gap-5">
                    <IconBox icon={<OnionFruitIcon/>} size={64} color={PRODUCT_COLOR}/>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-semibold">OnionFruit&trade;</h1>
                        <p className="text-xl text-gray-200">Connect to the Tor network with minimal effort.</p>
                    </div>
                    <p className="text-muted-foreground max-w-prose">
                        OnionFruit&trade; configures Tor&reg; and your system in one-click, letting you use the browser of your choice to connect effortlessly.
                    </p>

                    <div className="flex flex-wrap gap-3 pt-2">
                        <Button asChild size="lg">
                            <Link href={RELEASES_URL} target="_blank" rel="noopener">
                                <LuDownload/> Download
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href={REPO_URL} target="_blank" rel="noopener">
                                <FaGithub/> View on GitHub
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="hidden lg:flex items-center justify-center">
                    <img src={SCREENSHOT_URL} alt="OnionFruit user interface" className="w-full max-w-xl h-auto drop-shadow-2xl"/>
                </div>
            </div>
        </section>
    );
}

function SectionHeading({title, subtitle, className}: { title: string, subtitle?: string, className?: string }) {
    return (
        <div className={cn("flex flex-col gap-1 mx-4 mt-8", className)}>
            <h2 className="text-2xl font-semibold">{title}</h2>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
    );
}

function FeatureCard(props: { title: string, description: string, icon: React.ReactElement<any>, color: string, href?: string, linkText?: string }) {
    return (
        <div className="flex flex-col gap-4 rounded-md bg-muted p-6">
            <IconBox icon={props.icon} size={36} color={props.color}/>
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">{props.title}</h3>
                <p className="text-sm text-muted-foreground">{props.description}</p>
            </div>
            {props.href && (
                <Link href={props.href}
                      className="inline-flex items-center text-sm mt-auto hover:text-foreground transition-colors">
                    {props.linkText ?? "Learn more"} <LuChevronRight className="ml-1 h-4 w-4"/>
                </Link>
            )}
        </div>
    );
}

function PlatformCard(props: { title: string, subtitle: string, icon: React.ReactElement<any>, color: string }) {
    return (
        <div className="flex items-center gap-5 rounded-md bg-muted p-6">
            <IconBox icon={props.icon} size={36} color={props.color}/>
            <div className="flex flex-col">
                <span className="text-lg font-semibold">{props.title}</span>
                <span className="text-sm text-muted-foreground">{props.subtitle}</span>
            </div>
        </div>
    );
}

type ComparisonValue = boolean | string;

const comparisonRows: { feature: string, connect: ComparisonValue, current: ComparisonValue }[] = [
    {feature: "Status", connect: "Mature, in maintenance", current: "Current, in active development"},
    {feature: "License", connect: "Closed-source", current: "Open-source (LGPL-3.0)"},
    {feature: "Platforms", connect: "Windows 8.1+ (.NET Framework 4.7.2)", current: "Windows 10+ (.NET)"},
    {feature: "Entry/Exit country selection", connect: true, current: true},
    {feature: "Bridges", connect: "obfs4 · meek · snowflake", current: "obfs4 · meek · snowflake · webtunnel · conjure"},
    {feature: "DNS Support", connect: "Basic (single preset)", current: "Advanced (multiple presets)"},
    {feature: "Custom launch pages", connect: true, current: true},
    {feature: "Discord Integration", connect: true, current: true},
    {feature: "Auto-start on login", connect: true, current: true},
    {feature: "Advanced firewall configuration", connect: "—", current: true},
];

function VersionComparison() {
    return (
        <div className="rounded-md bg-muted mx-4 overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left">
                        <th className="px-6 py-4 font-medium text-muted-foreground">Feature</th>
                        <th className="px-6 py-4 font-semibold whitespace-nowrap">OnionFruit&trade; Connect <span className="text-xs font-normal text-muted-foreground">(legacy)</span></th>
                        <th className="px-6 py-4 font-semibold whitespace-nowrap"
                            style={{color: PRODUCT_COLOR}}>OnionFruit&trade; <span className="text-xs font-normal text-muted-foreground">(new)</span></th>
                    </tr>
                </thead>
                <tbody>
                    {comparisonRows.map(row => (
                        <tr key={row.feature} className="border-t border-border/60">
                            <td className="px-6 py-3 font-medium">{row.feature}</td>
                            <td className="px-6 py-3 text-muted-foreground"><ComparisonCell value={row.connect}/></td>
                            <td className="px-6 py-3"><ComparisonCell value={row.current}/></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ComparisonCell({value}: { value: ComparisonValue }) {
    if (value === true) return <LuCheck className="h-5 w-5 text-emerald-400" aria-label="Yes"/>;
    if (value === false) return <LuX className="h-5 w-5 text-muted-foreground" aria-label="No"/>;
    return <span className="whitespace-nowrap">{value}</span>;
}

function DownloadSection() {
    return (
        <section className="flex flex-col gap-6 rounded-md mx-4 mt-8 p-8 lg:p-10"
                 style={{backgroundColor: darken(0.3, PRODUCT_COLOR)}}>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold">Get OnionFruit&trade;</h2>
                    <p className="text-muted-foreground">
                        Bug reports and feature requests are welcome on GitHub.
                    </p>
                </div>
                <div className="flex flex-col gap-1.5 lg:items-end">
                    <Link href="/onionfruit/status"
                          className="text-sm text-gray-300 hover:text-white transition-colors inline-flex items-center gap-1">
                        Check your connection status <LuChevronRight className="h-4 w-4"/>
                    </Link>
                    <Link href="/onionfruit/countries"
                          className="text-sm text-gray-300 hover:text-white transition-colors inline-flex items-center gap-1">
                        Browse the relay database <LuChevronRight className="h-4 w-4"/>
                    </Link>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <Link href={RELEASES_URL} target="_blank" rel="noopener"
                      className="group flex items-center gap-5 rounded-md p-6 bg-black/30 transition-colors hover:bg-black/40"
                      style={{boxShadow: `0 0 0 1px ${PRODUCT_COLOR}66`}}>
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <span className="text-xs uppercase tracking-wider text-gray-400">Download</span>
                        <h3 className="text-2xl font-bold">OnionFruit&trade;</h3>
                        <p className="text-sm text-gray-300">For Windows 10+ &middot; Open-source &middot; Free</p>
                    </div>
                    <LuDownload className="h-7 w-7 shrink-0 transition-transform group-hover:translate-y-1"/>
                </Link>

                <Link href={LEGACY_RELEASES_URL} target="_blank" rel="noopener"
                      className="group flex items-center gap-4 rounded-md p-4 border border-amber-500/40 bg-black/20 transition-colors hover:border-amber-500/70 hover:bg-black/30">
                    <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-xs uppercase tracking-wider text-amber-400/70">Legacy</span>
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <h3 className="text-base font-semibold">OnionFruit&trade; Connect</h3>
                            <span className="text-xs text-muted-foreground">closed-source · Windows</span>
                        </div>
                    </div>
                    <LuDownload className="h-5 w-5 shrink-0 text-amber-400 transition-transform group-hover:translate-y-1"/>
                </Link>
            </div>
        </section>
    );
}

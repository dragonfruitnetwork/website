import React from "react";
import Link from "next/link";
import {Metadata} from "next";
import {darken} from "polished";
import {FaGithub, FaHatCowboySide, FaWindows} from "react-icons/fa6";
import {
    LuChevronRight,
    LuDownload,
    LuEyeOff,
    LuPackage,
    LuSearch,
    LuShieldCheck,
    LuTrash2,
    LuUsersRound,
    LuWifiOff
} from "react-icons/lu";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {IconBox} from "@/components/icon-box";
import Header from "@/components/header";
import Footer from "@/components/footer";

const PRODUCT_COLOR = "#795548";
const REPO_URL = "https://github.com/dragonfruitnetwork/kaplan";
const RELEASES_URL = `${REPO_URL}/releases/latest/download/kaplan-win-x64.exe`;

export const metadata: Metadata = {
    title: "Kaplan - MSIX/APPX Removal Utility",
    description: "Kaplan is a portable utility for removing MSIX/APPX-based programs from Windows 10 and 11.",
    alternates: {canonical: "https://dragonfruit.network/kaplan"},
    openGraph: {
        title: "Kaplan",
        description: "A portable MSIX/APPX removal utility for Windows.",
        url: "https://dragonfruit.network/kaplan"
    }
};

const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Kaplan",
    description: "A portable utility for removing MSIX/APPX-based programs from Windows 10 and 11.",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Windows 10, Windows 11",
    url: "https://dragonfruit.network/kaplan",
    downloadUrl: RELEASES_URL,
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
    },
    publisher: {
        "@type": "Organization",
        name: "DragonFruit Network",
        url: "https://dragonfruit.network"
    }
};

const removableExamples = ["Family Safety", "Cortana", "Camera", "Xbox Game Bar"];

const features = [
    {
        title: "Removes stubborn apps",
        description: "Evicts most MSIX/APPX packages that resist standard uninstall flows, including ones bundled with the system.",
        icon: <LuTrash2/>,
        color: "#ef4444"
    },
    {
        title: "Single file",
        description: "Kaplan is a single executable with no installer and no external dependencies.",
        icon: <LuPackage/>,
        color: "#2194f3"
    },
    {
        title: "Per-user or machine-wide",
        description: "Switch between removing for the current user or for all users (including future ones).",
        icon: <LuUsersRound/>,
        color: "#f59e0b"
    },
    {
        title: "Leaves no trace",
        description: "Kaplan writes no logs or files to the system it runs on.",
        icon: <LuEyeOff/>,
        color: "#64748b"
    },
    {
        title: "Search packages",
        description: "Find what you want to remove without scrolling through every installed package.",
        icon: <LuSearch/>,
        color: "#6366f1"
    },
    {
        title: "Safe by default",
        description: "Lists only user-level packages first, and hides anything Windows won't let you remove safely.",
        icon: <LuShieldCheck/>,
        color: "#22c55e"
    }
];

export default function Page() {
    return (<>
        <Header/>
        <main className="container mx-auto mb-10 flex flex-col gap-4">
            <Hero/>

            <SectionHeading title="What it does"
                            subtitle="Built around simplicity and ease-of-use."/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-4">
                {features.map(f => (
                    <FeatureCard key={f.title} {...f} />
                ))}
            </div>

            <SectionHeading title="Free and open"
                            subtitle="A tool you download, not a service you sign up for. You'll need admin rights to remove packages."/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-4">
                <div className="flex items-center gap-5 rounded-md bg-muted p-6">
                    <IconBox icon={<FaWindows/>} size={36} color="#2194f3"/>
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold">Windows 10 & 11</span>
                        <span className="text-sm text-muted-foreground">Single executable, no installation required.</span>
                    </div>
                </div>
                <div className="flex items-center gap-5 rounded-md bg-muted p-6">
                    <IconBox icon={<LuWifiOff/>} size={36} color="#14b8a6"/>
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold">Works offline</span>
                        <span className="text-sm text-muted-foreground">No internet connection needed once downloaded.</span>
                    </div>
                </div>
                <Link href={REPO_URL} target="_blank" rel="noopener"
                      className="group flex items-center gap-5 rounded-md bg-muted p-6 hover:bg-muted/70 transition-colors">
                    <IconBox icon={<FaGithub/>} size={36} color="#9ca3af"/>
                    <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-lg font-semibold">Apache-licensed</span>
                        <span className="text-sm text-muted-foreground">Source on GitHub. Contributions welcome.</span>
                    </div>
                    <LuChevronRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors"/>
                </Link>
            </div>

            <CtaStrip/>
        </main>
        <Footer/>

        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(softwareApplicationSchema)}}/>
    </>);
}

function Hero() {
    return (
        <section className="flex flex-col rounded-md mx-4 p-8 lg:p-12 select-none"
                 style={{backgroundColor: darken(0.3, PRODUCT_COLOR)}}>
            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
                <div className="flex flex-col gap-5">
                    <IconBox icon={<FaHatCowboySide/>} size={64} color={PRODUCT_COLOR}/>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl lg:text-5xl font-semibold">Kaplan</h1>
                        <p className="text-xl text-gray-200">A portable MSIX/APPX removal utility.</p>
                    </div>
                    <p className="text-muted-foreground max-w-prose">
                        Strip out the pre-installed apps Windows 10 and 11 ship with &mdash; including ones that
                        resist standard uninstall &mdash; from a single portable executable that leaves no trace.
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

                <div className="hidden lg:flex flex-col gap-3 items-end">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">Apps Kaplan can remove</span>
                    <div className="flex flex-wrap gap-2 justify-end max-w-md">
                        {removableExamples.map(app => (
                            <span key={app}
                                  className="rounded-full bg-black/30 px-4 py-1.5 text-sm text-gray-300 line-through decoration-gray-500">
                                {app}
                            </span>
                        ))}
                        <span className="rounded-full bg-black/30 px-4 py-1.5 text-sm text-gray-400">
                            and more&hellip;
                        </span>
                    </div>
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

function FeatureCard(props: { title: string, description: string, icon: React.ReactElement<any>, color: string }) {
    return (
        <div className="flex flex-col gap-4 rounded-md bg-muted p-6">
            <IconBox icon={props.icon} size={36} color={props.color}/>
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">{props.title}</h3>
                <p className="text-sm text-muted-foreground">{props.description}</p>
            </div>
        </div>
    );
}

function CtaStrip() {
    return (
        <section className="flex flex-col gap-5 rounded-md mx-4 mt-8 p-8 lg:p-10"
                 style={{backgroundColor: darken(0.3, PRODUCT_COLOR)}}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold">Get Kaplan</h2>
                    <p className="text-muted-foreground">
                        Grab the latest build straight from GitHub.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button asChild size="lg">
                        <Link href={RELEASES_URL} target="_blank" rel="noopener">
                            <LuDownload/> Latest release
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href={REPO_URL} target="_blank" rel="noopener">
                            <FaGithub/> Source on GitHub
                        </Link>
                    </Button>
                </div>
            </div>
            <p className="text-xs text-muted-foreground">
                Take care - only remove apps you are certain you don't need. DragonFruit can&rsquo;t help with issues caused
                by removing packages using this tool.
            </p>
        </section>
    );
}

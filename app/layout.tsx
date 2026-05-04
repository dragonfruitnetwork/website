import "./globals.css";

import React from "react";
import type {Metadata, Viewport} from "next";

import {TooltipProvider} from "@/components/ui/tooltip";
import {ThemeProvider} from "@/components/theme-provider";

export const metadata: Metadata = {
    metadataBase: new URL("https://dragonfruit.network"),
    title: {
        default: "DragonFruit Network",
        template: "%s | DragonFruit Network"
    },
    description: "Home of OnionFruit™ Tor access client, Kaplan MSIX/APPX removal utility and other open-source projects.",
    applicationName: "DragonFruit Network",
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1
    },
    twitter: {
        card: "summary_large_image"
    },
    openGraph: {
        type: "website",
        locale: "en_GB",
        siteName: "DragonFruit Network",
        url: "https://dragonfruit.network"
    }
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#663bb9"
};

const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DragonFruit Network",
    url: "https://dragonfruit.network",
    logo: "https://dragonfruit.network/dragonfruit.png",
    sameAs: [
        "https://github.com/dragonfruitnetwork",
        "https://discord.gg/mcYJQNe"
    ]
};

const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DragonFruit Network",
    url: "https://dragonfruit.network"
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
            <TooltipProvider>
                <div className="flex flex-col min-h-screen justify-between">
                    {children}
                </div>
            </TooltipProvider>
        </ThemeProvider>

        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(organizationSchema)}}/>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(websiteSchema)}}/>
        </body>
        </html>
    );
}

import "./globals.css";

import React from "react";
import {SessionProvider} from "next-auth/react";
import type {Metadata, Viewport} from "next";

import {TooltipProvider} from "@/components/ui/tooltip";
import {ThemeProvider} from "@/components/theme-provider";

export const metadata: Metadata = {
    twitter: {
        card: "summary"
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
    themeColor: "#663bb9",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
                <TooltipProvider>
                    <div className="flex flex-col min-h-screen justify-between">
                        {children}
                    </div>
                </TooltipProvider>
            </ThemeProvider>
        </SessionProvider>
        </body>
        </html>
    );
}

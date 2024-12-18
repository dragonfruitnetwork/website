import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

import type {Metadata, Viewport} from "next";

import {TooltipProvider} from "@/components/ui/tooltip";
import {ThemeProvider} from "@/components/theme-provider";

export const metadata: Metadata = {
    openGraph: {
        title: "DragonFruit Network",

        type: "website",
        url: "https://dragonfruit.network",
        locale: "en_GB",
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
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
            <TooltipProvider>
                <div className="flex flex-col min-h-screen justify-between">
                    {children}
                </div>
            </TooltipProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}

import "./globals.css";

import type {Metadata} from "next";

import NavBar from "@/components/navbar";
import {Separator} from "@/components/ui/separator";
import {ThemeProvider} from "@/components/theme-provider";

export const metadata: Metadata = {
    title: "DragonFruit Network"
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
            <header className="py-3 px-[10vw]">
                <NavBar/>
            </header>
            <Separator className="mb-8"/>

            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}

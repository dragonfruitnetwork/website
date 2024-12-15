import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

import type {Metadata} from "next";

import {TooltipProvider} from "@/components/ui/tooltip";
import {ThemeProvider} from "@/components/theme-provider";

export const metadata: Metadata = {
    title: "DragonFruit Network"
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <div className="flex flex-col min-h-screen justify-between">
            <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
                <TooltipProvider>
                    <Header/>
                    <main>
                        {children}
                    </main>
                    <Footer/>
                </TooltipProvider>
            </ThemeProvider>
        </div>
        </body>
        </html>
    );
}

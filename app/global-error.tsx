"use client";

import "./globals.css";

import {useEffect} from "react";
import * as Sentry from "@sentry/nextjs";
import {LuTriangleAlert} from "react-icons/lu";

export default function GlobalError({error, reset}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <html lang="en" className="dark">
        <body className="bg-background text-foreground">
        <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                <LuTriangleAlert className="h-8 w-8"/>
            </div>

            <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
                Something went wrong
            </h1>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
                An unexpected error occurred and has been reported. You can try again, or head back to the homepage.
            </p>

            {error.digest && (
                <p className="mt-4 font-mono text-xs text-muted-foreground/70">
                    ref: {error.digest}
                </p>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                    onClick={reset}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    Try again
                </button>
                <a
                    href="/"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    Go home
                </a>
            </div>
        </main>
        </body>
        </html>
    );
}

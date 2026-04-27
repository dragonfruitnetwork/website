import {Metadata} from "next";

import Header from "@/components/header";
import Footer from "@/components/footer";
import {GoogleSignInButton} from "./google-sign-in-button";

export const metadata: Metadata = {
    title: "Admin Login | DragonFruit Network"
};

type SearchParams = Promise<{ callbackUrl?: string; error?: string }>;

export default async function AdminLogin({searchParams}: { searchParams: SearchParams }) {
    const {callbackUrl, error} = await searchParams;

    return (<>
        <Header/>
        <main className="container mx-auto mb-10 flex max-w-md flex-col gap-6 py-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold">Admin Login</h1>
                <p className="text-sm text-muted-foreground">
                    Sign in to manage DragonFruit content.
                </p>
            </div>

            {error && (
                <p className="text-sm text-destructive">
                    Sign in failed ({error}). Please try again.
                </p>
            )}

            <div className="flex flex-col gap-3">
                <GoogleSignInButton callbackUrl={callbackUrl ?? "/"}/>
            </div>
        </main>
        <Footer/>
    </>);
}

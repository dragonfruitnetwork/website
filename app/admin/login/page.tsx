import {Metadata} from "next";

import {providers, signIn} from "@/auth";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {Button} from "@/components/ui/button";

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
                {providers.map((provider) => {
                    if (!("type" in provider) || (provider.type !== "oauth" && provider.type !== "oidc")) {
                        return null;
                    }

                    const {id, name, style} = provider;
                    return (
                        <form
                            key={id}
                            action={async () => {
                                "use server";
                                await signIn(id, {redirectTo: callbackUrl ?? "/"});
                            }}
                        >
                            <Button type="submit" className="w-full gap-2">
                                {style?.logo && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={style.logo} alt="" className="h-5 w-5"/>
                                )}
                                Sign in with {name ?? id}
                            </Button>
                        </form>
                    );
                })}

                {providers.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        No authentication providers are configured.
                    </p>
                )}
            </div>
        </main>
        <Footer/>
    </>);
}

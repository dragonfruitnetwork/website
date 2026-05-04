"use client";

import {FcGoogle} from "react-icons/fc";

import {Button} from "@/components/ui/button";
import {authClient} from "@/auth-client";

export function GoogleSignInButton({callbackUrl}: { callbackUrl: string }) {
    return (
        <Button
            type="button"
            className="w-full gap-2"
            onClick={() => authClient.signIn.social({provider: "google", callbackURL: callbackUrl})}
        >
            <FcGoogle className="h-5 w-5"/>
            Sign in with Google
        </Button>
    );
}

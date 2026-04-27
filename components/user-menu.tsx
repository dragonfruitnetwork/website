"use client";

import {LuLogOut} from "react-icons/lu";

import {Button} from "@/components/ui/button";
import {authClient} from "@/auth-client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
    const {data: session} = authClient.useSession();

    if (!session) {
        return null;
    }

    return (
        <>
            {/* spacers */}
            <div></div>
            <div></div>

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="ghost" size="icon" asChild>
                        <img alt="User Avatar"
                             className="w-8 h-8"
                             style={{borderRadius: "50%"}}
                             src={session.user?.image ?? ''}/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mt-3">
                    <DropdownMenuLabel className="inline-flex items-center gap-3">
                        <img alt="Avatar"
                             className="w-10 h-10"
                             style={{borderRadius: "50%"}}
                             src={session.user?.image ?? ''}/>
                        <span>{session.user?.name}</span>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator/>
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="text-red-700 hover:cursor-pointer"
                                          onClick={() => authClient.signOut()}>
                            <LuLogOut/>
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

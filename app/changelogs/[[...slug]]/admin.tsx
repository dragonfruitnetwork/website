"use client";

import {LuShield} from "react-icons/lu";
import {useSession} from "next-auth/react";
import {UserPermissions} from "@prisma/client";

import {Card, CardContent} from "@/components/ui/card";
import {IconBox} from "@/components/icon-box";

export function ChangelogAdminControls() {
    const {data: session} = useSession();

    if (session?.user?.userPermissions !== UserPermissions.ADMIN) {
        return null;
    }

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-row items-center gap-4">
                    <IconBox icon={<LuShield/>} color="#3e3e3e" size={40}/>
                    <div className="space-y-4">
                        <span className="text-lg font-semibold">Changelog Admin</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
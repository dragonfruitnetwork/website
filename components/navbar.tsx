import React, {HTMLAttributeAnchorTarget} from "react";
import Link from "next/link";
import Image from "next/image";
import {FaDiscord, FaGithub} from "react-icons/fa6";
import {LuBookOpen, LuCircleUser, LuGitPullRequest, LuMail} from "react-icons/lu";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {UserMenu} from "@/components/user-menu";
import {OnionFruitIcon} from "@/components/icons/onionfruit-icon";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

export default function NavBar() {
    return (
        <nav className="grid grid-cols-3 items-center justify-between px-5">
            <div>
                <Link href="/" className="shrink-0">
                    <Image src="/dragonfruit.png" width={45} height={45} alt="DragonFruit Logo"/>
                </Link>
            </div>

            <div className="flex items-center justify-center">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>OnionFruit&trade;</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <div className="grid gap-3 p-4 w-[400px] lg:w-[600px] lg:grid-cols-2">
                                    <div className="row-span-2">
                                        <Link href="/onionfruit" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-linear-to-b from-muted/50 to-muted p-6 no-underline outline-hidden focus:shadow-md">
                                            <OnionFruitIcon className="h-8 w-8"/>
                                            <span className="text-lg pt-2 font-semibold">OnionFruit&trade;</span>
                                            <p className="text-sm pt-3 text-muted-foreground">
                                                Bring your own browser and connect to the Tor network effortlessly
                                            </p>
                                        </Link>
                                    </div>

                                    <MenuItem href="/onionfruit/status" title="Connection Status">
                                        <span>Check if you're connected to Tor</span>
                                    </MenuItem>

                                    <MenuItem href="/onionfruit/countries" title="Countries Listing">
                                        <span>View current network info</span>
                                    </MenuItem>
                                </div>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/kaplan" passHref>
                                <NavigationMenuList className={navigationMenuTriggerStyle()}>
                                    Kaplan
                                </NavigationMenuList>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <div className="grid grid-cols-1 gap-3 p-4 w-[350px]">
                                    <MenuItem href="https://id.dragonfruit.network" target="_blank" title="Account" icon={<LuCircleUser/>}>
                                        <span>Manage your account</span>
                                    </MenuItem>

                                    <MenuItem href="/wiki" title="Wiki" icon={<LuBookOpen/>}>
                                        <span>Documentation for our projects</span>
                                    </MenuItem>

                                    <MenuItem href="/changelogs" title="Changelogs" icon={<LuGitPullRequest/>}>
                                        <span>View the latest changes</span>
                                    </MenuItem>
                                </div>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="mailto:inbox@dragonfruit.network">
                        <LuMail/>
                    </Link>
                </Button>

                <Button variant="ghost" size="icon" asChild>
                    <Link href="https://discord.gg/mcYJQNe" target="_blank">
                        <FaDiscord/>
                    </Link>
                </Button>

                <Button variant="ghost" size="icon" asChild>
                    <Link href="https://github.com/dragonfruitnetwork" target="_blank">
                        <FaGithub/>
                    </Link>
                </Button>

                <UserMenu/>
            </div>
        </nav>
    )
}

function MenuItem(props: {
    href: string,
    title: string,
    icon?: React.ReactNode,
    target?: HTMLAttributeAnchorTarget,
    className?: string,
    children?: React.ReactNode
}) {
    return (
        <Link passHref
              href={props.href}
              target={props.target}
              className={cn("flex flex-row items-center gap-5 select-none space-y-1 rounded-md p-3 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", props.className)}>
            {props.icon && (
                <div className="shrink-0 h-[25px]">
                    {props.icon}
                </div>
            )}
            <div>
                <span className="text-sm font-semibold leading-none">{props.title}</span>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{props.children}</p>
            </div>
        </Link>
    )
}

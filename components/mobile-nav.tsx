"use client";

import * as React from "react";
import Link from "next/link";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {FaDiscord, FaGithub} from "react-icons/fa6";
import {LuBookOpen, LuCircleUser, LuGitPullRequest, LuMail, LuMenu, LuX} from "react-icons/lu";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {OnionFruitIcon} from "@/components/icons/onionfruit-icon";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function MobileNav() {
    const [open, setOpen] = React.useState(false);

    const close = React.useCallback(() => setOpen(false), []);

    return (
        <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
            <DialogPrimitive.Trigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                    <LuMenu/>
                </Button>
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay
                    className={cn(
                        "fixed inset-0 z-50 bg-black/80",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
                    )}
                />
                <DialogPrimitive.Content
                    className={cn(
                        "fixed inset-y-0 end-0 z-50 w-3/4 max-w-sm border-s bg-background p-6 shadow-lg",
                        "flex flex-col gap-4 overflow-y-auto",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:duration-300 data-[state=open]:duration-300",
                        "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
                    )}
                >
                    <DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>
                    <DialogPrimitive.Description className="sr-only">
                        Site navigation menu
                    </DialogPrimitive.Description>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            Menu
                        </span>
                        <DialogPrimitive.Close asChild>
                            <Button variant="ghost" size="icon" aria-label="Close menu">
                                <LuX/>
                            </Button>
                        </DialogPrimitive.Close>
                    </div>

                    <Accordion type="multiple" className="w-full">
                        <AccordionItem value="onionfruit">
                            <AccordionTrigger>
                                <span className="inline-flex items-center gap-2">
                                    <OnionFruitIcon className="h-4 w-4"/>
                                    OnionFruit&trade;
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col gap-1 ps-2">
                                    <MobileLink href="/onionfruit" onNavigate={close}>Overview</MobileLink>
                                    <MobileLink href="/onionfruit/status" onNavigate={close}>Connection Status</MobileLink>
                                    <MobileLink href="/onionfruit/countries" onNavigate={close}>Countries Listing</MobileLink>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="kaplan">
                            <Link
                                href="/kaplan"
                                onClick={close}
                                className="flex flex-1 items-center justify-between py-4 font-medium hover:underline"
                            >
                                Kaplan
                            </Link>
                        </AccordionItem>

                        <AccordionItem value="services">
                            <AccordionTrigger>Services</AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col gap-1 ps-2">
                                    <MobileLink href="https://id.dragonfruit.network" target="_blank" onNavigate={close} icon={<LuCircleUser/>}>
                                        Account
                                    </MobileLink>
                                    <MobileLink href="/wiki" onNavigate={close} icon={<LuBookOpen/>}>
                                        Wiki
                                    </MobileLink>
                                    <MobileLink href="/changelogs" onNavigate={close} icon={<LuGitPullRequest/>}>
                                        Changelogs
                                    </MobileLink>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <div className="mt-auto flex flex-col gap-2 border-t pt-4">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Connect
                        </span>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="mailto:inbox@dragonfruit.network" onClick={close} aria-label="Email">
                                    <LuMail/>
                                </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="https://discord.gg/mcYJQNe" target="_blank" onClick={close} aria-label="Discord">
                                    <FaDiscord/>
                                </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="https://github.com/dragonfruitnetwork" target="_blank" onClick={close} aria-label="GitHub">
                                    <FaGithub/>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}

function MobileLink(props: {
    href: string;
    target?: React.HTMLAttributeAnchorTarget;
    onNavigate: () => void;
    icon?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={props.href}
            target={props.target}
            onClick={props.onNavigate}
            className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
        >
            {props.icon && <span className="shrink-0">{props.icon}</span>}
            <span>{props.children}</span>
        </Link>
    );
}

"use client";

// autocomplete component - https://github.com/Balastrong/shadcn-autocomplete-demo/blob/e3bab3481e5b6f694ead0e2d7a09bc6ccf37b388/src/components/autocomplete.tsx

import {cn} from "@/lib/utils";
import {Check} from "lucide-react";
import {useMemo, useState} from "react";
import {Command as CommandPrimitive} from "cmdk";
import { Popover as PopoverPrimitive } from "radix-ui";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";
import {Popover, PopoverContent} from "@/components/ui/popover";

type Props<T extends string> = {
    selectedValue: T;
    onSelectedValueChange: (value: T) => void;
    searchValue: string;
    onSearchValueChange: (value: string) => void;
    items: { value: T; label: string }[];
    isLoading?: boolean;
    emptyMessage?: string;
    placeholder?: string;
};

export function AutoComplete<T extends string>({
                                                   selectedValue,
                                                   onSelectedValueChange,
                                                   searchValue,
                                                   onSearchValueChange,
                                                   items,
                                                   isLoading,
                                                   emptyMessage = "No items.",
                                                   placeholder = "Search...",
                                               }: Props<T>) {
    const [open, setOpen] = useState(false);

    const labels = useMemo(
        () =>
            items.reduce((acc, item) => {
                acc[item.value] = item.label;
                return acc;
            }, {} as Record<string, string>),
        [items]
    );

    const reset = () => {
        onSelectedValueChange("" as T);
        onSearchValueChange("");
    };

    const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (
            !e.relatedTarget?.hasAttribute("cmdk-list") &&
            labels[selectedValue] !== searchValue
        ) {
            reset();
        }
    };

    const onSelectItem = (inputValue: string) => {
        if (inputValue === selectedValue) {
            reset();
        } else {
            onSelectedValueChange(inputValue as T);
            onSearchValueChange(labels[inputValue] ?? "");
        }
        setOpen(false);
    };

    return (
        <div className="flex items-center">
            <Popover open={open} onOpenChange={setOpen}>
                <Command shouldFilter={false}>
                    <PopoverPrimitive.Anchor asChild>
                        <CommandPrimitive.Input
                            asChild
                            value={searchValue}
                            onValueChange={onSearchValueChange}
                            onKeyDown={(e) => setOpen(e.key !== "Escape")}
                            onMouseDown={() => setOpen((open) => !!searchValue || !open)}
                            onFocus={() => setOpen(true)}
                            onBlur={onInputBlur}
                        >
                            <Input placeholder={placeholder}/>
                        </CommandPrimitive.Input>
                    </PopoverPrimitive.Anchor>
                    {!open && <CommandList aria-hidden="true" className="hidden"/>}
                    <PopoverContent
                        asChild
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        onInteractOutside={(e) => {
                            if (
                                e.target instanceof Element &&
                                e.target.hasAttribute("cmdk-input")
                            ) {
                                e.preventDefault();
                            }
                        }}
                        className="w-(--radix-popover-trigger-width) p-0"
                    >
                        <CommandList>
                            {isLoading && (
                                <CommandPrimitive.Loading>
                                    <div className="p-1">
                                        <Skeleton className="h-6 w-full"/>
                                    </div>
                                </CommandPrimitive.Loading>
                            )}
                            {items.length > 0 && !isLoading ? (
                                <CommandGroup>
                                    {items.map((option) => (
                                        <CommandItem
                                            key={option.value}
                                            value={option.value}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onSelect={onSelectItem}
                                        >
                                            <Check
                                                className={cn(
                                                    "me-2 h-4 w-4",
                                                    selectedValue === option.value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            {option.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            ) : null}
                            {!isLoading ? (
                                <CommandEmpty>{emptyMessage ?? "No items."}</CommandEmpty>
                            ) : null}
                        </CommandList>
                    </PopoverContent>
                </Command>
            </Popover>
        </div>
    );
}
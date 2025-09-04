"use client";
import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { ScrollArea } from "../ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";

import Label from "../ui/label";
import { Badge } from "../ui/badge";
import Loader from "../General/Loader";
import { InfoIcon } from "lucide-react";

interface SelectProps {
    items: Array<{ label: string; value: string }>;
    className?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    isLoading?: boolean;
    form?: any; // Replace with the actual form library's form control type
    name?: any;
    label?: string;
    description?: string;
    triggerClassName?: string;
    actionItems?: React.ReactNode[];
    isMulti?: boolean;
    renderItem?: (item: { label: string; value: string }) => React.ReactNode;
    value?: string | string[] | null; // Adjust this type based on your component's logic
    onValueChange?: (value: string | string[] | null) => void;
    variant?: any; // Specify the appropriate type for the 'variant' prop
}
export function Combobox({
    className,
    placeholder = "Select",
    searchPlaceholder = "Search...",
    emptyMessage = "Not Found",
    items = [],
    isLoading,
    form,
    name,
    label,
    description,
    triggerClassName,
    actionItems,
    isMulti = false,
    renderItem,
    value,
    onValueChange,
    variant = "ghost",
}: SelectProps) {
    const SelectBox = ({ value, onValueChange }: any) => {
        const [open, setOpen] = React.useState(false);

        if (
            items?.length &&
            (items[0].label === undefined || !items[0].value === undefined)
        )
            return (
                    <Tooltip>
                        <TooltipTrigger>
                            <p className="bg-destructive/20 rounded p-1 text-xs text-destructive">
                                Dropdown Error
                            </p>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="bg-secondary text-secondary-foreground max-w-[300px] rounded p-1 text-xs">
                                Rendering dropdown {name ?? ""} failed: Items
                                should be array of objects each having a label
                                and a value property
                            </p>
                        </TooltipContent>
                    </Tooltip>
            );

        isMulti =
            isMulti !== undefined ? isMulti : value && Array.isArray(value);
        if (isMulti && value === undefined) {
            onValueChange([]);
        }

        // const valueSliderRef = React.useRef<HTMLInputElement | null>(null);

        //     React.useEffect(() => {
        //         let mouseDown = false;
        //         let startX :number, scrollLeft :any;
        //         const slider = valueSliderRef.current

        //         if (!slider) {
        //             return; // Exit early if slider is null
        //         }
        //         let startDragging = function (e :MouseEvent) {
        //             mouseDown = true;
        //             startX = e.pageX - slider.offsetLeft;
        //             scrollLeft = slider.scrollLeft;
        //             e.stopPropagation();
        //         };
        //         let stopDragging = function (e :MouseEvent) {
        //             e.stopPropagation();
        //             mouseDown = false;
        //         };

        //         const handleMove = (e :MouseEvent) => {
        //             e.preventDefault();
        //             if (!mouseDown) {
        //                 return;
        //             }
        //             const x = e.pageX - slider.offsetLeft;
        //             const scroll = x - startX;
        //             slider.scrollLeft = scrollLeft - scroll;
        //         };

        //         // Add the event listeners
        //         slider.addEventListener("mousemove", handleMove);
        //         slider.addEventListener("mousedown", startDragging, false);
        //         slider.addEventListener("mouseup", stopDragging, false);
        //         slider.addEventListener("mouseleave", stopDragging, false);

        //         return () => {
        //             // Add the event listeners
        //             slider.removeEventListener("mousemove", handleMove);
        //             slider.removeEventListener("mousedown", startDragging);
        //             slider.removeEventListener("mouseup", stopDragging);
        //             slider.removeEventListener("mouseleave", stopDragging);
        //         }
        //         ;
        //  }, []);

        const remove = (index: number) => {
            const clone = structuredClone(value);
            clone.splice(index, 1);
            onValueChange(clone);
        };

        const findLabelByValue = (val: any) =>
            items?.find((item: any) => item.value === val)?.label;

        const renderValue = (val: any) => {
            if (val === undefined || (isMulti && !val?.length))
                return placeholder;
            if (!isMulti) {
                return findLabelByValue(val);
            }
            if (isMulti && !Array.isArray(val)) {
                console.error(
                    "isMulti is set to true but value is not an array"
                );
                return "isMulti is set to true but value is not an array";
            }
            return val?.map((item: any, i: number) => (
                <Badge
                    key={i}
                    className="flex-shrink-0 px-2 cursor-grab"
                    // onRemove={(e) => {
                    //     e.stopPropagation();
                    //     remove(i);
                    // }}
                >
                    <span>{findLabelByValue(item)}</span>
                </Badge>
            ));
        };

        const isItemSelected = (val: any) => {
            if (val === undefined || value === undefined) return false;
            if (!isMulti) return val === value;
            const found = value.find((item: any) => item === val);
            return found !== undefined;
        };

        const handleOnSelect = (val: any) => {
            if (isMulti) {
                if (value === undefined) onValueChange([]);
                const index = value?.indexOf(val);
                if (index !== -1) {
                    const clone = structuredClone(value);
                    clone.splice(index, 1);
                    onValueChange(clone);
                } else onValueChange([...value, val]);
                setTimeout(() => setOpen(true), 0);
            } else {
                onValueChange(val);
                setOpen(false);
            }
        };

        const getItems = () => {
            if (isLoading) {
                return (
                    <CommandItem
                        className="flex items-center justify-center cursor-pointer"
                        disabled
                    >
                        <Loader />
                    </CommandItem>
                );
            } else if (!items || items.length === 0) {
                return <CommandItem disabled>No items.</CommandItem>;
            } else {
                return items.map((item: any, i: number) => {
                    const isSelected = isItemSelected(item.value);
                    return (
                        <CommandItem
                            key={i}
                            onSelect={() => handleOnSelect(item.value)}
                            disabled={item.disabled}
                            className={cn(item.disabled && "disabled", "gap-2")}
                        >
                            {typeof renderItem === "function"
                                ? renderItem(item)
                                : item.label}
                            <CheckIcon
                                className={cn(
                                    "ml-auto h-4 w-4 text-sky-500",
                                    isSelected ? "opacity-100" : "opacity-0"
                                )}
                            />
                        </CommandItem>
                    );
                });
            }
        };

        const getActionItems = () => {
            return actionItems?.map((actionItem: any, i: number) => (
                <CommandItem
                    className="cursor-pointer"
                    key={actionItem.name + i}
                    onSelect={
                        typeof actionItem.action === "function"
                            ? actionItem.action
                            : () => {}
                    }
                >
                    {actionItem.icon && (
                        <i className={`fa ${actionItem.icon} opacity-40`}>
                            &nbsp;&nbsp;&nbsp;
                        </i>
                    )}
                    {actionItem.name || "Create"}
                </CommandItem>
            ));
        };
        return (
            <div className="flex flex-col space-y-1">
                {label && (
                    <div className="flex gap-2">
                        <Label>{label}</Label>
                        {description && (
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="grid items-center justify-center w-4 aspect-square border border-input rounded-full opacity-3">
                                            <InfoIcon
                                                size={15}
                                                strokeWidth={"1"}
                                            />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="bg-secondary text-secondary-foreground max-w-[300px] rounded p-1 text-xs">
                                            {description}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                        )}
                    </div>
                )}

                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild className="">
                        <Button
                            role="combobox"
                            aria-expanded={open}
                            variant={variant}
                            className={cn(
                                "border w-full justify-between p-3 text-primary/80",
                                (value === undefined ||
                                    (isMulti && !value?.length)) &&
                                    "text-primary/30",
                                triggerClassName
                            )}
                        >
                            <div
                                className={`${
                                    isMulti
                                        ? "flex gap-1 overflow-auto no-scrollbar"
                                        : "line-clamp-1"
                                } text-left`}
                                // ref={valueSliderRef}
                            >
                                {renderValue(value)}
                            </div>
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-full z-[9999] ">
                        <Command>
                            <CommandInput
                                placeholder={searchPlaceholder}
                                className="h-9 !outline-transparent"
                            />
                            <ScrollArea className="!overflow-auto max-h-80 nx-scrollbar">
                                <CommandEmpty>{emptyMessage}</CommandEmpty>
                                <CommandGroup className="!overflow-auto">
                                    {getItems()}
                                </CommandGroup>
                            </ScrollArea>
                            {actionItems?.length ? (
                                <>
                                    <CommandSeparator />
                                    <CommandGroup>
                                        {getActionItems()}
                                    </CommandGroup>
                                </>
                            ) : (
                                ""
                            )}
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        );
    };

    if (!form && onValueChange) {
        return <SelectBox value={value} onValueChange={onValueChange} />;
    }

    return (
        <FormField
            control={form?.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <SelectBox
                        value={field.value}
                        onValueChange={field.onChange}
                    />
                </FormItem>
            )}
        />
    );
}

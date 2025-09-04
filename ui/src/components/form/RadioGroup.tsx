import {
    RadioGroup as RadioGroup_ui,
    RadioGroupItem,
} from "@/components/ui/radio-group";

import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { CrownIcon } from "lucide-react";

interface ItemType {
    value: string;
    label: string;
    premium?: boolean;
    // Add other properties if necessary
}
interface RadioGroupProps {
    description?: string;
    name?: string;
    form: any;
    label?: string;
    items: ItemType[];
    className?: string;
    variant?: "default" | "tabs";
}
export default function RadioGroup({
    description,
    name = "",
    form,
    label,
    items = [],
    className,
    variant,
    ...props
}: RadioGroupProps) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <>
                    <FormItem>
                        {label && <Label> {label} </Label>}
                        <FormControl>
                            <RadioGroup_ui
                                className={cn(
                                    "flex items-center gap-3",
                                    variant === "tabs" &&
                                        "gap-1 border rounded shadow-sm p-1",
                                    className
                                )}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                {...props}
                            >
                                {items?.map((item, i) => {
                                    const isSelected =
                                        field.value == item.value;
                                    const isPremium = item.premium;
                                    return (
                                        <FormItem
                                            className={cn(
                                                "cursor-pointer space-y-0 flex gap-1",
                                                variant === "tabs" &&
                                                    "gap-0 w-full text-center rounded bg-transparent text-primary transition-all",
                                                variant === "tabs" &&
                                                    isSelected &&
                                                    "bg-primary-400/10 text-primary-600",
                                                variant === "tabs" &&
                                                    !isSelected &&
                                                    "hover:bg-primary-700/5"
                                            )}
                                            key={i}
                                        >
                                            <FormControl>
                                                <RadioGroupItem
                                                    value={item.value}
                                                    className={cn(
                                                        variant === "tabs" &&
                                                            "hidden"
                                                    )}
                                                    aria-disabled={isPremium}
                                                    disabled={isPremium}
                                                />
                                            </FormControl>
                                            <FormLabel
                                                className={cn(
                                                    "text-xs w-full cursor-pointer",
                                                    variant === "tabs" &&
                                                        "text-md font-normal py-1 px-3",
                                                    variant === "tabs" &&
                                                        isSelected &&
                                                        "opacity-100 font-medium",
                                                    isPremium &&
                                                        "flex items-center justify-center gap-2 cursor-not-allowed"
                                                )}
                                            >
                                                {isPremium && <CrownIcon size={17} className="text-yellow-800 fill-yellow-500"/>}
                                                <span>{item.label}</span>
                                            </FormLabel>
                                        </FormItem>
                                    );
                                })}
                            </RadioGroup_ui>
                        </FormControl>
                    </FormItem>
                </>
            )}
        />
    );
}

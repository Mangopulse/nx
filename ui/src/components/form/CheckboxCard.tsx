import * as React from "react";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
export interface ICheckboxCardProps {
    form?: any;
    name: string;
    disabled?: boolean;
    className?: string;
    label?: string;
    description?: string;
    id?: string;
    checked?: boolean;
    onCheckedChange?: ((checked: CheckedState) => void) | undefined;
}

export default function CheckboxCard({
    form,
    name,
    disabled,
    className,
    label,
    description,
    id,
    checked,
    onCheckedChange,
}: ICheckboxCardProps) {
    if (!form) {
        const labelId = id || name || label || description || "check";
        return (
            <label
                htmlFor={labelId}
                className="cursor-pointer flex gap-3 flex-row items-center justify-between rounded border p-3 shadow-sm opacity-100"
            >
                <div className="max-w-[60ch]">
                    <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {label}
                    </p>
                    {description && (
                        <p className="text-[0.8rem] text-primary/50 mt-2">
                            {description}
                        </p>
                    )}
                </div>
                <Checkbox
                    id={labelId}
                    checked={checked}
                    onCheckedChange={onCheckedChange}
                />
            </label>
        );
    }

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn("", className ?? "")}>
                    <FormLabel className="cursor-pointer flex gap-3 flex-row items-center justify-between rounded border p-3 shadow-sm opacity-100">
                        <div className="max-w-[60ch]">
                            <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {label}
                            </p>
                            {description && (
                                <FormDescription className="mt-1">
                                    {description}
                                </FormDescription>
                            )}
                        </div>
                        <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormLabel>
                </FormItem>
            )}
        />
    );
}

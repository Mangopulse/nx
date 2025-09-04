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
export interface ISwitchCardProps {
    form: any;
    name: string;
    disabled?: boolean;
    className?: string;
    label?: string;
    description?: string;
}

export default function SwitchCard({
    form,
    name,
    disabled,
    className,
    label,
    description,
}: ISwitchCardProps) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem
                    className={cn(
                        "",
                        className ?? ""
                    )}
                >
                    <FormLabel className="cursor-pointer flex gap-3 flex-row items-center justify-between rounded-lg border p-3 shadow-sm opacity-100">
                        <div className="max-w-[60ch]">
                            <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</p>
                            {description && (
                                <FormDescription className="mt-2">{description}</FormDescription>
                            )}
                        </div>
                        <FormControl>
                            <Switch
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

import React, { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Label from "../ui/label";
import IconButton from "../form/IconButton";
import { buttonVariants } from "../ui/button";

const _DateTimePicker = ({
    value,
    label,
    mode = "single",
    onChange,
    triggerClassName,
    triggerVariant = "outline",
    ...props
}: any) => {
    const getFormattedValue = () => {
        switch (mode) {
            case "range":
                return (
                    <>
                        {value?.from ? (
                            value.to ? (
                                <>
                                    {format(value.from, "LLL dd, y")} -{" "}
                                    {format(value.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(value.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </>
                );

            default:
                return (
                    <>
                        {value ? (
                            format(value, "PPP")
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </>
                );
        }
    };
    return (
        <FormItem className="flex flex-col">
            {label && <Label>{label}</Label>}
            <Popover open={props.open} onOpenChange={props.onOpenChange}>
                <PopoverTrigger
                    className={cn(
                        buttonVariants({ variant: triggerVariant }),
                        "w-full justify-start text-left font-normal p-3",
                        !value && "text-muted-foreground",
                        triggerClassName ?? ""
                    )}
                >
                    <>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {getFormattedValue()}
                    </>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode={mode}
                        selected={value}
                        onSelect={onChange}
                        numberOfMonths={mode === "range" ? 2 : 1}
                        initialFocus
                        {...props}
                    />
                    {props.sharedFooter}
                </PopoverContent>
            </Popover>
        </FormItem>
    );
};

const DateTimePicker = ({
    name,
    form,
    label,
    value,
    onChange,
    ...props
}: any) => {
    if (!form) {
        return (
            <_DateTimePicker
                {...props}
                value={value}
                label={label}
                onChange={onChange}
            />
        );
    }

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }: any) => (
                <_DateTimePicker
                    {...props}
                    value={field.value}
                    label={label}
                    onChange={field.onChange}
                />
            )}
        />
    );
};

export default DateTimePicker;

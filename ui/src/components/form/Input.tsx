import * as React from "react";
import Input_ui, { InputProps } from "@/components/ui/input";
import Label_ui from "@/components/ui/label";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export interface IInputProps extends InputProps {
    name?: string;
    control?: any;
    label?: string;
    placeholder?: string;
    type?: string;
    description?: string;
    className?: string;
    unit?: string;
    errorMsg?: string | undefined;
    value?: any;
    onChange?: (value: any) => void;
    defaultValue?: any;
    icon?: React.ReactNode;
}

export default function Input({
    control,
    icon,
    name,
    label,
    placeholder,
    type,
    description,
    unit,
    className,
    errorMsg,
    value,
    onChange,
    defaultValue,
    ...props
}: IInputProps) {
    const [passVisible, setPassVisible] = React.useState(false);

    if (!control) {
        const renderInput = () => (
            <Input_ui
                id={name}
                placeholder={placeholder}
                type={
                    type === "password" ? (passVisible ? "text" : type) : type
                }
                className={className}
                unit={unit}
                icon={icon}
                name={name ?? ""}
                defaultValue={defaultValue}
                value={value}
                onChange={onChange}
                {...props}
            />
        );

        return (
            <>
                {label ? (
                    <div className="">
                        <Label_ui htmlFor={name} className="">
                            {label}
                        </Label_ui>
                        {renderInput()}
                    </div>
                ) : (
                    renderInput()
                )}
            </>
        );
    }

    return (
        <FormField
            control={control}
            name={name || ""}
            render={({ field }) => (
                <FormItem className="w-full">
                    {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
                    <FormControl>
                        <div className="relative">
                            <Input_ui
                                id={name}
                                icon={icon}
                                placeholder={placeholder}
                                type={
                                    type === "password"
                                        ? passVisible
                                            ? "text"
                                            : type
                                        : type
                                }
                                {...field}
                                className={cn(
                                    className,
                                    type == "password" && "!pr-9"
                                )}
                                {...props}
                            />
                            {type == "password" && (
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer"
                                    onClick={() => setPassVisible(!passVisible)}
                                >
                                    {passVisible ? (
                                        <EyeOffIcon strokeWidth={"1"} />
                                    ) : (
                                        <EyeIcon strokeWidth={"1"} />
                                    )}
                                </div>
                            )}
                        </div>
                    </FormControl>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    {errorMsg ? <span>{errorMsg}</span> : <FormMessage />}
                </FormItem>
            )}
        />
    );
}

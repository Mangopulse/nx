import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    unit?: string;
    icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, unit, icon, ...props }, ref) => {
        if (unit || icon)
            return (
                <div className="relative">
                    {icon && (
                        <div className="absolute top-1/2 left-2 -translate-y-1/2 opacity-20">
                            {icon}
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            "flex h-9 w-full rounded border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary/60 focus-visible:ring-1 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
                            unit && "pr-8",
                            icon && "pl-8",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {unit && (
                        <div className="absolute top-1/2 right-3 -translate-y-1/2 opacity-20">
                            {unit}
                        </div>
                    )}
                </div>
            );
        return (
            <input
                type={type}
                className={cn(
                    "flex h-9 w-full rounded border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export default Input;

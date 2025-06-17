"use client"
import { cn } from "@/lib/utils";
import * as React from "react";

export interface IaLyoutGridProps {
    children?: React.ReactNode;
    className?: string;
}

export function LayoutGrid({ className, children }: IaLyoutGridProps) {
    return (
        <div className={cn("w-full grid grid-cols-12 gap-5", className)}>
            {children}
        </div>
    );
}

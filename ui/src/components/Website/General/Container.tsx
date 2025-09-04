"use client"
import { cn } from "@/lib/utils";
import * as React from "react";

export interface IContainerProps {
    children?: React.ReactNode;
    className?: string;
}

export function Container({ className, children }: IContainerProps) {
    return (
        <section className={cn("w-full relative py-12 md:py-16", className)}>
            <div className="container">{children}</div>
        </section>
    );
}

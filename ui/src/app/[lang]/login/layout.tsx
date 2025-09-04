"use client";
import { Toaster } from "@/components/ui/toaster";
import * as React from "react";

export interface ILoginLayoutProps {
    children: React.ReactNode;
}

export default function LoginLayout(props: ILoginLayoutProps) {
    return (
        <>
            {props.children}
            <Toaster />
        </>
    );
}

"use client";
import {
    QueryCache,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import * as React from "react";
import { TooltipProvider } from "./ui/tooltip";
import { Toaster } from "./ui/toaster";

export default function Providers({
    children,
}: {
    children: React.ReactNode;
}) {

    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onSuccess(data: any, query) {
                if (data?.code === 403) {
                    redirect("/login");
                }
            },
            onSettled(data: any, error, query) {
                if (error) {
                    redirect("/login");
                }
            },
        }),
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
            },
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                {children}
                <Toaster />
            </TooltipProvider>
        </QueryClientProvider>
    );
}

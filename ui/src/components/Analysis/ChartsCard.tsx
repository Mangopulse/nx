"use client";
import { ReactNode } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";

interface CardProps {
    className?: string;
    title?: string;
    children?: ReactNode;
}

export default function ChartsCard({ className, title, children }: CardProps) {
    return (
        <Card className={className}>
            <CardHeader className=" space-y-0 ">
                <CardTitle className="text-md font-semibold opacity-40">{title}</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="-ml-2">{children}</div>
            </CardContent>
        </Card>
    );
}

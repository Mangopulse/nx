"use client";
import { ReactElement, ReactNode } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";
import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import MiniRotatingLoader from "../loaders/MiniRotatingLoader";
import { formatNumber, isNull } from "@/helpers/analytics";

interface CardProps {
    className?: string;
    title?: string;
    value?: string;
    delta?: number;
    children?: ReactNode;
    description?: string;
    tooltip?: string | ReactElement;
    isLoading?: boolean;
}

export default function InsightCard({
    className,
    title,
    value,
    delta,
    description,
    tooltip,
    isLoading,
}: CardProps) {
    return (
        <Card className={cn("flex flex-col", className)}>
            <CardHeader className="space-y-0 py-3 px-4">
                <div className="flex flex-row items-center justify-between">
                    <CardTitle className="flex gap-2 items-center text-md">
                        <span className="opacity-40">{title}</span>
                        {tooltip && (
                                <Tooltip>
                                    <TooltipTrigger className="flex gap-2 items-center justify-center opacity-50">
                                        <InfoIcon size={16} strokeWidth={"1"} />
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="right"
                                        className="max-w-[200px] font-normal bg-primary"
                                    >
                                        {tooltip}
                                    </TooltipContent>
                                </Tooltip>
                        )}
                    </CardTitle>
                    {delta && (
                        <p
                            className={`text-sm  font-bold ${
                                delta > 0
                                    ? "text-emerald-500"
                                    : "text-destructive"
                            }`}
                        >
                            {`${delta > 0 ? "+" : ""}${delta} % `}
                        </p>
                    )}
                </div>
                {description && (
                    <CardDescription className="text-xs">
                        {description}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="mt-auto py-3 px-4">
                {isLoading ? (
                    <MiniRotatingLoader />
                ) : !isNull(value)  ? (
                    <div className="text-4xl font-bold text-primary-800">
                        {formatNumber(value)}
                    </div>
                ) : (
                    <span className="text-xl opacity-50"> - </span>
                )}
            </CardContent>
        </Card>
    );
}

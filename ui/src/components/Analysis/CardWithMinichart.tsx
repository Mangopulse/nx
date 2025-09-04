"use client";
import { title } from "process";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

import MiniChart from "./MiniChart";
import { cn } from "@/lib/utils";
import MiniRotatingLoader from "../loaders/MiniRotatingLoader";
import { formatNumber } from "@/helpers/analytics";
import { ReactElement } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { InfoIcon } from "lucide-react";

interface props {
    className?: string;
    title?: string;
    value?: string;
    chratValues?: any[];
    isLoading?: boolean;
    total?: boolean;
    tooltip?: string | ReactElement;
}

export default function CardWithMiniChart({
    className,
    title,
    value,
    isLoading,
    chratValues,
    total,
    tooltip,
}: props) {
    return (
        <Card
            className={cn(
                className,
                "flex flex-col justify-between overflow-hidden"
            )}
        >
            <CardHeader className="flex flex-col items-start justify-between space-y-0 p-3 pb-2">
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
                {isLoading ? (
                    <MiniRotatingLoader />
                ) : (
                    <p className="text-4xl font-bold text-primary-800">
                        {formatNumber(value)}
                        {total && (
                            <span className="text-sm font-normal text-primary-800/40">
                                {" "}
                                total
                            </span>
                        )}
                    </p>
                )}
            </CardHeader>
            {!isLoading && chratValues && (
                <CardContent className="p-0 ml-0">
                    <MiniChart data={chratValues} />
                </CardContent>
            )}
        </Card>
    );
}

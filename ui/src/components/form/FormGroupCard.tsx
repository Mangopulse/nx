import React from "react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "../ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";

const FormGroupCard = ({
    title,
    description,
    tooltip,
    className,
    children,
}: any) => {
    return (
        <Card className={cn("max-w-full", className)}>
            <CardHeader className="p-4 max-w-full">
                <CardTitle className="flex gap-2 items-center text-sm font-semibold">
                    <span className="opacity-60">{title}</span>
                    {tooltip && (
                            <Tooltip>
                                <TooltipTrigger className="flex gap-2 items-center">
                                    <InfoCircledIcon opacity={0.4}/>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="top"
                                    className="max-w-[300px] shadow-sm font-normal bg-secondary text-primary border"
                                >
                                    {tooltip}
                                </TooltipContent>
                            </Tooltip>
                    )}
                </CardTitle>
                {description && (
                    <CardDescription className="max-w-[50ch]">{description}</CardDescription>
                )}
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div>{children}</div>
            </CardContent>
        </Card>
    );
};

export default FormGroupCard;

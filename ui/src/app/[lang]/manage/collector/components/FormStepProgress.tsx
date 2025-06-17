import IconButton from "@/components/form/IconButton";
import MiniRotatingLoader from "@/components/loaders/MiniRotatingLoader";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
    ArrowLeftIcon,
    GanttChartIcon,
    LayoutTemplateIcon,
    MousePointerClickIcon,
    SaveIcon,
    SlidersHorizontalIcon,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

export interface IFormStepProgressProps {
    step: number;
    setStep: Function;
    onSave: React.MouseEventHandler<HTMLButtonElement>;
    isSaving: boolean;
}

export default function FormStepProgress({
    step,
    setStep,
    onSave,
    isSaving,
}: IFormStepProgressProps) {
    const tabs = [
        {
            title: "Type",
            icon: <LayoutTemplateIcon size={17} />,
        },
        {
            title: "Template",
            icon: <GanttChartIcon size={17} />,
        },
        {
            title: "Trigger",
            icon: <MousePointerClickIcon size={17} />,
        },
        {
            title: "Configuration",
            icon: <SlidersHorizontalIcon size={17} />,
        },
    ];

    return (
        <div className="w-full flex items-center justify-between px-3 border-b sticky top-0 bg-white z-10">
            <Link
                href="/manage/collector"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "flex items-center space-x-2"
                )}
            >
                <ArrowLeftIcon size={17} strokeWidth={"1"} />
                <span>All Collectors</span>
            </Link>
            <Tabs
                value={String(step)}
                onValueChange={(val: any) => setStep(parseInt(val))}
                className="flex items-center justify-center mx-auto"
            >
                <TabsList className={`grid grid-cols-4 w-fit`}>
                    {tabs.map((tab, i) => {
                        const stepNb = i + 1;
                        // const isDone = stepNb < step;
                        const isDone = false;
                        const isActive = stepNb === step;

                        return (
                            <TabsTrigger
                                className={cn(
                                    `rounded-none flex justify-start items-center gap-2 px-4 py-3 pr-9 cursor-pointer !outline-none transition-none`,
                                    (isDone || isActive) &&
                                        "border-b-2 border-primary-600"
                                )}
                                key={i}
                                value={String(stepNb)}
                                onClick={() => setStep(stepNb)}
                            >
                                <div
                                    className={cn(
                                        "rounded-full grid place-items-center w-9 h-9 bg-gray-200 text-primary font-semibold",
                                        (isDone || isActive) &&
                                            "bg-primary-600 text-primary-foreground",
                                        !isDone && !isActive && "opacity-40"
                                    )}
                                >
                                    {" "}
                                    {tab.icon}{" "}
                                </div>
                                <p className="text-1xl opacity-90">
                                    {tab.title}
                                </p>
                            </TabsTrigger>
                        );
                    })}
                </TabsList>
            </Tabs>
            <IconButton
                className="flex items-center space-x-2"
                onClick={onSave}
            >
                {isSaving ? (
                    <>
                        <MiniRotatingLoader />
                        Saving
                    </>
                ) : (
                    <>
                        <SaveIcon size={17} />
                        Save
                    </>
                )}
            </IconButton>
        </div>
    );
}

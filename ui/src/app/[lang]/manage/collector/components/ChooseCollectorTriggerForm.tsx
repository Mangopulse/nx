import Loader from "@/components/General/Loader";
import IconButton from "@/components/form/IconButton";
import * as React from "react";
import RadioCard from "./RadioCard";
import { useController } from "react-hook-form";
import FormGroupCard from "@/components/form/FormGroupCard";
import Input from "@/components/form/Input";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";

export default function ChooseCollectorTriggerForm({
    form,
    previousStep,
    nextStep,
    submitQuery,
}: any) {
    const { field } = useController({
        name: "trigger",
        control: form.control,
    } as any);

    return (
        <div className="flex flex-col items-center gap-10 justify-center pt-9">
            <div>
                <h1 className="text-2xl font-semibold text-center mb-1">
                    Choose Collector Trigger
                </h1>
                <p className="text-md text-center opacity-60">
                    When do you want the collector to be shown on to the user?
                </p>
            </div>
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-3 gap-4 items-center justify-center">
                    <RadioCard
                        title="On Page Load"
                        description="The collector will appear instantly with the page when it loads, the user will see it right away"
                        image="collector-trigger-onload.svg"
                        value="onload"
                        field={field}
                    />
                    <RadioCard
                        title="On Page Scroll"
                        description="The collector will appear when the user scrolls a specific percentage you specify of the page."
                        image="collector-trigger-scroll.svg"
                        value="onscroll"
                        field={field}
                    />
                    <RadioCard
                        title="On Time"
                        description="The collector will appear after a certain amount of seconds you specify pass."
                        image="collector-trigger-timed.svg"
                        value="timed"
                        field={field}
                    />
                </div>
                {form.getValues("trigger") === "onscroll" && (
                    <FormGroupCard
                        title="Scroll percentage trigger"
                        description="How much should the user scroll of the page for the collector to appear? (%)"
                        tooltip="Example: If set to 15%(recommended amount), we will show the collector after the user has scrolled down 15% of the page."
                        className="max-w-full"
                    >
                        <Input
                            control={form.control}
                            name="scrollPercentage"
                            min={0}
                            max={100}
                            placeholder="Recommended 15%"
                            type="numeric"
                            className="m-0"
                        />
                    </FormGroupCard>
                )}
                {form.getValues("trigger") === "timed" && (
                    <FormGroupCard
                        title="Time Trigger"
                        description="How many seconds should pass for the collector to appear?"
                        tooltip="Example: If set to 20(recommended amount), we will show the collector after 20 seconds pass from the moment the page and our script is loaded"
                        className="max-w-full"
                    >
                        <Input
                            control={form.control}
                            name="secondsToShow"
                            min={0}
                            placeholder="Recommended 20 seconds"
                            type="numeric"
                            className="m-0"
                        />
                    </FormGroupCard>
                )}
            </div>

            <div className="flex items-center w-full">
                <IconButton onClick={previousStep} variant={"outline"}>
                    <ArrowLeftIcon />
                    <p>Back</p>
                </IconButton>
                <div className="flex items-center gap-3 ml-auto">
                    
                    <IconButton onClick={nextStep} variant={"outline"}>
                        <p>Next</p>
                        <ArrowRightIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    );
}

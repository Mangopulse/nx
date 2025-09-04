import { Combobox } from "@/components/form/ComboBox";
import RadioGroup from "@/components/form/RadioGroup";
import MiniRotatingLoader from "@/components/loaders/MiniRotatingLoader";
import Button from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { daysOfMonth, daysOfWeek, timeOptions } from "@/constants";
import updateSchedule from "@/services/website/updateSchedulre";
import { Close } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";

export default function ScheduleForm({
    scheduleData,
    closePopup,
    refetch,
}: any) {
    const form = useForm({
        defaultValues: scheduleData,
    });

    const scheduleType = form.watch("type");
    const { toast } = useToast();
    const { id } = useParams();

    const qc = useQueryClient();
                // qc.invalidateQueries({
                //     queryKey: ["newsletter-read"],
                //     stale: true
                // });
    const submitM = useMutation(updateSchedule, {
        onSuccess: (res: any) => {
            if (res.code === 200) {

                refetch();
                toast({
                    title: "Schedule updated successfully",
                });
                closePopup();
            } else {
                toast({
                    title: "Error in updating schedule",
                    description: res.errorMessage,
                    variant: "destructive",
                });
            }
        },
    });
    const onSubmit = async (fv: any) => {
        const payload: any = {
            type: fv.type,
            hour: fv.hour,
            id,
        };
        switch (fv.type) {
            case "daily":
                payload.hour = fv.hour;
                break;
            case "weekly":
                payload.day = fv.weekDay;
                break;
            case "monthly":
                payload.day = fv.monthDay;
                break;
        }
        await submitM.mutateAsync(payload);
    };

    const renderDayDropdown = () => {
        if (!scheduleType || scheduleType === "daily") return;
        else if (scheduleType === "weekly") {
            return (
                <Combobox
                    className={"p-2"}
                    placeholder={"Select Day To Send"}
                    emptyMessage={""}
                    items={daysOfWeek}
                    isLoading={false}
                    label={"Day"}
                    form={form}
                    name={"weekDay"}
                    triggerClassName={""}
                    actionItems={[]}
                    isMulti={false}
                    value={null}
                    variant="ghost"
                />
            );
        } else {
            return (
                <Combobox
                    className={"p-2"}
                    emptyMessage={""}
                    label={"Day"}
                    items={daysOfMonth}
                    isLoading={false}
                    form={form}
                    placeholder="Select Day To Send"
                    name={"monthDay"}
                    triggerClassName={""}
                    actionItems={[]}
                    isMulti={false}
                    value={null}
                    variant="ghost"
                />
            );
        }
    };

    return (
        <Form {...form}>
            <form
                className="flex flex-col"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="mb-5">
                    <RadioGroup
                        name="type"
                        variant="tabs"
                        form={form}
                        items={[
                            {
                                label: "Daily",
                                value: "daily",
                                premium: true,
                            },
                            {
                                label: "Weekly",
                                value: "weekly",
                            },

                            {
                                label: "Monthly",
                                value: "monthly",
                            },
                        ]}
                    />
                </div>

                <div className="grid grid-cols-2 gap-2 h-fit">
                    <Combobox
                        className={"p-2 h-fit"}
                        placeholder={"Select Hours To Send"}
                        searchPlaceholder={"search"}
                        emptyMessage={""}
                        items={timeOptions}
                        isLoading={false}
                        form={form}
                        label={"Hour(UTC)"}
                        name={"hour"}
                        triggerClassName={""}
                        actionItems={[]}
                        isMulti={false}
                        value={null}
                        variant="ghost"
                    />

                    {renderDayDropdown()}
                </div>

                <div className="flex justify-end items-center gap-2 mt-4">
                    <Close>
                        <Button className="" variant={"outline"}>
                            Cancel
                        </Button>
                    </Close>
                    <Button className="" type="submit">
                        {submitM.isLoading ? (
                            <div className="flex gap-2 items-center">
                                <MiniRotatingLoader />
                                Saving...
                            </div>
                        ) : (
                            "Save"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

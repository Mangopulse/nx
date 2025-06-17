"use client";
import MainLayout from "@/layouts/MainLayout";
import { FormEvent, MouseEventHandler, useState } from "react";
import FormStepProgress from "./FormStepProgress";
import { useMutation, useQuery } from "@tanstack/react-query";
import readCollector from "@/services/manage/collector/read";
import Loader from "@/components/General/Loader";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import save from "@/services/manage/collector/save";
import { Form } from "@/components/ui/form";
import ChooseCollectorTypeForm from "./ChooseCollectorType";
import ChooseColelctorTemplateForm from "./ChooseColelctorTemplate";
import ChooseCollectorTriggerForm from "./ChooseCollectorTriggerForm";
import ConfigureCollectorForm from "./ConfigureCollector";

function CollectorWidget({ collectorData }: any) {
    const [step, setStep] = useState(1);

    const form = useForm({
        defaultValues: {
            type: "bottom-popup",
            template: "template-basic",
            trigger: "onscroll",
            scrollPercentage: 15,
            titleText: "Subscribe to our email newsletter",
            subtitleText: "Don't miss out on anything!",
            buttonText: "Subscribe",
            btnBgColor: "#2d4386",
            btnTextColor: "#ffffff",
            successMessageTitleText: "We have sent you an email",
            successMessageSubTitleText: "Please check your email to confirm your newsletter subscription!",
            popupSide: "left",
            direction: "ltr",
            isActive: true,
            ...collectorData,
        },
    });

    const { toast } = useToast();

    const submitQuery = useMutation(save, {
        onSuccess: (res) => {
            if (res.code === 200)
                toast({
                    title: "Collector updated successfully",
                });
            else {
                toast({
                    title: "Failed to update collector",
                    variant: "destructive",
                });
            }
        },
    });

    const onSubmit = async (fv: any) => {
        await submitQuery.mutateAsync(fv);
    };

    return (
        <>
            <FormStepProgress
                step={step}
                setStep={setStep}
                onSave={form.handleSubmit(onSubmit)}
                isSaving={submitQuery.isLoading}
            />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-8 items-center py-3"
                >
                    {step === 1 && (
                        <ChooseCollectorTypeForm
                            form={form}
                            nextStep={() => setStep(step + 1)}
                        />
                    )}
                    {step === 2 && (
                        <ChooseColelctorTemplateForm
                            form={form}
                            nextStep={() => setStep(step + 1)}
                            previousStep={() => setStep(step - 1)}
                        />
                    )}
                    {step === 3 && (
                        <ChooseCollectorTriggerForm
                            form={form}
                            nextStep={() => setStep(step + 1)}
                            previousStep={() => setStep(step - 1)}
                        />
                    )}
                    {step === 4 && (
                        <ConfigureCollectorForm
                            form={form}
                            previousStep={() => setStep(step - 1)}
                        />
                    )}
                </form>
            </Form>
        </>
    );
}

export default function Collector() {
    const readCollectorQ = useQuery(["collector-read"], readCollector);

    return (
        <>
            {readCollectorQ.isLoading ? (
                <div className="flex gap-8 justify-center py-52">
                    <Loader />
                </div>
            ) : (
                <CollectorWidget
                    collectorData={readCollectorQ.data?.collector}
                />
            )}
        </>
    );
}

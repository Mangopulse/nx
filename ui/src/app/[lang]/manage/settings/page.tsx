"use client";
import IconButton from "@/components/form/IconButton";
import * as React from "react";
import EmailServiceProviderSettings from "./components/EmailServiceProviderSettings";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "@/components/ui/form";
import SwitchCard from "@/components/form/SwitchCard";
import FreeAccountWarning from "./components/FreeAccountWarning";
import useWebsiteConfig from "@/hooks/queries/useWebsiteConfig";
import MiniRotatingLoader from "@/components/loaders/MiniRotatingLoader";
import { Config } from "@/types";
import { useMutation } from "@tanstack/react-query";
import updateSettings from "@/services/website/updateSettings";
import { useToast } from "@/components/ui/use-toast";
import { SaveIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import FormGroupCard from "@/components/form/FormGroupCard";
import Input from "@/components/form/Input";
import auth from "@/lib/Auth";

export interface ISettingsProps {
    config: Config;
    refetch: Function;
    isFetching: boolean;
}

function Settings({ config, refetch, isFetching }: ISettingsProps) {
    const getDefaultValues = (config: Config) => {
        return {
            useCustomApiKey:
                config.senderType &&
                config.senderType !== "cx_sendgrid_default",
            senderType: config.senderType,
            apiKey: config.apiKey,
            email: config.senderEmail,
        };
    };

    const form = useForm({
        defaultValues: getDefaultValues(config),
    });

    const { toast } = useToast();

    const saveM = useMutation(updateSettings, {
        onSuccess: (res, payload) => {
            if (res.code === 200) {
                toast({
                    title: "Settings updated successfully",
                });
                auth.setSenderId(res.sender?.id);
                // did the user update the email?
                const currentSenderEmail = config.senderEmail;
                if (
                    payload.senderType === "cx_sendgrid_default" &&
                    currentSenderEmail !== res.sender?.email
                ) {
                    auth.setSenderUnverified();
                }
                refetch();
            } else {
                toast({
                    title: "Something went wrong",
                    description: res?.errorMessage,
                    variant: "destructive",
                });
            }
        },
    });

    const onSubmit = async (fv: any) => {
        if (fv.useCustomApiKey) {
            if (!fv.senderType || fv.senderType === "cx_sendgrid_default")
                return toast({
                    title: "Please choose your email provider",
                    variant: "destructive",
                });
            else if (
                ["sendgrid", "mailchimp"].includes(fv.senderType) &&
                !fv.apiKey?.trim()
            )
                return toast({
                    title: "Enter your API key",
                    description:
                        "You can find your API key in your providers' portal. Ask them for support if you lost it",
                    variant: "destructive",
                });
            else if (
                (fv.senderType === "smtp" && (!fv.smtpHost || !fv.smtpPort)) ||
                (fv.senderType === "smtp" &&
                    fv.useAuth &&
                    (!fv.smtpUserName ||
                        !fv.smtpPassword ||
                        !fv.securityType))
            ) {
                return toast({
                    title: "Please enter your SMTP information",
                    description:
                        "Please make sure you filled all of the SMTP info fields",
                    variant: "destructive",
                });
            }
        }
        await saveM.mutateAsync({
            senderType: fv.useCustomApiKey
                ? fv.senderType
                : "cx_sendgrid_default",
            apiKey: fv.useCustomApiKey ? fv.apiKey?.trim() : "",
            smtpUserName: fv.useCustomApiKey ? fv.smtpUserName?.trim() : "",
            smtpPassword: fv.useCustomApiKey ? fv.smtpPassword?.trim() : "",
            smtpHost: fv.useCustomApiKey ? fv.smtpHost?.trim() : "",
            smtpPort: fv.useCustomApiKey ? fv.smtpPort?.trim() : "",
            smtpSSLProtocol: fv.useCustomApiKey
                ? fv.smtpSSLProtocol?.trim()
                : "",
            email: fv.email,
        });
    };

    const useCustomApiKey = useWatch({
        control: form.control,
        name: "useCustomApiKey",
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
                <div className="flex items-center justify-between mb-3 sticky top-0 w-full bg-white z-10 p-3 border-b">
                    <h1 className="text-xl opacity-80">Settings</h1>
                    <IconButton type="submit">
                        {saveM.isLoading ? (
                            <>
                                <MiniRotatingLoader />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <SaveIcon size={17} />
                                <span>Save</span>
                            </>
                        )}
                    </IconButton>
                </div>
                <div
                    className={cn(
                        "w-[600px] space-y-3 p-3",
                        (isFetching || saveM.isLoading) &&
                            "opacity-20 pointer-events-none"
                    )}
                >
                    {(!config.senderType ||
                        config.senderType === "cx_sendgrid_default") && (
                        <FreeAccountWarning />
                    )}
                    <SwitchCard
                        form={form}
                        name="useCustomApiKey"
                        label="Use my own email provider"
                        description="Use your own email provider account as the sender instead of the free limited account we provide"
                    />
                    {useCustomApiKey && (
                        <EmailServiceProviderSettings form={form} />
                    )}

                    <div className="w-full h-px bg-primary-800/10 !my-7"></div>

                    <FormGroupCard
                        title="Sender Email Address"
                        description="From which email do you want the newsletter
                            to be sent to your users?"
                        tooltip="Your users will receive the newsletter from this email address"
                        className="rounded-sm"
                    >
                        <Input
                            control={form.control}
                            type="email"
                            placeholder="Enter email address"
                            name="email"
                        />
                    </FormGroupCard>
                </div>
            </form>
        </Form>
    );
}

export default function LoadData() {
    const { isLoading, config, refetch, isFetching } = useWebsiteConfig();

    return (
        <>
            {isLoading ? (
                <div className="flex justify-center items-center h-72">
                    <MiniRotatingLoader />
                </div>
            ) : (
                <Settings
                    config={config}
                    refetch={refetch}
                    isFetching={isFetching}
                />
            )}
        </>
    );
}

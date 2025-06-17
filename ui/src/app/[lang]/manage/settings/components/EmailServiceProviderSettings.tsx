/* eslint-disable react/no-unescaped-entities */
import * as React from "react";
import RadioCard from "../../collector/components/RadioCard";
import { useController } from "react-hook-form";
import Input from "@/components/form/Input";
import FormGroupCard from "@/components/form/FormGroupCard";
import SMTPInfoForm from "./SMTPInfoForm";

export default function EmailServiceProviderSettings({ form }: any) {
    const { field } = useController({
        name: "senderType",
        control: form.control,
        required: true,
    } as any);

    return (
        <div>
            <div className="space-y-4 mt-4">
                <div className="">
                    <p className="text-xl font-medium">Your Email Provider</p>
                    <p className="text-sm opacity-60">
                        Choose the email provider you use or have an account for
                    </p>
                </div>
                <div className="flex gap-4">
                    <RadioCard
                        image={"provider-sendgrid.png"}
                        value="sendgrid"
                        field={field}
                        variant="email-provider"
                    />
                    <RadioCard
                        image={"provider-mailchimp.png"}
                        value="mailchimp"
                        field={field}
                        variant="email-provider"
                    />
                    <RadioCard
                        image={"provider-smtp.png"}
                        value="smtp"
                        field={field}
                        variant="email-provider"
                    />
                </div>
                {!field.value || field.value === "cx_sendgrid_default" ? (
                    ""
                ) : ["sendgrid", "mailchimp"].includes(field.value) ? (
                    <Input
                        control={form.control}
                        label="API Key"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Enter your API Key from your provider"
                        name="apiKey"
                    />
                ) : (
                    <SMTPInfoForm form={form} />
                )}
            </div>
        </div>
    );
}

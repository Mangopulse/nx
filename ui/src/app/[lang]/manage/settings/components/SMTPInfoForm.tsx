import CheckboxCard from "@/components/form/CheckboxCard";
import { Combobox } from "@/components/form/ComboBox";
import Input from "@/components/form/Input";
import * as React from "react";
import { useWatch } from "react-hook-form";

export interface ISMTPInfoFormProps {
    form: any;
}

export default function SMTPInfoForm({ form }: ISMTPInfoFormProps) {
    const isAuthenticated = useWatch({
        control: form.control,
        name: "useAuth",
    });

    return (
        <div className="grid grid-cols-2 gap-2">
            <Input
                control={form.control}
                label="SMTP Server Host"
                name="smtpHost"
                placeholder="smtp.example.com"
            />
            <Input
                control={form.control}
                label="SMTP Port"
                name="smtpPort"
                placeholder="25"
            />

            <CheckboxCard
                form={form}
                name="useAuth"
                label="Use Authentication?"
                description="Do you have authentication enabled on your SMTP server?"
                className="col-span-2"
            />
            {isAuthenticated && (
                <>
                    <Input
                        control={form.control}
                        label="SMTP Username"
                        name="smtpUsername"
                        placeholder="example@gmail.com"
                    />
                    <Input
                        control={form.control}
                        label="SMTP Password"
                        type="password"
                        autoComplete="new-password"
                        name="smtpPassword"
                    />
                    <Combobox
                        form={form}
                        label="Security Type"
                        name="securityType"
                        items={[
                            { label: "SSL", value: "SSL" },
                            { label: "TLS", value: "TLS" },
                        ]}
                    />
                </>
            )}
        </div>
    );
}

import IconButton from "@/components/form/IconButton";
import Input from "@/components/form/Input";
import SwitchCard from "@/components/form/SwitchCard";
import MiniRotatingLoader from "@/components/loaders/MiniRotatingLoader";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import useAuth from "@/hooks/useAuth";
import auth from "@/lib/Auth";
import updateSender from "@/services/website/updateSender";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import useBuilderStore from "../../../builderStore";

export default function SetSenderForm({ closePopup }: any) {
    const user = useAuth();
    const form = useForm({
        defaultValues: {
            email: user?.sender?.email,
            useUserEmail: user?.sender?.email === user?.email
        }
    });
    const getSenderEnabled = useBuilderStore(s => s.getSenderEnabled);
    const setGetSenderEnabled = useBuilderStore(s => s.setGetSenderEnabled);
    const qc = useQueryClient();
    const { toast } = useToast();
    const setSenderM = useMutation(updateSender, {
        onSuccess: (res) => {
            if (res.code === 200) {
                toast({
                    title: "We sent you en email!",
                    description: `Email sent to ${res?.sender?.email} for confirmation`,
                });
                // set cookie sender
                auth.setSender(res.sender);
                closePopup();
                // setGetSenderEnabled(!getSenderEnabled);
            } else {
                toast({
                    title: "Something went wrong!",
                    description: res?.errorMessage,
                    variant: "destructive",
                });
            }
        },
    });

    const onSubmit = async (fv: any) => {
        const payload:any = {
            email: fv.email,
        };
        if (useUserEmail) {
            payload.email = user?.email;
        }
        if(user?.sender?.id !== 0) payload.id = user?.sender?.id
        await setSenderM.mutateAsync(payload);
    };

    const useUserEmail = useWatch({
        control: form.control,
        name: "useUserEmail",
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                {!useUserEmail && (
                    <Input
                        label="Email Sender"
                        name="email"
                        placeholder={"john@example.com"}
                        control={form.control}
                    />
                )}
                <SwitchCard
                    form={form}
                    name="useUserEmail"
                    label="Use this account's email instead?"
                    description={"The email is " + user?.email}
                />
                <div className="flex justify-end">
                    <IconButton className="w-full mb-2" type="submit">
                        {setSenderM.isLoading ? (
                            <div className="flex items-center gap-2">
                                <MiniRotatingLoader />
                                <span>Submitting...</span>
                            </div>
                        ) : (
                            "Submit"
                        )}
                    </IconButton>
                </div>
            </form>
        </Form>
    );
}

import CheckboxCard from "@/components/form/CheckboxCard";
import IconButton from "@/components/form/IconButton";
import Input from "@/components/form/Input";
import MiniRotatingLoader from "@/components/loaders/MiniRotatingLoader";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import importSubscribers from "@/services/manage/subscribers/importSubscribers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

export default function AddSubscriberForm({ importSubscribersQ }: any) {
    const schema = z.object({
        firstName: z.optional(z.string()),
        lastName: z.optional(z.string()),
        email: z.string().email("Invalid email"),
        phone: z.optional(z.string()),
        country: z.optional(z.string()),
    });

    const form = useForm({
        resolver: zodResolver(schema),
    });
    const { toast } = useToast();

    function validateEmail(value: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value.trim());
    }
    const onSubmit = async (fv: any) => {
        if(!consent) return;
        if (!fv.email) return;
        if (!validateEmail(fv.email)) {
            toast({
                title: "Please enter a valid email.",
                description: `${fv.email} is not a valid email address`,
                variant: "destructive",
            });
        } else
            await importSubscribersQ.mutateAsync({
                subscribers: [
                    {
                        firstName: fv.firstName || "",
                        lastName: fv.lastName || "",
                        email: fv.email || "",
                        phone: fv.phone || "",
                        country: fv.country || "",
                    },
                ],
            });
    };

    const consent = useWatch({
        name: "consent",
        control: form.control
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <Input
                        label="First Name"
                        control={form.control}
                        name="firstName"
                    />
                    <Input
                        label="last Name"
                        control={form.control}
                        name="lastName"
                    />
                </div>
                <Input
                    label="Email"
                    type="email"
                    control={form.control}
                    name="email"
                />
                <div className="grid grid-cols-2 gap-2">
                    <Input
                        label="Phone Number"
                        type="tel"
                        control={form.control}
                        name="phone"
                    />
                    <Input
                        label="Country"
                        control={form.control}
                        name="country"
                    />
                </div>
                <CheckboxCard
                    form={form}
                    name={"consent"}
                    label={"I have the consent of the subscriber"}
                    description={"This is required before importing"}
                />
                <IconButton
                    type="submit"
                    className="space-x-2 w-full"
                    disabled={!consent}
                    size={"sm"}
                >
                    {importSubscribersQ.isLoading ? (
                        <>
                            <MiniRotatingLoader />
                            <span>Subscribing...</span>
                        </>
                    ) : (
                        <>
                            <span>Subscribe</span>
                        </>
                    )}
                </IconButton>
            </form>
        </Form>
    );
}

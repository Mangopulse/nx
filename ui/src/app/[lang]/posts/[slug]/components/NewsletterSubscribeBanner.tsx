/* eslint-disable react/no-unescaped-entities */
"use client";
import IconButton from "@/components/form/IconButton";
import Input from "@/components/form/Input";
import MiniRotatingLoader from "@/components/loaders/MiniRotatingLoader";
import { Form } from "@/components/ui/form";
import { Toaster } from "@/components/ui/toaster";
import { toast, useToast } from "@/components/ui/use-toast";
import localImageLoader from "@/lib/utils";
import subscribe from "@/services/website/subscribe";
import { useMutation } from "@tanstack/react-query";
import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { useForm } from "react-hook-form";

export interface INewsletterSubscribeBannerProps {}

export default function NewsletterSubscribeBanner(
    props: INewsletterSubscribeBannerProps
) {
    const form = useForm();

    const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
    const [collectorDismissed, setCollectorDismissed] = React.useState(false);

    const subscriberM = useMutation(subscribe, {
        onSuccess: (res) => {
            if (res?.code === 200) {
                setShowSuccessMessage(true);
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
        console.log(fv);
        await subscriberM.mutateAsync({
            email: fv.email,
            appDomain: "newsletterx.cognativex.com",
            userId: "from-nx-blog-article-page",
        });
    };

    if (collectorDismissed) return "";

    return (
        <Form {...form}>
            <form
                className="w-full my-9 p-5 border-l-4 border-l-primary shadow-lg border rounded relative"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                {showSuccessMessage && (
                    <div className="absolute inset-0 bg-white z-50">
                        <div className="p-5 flex justify-center h-full rounded flex-col">
                            <p className="">We have sent you an email.</p>
                            <p className="opacity-50 text-sm">
                                Please check your email and click the link we
                                sent you to confirm your subscription.
                            </p>
                            <button
                                className="opacity-80 hover:opacity-100 text-sm underline mt-9 w-fit"
                                type="button"
                                onClick={() => setCollectorDismissed(true)}
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}

                <div className="mb-7">
                    <p className="!m-0">Subscribe to our newsletter</p>
                    <p className="opacity-50 text-sm !m-0">
                        Don't miss anything from important updates to helpful
                        tips to elevate your email marketing game.
                    </p>
                </div>
                <div className="grid grid-cols-12 items-center space-y-2 md:space-y-0 md:space-x-2">
                    <div className="col-span-12 md:col-span-8">
                        <Input
                            placeholder="Enter your email"
                            name="email"
                            type="email"
                            required={true}
                            control={form.control}
                        />
                    </div>
                    <IconButton
                        className="col-span-12 md:col-span-4"
                        type="submit"
                    >
                        {subscriberM.isLoading ? (
                            <MiniRotatingLoader />
                        ) : (
                            "Subscribe"
                        )}
                    </IconButton>
                </div>
            </form>
            <Toaster />
        </Form>
    );
}

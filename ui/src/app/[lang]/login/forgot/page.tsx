"use client";
import IconButton from "@/components/form/IconButton";
/* eslint-disable react/no-unescaped-entities */
import Input from "@/components/form/Input";
import MiniRotatingLoader from "@/components/loaders/MiniRotatingLoader";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import localImageLoader from "@/lib/utils";
import { forgetPassword } from "@/services/auth/forgetPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

export interface IForgotPasswordProps {}

export default function ForgotPassword(props: IForgotPasswordProps) {
    const schema = z.object({
        email: z.string().email(),
    });

    const form = useForm({
        resolver: zodResolver(schema),
    });

    const { toast } = useToast();

    const forgotPassM = useMutation(forgetPassword, {
        onSuccess: (res) => {
            console.log(res);
            if (res.code === 200) {
                toast({
                    title: "We have sent you an email!",
                    description:
                        "Please click the button we sent by email to reset your password",
                });
            } else {
                toast({
                    title: res.errorMessage,
                    variant: "destructive",
                });
            }
        },
    });
    const emailSent = forgotPassM.data?.code === 200;

    const onSubmit = async (fv: any) => {
        console.log(fv);
        await forgotPassM.mutateAsync(fv);
    };

    const { email } = form.watch();

    return (
        <div className="container grid grid-cols-3">
            <div className="col-span-3 md:col-start-2 md:col-span-1 flex flex-col space-y-6 items-center px-4 mt-6 md:mt-20 text-center">
                <div className="relative w-20 md:w-52 max-w-full aspect-square ml-9">
                    <Image
                        loader={localImageLoader}
                        src={"forgot-password.png"}
                        fill
                        alt="Forgot Password"
                    />
                </div>
                <h1 className="text-center text-lg md:text-3xl font-semibold">
                    Reset your password
                </h1>
                {emailSent ? (
                    <>
                        <div className="p-4 px-9 rounded bg-primary-600 text-secondary">
                            <p className="text-2xl font-medium mb-4">
                                Help is on the way!
                            </p>
                            <p className="text-md mb-2 opacity-90">
                                Please check the email we sent at{" "}
                                <strong className="font-semibold">{email}</strong>
                            </p>
                            <p className="text-sm opacity-60">
                                If you didn't recieve and email in the next 15
                                mins, please make sure there is no typo in the
                                email and try again!
                            </p>
                        </div>
                        <Link
                            href={"/login"}
                            aria-label="go to login"
                            className="text-sky-500 underline"
                        >
                            Go back to login
                        </Link>
                    </>
                ) : (
                    <>
                        <p className="opacity-60 md:max-w-[50ch] text-center">
                            Please enter the email address you'd like your
                            password reset information sent to.
                        </p>

                        <Form {...form}>
                            <form
                                className="w-full"
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Email Address"
                                    control={form.control}
                                />
                                <IconButton
                                    className={" mt-3 w-full"}
                                    disabled={!email}
                                    type="submit"
                                >
                                    {forgotPassM.isLoading ? (
                                        <MiniRotatingLoader />
                                    ) : (
                                        "Reset Your Password"
                                    )}
                                </IconButton>
                            </form>
                        </Form>
                        <div className="relative w-9 aspect-[1.6] mt-10">
                            <Image
                                loader={localImageLoader}
                                src="nx-dark.png"
                                alt="logo"
                                fill
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

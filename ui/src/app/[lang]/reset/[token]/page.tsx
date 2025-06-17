"use client";
import IconButton from "@/components/form/IconButton";
/* eslint-disable react/no-unescaped-entities */
import Input from "@/components/form/Input";
import MiniRotatingLoader from "@/components/loaders/MiniRotatingLoader";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import localImageLoader from "@/lib/utils";
import { forgetPassword } from "@/services/auth/forgetPassword";
import { resetPassword } from "@/services/auth/resetPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

export interface IResetProps {}

export default function Reset(props: IResetProps) {
    const { token } = useParams();

    const schema = z
        .object({
            newPassword: z
                .string()
                .min(8)
                .max(30)
                .refine((value) => /[A-Z]/.test(value), {
                    message:
                        "Password must contain at least one uppercase letter",
                })
                .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
                    message:
                        "Password must contain at least one special character",
                }),
            confirmNewPassword: z.string(),
        })
        .refine((data) => data.newPassword === data.confirmNewPassword, {
            message: "Passwords don't match",
            path: ["confirmNewPassword"],
        });

    const form = useForm({
        resolver: zodResolver(schema),
    });

    const { toast } = useToast();

    const resetPassM = useMutation(resetPassword, {
        onSuccess: (res) => {
            if (res.code === 200) {
                toast({
                    title: "Password was successfully reset!",
                    description: "You can now login with your new password",
                });
            } else {
                toast({
                    title: res.errorMessage,
                    variant: "destructive",
                });
            }
        },
    });

    const onSubmit = async (fv: any) => {
        await resetPassM.mutateAsync({
            password: fv.newPassword,
            token: token,
        });
    };

    return (
        <div className="container grid grid-cols-3">
            <div className="col-span-3 md:col-start-2 md:col-span-1 flex flex-col gap-6 items-center px-4 mt-6 md:mt-20 text-center">
                <div className="relative w-20 md:w-52 max-w-full aspect-square ml-9">
                    <Image
                        loader={localImageLoader}
                        src={"reset-password.png"}
                        fill
                        alt="Forgot Password"
                    />
                </div>
                {resetPassM.data?.code === 200 ? (
                    <>
                        <p className="text-lg font-medium">
                            Your password is reset!
                        </p>
                        <Link
                            aria-label="go to login"
                            href={"/login"}
                            className="text-sky-500 underline"
                        >
                            Go back to login
                        </Link>
                    </>
                ) : (
                    <>
                        <h1 className="text-center text-lg md:text-3xl font-semibold">
                            Reset your password
                        </h1>
                        <p className="opacity-60 md:max-w-[50ch] text-center">
                            Please enter your new password
                        </p>

                        <Form {...form}>
                            <form
                                className="w-full flex flex-col gap-3 items-start text-left"
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <Input
                                    placeholder="Enter a strong password"
                                    label="New password"
                                    control={form.control}
                                    name="newPassword"
                                    type="password"
                                />
                                <Input
                                    placeholder="Confirm the new password (retype it)"
                                    label="Confirm password"
                                    control={form.control}
                                    name="confirmNewPassword"
                                    type="password"
                                />
                                <IconButton className={"w-full"} type="submit">
                                    {resetPassM.isLoading ? (
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

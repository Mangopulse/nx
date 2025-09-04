/* eslint-disable react/no-unescaped-entities */
"use client";
import "../login/styles.scss";
import "@/styles/globals.scss";
import { z } from "zod";
import imgLoader from "@/helpers/image";
import Image from "next/image";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import Input from "@/components/form/Input";
import IconButton from "@/components/form/IconButton";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/services/auth/signup";
import MiniRotatingLoader from "@/components/loaders/MiniRotatingLoader";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/button";
import { redirect, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import AuthLayout from "@/layouts/AuthLayout";
import { getCookie } from "cookies-next";
import { COOKIE_REF_NAME } from "@/constants";

export default function Signup() {
    const SignupForm = () => {
        const { toast } = useToast();

        const signupSchema = z.object({
            email: z.string().email("Please enter a valid email"),
            website: z
                .string()
                .refine((value) => !value.includes("https://"), {
                    message: "Please remove the https:// protocol",
                })
                .refine((value) => !value.includes("http://"), {
                    message: "Please remove the http:// protocol",
                })
                .refine((value) => validateUrl(value), {
                    message: "Please enter a valid URL",
                }),
            password: z
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
        });

        const form = useForm({
            resolver: zodResolver(signupSchema),
        });

        function validateUrl(url: string) {
            let urlPattern = /^[\w.-]+\.[A-Za-z]{2,4}(\.[A-Za-z]{2,4})?[/\S]*/;
            return urlPattern.test(url);
        }

        const signupM = useMutation(signup, {
            onSuccess: (res) => {
                if (res.code !== 200) {
                    toast({
                        title: "Signup Failed",
                        description: res.errorMessage,
                        variant: "destructive",
                    });
                } else {
                    toast({
                        title: "Signup Successfull",
                        description: "Account created successfully",
                    });
                }
            },
        });

        const onSubmit = async (fv: any) => {
            const nxRef = getCookie(COOKIE_REF_NAME);
            await signupM.mutateAsync({
                ...fv,
                referral: nxRef,
            });
        };

        if (signupM.data?.code !== 200) {
            return (
                <Form {...form}>
                    <form
                        className="px-5 md:px-0flex justify-center items-start flex-col m-auto md:w-[80%] lg:w-[80%] 2xl:w-[60%]"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <h1 className="text-4xl font-bold py-5">Signup</h1>
                        <div className="login-form w-full flex flex-col gap-3">
                            <Input
                                className="w-full py-4"
                                placeholder="Enter your email address"
                                label="Email"
                                control={form.control}
                                name="email"
                            />
                            <Input
                                name="website"
                                control={form.control}
                                placeholder="Your website (example.com)"
                                className={"w-full py-4"}
                            />
                            <Input
                                name="password"
                                type="password"
                                control={form.control}
                                placeholder="Enter a strong password"
                                className={"w-full py-4"}
                            />

                            <div>
                                <IconButton
                                    className="w-full mb-2"
                                    type="submit"
                                >
                                    {signupM.isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <MiniRotatingLoader />
                                            <span>Creating...</span>
                                        </div>
                                    ) : (
                                        "Create Account"
                                    )}
                                </IconButton>
                                <p className="text-primary/40 text-center">
                                    Already have an account?{" "}
                                    <Link
                                        aria-label="go to login"
                                        href="/login"
                                        className="text-primary/70 underline"
                                    >
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </Form>
            );
        } else {
            return (
                <div className="flex justify-center items-center flex-col m-auto w-[58%]">
                    <h1 className="text-4xl font-bold">Check your email!</h1>
                    <p className="text-center py-4">
                        We have sent you an email for verification at{" "}
                        <span className="font-semibold">
                            {signupM.data?.email}
                        </span>
                        . Click on &quot;Confirm Your Email&quot; Button in the
                        email sent to proceed.
                    </p>
                    <Link href={"/login"} aria-label="go to login">
                        <IconButton>Done? Go Login</IconButton>
                    </Link>
                </div>
            );
        }
    };

    return (
        <div className="md:grid md:grid-cols-2 h-screen overflow-hidden">
            <div className="hidden md:flex h-screen justify-center items-center gap-10 bg-primary flex-col">
                <Link className="img-wrap w-80 pt-[4%]" href={"/"}>
                    <Image
                        loader={imgLoader}
                        src="newsletterX-logo.svg"
                        alt="logo"
                        fill
                    />
                </Link>
                <p className="text-secondary text-2xl">
                    Let's make great things together.
                </p>
            </div>
            <SignupForm />
        </div>
    );
}

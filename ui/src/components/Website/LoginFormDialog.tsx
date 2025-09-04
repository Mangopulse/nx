/* eslint-disable react/no-unescaped-entities */
"use client";
import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import HeroSignupForm from "./Hero/HeroSignupForm";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { cn } from "@/lib/utils";
import Input from "../form/Input";
import Button from "../ui/button";
import Loader from "./General/Loader";
import { useMutation } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import login from "@/services/auth/login";
import auth from "@/lib/Auth";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import MiniRotatingLoader from "../loaders/MiniRotatingLoader";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { defaultWalkthrough } from "@/constants";

export interface ILoginFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lang?: "en" | "ar";
}

export default function LoginFormDialog({
    open,
    onOpenChange,
    lang = "en",
}: ILoginFormDialogProps) {
    const TYPOGRAPHY = {
        en: {
            LOGIN: "Login",
            PLEASE_ENTER_EMAIL: "Please enter your email",
            INVALID_EMAIL: "Please enter a valid email",
            PLEASE_ENTER_PASSWORD: "Please enter your password",
            LOGIN_FAILED: "Login failed",
            LOGIN_SUCCESSFUL: "Login successful",
            LOGGING_IN: "We're logging you in...",
            FORGOT_PASSWORD: "Forgot my password",
        },
        ar: {
            LOGIN: "تسجيل الدخول",
            PLEASE_ENTER_EMAIL: "الرجاء إدخال بريدك الإلكتروني",
            INVALID_EMAIL: "الرجاء إدخال بريد إلكتروني صالح",
            PLEASE_ENTER_PASSWORD: "الرجاء إدخال كلمة المرور الخاصة بك",
            LOGIN_FAILED: "فشل تسجيل الدخول",
            LOGIN_SUCCESSFUL: "تم تسجيل الدخول بنجاح",
            LOGGING_IN: "نحن نسجل دخولك...",
            FORGOT_PASSWORD: "نسيت كلمة المرور",
        },
    };

    const loginValidationSchema = z.object({
        email: z.string().email(TYPOGRAPHY[lang].INVALID_EMAIL),
        password: z.string(),
    });

    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(loginValidationSchema),
    });
    const [error, setError] = React.useState<string>();
    const [redirecting, setRedirecting] = React.useState(false);

    const router = useRouter();

    const { isLoading, data, mutateAsync } = useMutation(login, {
        onSuccess: (res) => {
            if (res.code !== 200) {
                toast({
                    title: TYPOGRAPHY[lang].LOGIN_FAILED,
                    description: res.errorMessage,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: TYPOGRAPHY[lang].LOGIN_SUCCESSFUL,
                });
                auth.setUser({
                    email: res.email,
                    token: res.accessToken,
                    website: res.website,
                    sender: res.sender,
                    walkthrough: res.walkthrough || defaultWalkthrough,
                });
                setRedirecting(true);
                router.push("/manage/newsletter");
            }
        },
    });

    function validateEmail(value: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value.trim());
    }

    const onSubmit = async (fv: any) => {
        if (!fv.email) return setError(TYPOGRAPHY[lang].PLEASE_ENTER_EMAIL);
        if (!validateEmail(fv.email))
            return setError(TYPOGRAPHY[lang].INVALID_EMAIL);
        else setError("");

        if (!fv.password) return setError(TYPOGRAPHY[lang].PLEASE_ENTER_PASSWORD);
        else setError("");

        await mutateAsync({
            email: fv.email.trim(),
            password: fv.password,
        } as any);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="gap-9 py-10 px-4 md:px-11">
                <DialogHeader>
                    <DialogTitle className="font-bold text-center text-xl md:text-2xl mb-2 md:mb-3">
                        {TYPOGRAPHY[lang].LOGIN}
                    </DialogTitle>
                </DialogHeader>
                <div className="relative">
                    {redirecting ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <MiniRotatingLoader />
                        </div>
                    ) : (
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className={cn("flex flex-col gap-3")}
                            >
                                <Input
                                    name="email"
                                    control={form.control}
                                    placeholder={TYPOGRAPHY[lang].PLEASE_ENTER_EMAIL}
                                    className={"md:text-lg md:p-5"}
                                />
                                <Input
                                    name="password"
                                    type="password"
                                    control={form.control}
                                    placeholder={TYPOGRAPHY[lang].PLEASE_ENTER_PASSWORD}
                                    className={"w-full md:text-lg md:p-5"}
                                />
                                <div className="flex flex-col gap-2 items-center">
                                    <Button
                                        type="submit"
                                        className={cn(
                                            "w-full md:h-fit md:py-2 md:text-lg"
                                        )}
                                    >
                                        {isLoading ? <Loader /> : TYPOGRAPHY[lang].LOGIN}
                                    </Button>
                                    {error ? (
                                        <div className="text-destructive text-[9px] sm:text-xs font-bold tracking-wide">
                                            {error}
                                        </div>
                                    ) : isLoading ? (
                                        <div className="opacity-40 text-[9px] sm:text-xs font-bold tracking-wide">
                                            {TYPOGRAPHY[lang].LOGGING_IN}
                                        </div>
                                    ) : (
                                        <Link aria-label={`go to forget password page`} className="text-muted text-sm text-sky-600 hover:underline" href="/login/forgot" target="_blank">
                                            {TYPOGRAPHY[lang].FORGOT_PASSWORD}
                                        </Link>
                                    )}
                                </div>
                            </form>
                        </Form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

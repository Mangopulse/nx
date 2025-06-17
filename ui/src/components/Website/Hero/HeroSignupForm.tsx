/* eslint-disable react/no-unescaped-entities */
"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import Loader from "../General/Loader";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form";
import Input from "@/components/form/Input";
import Button from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/services/auth/signup";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import { getCookie } from "cookies-next";
import { COOKIE_REF_NAME } from "@/constants";

export interface IHeroSignupFormProps {
    variant?: "hero" | "popup";
    showSuccessMessage: boolean;
    setShowSuccessMessage: Function;
    lang?: "en" | "ar";
}

export default function HeroSignupForm({
    variant = "hero",
    showSuccessMessage,
    setShowSuccessMessage,
    lang = "en",
}: IHeroSignupFormProps) {
    const inPopup = variant === "popup";
    const [error, setError] = React.useState<string>();

    const TYPOGRAPHY = {
        en: {
            SIGNUP_BUTTON: "Signup Now",
            SIGNUP_FAILED: "Signup Failed",
            SIGNUP_SUCCESSFUL: "Signup Successful",
            ACCOUNT_CREATED: "Account created successfully",
            EMAIL_INPUT_PLACEHOLDER: "Your email address",
            DOMAIN_INPUT_PLACEHOLDER: "Your domain (example.com)",
            PASSWORD_INPUT_PLACEHOLDER: "A strong password",
            PLEASE_ENTER_VALID_EMAIL: "Please enter a valid email",
            PLEASE_REMOVE_HTTPS: "Please remove the https:// protocol",
            PLEASE_REMOVE_HTTP: "Please remove the http:// protocol",
            PLEASE_REMOVE_WWW: "Please remove the www. subdomain",
            PLEASE_REMOVE_SLASHES: "Please remove any slashes /",
            PLEASE_REMOVE_PARAMETERS:
                "Please remove get parameters or any ? and & signs",
            PLEASE_ENTER_VALID_URL: "Please enter a valid URL",
            PASSWORD_REQUIREMENTS:
                "Password must contain at least one uppercase letter and one special character",
                PASSWORD_MIN_ERROR: "Password should at least be 8 characters",
                PASSWORD_MAX_ERROR: "Password should at most be 30 characters",
            WE_ARE_SENDING_EMAIL: "We're sending you an email!",
            START_GROWING_TODAY: "Start growing today",
            SIGNUP_SUCCESS_MESSAGE_HEADER: "We have sent you an email",
            SIGNUP_SUCCESS_MESSAGE_BODY:
                "Please check your inbox and click the link we sent there to confirm your signup!",
            START: "START",
            GROWING: "GROWING",
            TODAY: "TODAY",
        },
        ar: {
            SIGNUP_BUTTON: "تسجيل",
            SIGNUP_FAILED: "فشل التسجيل",
            SIGNUP_SUCCESSFUL: "تم التسجيل بنجاح",
            ACCOUNT_CREATED: "تم إنشاء الحساب بنجاح",
            EMAIL_INPUT_PLACEHOLDER: "عنوان بريدك الإلكتروني",
            DOMAIN_INPUT_PLACEHOLDER: "نطاقك (example.com)",
            PASSWORD_INPUT_PLACEHOLDER: "كلمة مرور قوية",
            PLEASE_ENTER_VALID_EMAIL: "الرجاء إدخال بريد إلكتروني صالح",
            PLEASE_REMOVE_HTTPS: "الرجاء إزالة بروتوكول https://",
            PLEASE_REMOVE_HTTP: "الرجاء إزالة بروتوكول http://",
            PLEASE_REMOVE_WWW: "الرجاء إزالة www. الفرعية",
            PLEASE_REMOVE_SLASHES: "الرجاء إزالة أي شرطات /",
            PLEASE_REMOVE_PARAMETERS:
                "الرجاء إزالة معلمات الحصول أو أي علامات ؟ و &",
            PLEASE_ENTER_VALID_URL: "الرجاء إدخال عنوان URL صالح",
            PASSWORD_REQUIREMENTS:
                "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل و رمز مميز (!@#$%^&*) واحد",
                PASSWORD_MIN_ERROR: "يجب ان تكون كلمة المرور 8 احرف على الاقل",
                PASSWORD_MAX_ERROR: "يجب ان تكون كلمة المرور 30 احرف على الاكثر",
            WE_ARE_SENDING_EMAIL: "نحن نرسل لك بريدًا إلكترونيًا!",
            START_GROWING_TODAY: "ابدأ النمو اليوم",
            SIGNUP_SUCCESS_MESSAGE_HEADER: "لقد ارسلنا لك بريد الكتروني",
            SIGNUP_SUCCESS_MESSAGE_BODY:
                "الرجاء التحقق من صندوق بريدك و النقر على الرابط المرسل لتأكيد اشتراكك",
            START: "ابدأ",
            GROWING: "بالنمو",
            TODAY: "اليوم",
        },
    };

    const signupSchema = z.object({
        email: z.string().email(TYPOGRAPHY[lang].PLEASE_ENTER_VALID_EMAIL),
        website: z
            .string()
            .refine((value) => !value.includes("https://"), {
                message: TYPOGRAPHY[lang].PLEASE_REMOVE_HTTPS,
            })
            .refine((value) => !value.includes("http://"), {
                message: TYPOGRAPHY[lang].PLEASE_REMOVE_HTTP,
            })
            .refine((value) => !value.includes("www."), {
                message: TYPOGRAPHY[lang].PLEASE_REMOVE_WWW,
            })
            .refine((value) => !value.includes("/"), {
                message: TYPOGRAPHY[lang].PLEASE_REMOVE_SLASHES,
            })
            .refine((value) => !value.includes("?") && !value.includes("&"), {
                message: TYPOGRAPHY[lang].PLEASE_REMOVE_PARAMETERS,
            })
            .refine((value) => validateUrl(value), {
                message: TYPOGRAPHY[lang].PLEASE_ENTER_VALID_URL,
            }),
        password: z
            .string()
            .min(8, { message: TYPOGRAPHY[lang].PASSWORD_MIN_ERROR, })
            .max(30, { message: TYPOGRAPHY[lang].PASSWORD_MAX_ERROR })
            .refine((value) => /[A-Z]/.test(value), {
                message: TYPOGRAPHY[lang].PASSWORD_REQUIREMENTS,
            })
            .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
                message: TYPOGRAPHY[lang].PASSWORD_REQUIREMENTS,
            }),
    });

    const form = useForm({
        resolver: zodResolver(signupSchema),
    });

    function validateUrl(url: string) {
        let urlPattern = /^[\w.-]+\.[A-Za-z]{2,4}(\.[A-Za-z]{2,4})?[/\S]*/;
        return urlPattern.test(url);
    }

    const { toast } = useToast();

    const signupM = useMutation(signup, {
        onSuccess: (res) => {
            if (res.code !== 200) {
                toast({
                    title: TYPOGRAPHY[lang].SIGNUP_FAILED,
                    description: res.errorMessage,
                    variant: "destructive",
                });
                setError(res.errorMessage);
            } else {
                toast({
                    title: TYPOGRAPHY[lang].SIGNUP_SUCCESSFUL,
                    description: TYPOGRAPHY[lang].ACCOUNT_CREATED,
                });
                setShowSuccessMessage(true);
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

    return (
        <div className="relative">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={cn(
                        "flex flex-col space-y-2",
                        inPopup && "space-y-3"
                    )}
                >
                    <Input
                        name="email"
                        control={form.control}
                        placeholder={TYPOGRAPHY[lang].EMAIL_INPUT_PLACEHOLDER}
                        className={inPopup ? "md:text-lg md:p-5" : ""}
                    />
                    <Input
                        name="website"
                        control={form.control}
                        placeholder={TYPOGRAPHY[lang].DOMAIN_INPUT_PLACEHOLDER}
                        className={inPopup ? "md:text-lg md:p-5" : ""}
                    />
                    <Input
                        name="password"
                        type="password"
                        control={form.control}
                        placeholder={TYPOGRAPHY[lang].PASSWORD_INPUT_PLACEHOLDER}
                        className={inPopup ? "md:text-lg md:p-5" : ""}
                    />

                    <div className="flex flex-col space-y-2 items-center">
                        <Button
                            type="submit"
                            className={cn(
                                "w-full",
                                inPopup && "md:h-fit md:py-2 md:text-lg"
                            )}
                        >
                            {signupM.isLoading ? (
                                <Loader />
                            ) : (
                                TYPOGRAPHY[lang].SIGNUP_BUTTON
                            )}
                        </Button>
                        {error ? (
                            <div className="text-destructive text-[9px] sm:text-xs font-bold tracking-wide">
                                {error}
                            </div>
                        ) : signupM.isLoading ? (
                            <div className="opacity-40 text-[9px] sm:text-xs font-bold tracking-wide">
                                {TYPOGRAPHY[lang].WE_ARE_SENDING_EMAIL}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 space-x-reverse ltr:tracking-[.25rem] uppercase opacity-40 text-[9px] sm:text-xs font-bold">
                                <span>{TYPOGRAPHY[lang].START}</span>
                                <div className="w-1 h-1 rounded-full bg-primary" />
                                <span> {TYPOGRAPHY[lang].GROWING}</span>
                                <div className="w-1 h-1 rounded-full bg-primary" />
                                <span>{TYPOGRAPHY[lang].TODAY}</span>
                            </div>
                        )}
                    </div>
                </form>
                {showSuccessMessage && (
                    <div className="rounded flex flex-col items-center justify-center text-center space-y-3 font-semibold text-sm absolute inset-0 p-3 bg-primary-600 text-primary-foreground border-2 border-primary z-20">
                        <CheckCircle />
                        <span className="text-primary-foreground/70">
                            {TYPOGRAPHY[lang].SIGNUP_SUCCESS_MESSAGE_HEADER}{" "}
                            <span className="text-primary-foreground">
                                {form.getValues("email")}
                            </span>
                            !{" "}
                            {
                                TYPOGRAPHY[lang]
                                    .SIGNUP_SUCCESS_MESSAGE_BODY
                            }
                        </span>
                    </div>
                )}
            </Form>
        </div>
    );
}

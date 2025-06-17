"use client";
import * as React from "react";
import { Container } from "./General/Container";
import Image from "next/image";
import Link from "next/link";
import localImageLoader, { cn } from "@/lib/utils";
import Button, { buttonVariants } from "../ui/button";
import SignupFormDialog from "./SignupFormDialog";
import LoginFormDialog from "./LoginFormDialog";
import LocaleSwitcher from "./LocaleSwticher";

export default function Header({
    variant,
    openSignupByDefault,
    lang = "en", // Added lang prop with default value
}: {
    variant?: string;
    openSignupByDefault?: boolean;
    lang?: "en" | "ar"; // Updated prop type
}) {
    const [isSignupPopupOpen, setIsSignupPopupOpen] = React.useState(
        openSignupByDefault ? true : false
    );
    const [isLoginPopupOpen, setIsLoginPopupOpen] = React.useState(false);

    const openSignForm = () => setIsSignupPopupOpen(true);
    const openLoginForm = () => setIsLoginPopupOpen(true);

    // Multilingual text
    const TYPOGRAPHY = {
        en: {
            BLOG: "Blog",
            CONTACT_US: "Contact Us",
            HELP: "Help",
            LOGIN: "Login",
            START_FOR_FREE: "Start For Free 🚀",
            SIGNUP: "Signup",
        },
        ar: {
            BLOG: "المدونة",
            CONTACT_US: "اتصل بنا",
            HELP: "المساعدة",
            LOGIN: "الدخول",
            START_FOR_FREE: "ابدأ مجاناً 🚀",
            SIGNUP: "التسجيل",
        },
    };

    return (
        <Container
            className={`fixed top-3 left-1/2 -translate-x-[50.4%] !p-0 z-50 ${
                lang === "ar" ? "rtl" : ""
            }`}
        >
            <header className="bg-primary w-full flex justify-between items-center px-3 py-2 md:px-5 md:py-4 rounded-lg">
                <div
                    className={`flex space-x-2 md:space-x-4 items-center ${
                        lang === "ar" ? "rtl:space-x-reverse" : ""
                    }`}
                >
                    {lang === "ar" ? (
                        <Link
                        aria-label={`go to home page`}
                        href={"/"}
                        className="img-wrap relative w-[91px] h-[32px] md:h-9 md:w-[6.3rem]"
                    >
                        <Image
                            loader={localImageLoader}
                            alt="logo"
                            src={"NX_AR_LOGO.png"}
                            fill
                        />
                    </Link>
                    ) : (
                        <Link
                            aria-label={`go to home page`}
                            href={"/"}
                            className="img-wrap relative w-28 h-[14px] md:h-5 md:w-40"
                        >
                            <Image
                                loader={localImageLoader}
                                alt="logo"
                                src={"newsletterX-logo.webp"}
                                fill
                            />
                        </Link>
                    )}

                    {variant && (
                        <>
                            <div className="divider w-px h-5 md:h-7 bg-white/30"></div>
                            <p className="text-sm md:text-xl text-white/70">
                                {variant}
                            </p>
                        </>
                    )}
                </div>
                <div
                    className={`flex items-center space-x-2 md:space-x-4 ${
                        lang === "ar" ? "rtl:space-x-reverse" : ""
                    }`}
                >
                    <Link
                        href={"/posts"}
                        aria-label={`go to contact us form`}
                        className={cn(
                            buttonVariants({ variant: "link" }),
                            "px-1 text-primary-foreground hidden md:block hover:text-primary-foreground/80"
                        )}
                    >
                        {TYPOGRAPHY[lang].BLOG}
                    </Link>
                    <Link
                        href={"#contact-us"}
                        aria-label={`go to contact us form`}
                        className={cn(
                            buttonVariants({ variant: "link" }),
                            "px-1 text-primary-foreground hidden md:block hover:text-primary-foreground/80"
                        )}
                    >
                        {TYPOGRAPHY[lang].CONTACT_US}
                    </Link>
                    <Link
                        href={"/help"}
                        aria-label={`go to help page`}
                        className={cn(
                            buttonVariants({ variant: "link" }),
                            "px-1 text-primary-foreground hidden md:block hover:text-primary-foreground/80"
                        )}
                    >
                        {TYPOGRAPHY[lang].HELP}
                    </Link>
                    <Button
                        variant={"outline"}
                        className="hidden md:inline-flex text-primary-foreground px-2 h-8 text-xs md:text-sm md:px-4 hover:text-primary-foreground/80"
                        onClick={openLoginForm}
                    >
                        {TYPOGRAPHY[lang].LOGIN}
                    </Button>

                    <Button
                        variant={"secondary"}
                        className="font-bold px-2 h-8 text-xs md:text-sm md:px-4"
                        onClick={openSignForm}
                    >
                        <span className="hidden md:block">
                            {TYPOGRAPHY[lang].START_FOR_FREE}
                        </span>
                        <span className="block md:hidden">
                            {TYPOGRAPHY[lang].SIGNUP}
                        </span>
                    </Button>
                    <LocaleSwitcher />
                </div>
            </header>

            {/* Sign up form popup */}
            <SignupFormDialog
                lang={lang}
                open={isSignupPopupOpen}
                onOpenChange={setIsSignupPopupOpen}
            />
            {/* Sign up form popup */}
            <LoginFormDialog
                open={isLoginPopupOpen}
                onOpenChange={setIsLoginPopupOpen}
                lang={lang}
            />
        </Container>
    );
}

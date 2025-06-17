"use client";
import Image from "next/image";
import HeroSignupForm from "./HeroSignupForm";
import localImageLoader, { cn } from "@/lib/utils";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import IconButton from "@/components/form/IconButton";
import { buttonVariants } from "@/components/ui/button";
import SignupFormDialog from "../SignupFormDialog";
import Link from "next/link";

export default function HeroCopy({ lang = "en" }: { lang?: "en" | "ar" }) {
    const [isSignupPopupOpen, setIsSignupPopupOpen] = React.useState(false);
    const openSignForm = () => setIsSignupPopupOpen(true);

    // Multilingual text
    const TYPOGRAPHY = {
        en: {
            PERSONALIZED: "Personalized",
            EMAIL_NEWSLETTER: "Email Newsletter In",
            ONE_CLICK: "One Click!",
            START_COLLECTING: "Start collecting emails and send personalised automatic emails to your users in few minutes for",
            FREE: "free",
            START_FOR_FREE: "Start For Free",
            NO_CARD_REQUIRED: "No Card Required",
            VIEW_DEMO: "View Demo",
            COMPLETE_WALKTHROUGH: "Complete Walkthrough",
            HELP: "Help",
        },
        ar: {
            PERSONALIZED: "النشرة المشخصنة ",
            EMAIL_NEWSLETTER: "احصل على نشرة بريدية مشخصنة في",
            ONE_CLICK: "نقرة واحدة!",
            START_COLLECTING: "ابدأ في جمع البريد الإلكتروني وإرسال رسائل تلقائية شخصية إلى مستخدميك في دقائق قليلة",
            FREE: "مجانًا",
            START_FOR_FREE: "ابدأ مجانًا",
            NO_CARD_REQUIRED: "لا يلزم بطاقة",
            VIEW_DEMO: "شاهد كيف يعمل",
            COMPLETE_WALKTHROUGH: "جولة كاملة",
            HELP: "المساعدة",
        },
    };

    return (
        <div className={`flex flex-col items-center text-center lg:block lg:text-left rtl:lg:text-right`}>
            <div className="text-sm text-primary-600 md:text-xl uppercase font-bold ltr:tracking-[.25rem]">
                {TYPOGRAPHY[lang].PERSONALIZED}
            </div>
            <h1 className="mb-7 text-4xl md:text-6xl font-bold md:mb-9 rtl:leading-[1.3]">
                {TYPOGRAPHY[lang].EMAIL_NEWSLETTER}{" "}
                <span className="relative">
                    <span className="z-10 relative whitespace-nowrap">
                        {TYPOGRAPHY[lang].ONE_CLICK}
                    </span>
                    <div className="absolute min-w-[110%] -bottom-5 -right-3 md:min-w-[120%] md:-bottom-4 md:-right-9 h-14 z-0">
                        <Image
                            alt="decorative swoosh"
                            loader={localImageLoader}
                            fill
                            src={"hero-swoosh.svg"}
                        />
                    </div>
                </span>
            </h1>
            <div className="w-full">
                <p className="mb-2 lg:w-[60%]">
                    {TYPOGRAPHY[lang].START_COLLECTING}{" "}
                    <span className="uppercase font-bold">{TYPOGRAPHY[lang].FREE}</span>.
                </p>

                <div className="w-full lg:w-[60%] flex flex-col space-y-1 mt-5">
                    <div className="flex flex-col items-center gap-1">
                        <IconButton className="w-full" onClick={openSignForm} size={"lg"}>
                            {TYPOGRAPHY[lang].START_FOR_FREE}
                        </IconButton>
                        <span className="text-xs opacity-60">{TYPOGRAPHY[lang].NO_CARD_REQUIRED}</span>
                    </div>
                    <Dialog>
                        <DialogTrigger
                            className={cn(
                                buttonVariants({
                                    variant: "outline",
                                }),
                                "w-full"
                            )}
                        >
                            {TYPOGRAPHY[lang].VIEW_DEMO}
                        </DialogTrigger>
                        <DialogContent
                            usePrimitiveOverlay={true}
                            className="max-w-[90vw] md:max-w-[70vw] p-0 md:p-6"
                        >
                            <DialogHeader className="hidden md:block">
                                <DialogTitle>{TYPOGRAPHY[lang].COMPLETE_WALKTHROUGH}</DialogTitle>
                            </DialogHeader>
                            <div className="w-full pt-[56.6%] relative rounded-xl overflow-hidden">
                                <iframe
                                    src="https://www.youtube.com/embed/77ZRDED9bK0?si=9ll-ZBfnb0eLDFYB"
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="absolute w-full h-full inset-0"
                                ></iframe>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Link
                        className={cn(buttonVariants({ variant: "outline" }))}
                        href={"/help"}
                        aria-label={`go to help help page`}
                    >
                        {TYPOGRAPHY[lang].HELP}
                    </Link>
                </div>
            </div>

            <SignupFormDialog
lang={lang}
                open={isSignupPopupOpen}
                onOpenChange={setIsSignupPopupOpen}
            />
        </div>
    );
}

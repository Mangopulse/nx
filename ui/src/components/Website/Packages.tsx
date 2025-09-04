"use client";
import * as React from "react";
import { Container } from "./General/Container";
import { LayoutGrid } from "./General/LayoutGrid";
import { SectionTitle } from "./General/SectionTitle";
import Link from "next/link";
import Button from "../ui/button";
import SignupFormDialog from "./SignupFormDialog";

export interface IPackagesProps {
    lang?: "en" | "ar";
}

export default function Packages({ lang = "en" }: IPackagesProps) {
    const [isSignupPopupOpen, setIsSignupPopupOpen] = React.useState(false);
    const openSignForm = () => setIsSignupPopupOpen(true);

    // Multilingual text
    const TYPOGRAPHY = {
        en: {
            SECTION_TITLE: "Packages",
            FREE_TITLE: "FREE",
            FREE_BUTTON_TEXT: "Start For FREE 🚀",
            FREE_DESCRIPTIONS: [
                "Up to 1000 subscribers.",
                "Newsletter sent once per week.",
                "1 newsletter design template.",
                "1 email collector design template.",
            ],
            PREMIUM_TITLE: "Premium",
            PREMIUM_BUTTON_TEXT: "Contact Us",
            PREMIUM_BUTTON_NO_CARD: "No Card Required",
            PREMIUM_DESCRIPTIONS: [
                "Unlimited subscribers.",
                "Schedule your own sender.",
                "Many newsletter design templates.",
                "Create your own design using our powerful drag and drop builder.",
                "Fully customizable email collector - control everything.",
                "Choose from many collector templates.",
            ],
        },
        ar: {
            SECTION_TITLE: "الباقات المتوفرة",
            FREE_TITLE: "مجانًا",
            FREE_BUTTON_TEXT: "ابدأ مجانًا 🚀",
            FREE_DESCRIPTIONS: [
                "حتى 1000 مشترك.",
                "النشرة الإخبارية تُرسل مرة اسبوعيا او شهريا.",
                "قالب تصميم النشرة الإخبارية واحد.",
                "قالب تصميم مجمع البريد الإلكتروني واحد.",
            ],
            PREMIUM_TITLE: "المميز",
            PREMIUM_BUTTON_TEXT: "اتصل بنا",
            PREMIUM_BUTTON_NO_CARD: "لا يلزم بطاقة",
            PREMIUM_DESCRIPTIONS: [
                "عدد غير محدود من المشتركين.",
                "النشرة الإخبارية تُرسل مرة يوميا او اسبوعيا او شهريا .",
                "العديد من قوالب تصميم النشرة الإخبارية.",
                "أنشئ تصميمك الخاص باستخدام منشئ السحب والإفلات القوي لدينا.",
                "مجمع البريد الإلكتروني قابل للتخصيص بالكامل. تحكم في كل شيء.",
                "اختيار من بين العديد من قوالب جمع البريد الإلكتروني.",
            ],
        },
    };

    return (
        <Container>
            <SectionTitle>{TYPOGRAPHY[lang].SECTION_TITLE}</SectionTitle>
            <LayoutGrid>
                {/* FREE Package */}
                <div className="col-span-12 h-full lg:col-span-4 lg:col-start-3">
                    <div className="flex flex-col h-full p-3 lg:py-8 rounded border-2 border-primary shadow-[-2px_2px_0px_0px_hsl(var(--primary))]">
                        <h3 className="text-3xl font-bold text-center mb-4">
                            {TYPOGRAPHY[lang].FREE_TITLE}
                        </h3>
                        <div className="flex flex-col space-y-4 mb-9 px-5 py-3">
                            {TYPOGRAPHY[lang].FREE_DESCRIPTIONS.map((description, index) => (
                                <PackageFeature key={index} feature={description} />
                            ))}
                        </div>
                        <div className="flex flex-col items-center mt-auto">
                            <Button className="border-2 border-primary mx-auto px-9 text-lg mb-1 font-bold tracking-wide" onClick={openSignForm}>
                                {TYPOGRAPHY[lang].FREE_BUTTON_TEXT}
                            </Button>
                            <span className="opacity-60 text-xs">
                                {TYPOGRAPHY[lang].PREMIUM_BUTTON_NO_CARD}
                            </span>
                        </div>
                    </div>
                </div>

                {/* PREMIUM Package */}
                <div className="col-span-12 h-full lg:col-span-4">
                    <div className="flex flex-col h-full bg-primary-600 text-primary-foreground p-3 px-5 lg:py-8 rounded border-2 border-primary shadow-[-2px_2px_0px_0px_hsl(var(--primary))]">
                        <h3 className="text-3xl font-bold text-center mb-4">
                            {TYPOGRAPHY[lang].PREMIUM_TITLE}
                        </h3>
                        <div className="flex flex-col space-y-4 mb-9 px-5 py-3">
                            {TYPOGRAPHY[lang].PREMIUM_DESCRIPTIONS.map((description, index) => (
                                <PackageFeature key={index} feature={description} iconColor="white" />
                            ))}
                        </div>
                        <div className="flex flex-col items-center mt-auto">
                            <Button
                                variant={"secondary"}
                                className="border-2 border-primary mx-auto px-9 text-lg mb-1 font-bold tracking-wide"
                            >
                                <Link href="#contact-us" aria-label={`go to contact us form`}>
                                    {TYPOGRAPHY[lang].PREMIUM_BUTTON_TEXT}
                                </Link>
                            </Button>
                            <span className="opacity-60 text-xs">ㅤ</span>
                        </div>
                    </div>
                </div>
            </LayoutGrid>

            {/* Sign up form popup */}
            <SignupFormDialog lang={lang} open={isSignupPopupOpen} onOpenChange={setIsSignupPopupOpen} />
        </Container>
    );
}

function PackageFeature({
    feature,
    iconColor = "primary",
}: {
    feature: string;
    iconColor?: "white" | "primary";
}) {
    const getIconColor = (): string => {
        return iconColor === "white" ? "#eee" : "#1F0D34";
    };

    return (
        <div className="grid grid-cols-[1.1em_auto] items-center gap-4">
            <svg
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M6.69189 11.7292L9.8973 14.9346L16.3081 8.06592"
                    stroke={getIconColor()}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle
                    cx="11.5"
                    cy="11.5"
                    r="10.8867"
                    stroke={getIconColor()}
                />
            </svg>
            <p>{feature}</p>
        </div>
    );
}

"use client";
/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { Container } from "./General/Container";
import { SectionTitle } from "./General/SectionTitle";
import Image from "next/image";
import { LayoutGrid } from "./General/LayoutGrid";
import Button from "../ui/button";
import localImageLoader from "@/lib/utils";
import SignupFormDialog from "./SignupFormDialog";

export default function AIFeatures({ lang = "en" }: { lang?: "en" | "ar" }) {
    const [isSignupPopupOpen, setIsSignupPopupOpen] = React.useState(false);
    const openSignForm = () => setIsSignupPopupOpen(true);

    // Multilingual text
    const TYPOGRAPHY = {
        en: {
            POWERED_BY: "Powered By",
            AI: "AI",
            SMART_SENDER_TITLE: "Smart Sender",
            SMART_SENDER_DESCRIPTION:
                "Experience the future of email marketing with our Smart Sender feature. Let AI optimize your email delivery for the best results. Send emails at the perfect time, every time.",
            ENGAGING_ARTICLES_TITLE: "Engaging Articles",
            ENGAGING_ARTICLES_DESCRIPTION:
                "Stay ahead of the curve with Trending Articles powered by AI. Our intelligent system identifies what's hot and relevant for your audience. Keep your readers engaged with the latest trends.",
            PERSONALIZED_ARTICLES_TITLE: "Personalised Articles",
            PERSONALIZED_ARTICLES_DESCRIPTION:
                "Enhance user engagement with Personalized Articles. Our AI tailors content based on individual preferences. Deliver a unique and personalized reading experience to each subscriber.",
            START_FOR_FREE: "Start For Free 🚀",
        },
        ar: {
            POWERED_BY: "يستخدم",
            AI: "الذكاء الاصطناعي",
            SMART_SENDER_TITLE: "المرسال الذكي",
            SMART_SENDER_DESCRIPTION:
                "استمتع بمستقبل تسويق البريد الإلكتروني مع ميزة المرسل الذكي لدينا. دع الذكاء الاصطناعي يحسن تسليم البريد الإلكتروني الخاص بك للحصول على أفضل النتائج. أرسل رسائل البريد الإلكتروني في الوقت المثالي، في كل مرة.",
            ENGAGING_ARTICLES_TITLE: "مقالات جذابة",
            ENGAGING_ARTICLES_DESCRIPTION:
                "ابقَ في الصدارة مع المقالات الفعالة التي تعتمد على الذكاء الاصطناعي. يتعرف نظامنا الذكي على ما هو مثير وملائم لجمهورك. احتفظ بقرائك و ارجعهم الى موقعك.",
            PERSONALIZED_ARTICLES_TITLE: "مقالات مشخصنة",
            PERSONALIZED_ARTICLES_DESCRIPTION:
                "عزز من مشاركة المستخدم مع مقالات مخصصة. يقوم الذكاء الاصطناعي لدينا بتخصيص المحتوى استنادًا إلى تفضيلات كل فرد. قدم تجربة قراءة فريدة وشخصية لكل مشترك.",
            START_FOR_FREE: "ابدأ مجاناً 🚀",
        },
    };

    return (
        <div className={`flex flex-col ${lang === "ar" ? "rtl" : ""}`}>
            <div className="relative aspect-[5.7] w-full translate-y-1">
                <Image
                    alt="decorative wave"
                    loader={localImageLoader}
                    src="ai-wave-top.svg"
                    fill
                />
            </div>
            <Container
                className={`bg-[#1f0d34] py-3 md:py-0 text-primary-foreground ${
                    lang === "ar" ? "rtl" : ""
                }`}
            >
                <div className="flex flex-col items-center space-y-9">
                    <SectionTitle
                        className={`text-primary-foreground ${
                            lang === "ar" ? "rtl" : ""
                        }`}
                    >
                        <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse">
                            <div className="relative w-[1em] h-[1em]">
                              <Image alt="decorative star" src="outputsvg.svg" fill loader={localImageLoader} />
                            </div>
                            <span>
                                {TYPOGRAPHY[lang].POWERED_BY}{" "}
                                <span className="text-nx-purple">
                                    {TYPOGRAPHY[lang].AI}
                                </span>
                            </span>
                        </div>
                    </SectionTitle>

                    <LayoutGrid>
                        <AIFeatureCard
                            title={TYPOGRAPHY[lang].SMART_SENDER_TITLE}
                            description={
                                TYPOGRAPHY[lang].SMART_SENDER_DESCRIPTION
                            }
                            image="icon-smart-sender.svg"
                        />
                        <AIFeatureCard
                            title={TYPOGRAPHY[lang].ENGAGING_ARTICLES_TITLE}
                            description={
                                TYPOGRAPHY[lang].ENGAGING_ARTICLES_DESCRIPTION
                            }
                            image="icon-trending-articles.svg"
                        />
                        <AIFeatureCard
                            title={TYPOGRAPHY[lang].PERSONALIZED_ARTICLES_TITLE}
                            description={
                                TYPOGRAPHY[lang]
                                    .PERSONALIZED_ARTICLES_DESCRIPTION
                            }
                            image="icon-personalised-articles.svg"
                        />
                    </LayoutGrid>
                    <Button
                        variant={"secondary"}
                        className={`font-bold mx-auto px-9 !mb-1 w-[80%] md:w-fit md:text-lg ${
                            lang === "ar" ? "rtl" : ""
                        }`}
                        onClick={openSignForm}
                    >
                        {TYPOGRAPHY[lang].START_FOR_FREE}
                    </Button>
                </div>
            </Container>
            <div className="relative aspect-[5.7] w-full rotate-180 -translate-y-1">
                <Image
                    alt="decorative wave"
                    loader={localImageLoader}
                    src="ai-wave-top.svg"
                    fill
                />
            </div>

            {/* Sign up form popup */}
            <SignupFormDialog
                lang={lang}
                open={isSignupPopupOpen}
                onOpenChange={setIsSignupPopupOpen}
            />
        </div>
    );
}

export interface IAIFeatureCardProps {
    title: string;
    description: string;
    image: string;
}

export function AIFeatureCard({
    title,
    image,
    description,
}: IAIFeatureCardProps) {
    return (
        <div className="col-span-12 lg:col-span-4">
            <div className="text-center mb-8">
                <div className="relative h-[100px] mb-4">
                    <Image
                        fill
                        alt={title}
                        src={image}
                        loader={localImageLoader}
                    />
                </div>
                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                <p className="text-sm opacity-60 sm:max-w-[50%] sm:mx-auto">
                    {description}
                </p>
            </div>
        </div>
    );
}

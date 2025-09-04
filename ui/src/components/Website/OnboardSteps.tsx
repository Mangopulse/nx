"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import * as React from "react";
import { Container } from "./General/Container";
import { LayoutGrid } from "./General/LayoutGrid";
import { SectionTitle } from "./General/SectionTitle";
import FeatureCard from "./General/FeatureCard";
import Chip from "./General/Chip";
import Image from "next/image";
import localImageLoader, { cn } from "@/lib/utils";
import Button from "../ui/button";
import useInViewport from "@/hooks/useInViewport";
import SignupFormDialog from "./SignupFormDialog";
import IconButton from "../form/IconButton";
import { ExternalLinkIcon } from "lucide-react";
import GTMBanner from "./GTMBanner";

export default function OnboardSteps({ lang = "en" }: { lang?: "en" | "ar" }) {
    // Multilingual text
    const TYPOGRAPHY = {
        en: {
            SECTION_TITLE: "It Doesn't Get Any Easier!",
            SECTION_DESCRIPTION: "Get the service in just 2 minutes!",
            STEP_ONE: {
                NUMBER: "1",
                HEADER: "Signup",
                DESCRIPTION:
                    "After you signup and confirm your email, we will send you an email with our script to insert into your website!",
            },
            STEP_TWO: {
                NUMBER: "2",
                HEADER: "Add Script",
                DESCRIPTION:
                    "Just copy and paste the script sent to you in your website's source code!",
            },
            STEP_THREE: {
                NUMBER: "3",
                HEADER: "Congrats!",
                DESCRIPTION: (
                    <>
                        You're done now and you can benefit from all our
                        features and services. Go and{" "}
                        <a href="/login" className="text-sky-600">
                            login
                        </a>{" "}
                        to our dashboard and enjoy!
                    </>
                ),
            },
            INSTALL_CHIP: "No Code Installation",
            INSTALL_HEADER: "Install Via Google Tag Manager",
            INSTALL_DESCRIPTION: (
                <>
                    Install our script through{" "}
                    <a
                        href="https://marketingplatform.google.com/about/tag-manager/"
                        className="text-sky-600"
                    >
                        google tag manager
                    </a>{" "}
                    without manually changing your code. Simply create a new tag
                    with our custom google tag manager compliant script!
                </>
            ),
            READ_TUTORIAL: "Read Tutorial",
            COLLECTOR_DESCRIPTION:
                "The email collector widget will now appear on your website (where you added the script). Your users can now subscribe to the newsletter!",
            SUBSCRIBER_DESCRIPTION:
                "You now have subscribers that will automatically receive personalized email newsletters that will increase your traffic, revenue, and loyalty!",
            LETS_DO_IT: "Let's Do It 🚀",
        },
        ar: {
            SECTION_TITLE: "لا يمكن أن يكون أسهل من ذلك!",
            SECTION_DESCRIPTION: "احصل على الخدمة في دقيقتين فقط!",
            STEP_ONE: {
                NUMBER: "1",
                HEADER: "التسجيل",
                DESCRIPTION:
                    "بعد التسجيل وتأكيد بريدك الإلكتروني، سنرسل لك بريدًا إلكترونيًا يحتوي على التعليمات الخاصة بنا لإدراجه في موقع الويب الخاص بك!",
            },
            STEP_TWO: {
                NUMBER: "2",
                HEADER: "إضافة البرمجيات",
                DESCRIPTION:
                    "ما عليك سوى نسخ ولصق البرمجيات الذي تم إرساله إليك في مصدر موقع الويب الخاص بك!",
            },
            STEP_THREE: {
                NUMBER: "3",
                HEADER: "تهانينا!",
                DESCRIPTION: (
                    <>
                        لقد انتهيت من التسجيل و الان يمكنك الاستفادة من كل
                         خدماتنا. اذهب و
                         {" "}<a href="/login" className="text-sky-600">
                             سجل الدخول 
                        </a>{" "}
                        في برنامجنا و استمتع! 
                    </>
                ),
            },
            INSTALL_CHIP: "لا داعي للكود",
            INSTALL_HEADER: "التثبيت عبر Google Tag Manager",
            INSTALL_DESCRIPTION: (
                <>
                    قم بتثبيت سكربتنا من خلال مدير علامات{" "}
                    <a
                        href="https://marketingplatform.google.com/about/tag-manager/"
                        className="text-sky-600"
                    >
                        google tag manager
                    </a>{" "}
                    بدون تغيير الكود يدويًا. قم ببساطة بإنشاء علامة جديدة
                    باستخدام سكربتنا المخصص المتوافق مع google!
                </>
            ),
            READ_TUTORIAL: "اقرأ الدورة التعليمية",
            COLLECTOR_DESCRIPTION:
                "سيظهر البرنامج النصي لجمع البريد الإلكتروني الآن على موقع الويب الخاص بك (حيث قمت بإضافة البرمجيات). يمكن لمستخدميك الآن الاشتراك في النشرة الإخبارية!",
            SUBSCRIBER_DESCRIPTION:
                "لديك الآن مشتركين سيتلقون تلقائيًا نشرات بريد إلكتروني شخصية ستزيد من عدد الزوار والإيرادات و ولاء القراء!",
            LETS_DO_IT: "هيا بنا 🚀",
        },
    };

    const ref = React.useRef(null);
    const inViewPort = useInViewport(ref);
    const [isSignupPopupOpen, setIsSignupPopupOpen] = React.useState(false);
    const openSignForm = () => setIsSignupPopupOpen(true);

    return (
        <Container>
            <SectionTitle>
                <p>{TYPOGRAPHY[lang].SECTION_TITLE}</p>
                <p className="font-normal text-sm opacity-60 mb-1">
                    {TYPOGRAPHY[lang].SECTION_DESCRIPTION}
                </p>
            </SectionTitle>
            <LayoutGrid className="gap-16 block space-y-16 md:grid md:space-y-0">
                <div className="col-span-12 md:col-span-4">
                    <div className="grid grid-cols-[4em_auto] gap-4">
                        <div className="text-8xl text-primary-600 font-black leading-[74%]">
                            {TYPOGRAPHY[lang].STEP_ONE.NUMBER}
                        </div>
                        <div className="">
                            <div className="font-bold text-4xl mb-2">
                                {TYPOGRAPHY[lang].STEP_ONE.HEADER}
                            </div>
                            <p className="text-md">
                                {TYPOGRAPHY[lang].STEP_ONE.DESCRIPTION}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                    <div className="grid grid-cols-[4em_auto] gap-4">
                        <div className="text-8xl text-primary-600 font-black leading-[79%]">
                            {TYPOGRAPHY[lang].STEP_TWO.NUMBER}
                        </div>
                        <div className="">
                            <div className="font-bold text-4xl mb-2">
                                {TYPOGRAPHY[lang].STEP_TWO.HEADER}
                            </div>
                            <p className="text-md">
                                {TYPOGRAPHY[lang].STEP_TWO.DESCRIPTION}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-span-12 md:col-span-4">
                    <div className="grid grid-cols-[4em_auto] gap-4">
                        <div className="text-8xl text-primary-600 font-black leading-[79%]">
                            {TYPOGRAPHY[lang].STEP_THREE.NUMBER}
                        </div>
                        <div className="">
                            <div className="font-bold text-4xl mb-2">
                                {TYPOGRAPHY[lang].STEP_THREE.HEADER}
                            </div>
                            <p className="text-md">
                                {TYPOGRAPHY[lang].STEP_THREE.DESCRIPTION}
                            </p>
                        </div>
                    </div>
                </div>
            </LayoutGrid>
            <GTMBanner lang={lang}/>
            <LayoutGrid>
                <div className="col-span-12 md:col-span-5">
                    <div className="flex flex-col gap-2">
                        <div className="relative rounded pt-[58.82%] overflow-hidden">
                            <Image
                                alt="ollector screenshot desktop"
                                src="collector-screenshot-desktop.webp"
                                loader={localImageLoader}
                                fill
                            />
                        </div>
                        <p className="text-center mt-3">
                            {TYPOGRAPHY[lang].COLLECTOR_DESCRIPTION}
                        </p>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-5 md:col-start-8">
                    <div className="flex flex-col gap-2">
                        <div
                            className="relative rounded pt-[58.82%] overflow-hidden"
                            ref={ref}
                        >
                            <Image
                                alt="screenshot of email newsletter"
                                className={cn(
                                    "w-full object-fill absolute top-0 left-0 right-0 stop-animation-on-hover",
                                    inViewPort && "animate-scroll"
                                )}
                                src={"template-screenshot-desktop.webp"}
                                loader={localImageLoader}
                                width={200}
                                height={0}
                            />
                        </div>
                        <p className="text-center mt-3">
                            {TYPOGRAPHY[lang].SUBSCRIBER_DESCRIPTION}
                        </p>
                    </div>
                </div>
            </LayoutGrid>
            <div className="flex justify-center">
                <Button
                    size={"lg"}
                    className="mt-14 text-xl px-16"
                    onClick={openSignForm}
                >
                    {TYPOGRAPHY[lang].LETS_DO_IT}
                </Button>
            </div>

            <SignupFormDialog
                lang={lang}
                open={isSignupPopupOpen}
                onOpenChange={setIsSignupPopupOpen}
            />
        </Container>
    );
}

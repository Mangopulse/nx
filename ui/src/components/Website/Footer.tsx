/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { Container } from "./General/Container";
import Image from "next/image";
import ContactUsForm from "./ContactUsForm";
import localImageLoader from "@/lib/utils";
import MiniRotatingLoader from "../loaders/MiniRotatingLoader";

export interface IFooterProps {
    lang?: "en" | "ar";
}

export default function Footer({ lang = "en" }: IFooterProps) {
    // Multilingual Typography Object
    const TYPOGRAPHY = {
        en: {
            ALT_WAVE: "decorative wave",
            GOOGLE_CLOUD_PARTNERS: "Google Cloud Partners",
            LOGO_ALT: "logo",
        },
        ar: {
            ALT_WAVE: "موجة تزيينية",
            GOOGLE_CLOUD_PARTNERS: "شركاء Google Cloud",
            LOGO_ALT: "شعار",
        },
    };

    return (
        <div className="flex flex-col">
            <div className="relative aspect-[5.7] w-full translate-y-1">
                <Image
                    alt={TYPOGRAPHY[lang].ALT_WAVE}
                    loader={localImageLoader}
                    src="ai-wave-top.svg"
                    fill
                />
            </div>
            <Container className="bg-[#1f0d34] text-primary-foreground !pt-3 md:!pt-0">
                <div className="flex flex-col gap-8 items-center">
                    <div className="w-full">
                        <React.Suspense fallback={<MiniRotatingLoader />}>
                            <ContactUsForm lang={lang} />
                        </React.Suspense>
                    </div>

                    <div className="col-span-3 col-start-10">
                        <div className="flex flex-col items-center space-y-5">
                            <div className="relative w-16 h-16 ">
                                <Image
                                    fill
                                    alt={TYPOGRAPHY[lang].GOOGLE_CLOUD_PARTNERS}
                                    src="gcp.webp"
                                    loader={localImageLoader}
                                />
                            </div>
                            <div className="img-wrap w-28 md:w-40 pt-[11%]">
                                <Image
                                    loader={localImageLoader}
                                    alt={TYPOGRAPHY[lang].LOGO_ALT}
                                    src={"newsletterX-logo.webp"}
                                    fill
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

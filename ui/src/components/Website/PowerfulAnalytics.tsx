import * as React from "react";
import { Container } from "./General/Container";
import { LayoutGrid } from "./General/LayoutGrid";
import { SectionTitle } from "./General/SectionTitle";
import FeatureCard from "./General/FeatureCard";
import Image from "next/image";
import Chip from "./General/Chip";
import localImageLoader from "@/lib/utils";

export default function PowerfulAnalytics({ lang = "en" }: { lang?: "en" | "ar" }) {
    // Multilingual text
    const TYPOGRAPHY = {
        en: {
            SECTION_TITLE: "Advanced Analytics",
            SECTION_DESCRIPTION: "Control and monitor everything for maximum clarity",
            CHIPS: ["Clicks", "Views", "Behaviors", "Preferences", "Loyalty"],
        },
        ar: {
            SECTION_TITLE: "تحليلات متقدمة",
            SECTION_DESCRIPTION: "التحكم ومراقبة كل شيء لتحقيق أقصى وضوح",
            CHIPS: ["النقرات", "المشاهدات", "السلوكيات", "التفضيلات", "الولاء"],
        },
    };

    return (
        <Container>
            <SectionTitle>
                <>
                    <span>{TYPOGRAPHY[lang].SECTION_TITLE}</span>
                    <p className="font-normal text-sm opacity-60 mb-1">
                        {TYPOGRAPHY[lang].SECTION_DESCRIPTION}
                    </p>
                </>
            </SectionTitle>
            <LayoutGrid>
                <div className="col-span-12 md:col-span-10 md:col-start-2 relative pt-[58.82%] rounded overflow-hidden">
                    <Image
                        alt="analytics"
                        fill
                        src={"powerfulanalytics.webp"}
                        loader={localImageLoader}
                    />
                </div>
            </LayoutGrid>
            <div className="flex flex-wrap space-x-2 space-y-2 mt-14 items-center justify-center md:space-x-4 md:space-y-4 rtl:space-x-reverse">
                {TYPOGRAPHY[lang].CHIPS.map((chipText, index) => (
                    <Chip key={index} className="mt-2 md:mt-4">
                        {chipText}
                    </Chip>
                ))}
            </div>
        </Container>
    );
}

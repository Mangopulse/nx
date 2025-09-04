import * as React from "react";
import { Container } from "./General/Container";
import { LayoutGrid } from "./General/LayoutGrid";
import { SectionTitle } from "./General/SectionTitle";
import FeatureCard from "./General/FeatureCard";

export default function CollectorFeatures({
    lang = "en",
}: {
    lang?: "en" | "ar";
}) {
    // Multilingual text
    const TYPOGRAPHY = {
        en: {
            CONTROL_COLLECTOR: "Control Your Collector",
            CONTROL_COLLECTOR_DESCRIPTION:
                "Convert users into subscribers and loyal readers",
            STYLE_IT_ALL_TITLE: "Style It All The Way",
            STYLE_IT_ALL_DESCRIPTION:
                "Control the look and feel, text, language, colors, fonts, layout and position. Capture emails with style, ensuring a harmonious user experience.",
            SMART_COLLECTOR_TITLE: "Smart Collector",
            SMART_COLLECTOR_DESCRIPTION:
                "It's not just a rendered widget. Do it the smart way with triggers and user-aware rendering. The collector will stop bothering the user when he closes it then re-appear after 2 days to ensure higher conversion and smooth user experience.",
            CHIP_CUSTOMIZABLE: "customizable",
            CHIP_INTELLIGENT: "intelligent",
        },
        ar: {
            CONTROL_COLLECTOR: "تحكم في مجمع البريد الالكتروني",
            CONTROL_COLLECTOR_DESCRIPTION:
                "حول المستخدمين إلى مشتركين وقراء مخلصين",
            STYLE_IT_ALL_TITLE: "قم بتخصيص كل شيء كما تشاء",
            STYLE_IT_ALL_DESCRIPTION:
                "تحكم في المظهر، النص، اللغة، الألوان، الخطوط و مكان القالب. التقط البريد الإلكتروني بأناقة ، ضامنا تجربة مستخدم متناغمة.",
            SMART_COLLECTOR_TITLE: "مجمع ذكي",
            SMART_COLLECTOR_DESCRIPTION:
                "استخدم المجمع الذكي و اضمن فعالية في تجربة المستخدم. سيتوقف جامع البريد الإلكتروني عن إزعاج المستخدم عند إغلاقه ثم يعود بعد يومين لضمان معدل تحويل أعلى وتجربة مستخدم سلسة",
            CHIP_CUSTOMIZABLE: "قابل للتخصيص",
            CHIP_INTELLIGENT: "ذكاء متقدم",
        },
    };

    return (
        <Container>
            <SectionTitle>
                <>
                    <span>{TYPOGRAPHY[lang].CONTROL_COLLECTOR}</span>
                    <p className="font-normal text-sm opacity-60 mb-1">
                        {TYPOGRAPHY[lang].CONTROL_COLLECTOR_DESCRIPTION}
                    </p>
                </>
            </SectionTitle>
            <LayoutGrid>
                <FeatureCard
                    title={TYPOGRAPHY[lang].STYLE_IT_ALL_TITLE}
                    description={TYPOGRAPHY[lang].STYLE_IT_ALL_DESCRIPTION}
                    image="collector-gif.gif"
                    className="mb-20"
                    chip={TYPOGRAPHY[lang].CHIP_CUSTOMIZABLE}
                />
                <FeatureCard
                    title={TYPOGRAPHY[lang].SMART_COLLECTOR_TITLE}
                    description={TYPOGRAPHY[lang].SMART_COLLECTOR_DESCRIPTION}
                    image="trigger-gif.gif"
                    reversed={true}
                    chip={TYPOGRAPHY[lang].CHIP_INTELLIGENT}
                />
            </LayoutGrid>
        </Container>
    );
}

/* eslint-disable react/no-unescaped-entities */
"use client";
import * as React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";
import { SectionTitle } from "./General/SectionTitle";
import { Container } from "./General/Container";
import { LayoutGrid } from "./General/LayoutGrid";

export interface IFAQProps {
    lang?: "en" | "ar";
}

export default function FAQ({ lang = "en" }: IFAQProps) {
    // Multilingual Typography Object
    const TYPOGRAPHY = {
        en: {
            FAQ: "FAQ",
            CAN_I_CUSTOMIZE:
                "Can I customize the email collector that shows on my website?",
            CUSTOMIZE_ANSWER:
                "Yes, our service offers a highly customizable Email Collector. You can tailor its appearance, behavior, and integration to match your brand and specific needs.",
            CAN_I_SEE_ANALYTICS:
                "Can I see analytics of how this service is performing?",
            ANALYTICS_ANSWER:
                "Absolutely. Our service provides detailed analytics, allowing you to track key performance metrics, such as email sign-up rates, user engagement, and collector visibility.",
            CAN_I_USE_WORDPRESS: "Can I use this if I have a WordPress site?",
            WORDPRESS_ANSWER: (
                <>
                    Certainly, all you have to do is to install{" "}
                    <a
                        href={"https://wordpress.org/plugins/cognativex"}
                        target="_blank"
                        aria-label="go to our wordpress plugin"
                        referrerPolicy="no-referrer"
                        className="text-sky-600"
                    >
                        our Wordpress plugin
                    </a>{" "}
                    and the collector will show on your website!
                </>
            ),
        },
        ar: {
            FAQ: "الأسئلة الشائعة",
            CAN_I_CUSTOMIZE:
                "هل يمكنني التعديل على مجمع البريد الإلكتروني الذي يظهر على موقعي؟",
            CUSTOMIZE_ANSWER:
                "نعم، يقدم خدمتنا جامع بريد إلكتروني قابل للتخصيص بشكل كبير. يمكنك تكييف مظهره وسلوكه وتكامله ليتناسب مع علامتك التجارية واحتياجاتك الخاصة.",
            CAN_I_SEE_ANALYTICS: "هل يمكنني رؤية تحليلات أداء هذه الخدمة؟",
            ANALYTICS_ANSWER:
                "بالتأكيد. توفر خدمتنا تحليلات مفصلة تتيح لك تتبع مؤشرات الأداء الرئيسية، مثل معدلات تسجيل البريد الإلكتروني ومشاركة المستخدم ورؤية المجمع.",
            CAN_I_USE_WORDPRESS:
                "هل يمكنني استخدام هذه الخدمة إذا كان لدي موقع Wordpress",
            WORDPRESS_ANSWER: (
                <>
                    بالتأكيد، كل ما عليك فعله هو تثبيت{" "}
                    <a
                        href={"https://wordpress.org/plugins/cognativex"}
                        target="_blank"
                        aria-label="go to our wordpress plugin"
                        referrerPolicy="no-referrer"
                        className="text-sky-600"
                    >
                        إضافة wordpress
                    </a>{" "}
                    الخاصة بنا وسيظهر جامع البريد على موقع الويب الخاص بك!
                </>
            ),
        },
    };

    return (
        <Container>
            <SectionTitle>{TYPOGRAPHY[lang].FAQ}</SectionTitle>
            <LayoutGrid>
                <Accordion
                    type="single"
                    collapsible
                    className="col-span-12 md:col-span-8 md:col-start-3"
                >
                    <AccordionItem value="item-1" className="container">
                        <AccordionTrigger className="text-left">
                            {TYPOGRAPHY[lang].CAN_I_CUSTOMIZE}
                        </AccordionTrigger>
                        <AccordionContent>
                            {TYPOGRAPHY[lang].CUSTOMIZE_ANSWER}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="container">
                        <AccordionTrigger className="text-left">
                            {TYPOGRAPHY[lang].CAN_I_SEE_ANALYTICS}
                        </AccordionTrigger>
                        <AccordionContent>
                            {TYPOGRAPHY[lang].ANALYTICS_ANSWER}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="container">
                        <AccordionTrigger className="text-left">
                            {TYPOGRAPHY[lang].CAN_I_USE_WORDPRESS}
                        </AccordionTrigger>
                        <AccordionContent>
                            {TYPOGRAPHY[lang].WORDPRESS_ANSWER}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </LayoutGrid>
        </Container>
    );
}
